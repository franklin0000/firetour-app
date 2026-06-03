import os
import requests
import time
import urllib3
from concurrent.futures import ThreadPoolExecutor

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

UPLOAD_DIR = r"c:\Users\bot\Desktop\Fire Tour DR\backend\uploads"
API_URL = "https://firetour-app-node.onrender.com/api/sync-upload"
CHECK_URL = "https://firetour-app-node.onrender.com/api/health" # Or tours endpoint
MAX_WORKERS = 50
MAX_RETRIES = 5

def wait_for_server():
    print("Waiting for server to complete deploy...")
    while True:
        try:
            res = requests.get("https://firetour-app-node.onrender.com/api/tours", timeout=5, verify=False)
            if res.status_code == 200:
                print("Server is UP! Starting upload...")
                break
        except Exception:
            pass
        print("Server not ready yet, waiting 10 seconds...")
        time.sleep(10)

def upload_file(filepath):
    filename = os.path.basename(filepath)
    retries = 0
    while retries < MAX_RETRIES:
        try:
            with open(filepath, 'rb') as f:
                files = {'image': (filename, f, 'image/jpeg')}
                data = {'exactFilename': filename}
                response = requests.post(API_URL, files=files, data=data, timeout=30, verify=False)
                
                if response.status_code == 200:
                    print(f"Success: {filename}")
                    return True
                else:
                    print(f"Failed: {filename} - Status: {response.status_code} - Retrying...")
        except Exception as e:
            print(f"Error: {filename} - {str(e)} - Retrying...")
            
        retries += 1
        time.sleep(2)
        
    print(f"Gave up on {filename} after {MAX_RETRIES} retries.")
    return False

import re

def extract_numbers(filename):
    numbers = re.findall(r'\d+', filename)
    return [int(n) for n in numbers]

def main():
    wait_for_server()
    
    if not os.path.exists(UPLOAD_DIR):
        print(f"Directory not found: {UPLOAD_DIR}")
        return

    files = [os.path.join(UPLOAD_DIR, f) for f in os.listdir(UPLOAD_DIR) if f.endswith('.jpg')]
    
    # Sort files naturally so tour_1_0 uploads before tour_100_0
    files.sort(key=lambda x: extract_numbers(os.path.basename(x)))
    
    total_files = len(files)
    print(f"Starting resilient upload of {total_files} files to {API_URL}")

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        executor.map(upload_file, files)
        
    print("Upload process completed.")

if __name__ == "__main__":
    main()
