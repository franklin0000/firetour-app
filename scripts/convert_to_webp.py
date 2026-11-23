#!/usr/bin/env python3
"""
Fire Tour DR - Image Optimizer & WebP Converter
Converts JPEG and PNG images to WebP format with high visual fidelity and maximum compression.
Calculates total size reduction and maintains original files for legacy fallback compatibility.
"""

import os
import sys
from pathlib import Path
from PIL import Image

PUBLIC_DIR = Path(__file__).resolve().parent.parent / "frontend" / "public"

def convert_images(quality=82):
    print("=" * 60)
    print(" FIRE TOUR DR - WEBP IMAGE CONVERSION PIPELINE ")
    print("=" * 60)
    print(f"Target directory: {PUBLIC_DIR}\n")

    if not PUBLIC_DIR.exists():
        print(f"Error: Directory {PUBLIC_DIR} does not exist.")
        sys.exit(1)

    extensions = {".jpg", ".jpeg", ".png"}
    image_files = [
        p for p in PUBLIC_DIR.rglob("*")
        if p.is_file() and p.suffix.lower() in extensions and not p.name.endswith(".webp")
    ]

    total_files = len(image_files)
    print(f"Discovered {total_files} images to process.\n")

    original_total_size = 0
    webp_total_size = 0
    converted_count = 0
    skipped_count = 0
    errors = []

    for idx, img_path in enumerate(image_files, 1):
        webp_path = img_path.with_suffix(".webp")
        orig_size = img_path.stat().st_size
        original_total_size += orig_size

        # If webp already exists and is newer than source, reuse it
        if webp_path.exists() and webp_path.stat().st_mtime >= img_path.stat().st_mtime:
            webp_total_size += webp_path.stat().st_size
            skipped_count += 1
            continue

        try:
            with Image.open(img_path) as im:
                # Handle alpha channel for PNG or RGBA
                if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
                    im.save(webp_path, "WEBP", quality=quality, method=6)
                else:
                    rgb_im = im.convert("RGB")
                    rgb_im.save(webp_path, "WEBP", quality=quality, method=6)

            new_size = webp_path.stat().st_size
            webp_total_size += new_size
            converted_count += 1

            if idx % 100 == 0 or idx == total_files:
                print(f"[{idx}/{total_files}] Processed {converted_count} files... (Current file: {img_path.name})")

        except Exception as e:
            errors.append((str(img_path), str(e)))
            webp_total_size += orig_size  # fallback to orig size for calculation

    orig_mb = original_total_size / (1024 * 1024)
    webp_mb = webp_total_size / (1024 * 1024)
    savings_mb = orig_mb - webp_mb
    savings_pct = (savings_mb / orig_mb * 100) if orig_mb > 0 else 0

    print("\n" + "=" * 60)
    print(" CONVERSION SUMMARY ")
    print("=" * 60)
    print(f"Total images evaluated:  {total_files}")
    print(f"Converted now:           {converted_count}")
    print(f"Already up to date:      {skipped_count}")
    print(f"Original total size:     {orig_mb:.2f} MB")
    print(f"WebP total size:         {webp_mb:.2f} MB")
    print(f"Total Bandwidth Saved:   {savings_mb:.2f} MB ({savings_pct:.1f}% reduction)")

    if errors:
        print(f"\nWarnings/Errors ({len(errors)}):")
        for f, err in errors[:5]:
            print(f"  - {f}: {err}")

    print("\n[Done] WebP conversion completed successfully.")

if __name__ == "__main__":
    convert_images()
