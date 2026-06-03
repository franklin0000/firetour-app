import time
from playwright.sync_api import sync_playwright

def main():
    print("Dumping Viator HTML...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, args=['--disable-blink-features=AutomationControlled'])
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = context.new_page()
        page.goto('https://www.viator.com/Punta-Cana/d794-ttd')
        page.wait_for_timeout(10000)
        page.evaluate("window.scrollTo(0, document.body.scrollHeight/2)")
        page.wait_for_timeout(4000)

        with open('viator_dump.html', 'w', encoding='utf-8') as f:
            f.write(page.content())

        print("Saved viator_dump.html")
        browser.close()

if __name__ == '__main__':
    main()
