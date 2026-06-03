import os
import re
import sys
import time
import requests
import urllib.parse
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

def sanitize_folder_name(name):
    # Remove characters that are invalid in Windows folder names
    clean = re.sub(r'[\\/*?:"<>|]', "", name)
    # Replace newlines, double spaces, and strip
    clean = clean.replace("\n", " ").replace("\r", " ")
    clean = re.sub(r'\s+', " ", clean).strip()
    # Limit length
    return clean[:100]

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
            return True
        else:
            print(f"      [WARN] HTTP {res.status_code} for {url[:50]}...")
    except Exception as e:
        print(f"      [ERROR] Downloading {url[:50]}: {e}")
    return False

def main():
    target_url = "https://www.viator.com/Punta-Cana/d794-ttd/2"
    backup_url = "https://www.viator.com/Punta-Cana/d794-ttd?page=2"
    
    desktop_path = r"C:\Users\bot\Desktop"
    output_base_dir = os.path.join(desktop_path, "Viator_Page_2_Tours")
    
    print("==============================================================")
    print("INICIANDO EXTRACCION DE FOTOS DE VIATOR (PAGINA 2)")
    print(f"Carpeta de Destino: {output_base_dir}")
    print("==============================================================")
    
    os.makedirs(output_base_dir, exist_ok=True)
    
    with sync_playwright() as p:
        print("\n[1/3] Lanzando navegador con evasion de deteccion...")
        browser = p.chromium.launch(
            headless=False, # Modo visible para evitar deteccion de Cloudflare
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
        
        print(f"\n[2/3] Navegando a la pagina principal: {target_url}...")
        try:
            page.goto(target_url)
        except Exception as e:
            print(f"[WARN] Error navegando a URL primaria: {e}. Probando URL de respaldo...")
            page.goto(backup_url)
            
        # Dar tiempo extra para evadir retos pasivos / Cloudflare
        print("Esperando resolucion de Captcha pasivo (10 segundos)...")
        page.wait_for_timeout(10000)
        
        # Scroll progresivo para cargar imagenes diferidas (lazy-loaded)
        print("Realizando scroll progresivo para cargar imagenes diferidas...")
        for scroll_step in range(1, 9):
            fraction = scroll_step / 8.0
            print(f"   Scroll {scroll_step}/8...")
            page.evaluate(f"window.scrollTo(0, document.body.scrollHeight * {fraction})")
            page.wait_for_timeout(1500)
            
        print("\n[3/3] Extrayendo estructura de tarjetas de tours...")
        html_content = page.content()
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Buscamos enlaces de tours que son tipicos de Viator
        links = soup.find_all('a', href=True)
        tour_links = []
        seen_hrefs = set()
        
        for l in links:
            href = l['href']
            # Filtrar enlaces de excursiones en Punta Cana
            if '/tours/Punta-Cana/' in href and href not in seen_hrefs:
                # Evitar enlaces repetitivos de paginacion o filtros
                if not any(x in href for x in ['?page=', 'd794-ttd', '/d794-ttd']):
                    seen_hrefs.add(href)
                    tour_links.append(l)
                    
        print(f"Se encontraron {len(tour_links)} enlaces de tours unicos.")
        
        # Mapear tarjetas subiendo en el arbol DOM para tener contenedores de tarjetas
        cards = []
        for idx, link in enumerate(tour_links):
            # Caminar hacia arriba para encontrar un contenedor comun
            parent = link
            found_card = None
            for _ in range(5): # Subir hasta 5 niveles
                if parent is None:
                    break
                class_str = " ".join(parent.get('class', []))
                data_auto = parent.get('data-automation', '')
                # Si encontramos un div contenedor tipico de Viator
                if 'product-card' in class_str or 'productCard' in class_str or data_auto == 'product-card' or parent.name == 'article':
                    found_card = parent
                    break
                parent = parent.parent
            
            # Fallback a link.parent.parent si no detectamos la clase
            card_elem = found_card if found_card else link.parent.parent
            if card_elem not in [c[0] for c in cards]:
                cards.append((card_elem, link['href']))
                
        print(f"Tarjetas de tours identificadas: {len(cards)}")
        
        extracted_tours = []
        for i, (card, href) in enumerate(cards):
            # Extraer el titulo del tour
            title_tag = card.find('h2') or card.find('h3') or card.find('div', class_=re.compile('title'))
            if title_tag:
                title = title_tag.text.strip()
            else:
                title = f"Excursion_{i+1}"
                
            # Extraer todas las imagenes dentro de la tarjeta
            img_elements = card.find_all('img')
            img_urls = []
            
            for img in img_elements:
                # Viator almacena imagenes en src o data-src
                src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
                if src:
                    # Resolver URL relativa
                    full_src = urllib.parse.urljoin(target_url, src)
                    # Asegurar que sea una imagen real de Viator/TripAdvisor
                    if 'media.tacdn.com' in full_src or 'dynamic-media' in full_src or 'viator' in full_src:
                        if full_src not in img_urls:
                            img_urls.append(full_src)
                            
            if img_urls:
                extracted_tours.append({
                    'title': title,
                    'href': href,
                    'images': img_urls
                })
                
        print(f"\nTours con imagenes validas extraidos: {len(extracted_tours)}")
        
        # Si las tarjetas fallaron por cambios de DOM, tomamos las imagenes globales agrupadas
        if len(extracted_tours) == 0:
            print("[WARN] No se detectaron tarjetas mediante contenedores. Usando selector de imagenes global...")
            all_imgs = soup.find_all('img')
            global_images = []
            for img in all_imgs:
                src = img.get('src') or img.get('data-src')
                if src:
                    full_src = urllib.parse.urljoin(target_url, src)
                    if 'media.tacdn.com' in full_src or 'dynamic-media' in full_src:
                        if full_src not in global_images:
                            global_images.append(full_src)
            print(f"Se encontraron {len(global_images)} imagenes de Viator globales en el DOM.")
            # Crear un tour ficticio masivo para no dejar al usuario sin fotos
            if global_images:
                extracted_tours.append({
                    'title': "Excursiones_Globales_Pagina_2",
                    'href': '#',
                    'images': global_images
                })
        
        browser.close()
        
    # --- DESCARGA DE IMAGENES AL ESCRITORIO ---
    print("\n==============================================================")
    print("INICIANDO DESCARGA DE IMAGENES AL ESCRITORIO")
    print("==============================================================")
    
    total_downloaded = 0
    for idx, tour in enumerate(extracted_tours):
        tour_num = idx + 1
        raw_title = tour['title']
        sanitized_title = sanitize_folder_name(raw_title)
        
        # Nombre de la subcarpeta por tour
        tour_folder = os.path.join(output_base_dir, f"{tour_num:02d}_{sanitized_title}")
        os.makedirs(tour_folder, exist_ok=True)
        
        print(f"\n[{tour_num}/{len(extracted_tours)}] Descargando fotos para: {raw_title}")
        print(f"   Destino: ...\\Desktop\\Viator_Page_2_Tours\\{tour_num:02d}_{sanitized_title}\\")
        
        images_to_download = tour['images']
        print(f"   Se encontraron {len(images_to_download)} imagenes.")
        
        success_count = 0
        for img_idx, img_url in enumerate(images_to_download):
            filename = f"foto_{img_idx + 1}.jpg"
            print(f"      [{img_idx + 1}/{len(images_to_download)}] Descargando de CDN...")
            
            success = download_image(img_url, tour_folder, filename)
            if success:
                success_count += 1
                total_downloaded += 1
                
        print(f"   Exito: {success_count} de {len(images_to_download)} fotos descargadas.")
        
    print("\n==============================================================")
    print("PROCESO DE EXTRACCION Y DESCARGA COMPLETADO CON EXITO")
    print(f"Total de excursiones procesadas: {len(extracted_tours)}")
    print(f"Total de fotos descargadas en tu Escritorio: {total_downloaded}")
    print(f"Puedes encontrarlas en: {output_base_dir}")
    print("==============================================================")

if __name__ == '__main__':
    main()
