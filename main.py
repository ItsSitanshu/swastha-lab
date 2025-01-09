import os
from tqdm import tqdm 
import cv2

import numpy as np

from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.utils import to_categorical

from sklearn.model_selection import train_test_split


def load_data(image_mask_dir, batch_size=16):
    images, masks = [], []
    
    for idx, file in enumerate(os.listdir(image_mask_dir)):
        if file.endswith('.bmp'):
            img_path = os.path.join(image_mask_dir, file)
            img = cv2.imread(img_path)
            img = cv2.resize(img, (256, 256)) 
            img = img_to_array(img)
            images.append(img)
            
            mask = np.zeros((256, 256), dtype=np.uint8)

            for i in range(1, 6):
                cytoplasm_mask_path = os.path.join(image_mask_dir, file.replace('.bmp', f'_cyt{str(i)}_mask.bmp'))
                nucleus_mask_path = os.path.join(image_mask_dir, file.replace('.bmp', f'_nuc{str(i)}_mask.bmp'))

                if os.path.exists(cytoplasm_mask_path):
                    cytoplasm_mask = cv2.imread(cytoplasm_mask_path, cv2.IMREAD_GRAYSCALE)
                    cytoplasm_mask = cv2.resize(cytoplasm_mask, (256, 256), interpolation=cv2.INTER_NEAREST)
                    mask[cytoplasm_mask == 255] = 1  # Assign 1 for cytoplasm
                
                if os.path.exists(nucleus_mask_path):
                    nucleus_mask = cv2.imread(nucleus_mask_path, cv2.IMREAD_GRAYSCALE)
                    nucleus_mask = cv2.resize(nucleus_mask, (256, 256), interpolation=cv2.INTER_NEAREST)
                    mask[nucleus_mask == 255] = 2  # Assign 2 for nucleus

            masks.append(mask)

            if len(images) >= batch_size:
                yield np.array(images), np.array(masks)
                images, masks = [], []


    if len(images) > 0:
        yield np.array(images), np.array(masks)


# Build U-Net model
def build_unet(input_shape=(256, 256, 3)):
    inputs = layers.Input(shape=input_shape)
  
    # Encoder
    c1 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(inputs)
    c1 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(c1)
    p1 = layers.MaxPooling2D((2, 2))(c1)
  
    c2 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(p1)
    c2 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(c2)
    p2 = layers.MaxPooling2D((2, 2))(c2)
  
    # Bottleneck
    c3 = layers.Conv2D(256, (3, 3), activation='relu', padding='same')(p2)
    c3 = layers.Conv2D(256, (3, 3), activation='relu', padding='same')(c3)
  
    u1 = layers.UpSampling2D((2, 2))(c3)
    u1 = layers.Concatenate()([u1, c2])
    c4 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(u1)
    c4 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(c4)
  
    u2 = layers.UpSampling2D((2, 2))(c4)
    u2 = layers.Concatenate()([u2, c1])
    c5 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(u2)
    c5 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(c5)
  
    outputs = layers.Conv2D(3, (1, 1), activation='softmax')(c5)
  
    model = models.Model(inputs, outputs)
    return model

images, masks = [], []

image_mask_dir = 'data/train'
total_images = len([f for f in os.listdir(image_mask_dir) if f.endswith('.bmp')])


for batch_images, batch_masks in tqdm(load_data(image_mask_dir, batch_size=16), total=total_images // 16,desc="Loading batches", unit="batch"):
    images.append(batch_images)
    masks.append(batch_masks)

images = np.concatenate(images, axis=0) / 255.0
masks = np.concatenate(masks, axis=0)

masks = to_categorical(masks, num_classes=3)  

X_train, X_val, y_train, y_val = train_test_split(images, masks, test_size=0.2, random_state=42)

model = build_unet()
model.compile(optimizer=Adam(), loss='categorical_crossentropy', metrics=['accuracy'])

history = model.fit(X_train, y_train, validation_data=(X_val, y_val), batch_size=32, epochs=20)

model.save('cell_segmentation_model.h5')
