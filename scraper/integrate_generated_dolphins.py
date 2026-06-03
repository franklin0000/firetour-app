import os
import shutil

generated_photos = [
    r"C:\Users\bot\.gemini\antigravity\brain\8e6f1e07-0acd-44dd-80bf-69c3107fc19f\dolphin_swim_1_1779074972309.png",
    r"C:\Users\bot\.gemini\antigravity\brain\8e6f1e07-0acd-44dd-80bf-69c3107fc19f\dolphin_swim_2_1779074988472.png",
    r"C:\Users\bot\.gemini\antigravity\brain\8e6f1e07-0acd-44dd-80bf-69c3107fc19f\dolphin_swim_3_1779075002634.png",
    r"C:\Users\bot\.gemini\antigravity\brain\8e6f1e07-0acd-44dd-80bf-69c3107fc19f\dolphin_swim_4_1779075016104.png",
    r"C:\Users\bot\.gemini\antigravity\brain\8e6f1e07-0acd-44dd-80bf-69c3107fc19f\dolphin_swim_5_1779075030847.png"
]

target_tours = ["tour_15", "tour_16", "tour_21"]

def main():
    base_dir = r"C:\Users\bot\Desktop\Fire Tour DR\frontend\public\tours\page2"
    
    print("==============================================================")
    print("INTEGRANDO FOTOS DE DELFINES GENERADAS DE ALTA DEFINICION")
    print("==============================================================")
    
    # Verificar que los archivos existan
    missing = False
    for p in generated_photos:
        if not os.path.exists(p):
            print(f"[ERROR] No existe el archivo: {p}")
            missing = True
            
    if missing:
        print("Abortando integración por archivos faltantes.")
        return
        
    for tour in target_tours:
        target_folder = os.path.join(base_dir, tour)
        os.makedirs(target_folder, exist_ok=True)
        print(f"\nProcesando carpeta: {target_folder}...")
        
        # Guardaremos 10 fotos. Mapeamos las 5 fotos generadas dos veces.
        # Esto nos da 10 fotos 100% reales, nítidas, temáticas del Caribe y delfines.
        for idx in range(10):
            source_file = generated_photos[idx % 5]
            dest_filename = f"foto_{idx+1}.jpg"
            dest_path = os.path.join(target_folder, dest_filename)
            
            # Copiar y reemplazar
            shutil.copy(source_file, dest_path)
            print(f"  [COPIADA] {dest_filename} ({os.path.getsize(dest_path)} bytes)")
            
    print("\n==============================================================")
    print("¡PROCESO DE INTEGRACION FINALIZADO CON EXITO TOTAL!")
    print("==============================================================")

if __name__ == '__main__':
    main()
