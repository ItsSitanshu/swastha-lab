import os
import cv2
import shutil
import time as t
import numpy as np
from tqdm import tqdm

def parse_dat_file(dat_file):
    coords = []
    with open(dat_file, 'r') as file:
        lines = file.readlines()
        for line in lines:
            coords_line = line.strip().split(',')
            if len(coords_line) > 1:
                coords.append([int(float(x)) for x in coords_line])
    return np.array(coords)

def create_combined_mask(image_shape, cytoplasm_coords, nucleus_coords):
    mask = np.zeros(image_shape[:2], dtype=np.uint8)
    if cytoplasm_coords is not None:
        cv2.fillPoly(mask, [cytoplasm_coords], 255)  # Cytoplasm
    if nucleus_coords is not None:
        cv2.fillPoly(mask, [nucleus_coords], 255)  # Nucleus
    return mask

def save_combined_mask(output_dir, mask, mask_name):
    mask_filename = os.path.join(output_dir, f"{mask_name}_mask.bmp")
    cv2.imwrite(mask_filename, mask)

def move_image(image_path, output_dir, img_name):
    output_image_path = os.path.join(output_dir, img_name)
    shutil.copy(image_path, output_image_path)

if __name__ == "__main__":
    data_dir = input("[?] Enter your data directory (data/pool): ").strip()
    categories = [f for f in os.listdir(os.path.join(data_dir, 'pool')) if os.path.isdir(os.path.join(data_dir, 'pool', f))]
    
    print(f"[LOG] Categories found: {categories}")
    selected_categories = input(f"[?] Enter categories to process (comma-separated from {categories} or 'all'): ").strip()
    if selected_categories.lower() == 'all':
        selected_categories = categories
    else:
        selected_categories = [cat.strip() for cat in selected_categories.split(',') if cat.strip() in categories]

    o_dir = input("[?] Are you processing for training data (Yes/n)? ").strip()
    output_dir = os.path.join(data_dir, 'train' if o_dir.lower() in ['y', 'yes'] else 'test')

    limit = input(f"[?] Enter number (N) of specimens to extract per category (or 'all'): ").strip()
    limit = -1 if limit.lower() == 'all' else int(limit)
    offset = int(input("[?] Select specimen # to start extraction from (1 to start from beginning): ").strip()) - 1

    os.makedirs(output_dir, exist_ok=True)
    t_start = t.time()

    for category in selected_categories:
        category_dir = os.path.join(data_dir, 'pool', category)
        category_output_dir = os.path.join(output_dir, category)
        if output_dir != 'data/test':
            os.makedirs(category_output_dir, exist_ok=True)

        category_images = [f for f in os.listdir(category_dir) if f.endswith('.bmp')]
        category_images.sort()
        total_category_images = len(category_images)

        if limit == -1 or limit > total_category_images:
            limit = total_category_images

        print(f"[LOG] Processing category '{category}': {limit} images (starting at offset {offset}).")
        
        for i in tqdm(range(offset, offset + limit), desc=f"Processing {category} images", unit="image"):
            if i >= total_category_images:
                print(f"[LOG] Reached end of available images for {category}.")
                break

            img_file = category_images[i]
            img_path = os.path.join(category_dir, img_file)

            if not os.path.exists(img_path):
                print(f"[WARNING] File not found: {img_path}, skipping.")
                continue

            if output_dir == 'data/test':
                move_image(img_path, output_dir, img_file)
            else:
                move_image(img_path, category_output_dir, img_file)

            dat_files_cyt = [os.path.join(category_dir, img_file.replace('.bmp', f'_cyt{str(j).zfill(2)}.dat')) for j in range(1, 6)]
            dat_files_nuc = [os.path.join(category_dir, img_file.replace('.bmp', f'_nuc{str(j).zfill(2)}.dat')) for j in range(1, 6)]

            image_shape = cv2.imread(img_path).shape

            for pair_idx, (cyt_file, nuc_file) in enumerate(zip(dat_files_cyt, dat_files_nuc)):
                if os.path.exists(cyt_file) or os.path.exists(nuc_file):
                    single_cell_mask = np.zeros(image_shape[:2], dtype=np.uint8)

                    cytoplasm_coords = parse_dat_file(cyt_file) if os.path.exists(cyt_file) else None
                    nucleus_coords = parse_dat_file(nuc_file) if os.path.exists(nuc_file) else None

                    if cytoplasm_coords is not None:
                        cv2.fillPoly(single_cell_mask, [cytoplasm_coords], 200)

                    if nucleus_coords is not None:
                        cv2.fillPoly(single_cell_mask, [nucleus_coords], 255) 

                    if np.any(single_cell_mask):  
                        mask_name = f"{img_file.replace('.bmp', '')}_{pair_idx + 1}"
                        if output_dir == 'data/test':
                            save_combined_mask(output_dir, single_cell_mask, mask_name)
                        else:
                            save_combined_mask(category_output_dir, single_cell_mask, mask_name)

    t_end = t.time()
    print(f"[LOG] Time taken to process: {t_end - t_start:.2f} seconds")
