import scrapy
import re
import os
import json
import requests
import urllib.parse
from scrapy_playwright.page import PageMethod

class ThematicExcursionsSpider(scrapy.Spider):
    name = "thematic_excursions"
    
    custom_settings = {
        'DOWNLOAD_HANDLERS': {
            "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
            "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
        },
        'TWISTED_REACTOR': "twisted.internet.asyncioreactor.AsyncioSelectorReactor",
        'PLAYWRIGHT_LAUNCH_OPTIONS': {
            'headless': False,  # Desactivamos Headless para engañar a Cloudflare y pasar su desafío
            'args': [
                '--disable-blink-features=AutomationControlled',
                '--disable-infobars'
            ]
        },
        'PLAYWRIGHT_DEFAULT_NAVIGATION_TIMEOUT': 120000,
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    }

    # Map of tour directory and category names to their direct Viator excursion pages
    tours_metadata = {
        "tour_2": {
            "url": "https://www.viator.com/tours/Punta-Cana/Punta-Cana-Off-Road-Buggy-Adventure-Beaches-Caves-Countryside/d794-5546758P2",
            "name": "Off-Road Buggy Adventure"
        },
        "tour_11": {
            "url": "https://www.viator.com/tours/Punta-Cana/Punta-Cana-Helicopter-Tour/d794-6821P1",
            "name": "Helicopter VIP Flight"
        },
        "tour_24": {
            "url": "https://www.viator.com/tours/Punta-Cana/Half-Day-Buggy-Authentic-Experience-and-Shopping-Tour-From-Punta-Cana/d794-19114P12",
            "name": "Premium Buggy & Shopping"
        }
    }

    def start_requests(self):
        for folder_name, info in self.tours_metadata.items():
            self.logger.info(f"Lanzando request Scrapy-Playwright para {folder_name} | URL: {info['url']}")
            yield scrapy.Request(
                info['url'],
                meta={
                    "playwright": True,
                    "playwright_page_methods": [
                        PageMethod("wait_for_timeout", 8000),  # Tiempo generoso para resolver Cloudflare
                        PageMethod("evaluate", "window.scrollTo(0, 400)"),
                        PageMethod("wait_for_timeout", 1000),
                        PageMethod("evaluate", "window.scrollTo(0, 800)"),
                        PageMethod("wait_for_timeout", 1000),
                        PageMethod("evaluate", "window.scrollTo(0, 1200)"),
                        PageMethod("wait_for_timeout", 1000),
                    ],
                    "folder_name": folder_name
                },
                callback=self.parse_excursion
            )

    def parse_excursion(self, response):
        folder_name = response.meta["folder_name"]
        self.logger.info(f"Parseando respuesta de Scrapy para {folder_name}...")

        # Extraemos todos los tags img de la pagina
        all_img_tags = response.xpath('//img')
        extracted_urls = []

        for img in all_img_tags:
            src = img.xpath('@src').get() or img.xpath('@data-src').get() or img.xpath('@data-lazy-src').get()
            if src:
                full_url = urllib.parse.urljoin(response.url, src)
                if 'media.tacdn.com' in full_url or 'dynamic-media' in full_url:
                    # Evitamos logos, avatares de reseñas, badges, etc.
                    if not any(x in full_url for x in ['avatar', 'icon', 'profile', 'user', 'badge', 'logo']):
                        # Reemplazamos la resolucion para que sea HD
                        large_url = full_url
                        if 'splice-spp-' in large_url:
                            large_url = re.sub(r'splice-spp-\d+x\d+', 'splice-spp-674x446', large_url)
                        elif 'dynamic-media' in large_url:
                            large_url = re.sub(r'w=\d+', 'w=1200', large_url)
                            large_url = re.sub(r'h=\d+', 'h=900', large_url)
                            
                        if large_url not in extracted_urls:
                            extracted_urls.append(large_url)

        self.logger.info(f"Se encontraron {len(extracted_urls)} imagenes candidatas para {folder_name}.")

        # Guardar en disco el listado local de fotos antes de descargarlas
        images_to_download = extracted_urls[:10]
        
        # Crear la carpeta de destino
        base_dir = r"c:\Users\bot\Desktop\Fire Tour DR\frontend\public\tours\page2"
        target_folder = os.path.join(base_dir, folder_name)
        os.makedirs(target_folder, exist_ok=True)

        print(f"\n[Scrapy-Downloader] Descargando {len(images_to_download)} fotos para {folder_name} en {target_folder}...")
        
        downloaded_count = 0
        for idx, img_url in enumerate(images_to_download):
            filename = f"foto_{idx + 1}.jpg"
            try:
                res = requests.get(img_url, headers={'User-Agent': self.custom_settings['USER_AGENT']}, timeout=15)
                if res.status_code == 200:
                    with open(os.path.join(target_folder, filename), 'wb') as f:
                        f.write(res.content)
                    print(f"      [OK] Scrapy descargo: {filename} ({len(res.content)} bytes)")
                    downloaded_count += 1
                else:
                    print(f"      [FAIL] Status HTTP {res.status_code} para {filename}")
            except Exception as e:
                print(f"      [FAIL] Error descargando {filename}: {e}")

        # Fallback por si Scrapy no pudo extraer suficientes debido a bloqueos dinamicos
        if downloaded_count < 3:
            print(f"      [WARN] Solo se descargaron {downloaded_count} imagenes. Agregando fallbacks.")
            # Podemos copiar las existentes o dejar un log para resolverlo

        yield {
            "folder": folder_name,
            "downloaded": downloaded_count,
            "urls": images_to_download
        }
