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
        
    print("\n=== BUSCANDO PALABRAS CLAVE DE INCLUSIONS EN EL DOM ===")
    
    # Dump all list items
    lis = soup.find_all('li')
    print(f"Se encontraron {len(lis)} list items en la pagina.")
    
    # Print the ones that contain text that looks like an inclusion (e.g. guide, transport, water, etc.)
    keywords = ["guide", "pickup", "hotel", "water", "soda", "entrance", "equipment", "parasail", "boat", "driver", "transport"]
    for li in lis:
        text = li.text.strip().lower()
        if any(kw in text for kw in keywords) and len(text) < 150:
            print(f"   [LI]: {li.text.strip()}")
            
    # Print any div/span that has classes containing inclusion
    for tag in soup.find_all(['div', 'span', 'li'], class_=True):
        classes = " ".join(tag.get('class'))
        if 'inclusion' in classes.lower() or 'included' in classes.lower():
            print(f"   [TAG class={classes}]: {tag.text.strip()[:100]}")

if __name__ == '__main__':
    main()
