import re
import requests

def main():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': 'https://www.viator.com/'
    }
    
    url = "https://dynamic-media.tacdn.com/media/photo-o/2e/f4/12/2e/caption.jpg?w=800&h=600&s=1"
    print(f"Base URL: {url}")
    
    # Try different standard width/height dimensions
    sizes = [
        ("1024", "768"),
        ("1200", "900"),
        ("1440", "1080"),
        ("1920", "1440"),
        ("2048", "1536")
    ]
    
    for w, h in sizes:
        resized_url = url
        resized_url = re.sub(r'w=\d+', f'w={w}', resized_url)
        resized_url = re.sub(r'h=\d+', f'h={h}', resized_url)
        
        res = requests.get(resized_url, headers=headers, timeout=10)
        print(f"Size {w}x{h} Status: {res.status_code}, Length in bytes: {len(res.content)}")
        
if __name__ == '__main__':
    main()
