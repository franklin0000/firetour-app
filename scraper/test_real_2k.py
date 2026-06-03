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
    
    print("Lanzando navegador visible...")
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--disable-infobars'
            ]
        )
        context = browser.new_context(user_agent=headers['User-Agent'])
        page = context.new_page()
        page.goto(target_url)
        print("Esperando 10 segundos por captcha...")
        page.wait_for_timeout(10000)
        
        # Scroll para cargar imagenes
        page.evaluate("window.scrollTo(0, 500)")
        page.wait_for_timeout(2000)
        
        html = page.content()
        soup = BeautifulSoup(html, 'html.parser')
        
        all_imgs = soup.find_all('img')
        real_url = None
        for img in all_imgs:
            src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
            if src:
                full_src = urllib.parse.urljoin(target_url, src)
                if 'media.tacdn.com' in full_src or 'dynamic-media' in full_src:
                    real_url = full_src
                    break
        
        browser.close()
        
    if not real_url:
        print("No real image URL found on the page.")
        return
        
    print(f"Real Image URL from page: {real_url}")
    
    # Try replacing any dimensions with 2048x1365
    large_url = re.sub(r'splice-spp-\d+x\d+', 'splice-spp-2048x1365', real_url)
    # Also try replacing any other occurrence of \d+x\d+
    if large_url == real_url:
        large_url = re.sub(r'(\d+)x(\d+)', '2048x1365', real_url)
        
    print(f"2K Resized URL: {large_url}")
    
    # Check if 2K URL returns 200
    res_orig = requests.get(real_url, headers=headers, timeout=10)
    print(f"Original Status: {res_orig.status_code}, Length in bytes: {len(res_orig.content)}")
    
    res_large = requests.get(large_url, headers=headers, timeout=10)
    print(f"2K Status: {res_large.status_code}, Length in bytes: {len(res_large.content)}")
    
    # Save the 2K image to check if it's readable
    if res_large.status_code == 200:
        with open("test_2k_image.jpg", "wb") as f:
            f.write(res_large.content)
        print("Successfully saved test_2k_image.jpg!")

if __name__ == '__main__':
    main()
