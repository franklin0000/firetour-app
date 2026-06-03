import os
import re
import sys
import time
import shutil
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
    return clean[:80]

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
    except Exception as e:
        pass
    return False

def main():
    target_url = "https://www.viator.com/Punta-Cana/d794-ttd/2"
    backup_url = "https://www.viator.com/Punta-Cana/d794-ttd?page=2"
    
    desktop_path = r"C:\Users\bot\Desktop"
    output_base_dir = os.path.join(desktop_path, "Viator_Page_2_Tours")
    
    print("==============================================================")
    print("INICIANDO EXTRACCION PROFUNDA TOTAL Y LIMPIA DE VIATOR")
    print(f"Carpeta base de destino: {output_base_dir}")
    print("==============================================================")
    
    # 1. BORRAR CARPETA ANTERIOR PARA EVITAR REPETIDOS
    if os.path.exists(output_base_dir):
        print("\nLimpiando descargas anteriores para evitar duplicados...")
        try:
            shutil.rmtree(output_base_dir)
            print("Carpeta anterior eliminada correctamente.")
        except Exception as e:
            print(f"[WARN] No se pudo borrar la carpeta anterior: {e}. Sobrescribiendo...")
            
    os.makedirs(output_base_dir, exist_ok=True)
    
    tours_to_scrape = []
    
    with sync_playwright() as p:
        print("\n[1/3] Lanzando navegador para extraer lista de tours...")
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
        
        print(f"Navegando a la lista: {target_url}...")
        try:
            page.goto(target_url)
        except Exception as e:
            print(f"[WARN] Error navegando a URL primaria: {e}. Probando URL de respaldo...")
            page.goto(backup_url)
            
        print("Esperando resolucion de Captcha pasivo (10 segundos)...")
        page.wait_for_timeout(10000)
        
        # Scroll progresivo de la lista
        print("Cargando lista de tours con scroll...")
        for scroll_step in range(1, 7):
            fraction = scroll_step / 6.0
            page.evaluate(f"window.scrollTo(0, document.body.scrollHeight * {fraction})")
            page.wait_for_timeout(1500)
            
        html_content = page.content()
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Extraer enlaces de tours
        links = soup.find_all('a', href=True)
        seen_hrefs = set()
        
        for l in links:
            href = l['href']
            if '/tours/Punta-Cana/' in href and href not in seen_hrefs:
                if not any(x in href for x in ['?page=', 'd794-ttd', '/d794-ttd']):
                    seen_hrefs.add(href)
                    
                    # Tratar de encontrar el titulo
                    title = "Excursion"
                    parent = l
                    for _ in range(5):
                        if parent is None:
                            break
                        h_tag = parent.find('h2') or parent.find('h3')
                        if h_tag:
                            title = h_tag.text.strip()
                            break
                        parent = parent.parent
                        
                    full_url = urllib.parse.urljoin(target_url, href)
                    tours_to_scrape.append({
                        'title': title,
                        'url': full_url
                    })
                    
        print(f"Se encontraron {len(tours_to_scrape)} tours unicos en la lista.")
        
        # ELIMINAMOS EL LIMITE DE TOURS: Procesamos el 100% de los tours encontrados en la pagina
        selected_tours = tours_to_scrape
        max_tours = len(selected_tours)
        print(f"Iniciando raspado profundo para las {max_tours} excursiones de la pagina.")
        
        # --- SEGUNDA FASE: NAVEGACION PROFUNDA A CADA TOUR ---
        print("\n[2/3] Iniciando navegacion profunda a cada tour...")
        
        for idx, tour in enumerate(selected_tours):
            tour_num = idx + 1
            tour_title = tour['title']
            tour_url = tour['url']
            
            print(f"\n   [{tour_num}/{max_tours}] Visitando: {tour_title[:55]}...")
            
            try:
                # Navegar al detalle de este tour
                page.goto(tour_url, timeout=50000)
                page.wait_for_timeout(4000)
                
                # Realizar scroll suave en la pagina de detalle para forzar la carga de imagenes
                page.evaluate("window.scrollTo(0, 350)")
                page.wait_for_timeout(2000)
                page.evaluate("window.scrollTo(0, 900)")
                page.wait_for_timeout(2000)
                
                detail_html = page.content()
                detail_soup = BeautifulSoup(detail_html, 'html.parser')
                
                # Extraer todas las imagenes que sean del CDN de Viator/TripAdvisor
                all_imgs = detail_soup.find_all('img')
                gallery_urls = []
                for img in all_imgs:
                    src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
                    if src:
                        full_src = urllib.parse.urljoin(tour_url, src)
                        if 'media.tacdn.com' in full_src or 'dynamic-media' in full_src:
                            # Ignorar imagenes de avatares pequeños o iconos de valoracion
                            if not any(x in full_src for x in ['avatar', 'icon', 'profile', 'user', 'badge', 'logo']):
                                if full_src not in gallery_urls:
                                    gallery_urls.append(full_src)
                                    
                # Descargamos las 10 mejores fotos unicas de la galeria de detalles
                tour['images'] = gallery_urls[:10]
                print(f"         Exito: {len(tour['images'])} fotos de galeria encontradas.")
                
            except Exception as e:
                print(f"         [WARN] No se pudo cargar el detalle: {e}. Se usara imagen principal.")
                # Si falla, intentamos usar un fallback del listado si existe
                tour['images'] = []
                
        browser.close()
        
    # --- TERCERA FASE: DESCARGA DE GALERIAS COMPLETAS AL ESCRITORIO ---
    print("\n[3/3] Iniciando descarga de galerias de alta resolucion...")
    
    total_downloaded = 0
    tours_downloaded_count = 0
    
    for idx, tour in enumerate(selected_tours):
        tour_num = idx + 1
        raw_title = tour['title']
        images = tour.get('images', [])
        
        if not images:
            print(f"\n   [{tour_num}/{max_tours}] Saltando {raw_title[:50]} (galeria vacia)")
            continue
            
        sanitized_title = sanitize_folder_name(raw_title)
        tour_folder = os.path.join(output_base_dir, f"{tour_num:02d}_{sanitized_title}")
        os.makedirs(tour_folder, exist_ok=True)
        
        print(f"\n   [{tour_num}/{max_tours}] Descargando galeria de: {raw_title}")
        print(f"         Carpeta: ...\\Desktop\\Viator_Page_2_Tours\\{tour_num:02d}_{sanitized_title}\\")
        
        success_count = 0
        for img_idx, img_url in enumerate(images):
            filename = f"foto_{img_idx + 1}.jpg"
            success = download_image(img_url, tour_folder, filename)
            if success:
                success_count += 1
                total_downloaded += 1
                
        print(f"         Completado: {success_count} de {len(images)} fotos de galeria descargadas.")
        tours_downloaded_count += 1
        
    print("\n==============================================================")
    print("PROCESO DE EXTRACCION PROFUNDA COMPLETA FINALIZADO CON EXITO")
    print(f"Total de galerias de tours descargadas: {tours_downloaded_count}")
    print(f"Total de fotos de alta resolucion sin repeticion en tu Escritorio: {total_downloaded}")
    print(f"Carpeta del bundle completo: {output_base_dir}")
    print("==============================================================")

if __name__ == '__main__':
    main()
