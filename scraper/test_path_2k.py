import re
import urllib.parse
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import requests

def main():
    target_url = "https://www.viator.com/Punta-Cana/d794-ttd/2"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': 'https://www.viator.com/'
    }
    
    print("Navegando a la lista...")
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,
            args=['--disable-blink-features=AutomationControlled', '--disable-infobars']
        )
        context = browser.new_context(user_agent=headers['User-Agent'])
        page = context.new_page()
        page.goto(target_url)
        page.wait_for_timeout(8000)
        
        # Click en el primer enlace de tour
        html = page.content()
        soup = BeautifulSoup(html, 'html.parser')
        links = soup.find_all('a', href=True)
        tour_url = None
        for l in links:
            href = l['href']
            if '/tours/Punta-Cana/' in href:
                if not any(x in href for x in ['?page=', 'd794-ttd', '/d794-ttd']):
                    tour_url = urllib.parse.urljoin(target_url, href)
                    break
                    
        if not tour_url:
            print("No tour detail page URL found.")
            browser.close()
            return
            
        print(f"Abriendo detalle de tour: {tour_url}")
        page.goto(tour_url)
        page.wait_for_timeout(6000)
        
        # Scroll para lazy-loading
        page.evaluate("window.scrollTo(0, 400)")
        page.wait_for_timeout(2000)
        
        detail_html = page.content()
        detail_soup = BeautifulSoup(detail_html, 'html.parser')
        
        all_imgs = detail_soup.find_all('img')
        real_urls = []
        for img in all_imgs:
            src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
            if src:
                full_src = urllib.parse.urljoin(tour_url, src)
                if 'media.tacdn.com' in full_src and 'splice-spp-' in full_src:
                    if full_src not in real_urls:
                        real_urls.append(full_src)
                        
        browser.close()
        
    if not real_urls:
        print("No real gallery images found in the detail page.")
        return
        
    real_url = real_urls[0]
    print(f"\nReal Gallery Image URL: {real_url}")
    
    # Try different dimension replacements
    sizes = ["1024x683", "1440x960", "2048x1365"]
    
    res_orig = requests.get(real_url, headers=headers, timeout=10)
    print(f"Original Status: {res_orig.status_code}, Length in bytes: {len(res_orig.content)}")
    
    for size in sizes:
        resized_url = re.sub(r'splice-spp-\d+x\d+', f'splice-spp-{size}', real_url)
        res = requests.get(resized_url, headers=headers, timeout=10)
        print(f"Size {size} Status: {res.status_code}, Length in bytes: {len(res.content)}")
        
        if res.status_code == 200:
            filename = f"test_{size}.jpg"
            with open(filename, "wb") as f:
                f.write(res.content)
            print(f"Saved: {filename}")

if __name__ == '__main__':
    main()
