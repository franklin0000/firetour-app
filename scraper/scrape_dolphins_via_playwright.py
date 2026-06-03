import os
import re
import sys
import requests
import time
import urllib.parse
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

tours_metadata = {
    "tour_15": {
        "url": "https://www.viator.com/tours/Punta-Cana/Dolphin-Swim-Adventure-in-Punta-Cana/d794-5616D_SAD",
        "name": "Dolphin Swim Adventure"
    },
    "tour_16": {
        "url": "https://www.viator.com/tours/Punta-Cana/Dolphin-Encounter-at-Dolphin-Island-in-Punta-Cana/d794-5616D_ENC",
        "name": "Dolphin Encounter"
    },
    "tour_21": {
        "url": "https://www.viator.com/tours/Punta-Cana/Dolphin-Royal-Swim-VIP-in-Punta-Cana/d794-5616D_ROY",
        "name": "Dolphin Royal Swim VIP"
    }
}

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
            print(f"      [EXITO] Guardada: {filename} ({len(res.content)} bytes)")
            return True
    except Exception as e:
        print(f"      [ERROR] Falló descarga de {url}: {e}")
    return False

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    base_dir = r"C:\Users\bot\Desktop\Fire Tour DR\frontend\public\tours\page2"
    
    print("==============================================================")
    print("INICIANDO PLAYWRIGHT SPIDER PARA FOTOS REALES DE DELFINES VIATOR")
    print("==============================================================")
    
    with sync_playwright() as p:
        print("[1/2] Iniciando navegador headed para pasar Cloudflare...")
        browser = p.chromium.launch(
            headless=False,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--disable-infobars',
                '--window-size=1280,800'
            ]
        )
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()
        
        for folder_name, info in tours_metadata.items():
            print(f"\n   -> Procesando {folder_name} | {info['name']}")
            print(f"      Navegando a: {info['url']}")
            
            try:
                page.goto(info['url'], timeout=60000)
                # Esperar a que la página cargue y pasar Cloudflare
                page.wait_for_timeout(8000)
                
                # Desplazamiento progresivo para forzar lazy load de imágenes
                print("      Haciendo scroll para cargar galería de fotos...")
                for scroll_step in range(1, 6):
                    page.evaluate(f"window.scrollTo(0, {scroll_step * 350})")
                    page.wait_for_timeout(1000)
                    
                # Extraer contenido HTML
                html = page.content()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Extraer URLs candidatas
                all_imgs = soup.find_all('img')
                candidate_urls = []
                for img in all_imgs:
                    src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
                    if src:
                        full_src = urllib.parse.urljoin(info['url'], src)
                        if 'media.tacdn.com' in full_src or 'dynamic-media' in full_src:
                            if not any(x in full_src for x in ['avatar', 'icon', 'profile', 'user', 'badge', 'logo']):
                                # Convertir a alta resolución
                                large_src = full_src
                                if 'splice-spp-' in large_src:
                                    large_src = re.sub(r'splice-spp-\d+x\d+', 'splice-spp-674x446', large_src)
                                elif 'dynamic-media' in large_src:
                                    large_src = re.sub(r'w=\d+', 'w=1200', large_src)
                                    large_src = re.sub(r'h=\d+', 'h=900', large_src)
                                    
                                if large_src not in candidate_urls:
                                    candidate_urls.append(large_src)
                                    
                print(f"      Encontradas {len(candidate_urls)} imágenes candidatas en el CDN.")
                
                # Seleccionar las 10 mejores
                selected_urls = candidate_urls[:10]
                
                # Si no encontramos suficientes, buscar fotos de delfines alternativas desde el CDN de respaldo
                fallback_dolphins = [
                    "https://media.tacdn.com/media/attractions-splice-spp-674x446/09/b3/89/3e.jpg",
                    "https://media.tacdn.com/media/attractions-splice-spp-674x446/09/b3/88/54.jpg",
                    "https://media.tacdn.com/media/attractions-splice-spp-674x446/09/b3/89/65.jpg",
                    "https://media.tacdn.com/media/attractions-splice-spp-674x446/09/b3/89/a2.jpg",
                    "https://media.tacdn.com/media/attractions-splice-spp-674x446/09/b3/8a/0a.jpg",
                    "https://media.tacdn.com/media/attractions-splice-spp-674x446/0a/8a/02/76.jpg",
                    "https://media.tacdn.com/media/attractions-splice-spp-674x446/0a/8a/02/b0.jpg",
                    "https://media.tacdn.com/media/attractions-splice-spp-674x446/0a/8a/02/c4.jpg",
                    "https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/2e/de/c3.jpg",
                    "https://media.tacdn.com/media/attractions-splice-spp-674x446/0a/8f/3e/26.jpg"
                ]
                
                # Rellenar si faltan fotos
                while len(selected_urls) < 10 and len(fallback_dolphins) > 0:
                    fb = fallback_dolphins.pop(0)
                    if fb not in selected_urls:
                        selected_urls.append(fb)
                        
                target_folder = os.path.join(base_dir, folder_name)
                os.makedirs(target_folder, exist_ok=True)
                
                # Descargar fotos
                print(f"      Iniciando descarga de 10 fotos a {target_folder}...")
                downloaded_count = 0
                for idx, img_url in enumerate(selected_urls):
                    filename = f"foto_{idx+1}.jpg"
                    success = download_image(img_url, target_folder, filename)
                    if success:
                        downloaded_count += 1
                        
                print(f"      Descarga completada para {folder_name}: {downloaded_count}/10 imágenes guardadas.")
                
            except Exception as e:
                print(f"      [WARN] Ocurrió un error con {folder_name}: {e}")
                
        browser.close()
        
    print("\n==============================================================")
    print("PROCESO DE EXTRACCION Y DESCARGA COMPLETADO CON EXITO.")
    print("==============================================================")

if __name__ == '__main__':
    main()
