import urllib.parse
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

def main():
    # Use one of the real tour URLs from Punta Cana Page 2
    tour_url = "https://www.viator.com/tours/Punta-Cana/Parasailing-Adventure-in-Punta-Cana/d794-316452P8"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': 'https://www.viator.com/'
    }
    
    print(f"Abriendo detalle de tour: {tour_url}")
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,
            args=['--disable-blink-features=AutomationControlled', '--disable-infobars']
        )
        context = browser.new_context(user_agent=headers['User-Agent'])
        page = context.new_page()
        page.goto(tour_url)
        page.wait_for_timeout(8000)
        
        # Scroll para forzar carga de contenido
        page.evaluate("window.scrollTo(0, 500)")
        page.wait_for_timeout(2000)
        page.evaluate("window.scrollTo(0, 1500)")
        page.wait_for_timeout(2000)
        
        html = page.content()
        soup = BeautifulSoup(html, 'html.parser')
        browser.close()
        
    print("\n=== ANALIZANDO SELECTORES EN EL DOM ===")
    
    # 1. Nombre / Titulo
    title_tag = soup.find('h1')
    title = title_tag.text.strip() if title_tag else "No encontrado"
    print(f"Titulo: {title}")
    
    # 2. Descripcion
    desc_section = soup.find('div', class_=re.compile(r'description|overview|about', re.I))
    if not desc_section:
        desc_section = soup.find('section', id=re.compile(r'description|overview|about', re.I))
    desc_text = desc_section.text.strip()[:300] if desc_section else "No encontrada"
    print(f"Descripcion (primeros 300 chars): {desc_text}")
    
    # 3. Qué incluye (Inclusions)
    inclusions = []
    inclusion_elems = soup.find_all(text=re.compile(r'What\'s Included|Qué incluye', re.I))
    if inclusion_elems:
        parent = inclusion_elems[0].parent
        for _ in range(4):
            if parent is None:
                break
            # Buscar elementos li o div con textos de inclusions en los descendientes
            lis = parent.find_all('li')
            if lis:
                inclusions = [li.text.strip() for li in lis]
                break
            parent = parent.parent
            
    if not inclusions:
        # Fallback a clases comunes de inclusions
        inc_divs = soup.find_all('div', class_=re.compile(r'inclusion|whatsIncluded', re.I))
        inclusions = [d.text.strip() for d in inc_divs if d.text.strip()]
        
    print(f"Qué incluye (primeras 5): {inclusions[:5]}")
    
    # 4. Itinerario (Itinerary)
    itinerary_steps = []
    itinerary_title_elems = soup.find_all(text=re.compile(r'Itinerary|Itinerario|Itinerary details', re.I))
    if itinerary_title_elems:
        parent = itinerary_title_elems[0].parent
        for _ in range(5):
            if parent is None:
                break
            # Buscar elementos que puedan contener pasos (por ejemplo h3, h4 o divs con titulos de pasos)
            steps = parent.find_all(['h3', 'h4', 'div'], class_=re.compile(r'step|item|title|header', re.I))
            if len(steps) > 1:
                itinerary_steps = [s.text.strip() for s in steps if s.text.strip()]
                break
            parent = parent.parent
            
    print(f"Pasos del itinerario (primeros 5): {itinerary_steps[:5]}")

if __name__ == '__main__':
    import re
    main()
