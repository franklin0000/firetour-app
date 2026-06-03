from bs4 import BeautifulSoup
import json

def main():
    with open('viator_dump.html', 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')
    
    # Try to find common product card elements. Viator often uses <a> tags wrapping the whole card, or a specific div
    # They often have links containing "/tours/"
    links = soup.find_all('a', href=True)
    tour_links = [l for l in links if '/tours/Punta-Cana/' in l['href']]
    
    # Find the parent container of these links
    cards = []
    seen_hrefs = set()
    for link in tour_links:
        if link['href'] not in seen_hrefs:
            seen_hrefs.add(link['href'])
            cards.append(link.parent.parent)

    print(f"Found {len(cards)} potential cards")
    
    for i, card in enumerate(cards[:2]):
        print(f"\n--- Card {i+1} ---")
        
        # Title
        h2 = card.find('h2') or card.find('h3')
        print(f"Title: {h2.text.strip() if h2 else 'None'}")
        
        # Image
        img = card.find('img')
        print(f"Image: {img.get('src') or img.get('data-src') if img else 'None'}")
        
        # Price
        # Look for text with $ or "from"
        texts = list(card.stripped_strings)
        price = next((t for t in texts if '$' in t), 'None')
        print(f"Price: {price}")
        
if __name__ == '__main__':
    main()
