import time
from playwright.sync_api import sync_playwright

def main():
    print("Testing Viator selectors...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, args=['--disable-blink-features=AutomationControlled'])
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = context.new_page()
        page.goto('https://www.viator.com/Punta-Cana/d794-ttd')
        page.wait_for_timeout(8000)
        page.evaluate("window.scrollTo(0, document.body.scrollHeight/2)")
        page.wait_for_timeout(4000)

        # The main product cards usually have specific data-automation attributes or standard classes
        # Let's try a broad selector for cards
        cards = page.locator('[data-automation="product-card"]').all()
        if not cards:
            cards = page.locator('.productCard, .product-card, article').all()

        print(f"Found {len(cards)} cards on page 1.")
        
        for i, card in enumerate(cards[:3]):
            try:
                title = card.locator('h2, h3').first.inner_text()
            except: title = "No title"
            
            try:
                price_text = card.locator('[data-automation="price"], .price, .money').first.inner_text()
            except: price_text = "0"
            
            try:
                img = card.locator('img').first
                img_url = img.get_attribute('src') or img.get_attribute('data-src') or "No image"
            except: img_url = "No image"

            print(f"[{i+1}] {title} | {price_text} | {img_url[:60]}")

        browser.close()

if __name__ == '__main__':
    main()
