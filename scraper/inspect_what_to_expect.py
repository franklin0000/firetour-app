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
        page.evaluate("window.scrollTo(0, 1500)")
        page.wait_for_timeout(2000)
        
        html = page.content()
        soup = BeautifulSoup(html, 'html.parser')
        browser.close()
        
    print("\n=== ANALIZANDO 'WHAT TO EXPECT' ===")
    
    # Find h2 or element containing "What To Expect"
    target_tag = None
    for tag in soup.find_all(['h2', 'h3', 'div', 'span', 'section']):
        if tag.text.strip().lower() == "what to expect":
            target_tag = tag
            break
            
    if not target_tag:
        print("No se encontro la seccion 'What To Expect'.")
        return
        
    print(f"Seccion encontrada en tag: {target_tag.name} con clases: {target_tag.get('class')}")
    
    # Traverse parents to find the wrapper container
    container = target_tag
    for _ in range(5):
        if container is None:
            break
        # Print text of siblings or children
        print(f"\nNivel {_ + 1} de parent: {container.name} class={container.get('class')}")
        # Print child texts
        children = container.find_all(['h3', 'h4', 'div', 'p', 'span', 'li'])
        for idx, child in enumerate(children[:15]):
            print(f"   [Child {idx} - {child.name} class={child.get('class')}]: {child.text.strip()[:150]}")
        container = container.parent

if __name__ == '__main__':
    main()
