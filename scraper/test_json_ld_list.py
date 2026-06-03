import json
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
        
        html = page.content()
        soup = BeautifulSoup(html, 'html.parser')
        browser.close()
        
    print("\n=== ANALIZANDO LISTA JSON-LD ===")
    json_ld_tags = soup.find_all('script', type='application/ld+json')
    
    for tag in json_ld_tags:
        try:
            data = json.loads(tag.string.strip())
            if isinstance(data, list):
                print(f"Bloque es una lista de {len(data)} elementos.")
                for idx, item in enumerate(data):
                    print(f"\n   [Elemento {idx + 1}] Tipo: {item.get('@type')}")
                    for k, v in item.items():
                        if isinstance(v, (str, int, float, bool)):
                            print(f"      {k}: {str(v)[:150]}")
                        elif isinstance(v, list):
                            print(f"      {k} (list of {len(v)} elements): {str(v)[:150]}")
                        elif isinstance(v, dict):
                            print(f"      {k} (dict with keys): {list(v.keys())}")
            else:
                print(f"Bloque es un diccionario. Tipo: {data.get('@type')}")
                for k, v in data.items():
                    print(f"   {k}: {str(v)[:150]}")
        except Exception as e:
            print(f"Error parsing: {e}")

if __name__ == '__main__':
    main()
