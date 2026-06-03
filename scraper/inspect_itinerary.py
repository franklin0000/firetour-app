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
        page.evaluate("window.scrollTo(0, 1000)")
        page.wait_for_timeout(2000)
        
        html = page.content()
        soup = BeautifulSoup(html, 'html.parser')
        browser.close()
        
    print("\n=== BUSCANDO ITINERARIOS EN EL DOM ===")
    
    # Check all h3 and h4 tags
    headers_tags = soup.find_all(['h3', 'h4', 'span', 'div'])
    keywords = ["stop at", "pass by", "duration:", "admission ticket", "parada en", "pasar por", "duración:"]
    
    for tag in headers_tags:
        text = tag.text.strip().lower()
        if any(kw in text for kw in keywords) and len(text) < 180:
            print(f"   [{tag.name}]: {tag.text.strip()}")

if __name__ == '__main__':
    main()
