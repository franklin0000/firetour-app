import re
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

def main():
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
        
        # Scroll para forzar carga
        page.evaluate("window.scrollTo(0, 1200)")
        page.wait_for_timeout(2000)
        
        html = page.content()
        soup = BeautifulSoup(html, 'html.parser')
        browser.close()
        
    print("\n=== BUSCANDO TEXTOS DE INTERES ===")
    
    # Encontrar textos
    keywords = [r"stop at", r"pass by", r"duration:", r"what to expect", r"itinerary"]
    for text_node in soup.find_all(text=True):
        node_text = text_node.strip().lower()
        if any(re.search(kw, node_text) for kw in keywords):
            parent = text_node.parent
            if parent:
                parent_name = parent.name
                parent_class = " ".join(parent.get('class', []))
                print(f"   [{parent_name} class='{parent_class}']: {text_node.strip()[:100]}")

if __name__ == '__main__':
    main()
