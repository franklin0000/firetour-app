try:
    import scrapy_playwright
    print("SUCCESS: scrapy_playwright is installed!")
except ImportError as e:
    print(f"ERROR: scrapy_playwright import failed: {e}")
