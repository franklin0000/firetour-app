import time
from playwright.sync_api import sync_playwright

def main():
    print("Testing Deep Scrape on a single Viator Tour Page...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, args=['--disable-blink-features=AutomationControlled'])
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = context.new_page()
        
        # Let's go to a known popular tour or just the top Punta Cana tour
        page.goto('https://www.viator.com/tours/Punta-Cana/Punta-Cana-ATV-Double-and-Single/d794-142858P1')
        page.wait_for_timeout(8000)
        
        try:
            # The main title is usually the H1
            title = page.locator('h1').inner_text()
            print("Title:", title)
            
            # The description or overview
            # Sometimes it's under an element with 'overview' in id or class
            desc = ""
            try:
                # locator targeting the standard viator overview text
                overview_divs = page.locator('div[data-automation="overview"], div[id*="overview"]').all()
                if overview_divs:
                    desc = overview_divs[0].inner_text()
                else:
                    # fallback, try to get the first large paragraph
                    desc = page.locator('p').first.inner_text()
            except Exception as e:
                print("Desc error:", e)
                
            print("Desc:", desc[:100] + "...")
            
            # Inclusions
            inclusions = []
            try:
                # they usually use ul > li inside an 'included' section
                inc_list = page.locator('div[data-automation="inclusions"], div:has-text("What\'s Included")').locator('li').all()
                for li in inc_list[:5]:
                    inclusions.append(li.inner_text())
            except Exception as e:
                print("Inclusions error:", e)
                
            print("Inclusions:", inclusions)
            
        except Exception as e:
            print("General error:", e)
            
        browser.close()

if __name__ == '__main__':
    main()
