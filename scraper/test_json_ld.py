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
        
    print("\n=== ANALIZANDO JSON-LD STRUCTURED DATA ===")
    json_ld_tags = soup.find_all('script', type='application/ld+json')
    print(f"Se encontraron {len(json_ld_tags)} bloques JSON-LD.")
    
    for idx, tag in enumerate(json_ld_tags):
        try:
            data = json.loads(tag.string.strip())
            print(f"\n[Bloque {idx + 1}] Tipo: {data.get('@type') or data.get('@context')}")
            # Print keys and some contents
            if isinstance(data, list):
                print(f"   Es una lista de {len(data)} elementos.")
                for sub_item in data:
                    print(f"   - Sub-tipo: {sub_item.get('@type')}")
            else:
                for k, v in data.items():
                    if isinstance(v, (str, int, float, bool)):
                        print(f"   {k}: {str(v)[:100]}")
                    elif isinstance(v, list):
                        print(f"   {k} (list of {len(v)} elements): {str(v)[:100]}")
                    elif isinstance(v, dict):
                        print(f"   {k} (dict): {list(v.keys())}")
        except Exception as e:
            print(f"   Error parsing json block {idx + 1}: {e}")

if __name__ == '__main__':
    main()
