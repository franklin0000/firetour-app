import re
import requests

def test():
    # A typical Viator CDN URL
    url = "https://media.tacdn.com/media/attractions-splice-spp-674x446/0d/1a/f6.jpg"
    
    # Replace standard dimensions with 2K resolution (2048x1365)
    large_url = re.sub(r'(\d+)x(\d+)', '2048x1365', url)
    
    print(f"Original: {url}")
    print(f"Large (2K): {large_url}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': 'https://www.viator.com/'
    }
    
    try:
        r_orig = requests.head(url, headers=headers, timeout=10)
        print(f"Original Status: {r_orig.status_code}, Length: {r_orig.headers.get('Content-Length')}")
        
        r_large = requests.head(large_url, headers=headers, timeout=10)
        print(f"2K Status: {r_large.status_code}, Length: {r_large.headers.get('Content-Length')}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test()
