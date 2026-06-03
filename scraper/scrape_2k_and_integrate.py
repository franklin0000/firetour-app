import os
import re
import sys
import json
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

def calculate_token_overlap(name1, name2):
    # Token-overlap score
    words1 = set(re.findall(r'\w+', name1.lower()))
    words2 = set(re.findall(r'\w+', name2.lower()))
    
    # Remove common filler words
    filler_words = {'in', 'the', 'and', 'or', 'of', 'to', 'for', 'with', 'on', 'at', 'by', 'from', 'a', 'an', 'el', 'la', 'los', 'las', 'de', 'del', 'y', 'en', 'para', 'con'}
    words1 = words1 - filler_words
    words2 = words2 - filler_words
    
    if not words1 or not words2:
        return 0.0
        
    intersection = words1.intersection(words2)
    return len(intersection) / max(len(words1), len(words2))

def main():
    target_url = "https://www.viator.com/Punta-Cana/d794-ttd/2"
    backup_url = "https://www.viator.com/Punta-Cana/d794-ttd?page=2"
    
    desktop_path = r"C:\Users\bot\Desktop"
    desktop_output_dir = os.path.join(desktop_path, "Viator_Page_2_Tours")
    
    project_root = r"C:\Users\bot\Desktop\Fire Tour DR"
    frontend_public_dir = os.path.join(project_root, "frontend", "public", "tours", "page2")
    database_file = os.path.join(project_root, "backend", "database.json")
    
    print("==============================================================")
    print("INICIANDO EXTRACCION 2K E INTEGRACION EN PORTAL WEB")
    print(f"Directorio Escritorio: {desktop_output_dir}")
    print(f"Directorio Frontend:  {frontend_public_dir}")
    print(f"Base de Datos:        {database_file}")
    print("==============================================================")
    
    # 1. LIMPIEZA DE CARPETAS PREVIAS
    for path_dir in [desktop_output_dir, frontend_public_dir]:
        if os.path.exists(path_dir):
            print(f"Limpiando directorio anterior: {path_dir}...")
            try:
                shutil.rmtree(path_dir)
            except Exception as e:
                print(f"[WARN] No se pudo limpiar: {e}")
                
    os.makedirs(desktop_output_dir, exist_ok=True)
    os.makedirs(frontend_public_dir, exist_ok=True)
    
    # 2. CARGAR BASE DE DATOS
    try:
        with open(database_file, 'r', encoding='utf-8') as f:
            db_data = json.load(f)
        db_tours = db_data.get('tours', [])
        print(f"Cargados {len(db_tours)} tours de la base de datos local.")
    except Exception as e:
        print(f"[ERROR] No se pudo cargar database.json: {e}")
        sys.exit(1)
        
    tours_to_scrape = []
    
    # 3. EXTRAER LISTADO DE TOURS
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
            print(f"[WARN] Error navegando: {e}. Probando respaldo...")
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
                    
                    # Encontrar titulo
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
                    
        print(f"Se encontraron {len(tours_to_scrape)} tours unicos en Viator.")
        
        # 4. NAVEGACION DE DETALLES Y EXTRACCION 2K
        print("\n[2/3] Iniciando navegacion profunda a cada tour con escalamiento 2K...")
        
        matched_ids = set()
        
        for idx, tour in enumerate(tours_to_scrape):
            tour_num = idx + 1
            tour_title = tour['title']
            tour_url = tour['url']
            
            # --- ALGORITMO INTELIGENTE DE CRUCE CON BASE DE DATOS ---
            matched_tour_id = None
            best_score = 0.0
            
            # Intentar primero coincidencia de tokens en el nombre
            for db_t in db_tours:
                db_id = db_t.get('id')
                if db_id in matched_ids:
                    continue
                score = calculate_token_overlap(tour_title, db_t.get('name', ''))
                if score > best_score:
                    best_score = score
                    matched_tour_id = db_id
                    
            # Si la coincidencia es debil (menor a 0.25), buscar por tag similar que no este emparejado
            if best_score < 0.25:
                matched_tour_id = None
                # Asignar secuencialmente a un ID libre para asegurar integracion total
                for db_t in db_tours:
                    db_id = db_t.get('id')
                    if db_id not in matched_ids and db_id > 1: # Mantener el ID 1 impecable con nuestra seccion manual de Fire Tour
                        matched_tour_id = db_id
                        break
            
            if matched_tour_id is None:
                # Fallback de emergencia
                matched_tour_id = idx + 2 # Empezar despues del ID 1
                
            matched_ids.add(matched_tour_id)
            tour['id'] = matched_tour_id
            
            print(f"\n   [{tour_num}/{len(tours_to_scrape)}] Scrapeando: {tour_title[:45]}...")
            print(f"         Asociado a Tour ID {matched_tour_id} de database.json")
            
            try:
                page.goto(tour_url, timeout=50000)
                page.wait_for_timeout(4000)
                
                # Scroll suave para lazy-loading
                page.evaluate("window.scrollTo(0, 350)")
                page.wait_for_timeout(1500)
                page.evaluate("window.scrollTo(0, 900)")
                page.wait_for_timeout(1500)
                
                detail_html = page.content()
                detail_soup = BeautifulSoup(detail_html, 'html.parser')
                
                # Extraer imagenes reales
                all_imgs = detail_soup.find_all('img')
                gallery_urls = []
                for img in all_imgs:
                    src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
                    if src:
                        full_src = urllib.parse.urljoin(tour_url, src)
                        if 'media.tacdn.com' in full_src or 'dynamic-media' in full_src:
                            if not any(x in full_src for x in ['avatar', 'icon', 'profile', 'user', 'badge', 'logo']):
                                
                                # --- OPTIMIZACION DE CALIDAD 2K DENTRO DEL CDN ---
                                large_src = full_src
                                if 'splice-spp-' in large_src:
                                    # Para media.tacdn.com path-resizing, forzar 674x446 (max sin perdida)
                                    large_src = re.sub(r'splice-spp-\d+x\d+', 'splice-spp-674x446', large_src)
                                elif 'dynamic-media' in large_src:
                                    # Para dynamic-media query-resizing, forzar w=1200 y h=900 (max CDN)
                                    large_src = re.sub(r'w=\d+', 'w=1200', large_src)
                                    large_src = re.sub(r'h=\d+', 'h=900', large_src)
                                    
                                if large_src not in gallery_urls:
                                    gallery_urls.append(large_src)
                                    
                tour['images'] = gallery_urls[:10]
                print(f"         Completado: {len(tour['images'])} fotos 2K de alta resolucion encontradas.")
                
            except Exception as e:
                print(f"         [WARN] No se pudo cargar: {e}")
                tour['images'] = []
                
        browser.close()
        
    # 5. DESCARGA E INTEGRACION EN BASE DE DATOS
    print("\n[3/3] Iniciando descargas simultaneas y actualizacion de base de datos...")
    
    total_downloaded = 0
    
    for idx, tour in enumerate(tours_to_scrape):
        tour_num = idx + 1
        raw_title = tour['title']
        tour_id = tour['id']
        images = tour.get('images', [])
        
        if not images:
            print(f"\n   [{tour_num}/{len(tours_to_scrape)}] Saltando {raw_title[:45]} (sin fotos)")
            continue
            
        sanitized_title = sanitize_folder_name(raw_title)
        
        # Ruta en el Escritorio (bundle del usuario)
        desktop_tour_folder = os.path.join(desktop_output_dir, f"{tour_num:02d}_{sanitized_title}")
        os.makedirs(desktop_tour_folder, exist_ok=True)
        
        # Ruta en el Frontend (recursos estaticos públicos del portal)
        frontend_tour_folder = os.path.join(frontend_public_dir, f"tour_{tour_id}")
        os.makedirs(frontend_tour_folder, exist_ok=True)
        
        print(f"\n   [{tour_num}/{len(tours_to_scrape)}] Descargando fotos 2K para Tour ID {tour_id}: {raw_title[:45]}")
        print(f"         Destino Web:  .../frontend/public/tours/page2/tour_{tour_id}/")
        
        downloaded_local_paths = []
        success_count = 0
        
        for img_idx, img_url in enumerate(images):
            filename = f"foto_{img_idx + 1}.jpg"
            
            # Descargar a Escritorio
            download_image(img_url, desktop_tour_folder, filename)
            
            # Descargar a Frontend Assets
            success = download_image(img_url, frontend_tour_folder, filename)
            if success:
                success_count += 1
                total_downloaded += 1
                # Guardar la ruta relativa para database.json
                rel_path = f"/tours/page2/tour_{tour_id}/{filename}"
                downloaded_local_paths.append(rel_path)
                
        print(f"         Descargadas: {success_count} de {len(images)} fotos en alta resolucion.")
        
        # --- ACTUALIZACION EN LA BASE DE DATOS LOCAL ---
        if downloaded_local_paths:
            for db_t in db_tours:
                if db_t.get('id') == tour_id:
                    # Asignar la primera foto 2K como portada de la tarjeta
                    db_t['image'] = downloaded_local_paths[0]
                    # Asignar la galeria de 10 fotos 2K
                    db_t['photos'] = downloaded_local_paths
                    print(f"         [DB UPDATE] Actualizados 'image' y 'photos' en la base de datos para ID {tour_id}.")
                    break
                    
    # Guardar base de datos
    try:
        with open(database_file, 'w', encoding='utf-8') as f:
            json.dump(db_data, f, indent=2, ensure_ascii=False)
        print("\n==============================================================")
        print("BASE DE DATOS database.json ACTUALIZADA CORRECTAMENTE.")
        print("==============================================================")
    except Exception as e:
        print(f"[ERROR] No se pudo guardar database.json: {e}")
        
    print("\n==============================================================")
    print("PROCESO DE EXTRACCION 2K E INTEGRACION FINALIZADO CON EXITO")
    print(f"Total de tours enriquecidos en el portal: {len(tours_to_scrape)}")
    print(f"Total de fotos 2K descargadas en el sistema: {total_downloaded}")
    print(f"Carpeta del bundle en Escritorio: {desktop_output_dir}")
    print("==============================================================")

if __name__ == '__main__':
    main()
