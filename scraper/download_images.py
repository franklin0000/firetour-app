import time
import requests
import os
import json
from playwright.sync_api import sync_playwright

def main():
    print("Iniciando Playwright para evadir Cloudflare...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, args=['--disable-blink-features=AutomationControlled'])
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")
        page = context.new_page()
        page.goto('https://www.viator.com/Punta-Cana/d794-ttd')
        
        print("Esperando resolucion de Captcha pasivo...")
        page.wait_for_timeout(10000)
        page.evaluate("window.scrollTo(0, document.body.scrollHeight/3)")
        page.wait_for_timeout(5000)
        
        # Extraer imagenes reales
        print("Buscando imagenes en el DOM...")
        images = page.locator('img').evaluate_all('''(imgs) => {
            return imgs.map(img => img.src || img.getAttribute('data-src'))
                       .filter(src => src && (src.includes("media.tacdn.com") || src.includes("dynamic-media")))
        }''')
        
        # Filtrar duplicados y tomar las primeras 6
        unique_images = []
        for img in images:
            if img not in unique_images:
                unique_images.append(img)
            if len(unique_images) == 6:
                break
                
        print(f"Imagenes encontradas: {len(unique_images)}")
        
        # Crear directorio local
        os.makedirs('../frontend/public/tours', exist_ok=True)
        
        # Descargar imagenes
        for i, img_url in enumerate(unique_images):
            try:
                print(f"Descargando: {img_url}")
                res = requests.get(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                if res.status_code == 200:
                    with open(f'../frontend/public/tours/tour_{i+1}.jpg', 'wb') as f:
                        f.write(res.content)
                    print(f"Guardado exitosamente: tour_{i+1}.jpg")
                else:
                    print(f"Error descargando {img_url} - HTTP {res.status_code}")
            except Exception as e:
                print(f"Error critico: {e}")
                
        browser.close()
        
if __name__ == '__main__':
    main()
