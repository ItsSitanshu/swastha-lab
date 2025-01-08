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

def create_mask(image_shape, coords):
    mask = np.zeros(image_shape[:2], dtype=np.uint8)
    
    if coords.any():
        cv2.fillPoly(mask, [coords], 255)

    return mask

def save_mask(image_path, mask, mask_name):
    mask_filename = f"{image_path}/{mask_name}_mask.bmp"
    cv2.imwrite(mask_filename, mask)

def move_image(image_path, output_dir, img_name):
    output_image_path = os.path.join(output_dir, img_name)
    shutil.copy(image_path, output_image_path) 

if __name__ == "__main__":
    data_dir = input("[?] Enter your data directory (data/pool*) ")
    
    if not os.path.isdir(os.path.join(data_dir, 'pool')):
        print(f"[LOG] {data_dir}/pool is required to pool data from")
        exit(-1)

    image_dir = f'{data_dir}/pool'
    dat_dir = f'{data_dir}/pool'

    o_dir = 'train'

    out_opt = input("[?] Are you processing for training data (Yes/n) ")

    if (out_opt.lower() == "y" or out_opt.lower() == 'yes'):
        o_dir = 'train'
    else:
        o_dir = 'test'

    output_dir = f'{data_dir}/{o_dir}'
    total = len([f for f in os.listdir(image_dir) if f.endswith('.bmp')])

    nof = input(f"[?] Enter number (N) of specimen to extract (0 - {total} | a/All): ")
    if (nof.lower() == 'a' or nof.lower() == 'all'):
        nof = total
    elif (int(nof) < 0 or int(nof) > total):
        print(f"[LOG] Please enter a valid number")
        exit(-1)

    limit = int(nof)

    offset = 0
    
    if limit != total:
        offset = int(input("[?] Select a specific specimen # to start extraction from (1 if to start from begining serially): "))
        if (offset <= 0 or (offset + limit) > (total + 1)):
            print(f"[LOG] Please enter a valid specimen ID such that ID + {limit} <= {total}")
            exit(-1)
    

    os.makedirs(output_dir, exist_ok=True)
    
    print(f"[LOG] Total number of image files: {total} (Limiting to {limit} images)")

    t_start = t.time()
    
    current_processed = 1

    for i in tqdm(range(limit), desc="Processing images", unit="image"):
        img_file = str(current_processed + offset).zfill(3) + ".bmp"

        if img_file.endswith('.bmp'):
            if current_processed >= limit and (i + offset) >= total:
                break

            img_path = os.path.join(image_dir, img_file)
            
            move_image(img_path, output_dir, img_file)  
            
            dat_files_cyt = [os.path.join(dat_dir, img_file.replace('.bmp', f'_cyt{str(i).zfill(2)}.dat')) for i in range(1, 6)]
            dat_files_nuc = [os.path.join(dat_dir, img_file.replace('.bmp', f'_nuc{str(i).zfill(2)}.dat')) for i in range(1, 6)]
            
            for i, dat_file in enumerate(dat_files_cyt):
                if os.path.exists(dat_file):  
                    cytoplasm_coords = parse_dat_file(dat_file)
                    cytoplasm_mask = create_mask(cv2.imread(img_path).shape, cytoplasm_coords)
                    save_mask(output_dir, cytoplasm_mask, f"{img_file.replace('.bmp', '')}_cyt{str(i+1)}")
            
            for i, dat_file in enumerate(dat_files_nuc):
                if os.path.exists(dat_file):
                  nucleus_coords = parse_dat_file(dat_file)
                  nucleus_mask = create_mask(cv2.imread(img_path).shape, nucleus_coords)
                  save_mask(output_dir, nucleus_mask, f"{img_file.replace('.bmp', '')}_nuc{str(i+1)}")


            progress = (current_processed / limit) * 100

            current_processed += 1




    t_end = t.time()

    time_taken = t_end - t_start
    print(f"[LOG] Time taken to process: {time_taken:.2f} seconds")
