import re
import requests

def main():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': 'https://www.viator.com/'
    }
    
    url = "https://media.tacdn.com/media/attractions-splice-spp-210x118/0e/b7/a7/11.jpg"
    print(f"Thumbnail URL: {url}")
    
    # Try different standard Viator CDN dimensions in path
    dimensions = [
        "674x446",
        "800x533",
        "1024x576",
        "1440x960",
        "2048x1365"
    ]
    
    for size in dimensions:
        resized_url = re.sub(r'splice-spp-\d+x\d+', f'splice-spp-{size}', url)
        res = requests.get(resized_url, headers=headers, timeout=10)
        print(f"Size {size} Status: {res.status_code}, Length in bytes: {len(res.content)}")
        
if __name__ == '__main__':
    main()
