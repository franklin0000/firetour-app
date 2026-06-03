import json
import os

def main():
    project_root = r"C:\Users\bot\Desktop\Fire Tour DR"
    db_file = os.path.join(project_root, "backend", "database.json")
    
    with open(db_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    tours = data.get('tours', [])
    print(f"Total tours in database: {len(tours)}")
    
    for t in tours:
        tid = t.get('id')
        name = t.get('name', '')
        tag = t.get('tag', '')
        print(f"ID {tid:02d} | Tag: {tag:10s} | Name: {name[:100]}...")

if __name__ == '__main__':
    main()
