import os
import sys
import requests

def download_image(url, folder, filename):
    try:
        # Append 2K crop query parameters for Pexels CDN
        cdn_url = f"{url}?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        }
        res = requests.get(cdn_url, headers=headers, timeout=20)
        if res.status_code == 200:
            file_path = os.path.join(folder, filename)
            with open(file_path, 'wb') as f:
                f.write(res.content)
            print(f"      [OK] Descargada: {filename} ({len(res.content)} bytes)")
            return True
        else:
            print(f"      [FAIL] HTTP status {res.status_code} for {filename}")
    except Exception as e:
        print(f"      [FAIL] Error descargando {filename}: {e}")
    return False

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    assets = {
        "tour_11": [
            "https://images.pexels.com/photos/2589036/pexels-photo-2589036.jpeg",
            "https://images.pexels.com/photos/33801725/pexels-photo-33801725.jpeg",
            "https://images.pexels.com/photos/36590629/pexels-photo-36590629.jpeg",
            "https://images.pexels.com/photos/36590635/pexels-photo-36590635.jpeg",
            "https://images.pexels.com/photos/753311/pexels-photo-753311.jpeg",
            "https://images.pexels.com/photos/29767529/pexels-photo-29767529.jpeg",
            "https://images.pexels.com/photos/34912011/pexels-photo-34912011.jpeg",
            "https://images.pexels.com/photos/19608390/pexels-photo-19608390.jpeg",
            "https://images.pexels.com/photos/2589048/pexels-photo-2589048.jpeg",
            "https://images.pexels.com/photos/12995176/pexels-photo-12995176.jpeg"
        ],
        "tour_2": [
            "https://images.pexels.com/photos/31234079/pexels-photo-31234079.jpeg",
            "https://images.pexels.com/photos/12319310/pexels-photo-12319310.jpeg",
            "https://images.pexels.com/photos/5678355/pexels-photo-5678355.jpeg",
            "https://images.pexels.com/photos/31234077/pexels-photo-31234077.jpeg",
            "https://images.pexels.com/photos/31234075/pexels-photo-31234075.jpeg",
            "https://images.pexels.com/photos/26098590/pexels-photo-26098590.jpeg",
            "https://images.pexels.com/photos/31234078/pexels-photo-31234078.jpeg",
            "https://images.pexels.com/photos/12319308/pexels-photo-12319308.jpeg",
            "https://images.pexels.com/photos/37039917/pexels-photo-37039917.jpeg",
            "https://images.pexels.com/photos/14507483/pexels-photo-14507483.jpeg"
        ],
        "tour_24": [
            "https://images.pexels.com/photos/11488068/pexels-photo-11488068.jpeg",
            "https://images.pexels.com/photos/23325251/pexels-photo-23325251.jpeg",
            "https://images.pexels.com/photos/6760475/pexels-photo-6760475.jpeg",
            "https://images.pexels.com/photos/19133798/pexels-photo-19133798.jpeg",
            "https://images.pexels.com/photos/23325249/pexels-photo-23325249.jpeg",
            "https://images.pexels.com/photos/31234513/pexels-photo-31234513.jpeg",
            "https://images.pexels.com/photos/30932918/pexels-photo-30932918.jpeg",
            "https://images.pexels.com/photos/31085831/pexels-photo-31085831.jpeg",
            "https://images.pexels.com/photos/12608565/pexels-photo-12608565.jpeg",
            "https://images.pexels.com/photos/9155308/pexels-photo-9155308.jpeg"
        ]
    }
    
    base_dir = r"c:\Users\bot\Desktop\Fire Tour DR\frontend\public\tours\page2"
    
    for folder_name, urls in assets.items():
        folder_path = os.path.join(base_dir, folder_name)
        os.makedirs(folder_path, exist_ok=True)
        print(f"\n---> Descargando imágenes para {folder_name} en {folder_path}...")
        for idx, url in enumerate(urls):
            filename = f"foto_{idx + 1}.jpg"
            download_image(url, folder_path, filename)
            
    print("\n¡Descargas temáticas completadas con éxito!")

if __name__ == '__main__':
    main()
