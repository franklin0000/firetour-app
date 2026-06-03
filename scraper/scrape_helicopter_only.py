import os
import re
import sys
import json
import urllib.parse
import requests
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

def download_image(url, folder, filename):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Referer': 'https://www.viator.com/'
        }
        res = requests.get(url, headers=headers, timeout=15)
        if res.status_code == 200:
            file_path = os.path.join(folder, filename)
            with open(file_path, 'wb') as f:
                f.write(res.content)
            print(f"      [OK] Descargada: {filename} ({len(res.content)} bytes)")
            return True
    except Exception as e:
        print(f"      [FAIL] Error descargando {filename}: {e}")
    return False

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    url = "https://www.viator.com/tours/Punta-Cana/Punta-Cana-Helicopter-Tour/d794-6821P1"
    folder = r"c:\Users\bot\Desktop\Fire Tour DR\frontend\public\tours\page2\tour_11"
    os.makedirs(folder, exist_ok=True)
    
    print(f"Abriendo: {url}")
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=['--disable-blink-features=AutomationControlled']
        )
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
        )
        page = context.new_page()
        try:
            page.goto(url, timeout=60000)
            page.wait_for_timeout(5000)
            
            # Print current URL (checks redirects)
            print(f"URL final resuelta: {page.url}")
            
            page.evaluate("window.scrollTo(0, 400)")
            page.wait_for_timeout(1000)
            page.evaluate("window.scrollTo(0, 800)")
            page.wait_for_timeout(1000)
            
            html = page.content()
            soup = BeautifulSoup(html, 'html.parser')
            
            # Inspect script tags with ld+json
            json_ld_tags = soup.find_all('script', type='application/ld+json')
            image_urls = []
            for tag in json_ld_tags:
                try:
                    data = json.loads(tag.string.strip())
                    if isinstance(data, list):
                        for item in data:
                            if item.get('@type') == 'Product' and 'image' in item:
                                imgs = item['image']
                                if isinstance(imgs, list):
                                    image_urls.extend(imgs)
                                elif isinstance(imgs, str):
                                    image_urls.append(imgs)
                    elif isinstance(data, dict):
                        if data.get('@type') == 'Product' and 'image' in data:
                            imgs = data['image']
                            if isinstance(imgs, list):
                                image_urls.extend(imgs)
                            elif isinstance(imgs, str):
                                image_urls.append(imgs)
                except Exception as je:
                    pass
            
            # Fallback to img tags in HTML if ld+json yielded nothing
            if not image_urls:
                all_imgs = soup.find_all('img')
                for img in all_imgs:
                    src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
                    if src:
                        full_src = urllib.parse.urljoin(url, src)
                        if 'media.tacdn.com' in full_src or 'dynamic-media' in full_src:
                            if not any(x in full_src for x in ['avatar', 'icon', 'profile', 'user', 'badge', 'logo']):
                                image_urls.append(full_src)
            
            # Clean and clean duplicates
            cleaned_urls = []
            for u in image_urls:
                if u not in cleaned_urls:
                    cleaned_urls.append(u)
                    
            print(f"Encontradas {len(cleaned_urls)} URLs de imágenes en total:")
            for idx, u in enumerate(cleaned_urls[:15]):
                print(f"  [{idx}] {u}")
                
            # Apply 2K resize
            resized_urls = []
            for u in cleaned_urls:
                large_src = u
                if 'splice-spp-' in large_src:
                    large_src = re.sub(r'splice-spp-\d+x\d+', 'splice-spp-674x446', large_src)
                elif 'dynamic-media' in large_src:
                    large_src = re.sub(r'w=\d+', 'w=1200', large_src)
                    large_src = re.sub(r'h=\d+', 'h=900', large_src)
                if large_src not in resized_urls:
                    resized_urls.append(large_src)
                    
            target_urls = resized_urls[:10]
            print(f"Seleccionadas {len(target_urls)} para descargar en 2K...")
            
            for idx, img_url in enumerate(target_urls):
                filename = f"foto_{idx + 1}.jpg"
                download_image(img_url, folder, filename)
                
        except Exception as e:
            print(f"Error procesando la página: {e}")
        finally:
            browser.close()

if __name__ == '__main__':
    main()
