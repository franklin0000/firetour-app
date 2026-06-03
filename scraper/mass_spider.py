import time
import requests
import os
import json
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

def extract_page_data(page):
    html = page.content()
    soup = BeautifulSoup(html, 'html.parser')
    links = soup.find_all('a', href=True)
    tour_links = [l for l in links if '/tours/Punta-Cana/' in l['href']]
    
    cards = []
    seen_hrefs = set()
    for link in tour_links:
        if link['href'] not in seen_hrefs:
            seen_hrefs.add(link['href'])
            cards.append((link.parent.parent, link['href']))
            
    extracted = []
    for card, href in cards:
        title_tag = card.find('h2') or card.find('h3')
        if title_tag:
            title = title_tag.text.strip()
        else:
            title = "Tour " + href.split('-')[-1]
            
        img_tag = card.find('img')
        img_url = img_tag.get('src') or img_tag.get('data-src') if img_tag else None
        
        if img_url and 'media.tacdn.com' not in img_url and 'dynamic-media' not in img_url:
            img_url = None
            
        texts = list(card.stripped_strings)
        price_text = next((t for t in texts if '$' in t), '0')
        price = int(''.join(filter(str.isdigit, price_text))) if any(char.isdigit() for char in price_text) else 50
        
        if img_url:
            extracted.append({
                'title': title,
                'price': price,
                'image_url': img_url,
                'href': href,
                'texts': texts
            })
            
    return extracted

def main():
    print("Iniciando Extractor Masivo de Fire Tour DR...")
    all_tours = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, args=['--disable-blink-features=AutomationControlled'])
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = context.new_page()
        
        for i in range(1, 11): 
            url = f'https://www.viator.com/Punta-Cana/d794-ttd?page={i}' if i > 1 else 'https://www.viator.com/Punta-Cana/d794-ttd'
            print(f"Navegando a la pagina {i}...")
            
            try:
                page.goto(url)
                page.wait_for_timeout(5000)
                
                for _ in range(5):
                    page.evaluate("window.scrollBy(0, document.body.scrollHeight/5)")
                    page.wait_for_timeout(1000)
                    
                page_tours = extract_page_data(page)
                if not page_tours:
                    print(f"No se encontraron tours en la pagina {i}. Posible fin o bloqueo.")
                    break
                    
                all_tours.extend(page_tours)
                print(f"Pagina {i} completada: {len(page_tours)} tours extraidos. Total acumulado: {len(all_tours)}")
                
            except Exception as e:
                print(f"Error en pagina {i}: {e}")
                break
                
        browser.close()
        
    print(f"\nExtraccion finalizada. {len(all_tours)} excursiones encontradas en total.")
    print("Iniciando descarga masiva de imagenes al disco duro (frontend/public/tours/mass)...")
    
    os.makedirs('../frontend/public/tours/mass', exist_ok=True)
    
    final_db_tours = []
    
    for idx, tour in enumerate(all_tours):
        tour_id = idx + 1
        img_url = tour['image_url']
        local_img_path = f'/tours/mass/tour_{tour_id}.jpg'
        
        try:
            res = requests.get(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            if res.status_code == 200:
                with open(f'../frontend/public{local_img_path}', 'wb') as f:
                    f.write(res.content)
            else:
                local_img_path = "https://media.tacdn.com/media/attractions-splice-spp-674x446/09/cc/62/08.jpg" 
        except:
             local_img_path = "https://media.tacdn.com/media/attractions-splice-spp-674x446/09/cc/62/08.jpg" 
             
        title = tour['title']
        if title.startswith("Tour "):
             long_texts = [t for t in tour['texts'] if len(t) > 15]
             if long_texts: title = long_texts[0]
             
        final_db_tours.append({
            "id": tour_id,
            "name": f"Fire Tour DR: {title}",
            "category": "booking",
            "badge": "Recomendado" if tour_id <= 10 else ("Oferta" if tour_id % 4 == 0 else "Novedad"),
            "badgeClass": "badge-accent" if tour_id % 2 == 0 else "badge-cyan",
            "price": tour['price'],
            "rating": 4.5 + (tour_id % 5) / 10,
            "reviews": 100 + (tour_id * 3),
            "tag": "Adventure" if tour_id % 3 == 0 else ("Water" if tour_id % 2 == 0 else "Relax"),
            "image": local_img_path,
            "desc": f"Experimenta lo mejor de Punta Cana con esta actividad inolvidable. Disfruta de la maxima aventura tropical de clase mundial operada directamente por la agencia experta Fire Tour DR.",
            "duration": "Medio Dia" if tour_id % 2 == 0 else "Dia Completo",
            "difficulty": "Media" if tour_id % 2 == 0 else "Facil",
            "included": ["Transporte de ida y vuelta", "Guia certificado local", "Refrescos y botellas de agua", "Equipo de seguridad profesional"]
        })
        
        if (idx+1) % 10 == 0:
            print(f"Progreso de Descarga: {idx+1} de {len(all_tours)} fotos guardadas...")
            
    db_file = '../backend/database.json'
    try:
        with open(db_file, 'r', encoding='utf-8') as f:
            db_data = json.load(f)
    except:
        db_data = {"tours": [], "reservations": [], "chat_messages": []}
        
    db_data['tours'] = final_db_tours
    
    with open(db_file, 'w', encoding='utf-8') as f:
        json.dump(db_data, f, indent=2, ensure_ascii=False)
        
    print(f"\n¡EXITO TOTAL! Se inyectaron {len(final_db_tours)} excursiones masivas a la base de datos central.")

if __name__ == '__main__':
    main()
