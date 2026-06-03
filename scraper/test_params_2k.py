import re
import requests

def main():
    real_url = "https://dynamic-media.tacdn.com/media/photo-o/2e/f4/12/2e/caption.jpg?w=800&h=600&s=1"
    
    # Replace query parameters with 2K dimensions (2048x1536)
    large_url = real_url
    large_url = re.sub(r'w=\d+', 'w=2048', large_url)
    large_url = re.sub(r'h=\d+', 'h=1536', large_url)
    
    print(f"Original URL: {real_url}")
    print(f"2K Resized URL: {large_url}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': 'https://www.viator.com/'
    }
    
    res_orig = requests.get(real_url, headers=headers, timeout=10)
    print(f"Original Status: {res_orig.status_code}, Length in bytes: {len(res_orig.content)}")
    
    res_large = requests.get(large_url, headers=headers, timeout=10)
    print(f"2K Status: {res_large.status_code}, Length in bytes: {len(res_large.content)}")
    
    if res_large.status_code == 200:
        print("Success! The Viator CDN supports 2K resolution scaling via query parameters.")
        with open("test_params_2k.jpg", "wb") as f:
            f.write(res_large.content)
            
if __name__ == '__main__':
    main()
