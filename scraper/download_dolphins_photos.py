import os
import requests
import time

# Mapeo de directorios a URLs reales de Viator/TripAdvisor CDN para fotos de delfines en Punta Cana
dolphins_catalog = {
    "tour_15": [
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/2e/de/c3.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/2e/de/c1.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/0a/8f/3e/26.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/0a/8f/3e/22.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/2e/de/b9.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/18.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/1b.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/23.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/1a.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/0a/8f/3e/28.jpg"
    ],
    "tour_16": [
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/0a/8e/3c/65.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/2e/de/ba.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/0a/8e/3c/6a.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/0a/8e/3c/6c.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/28.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/29.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/2a.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/2b.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/2e/de/bc.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/0a/8e/3c/6e.jpg"
    ],
    "tour_21": [
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/30.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/31.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/32.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/33.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/34.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/35.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/36.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/37.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/38.jpg",
        "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f3/d3/39.jpg"
    ]
}

def download_image(url, folder, filename):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': 'https://www.viator.com/'
    }
    retries = 3
    for attempt in range(retries):
        try:
            r = requests.get(url, headers=headers, timeout=15)
            if r.status_code == 200:
                filepath = os.path.join(folder, filename)
                with open(filepath, 'wb') as f:
                    f.write(r.content)
                print(f"  [EXITO] Descargada: {filename} (Tamaño: {len(r.content)} bytes)")
                return True
            else:
                print(f"  [ERROR] Intento {attempt+1} falló con status {r.status_code} para {url}")
        except Exception as e:
            print(f"  [ERROR] Intento {attempt+1} falló con excepción: {e}")
        time.sleep(1)
    return False

def main():
    base_dir = r"C:\Users\bot\Desktop\Fire Tour DR\frontend\public\tours\page2"
    print("==============================================================")
    print("DESCARGANDO FOTOS REALES DE DELFINES DESDE EL CDN DE VIATOR")
    print("==============================================================")

    total_downloads = 0
    
    for folder_name, urls in dolphins_catalog.items():
        folder_path = os.path.join(base_dir, folder_name)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            print(f"Directorio creado: {folder_path}")
        else:
            print(f"Descargando en directorio existente: {folder_path}")
            
        for i, url in enumerate(urls):
            filename = f"foto_{i+1}.jpg"
            success = download_image(url, folder_path, filename)
            if success:
                total_downloads += 1
            # Pequeña pausa de cortesía para no saturar el CDN
            time.sleep(0.2)
            
    print("==============================================================")
    print(f"PROCESO FINALIZADO. Total de imágenes descargadas con éxito: {total_downloads}/30")
    print("==============================================================")

if __name__ == '__main__':
    main()
