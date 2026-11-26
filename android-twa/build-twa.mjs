import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync, spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import bubblewrapCore from '@bubblewrap/core';

const {
  AndroidSdkTools,
  Config,
  GradleWrapper,
  JarSigner,
  JdkHelper,
  TwaGenerator,
  TwaManifest,
} = bubblewrapCore;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUBBLEWRAP_HOME = path.join(os.homedir(), '.bubblewrap');
const JDK_DIR = path.join(BUBBLEWRAP_HOME, 'jdk');
const SDK_DIR = path.join(BUBBLEWRAP_HOME, 'android_sdk');

const JDK17_URL = 'https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse';
const CMDTOOLS_URL = 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip';

function readKeystoreCredentials() {
  const backupFile = path.join(__dirname, 'keystore', 'KEYSTORE_CREDENTIALS_BACKUP.txt');
  if (!fs.existsSync(backupFile)) {
    throw new Error('Missing android-twa/keystore/KEYSTORE_CREDENTIALS_BACKUP.txt');
  }
  const text = fs.readFileSync(backupFile, 'utf8');
  const get = (k) => {
    const m = text.match(new RegExp(`^${k}=(.+)$`, 'm'));
    return m ? m[1].trim() : '';
  };
  return {
    path: get('KEYSTORE_PATH'),
    alias: get('KEY_ALIAS'),
    storePass: get('STORE_PASSWORD'),
    keyPass: get('KEY_PASSWORD'),
  };
}

async function downloadFile(url, destPath) {
  console.log('[TWA] Downloading', url, '...');
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  console.log(`[TWA] Downloaded ${Math.round(buf.length / (1024 * 1024))} MB -> ${destPath}`);
}

function unzipWindows(zipPath, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  execFileSync('powershell.exe', [
    '-NoProfile', '-Command',
    `Expand-Archive -Path '${zipPath}' -DestinationPath '${destDir}' -Force`
  ], { stdio: 'inherit' });
}

async function ensureToolchain() {
  fs.mkdirSync(BUBBLEWRAP_HOME, { recursive: true });

  // 1. Ensure OpenJDK 17
  let jdkPath = '';
  if (fs.existsSync(JDK_DIR)) {
    const sub = fs.readdirSync(JDK_DIR).map((d) => path.join(JDK_DIR, d)).filter((p) => fs.statSync(p).isDirectory());
    const found = sub.find((d) => fs.existsSync(path.join(d, 'bin', 'java.exe')));
    if (found) jdkPath = found;
  }
  if (!jdkPath) {
    const jdkZip = path.join(BUBBLEWRAP_HOME, 'jdk17.zip');
    await downloadFile(JDK17_URL, jdkZip);
    unzipWindows(jdkZip, JDK_DIR);
    fs.unlinkSync(jdkZip);
    const sub = fs.readdirSync(JDK_DIR).map((d) => path.join(JDK_DIR, d)).filter((p) => fs.statSync(p).isDirectory());
    jdkPath = sub.find((d) => fs.existsSync(path.join(d, 'bin', 'java.exe'))) || '';
    if (!jdkPath) throw new Error('OpenJDK 17 extraction failed');
  }
  console.log('[TWA] Using JDK 17:', jdkPath);

  // 2. Ensure Android Command-Line Tools
  const sdkManagerBin = path.join(SDK_DIR, 'bin', 'sdkmanager.bat');
  if (!fs.existsSync(sdkManagerBin)) {
    const sdkZip = path.join(BUBBLEWRAP_HOME, 'cmdline-tools.zip');
    const tmpExtract = path.join(BUBBLEWRAP_HOME, 'cmdline-tmp');
    await downloadFile(CMDTOOLS_URL, sdkZip);
    unzipWindows(sdkZip, tmpExtract);
    fs.unlinkSync(sdkZip);
    const inner = path.join(tmpExtract, 'cmdline-tools');
    fs.mkdirSync(SDK_DIR, { recursive: true });
    // Copy into SDK_DIR (for Bubblewrap AndroidSdkTools) AND SDK_DIR/cmdline-tools/latest (for sdkmanager standard layout)
    fs.cpSync(inner, SDK_DIR, { recursive: true });
    fs.cpSync(inner, path.join(SDK_DIR, 'cmdline-tools', 'latest'), { recursive: true });
    fs.rmSync(tmpExtract, { recursive: true, force: true });
  }
  console.log('[TWA] Using Android SDK:', SDK_DIR);

  // 3. Accept Android SDK licenses & install build-tools;36.1.0 + platform-tools + platforms;android-36
  const env = {
    ...process.env,
    JAVA_HOME: jdkPath,
    ANDROID_HOME: SDK_DIR,
    ANDROID_SDK_ROOT: SDK_DIR,
    PATH: `${path.join(jdkPath, 'bin')};${process.env.PATH || ''}`,
  };
  const yesInput = 'y\n'.repeat(40);
  const stdSdkManager = path.join(SDK_DIR, 'cmdline-tools', 'latest', 'bin', 'sdkmanager.bat');

  if (!fs.existsSync(path.join(SDK_DIR, 'licenses', 'android-sdk-license'))) {
    console.log('[TWA] Accepting Android SDK licenses...');
    spawnSync('cmd.exe', ['/c', stdSdkManager, `--sdk_root=${SDK_DIR}`, '--licenses'], {
      env,
      input: yesInput,
      stdio: ['pipe', 'inherit', 'inherit'],
    });
  }

  if (!fs.existsSync(path.join(SDK_DIR, 'build-tools', '36.1.0')) || !fs.existsSync(path.join(SDK_DIR, 'platforms', 'android-36'))) {
    console.log('[TWA] Installing build-tools;36.1.0, platform-tools, platforms;android-36...');
    const res = spawnSync('cmd.exe', [
      '/c', stdSdkManager, `--sdk_root=${SDK_DIR}`,
      'build-tools;36.1.0', 'platform-tools', 'platforms;android-36'
    ], {
      env,
      input: yesInput,
      stdio: ['pipe', 'inherit', 'inherit'],
    });
    if (res.status !== 0) {
      throw new Error('sdkmanager package installation failed with code ' + res.status);
    }
  }

  const config = new Config(jdkPath, SDK_DIR);
  const jdkHelper = new JdkHelper(process, config);
  const androidSdkTools = await AndroidSdkTools.create(process, config, jdkHelper);
  return { config, jdkHelper, androidSdkTools, jdkPath };
}

async function main() {
  const creds = readKeystoreCredentials();
  const { androidSdkTools, jdkPath } = await ensureToolchain();

  // 4. Generate official Android TWA project from twa-manifest.json
  const twaManifest = await TwaManifest.fromFile(path.join(__dirname, 'twa-manifest.json'));
  const twaGenerator = new TwaGenerator();

  // Resolve local PWA icons/manifest from frontend/dist if production has not been deployed yet,
  // while keeping EVERY Android XML/Gradle URL strictly on https://www.firetourdr.com
  const localDistDir = path.resolve(__dirname, '..', 'frontend', 'dist');
  const localManifestFile = path.join(localDistDir, 'manifest.webmanifest');
  if (fs.existsSync(localManifestFile)) {
    const prodOrigin = `https://${twaManifest.host}`;
    const mapToLocal = (u) => (u && u.startsWith(prodOrigin) ? u.replace(prodOrigin, 'http://localhost:5000') : u);
    twaManifest.iconUrl = mapToLocal(twaManifest.iconUrl);
    twaManifest.maskableIconUrl = mapToLocal(twaManifest.maskableIconUrl);
    for (const s of twaManifest.shortcuts || []) {
      if (s.chosenIconUrl) s.chosenIconUrl = mapToLocal(s.chosenIconUrl);
    }
    twaGenerator.writeWebManifest = async (manifest, targetDirectory) => {
      const webManifestJson = JSON.parse(fs.readFileSync(localManifestFile, 'utf8').trim());
      webManifestJson.start_url = manifest.startUrl;
      const destDir = path.join(targetDirectory, 'app', 'src', 'main', 'res', 'raw');
      fs.mkdirSync(destDir, { recursive: true });
      fs.writeFileSync(path.join(destDir, 'web_app_manifest.json'), JSON.stringify(webManifestJson));
    };
  }

  console.log('[TWA] Generating Android project for', twaManifest.packageId, '...');
  await twaGenerator.createTwaProject(__dirname, twaManifest);

  // 5. Build Release AAB and Release APK via Gradle
  const gradleWrapper = new GradleWrapper(process, androidSdkTools, __dirname);
  console.log('[TWA] Building Release App Bundle (.aab)...');
  await gradleWrapper.bundleRelease();
  console.log('[TWA] Building Release APK (.apk)...');
  await gradleWrapper.assembleRelease();

  const unsignedAab = path.join(__dirname, 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab');
  const signedAab = path.join(__dirname, 'app-release-bundle.aab');
  if (!fs.existsSync(unsignedAab)) {
    throw new Error('Expected bundle not found at ' + unsignedAab);
  }

  // 6. Sign .aab with jarsigner directly (execFileSync avoids Windows spaces-in-path bugs)
  console.log('[TWA] Signing app-release-bundle.aab with permanent keystore...');
  const jarsignerBin = path.join(jdkPath, 'bin', 'jarsigner.exe');
  if (fs.existsSync(signedAab)) fs.unlinkSync(signedAab);
  execFileSync(jarsignerBin, [
    '-sigalg', 'SHA256withRSA',
    '-digestalg', 'SHA-256',
    '-keystore', creds.path,
    '-storepass', creds.storePass,
    '-keypass', creds.keyPass,
    '-signedjar', signedAab,
    unsignedAab,
    creds.alias,
  ], { stdio: 'inherit' });

  console.log('[TWA] Verifying signed AAB signature...');
  execFileSync(jarsignerBin, ['-verify', '-keystore', creds.path, signedAab], { stdio: 'inherit' });

  // 7. Zipalign + sign APK for direct local phone verification
  const unsignedApk = path.join(__dirname, 'app', 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk');
  const alignedApk = path.join(__dirname, 'app-release-aligned.apk');
  const signedApk = path.join(__dirname, 'app-release-signed.apk');
  const buildToolsDir = path.join(SDK_DIR, 'build-tools', '36.1.0');
  const zipalignBin = path.join(buildToolsDir, 'zipalign.exe');
  const apksignerJar = path.join(buildToolsDir, 'lib', 'apksigner.jar');
  const javaBin = path.join(jdkPath, 'bin', 'java.exe');

  if (fs.existsSync(unsignedApk)) {
    if (fs.existsSync(alignedApk)) fs.unlinkSync(alignedApk);
    if (fs.existsSync(signedApk)) fs.unlinkSync(signedApk);
    execFileSync(zipalignBin, ['-v', '-p', '4', unsignedApk, alignedApk], { stdio: 'pipe' });
    execFileSync(javaBin, [
      '-jar', apksignerJar, 'sign',
      '--ks', creds.path,
      '--ks-key-alias', creds.alias,
      '--ks-pass', `pass:${creds.storePass}`,
      '--key-pass', `pass:${creds.keyPass}`,
      '--out', signedApk,
      alignedApk,
    ], { stdio: 'inherit' });
    if (fs.existsSync(alignedApk)) fs.unlinkSync(alignedApk);
    console.log('[TWA] Verifying signed APK signature...');
    execFileSync(javaBin, ['-jar', apksignerJar, 'verify', '--print-certs', signedApk], { stdio: 'inherit' });
  }

  console.log('======================================================');
  console.log('[TWA SUCCESS] Signed AAB:', signedAab, `(${Math.round(fs.statSync(signedAab).size / 1024)} KB)`);
  if (fs.existsSync(signedApk)) {
    console.log('[TWA SUCCESS] Signed APK:', signedApk, `(${Math.round(fs.statSync(signedApk).size / 1024)} KB)`);
  }
  console.log('======================================================');
}

main().catch((err) => {
  console.error('[TWA BUILD FAILED]', err);
  process.exit(1);
});
