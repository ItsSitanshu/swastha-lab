# V1 - JAN/13/2025

import os
import cv2
import numpy as np

import matplotlib.pyplot as plt

from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.metrics import MeanIoU, Precision, Recall
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import ModelCheckpoint

from sklearn.model_selection import train_test_split
from tqdm import tqdm

def load_data(image_mask_dir, batch_size=256):
    images, masks = [], []

    dir_categories = [f for f in os.listdir(os.path.join('data', 'pool')) if os.path.isdir(os.path.join('data', 'pool', f))]

    category_to_class = {
      "im_Dyskeratotic": 1,
      "im_Koilocytotic": 2,
      "im_Metaplastic": 3,
      "im_Parabasal": 4,
      "im_Superficial-Intermediate": 5
    }

    for category in dir_categories:
        if category not in category_to_class:
            break
        category_path = os.path.join(image_mask_dir, category)

        files = [file for file in os.listdir(category_path) if file.endswith('.bmp') and not file.endswith('_mask.bmp')]
        for file in tqdm(files, desc=f"Loading {category}", ncols=100):
            img_path = os.path.join(category_path, file)
            img = cv2.imread(img_path)
            img = cv2.resize(img, (256, 256))
            img = img_to_array(img)
            images.append(img)

            mask = np.zeros((256, 256), dtype=np.uint8)

            for i in range(1, 6):
                mask_file = file.replace('.bmp', f'_{str(i)}_mask.bmp')
                mask_path = os.path.join(category_path, mask_file)

                if os.path.exists(mask_path):
                    mask_part = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
                    mask_part = cv2.resize(mask_part, (256, 256),
                                           interpolation=cv2.INTER_NEAREST)  # Resize mask to 256x256
                    mask[mask_part == 255] = category_to_class[category]

            masks.append(mask)

            if len(images) >= batch_size:
                yield np.array(images), np.array(masks)
                images, masks = [], []

    if len(images) > 0:
        yield np.array(images), np.array(masks)

def preprocess_masks(masks, num_classes=6):
    return to_categorical(masks, num_classes=num_classes)

def build_unet(input_shape=(256, 256, 3)):
    inputs = layers.Input(shape=input_shape)
    c1 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(inputs)
    c1 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(c1)
    c1 = layers.BatchNormalization()(c1)
    p1 = layers.MaxPooling2D((2, 2))(c1)
    p1 = layers.Dropout(0.2)(p1)
    c2 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(p1)
    c2 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(c2)
    c2 = layers.BatchNormalization()(c2)
    p2 = layers.MaxPooling2D((2, 2))(c2)
    p2 = layers.Dropout(0.2)(p2)
    c3 = layers.Conv2D(256, (3, 3), activation='relu', padding='same')(p2)
    c3 = layers.Conv2D(256, (3, 3), activation='relu', padding='same')(c3)
    c3 = layers.BatchNormalization()(c3)
    u1 = layers.UpSampling2D((2, 2))(c3)
    u1 = layers.Concatenate()([u1, c2])
    c4 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(u1)
    c4 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(c4)
    c4 = layers.BatchNormalization()(c4)
    u1 = layers.Dropout(0.2)(c4)
    u2 = layers.UpSampling2D((2, 2))(u1)
    u2 = layers.Concatenate()([u2, c1])
    c5 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(u2)
    c5 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(c5)
    c5 = layers.BatchNormalization()(c5)
    u2 = layers.Dropout(0.2)(c5)
    outputs = layers.Conv2D(6, (1, 1), activation='softmax')(u2)
    model = models.Model(inputs, outputs)
    return model

def count_class_distribution(masks, num_classes=6):
    class_counts = np.zeros(num_classes)

    for mask in masks:
        mask_labels = np.argmax(mask, axis=-1)

        unique_classes = np.unique(mask_labels)
        for uc in unique_classes:
            class_counts[uc] += np.sum(mask_labels == uc)

    return class_counts

def train_model(image_mask_dir, batch_size=16):
    train_gen = load_data(image_mask_dir, batch_size=batch_size)

    images, masks = [], []
    for batch_images, batch_masks in train_gen:
        images.append(batch_images)
        masks.append(preprocess_masks(batch_masks))
    images = np.concatenate(images, axis=0) / 255.0
    masks = np.concatenate(masks, axis=0)

    class_counts = count_class_distribution(masks)

    plt.figure(figsize=(10, 5))
    my_cmap = plt.get_cmap("PRGn")
    rescale = lambda y: (y - np.min(y)) / (np.max(y) - np.min(y))

    plt.bar(range(6), class_counts, color=my_cmap(rescale(class_counts)))
    plt.yscale('log')
    plt.title('Class Distribution in Masks')
    plt.xlabel('Class')
    plt.ylabel('Pixel Count')
    plt.show()

    total_pixels = np.sum(class_counts)
    class_weights = total_pixels / class_counts

    class_counts = np.array([42536556., 45232., 235497., 132326., 215152., 744357.])

    total_pixels = np.sum(class_counts)

    model = build_unet(input_shape=(256, 256, 3))
    model.compile(optimizer=Adam(),
                  loss='categorical_crossentropy',
                  metrics=['accuracy',
                           MeanIoU(num_classes=6),
                           Precision(),
                           Recall()])

    checkpoint = ModelCheckpoint('checkpoint.keras', save_best_only=True, monitor='val_loss', mode='min')

    history = model.fit(images, masks, batch_size=batch_size, epochs=20,
                        callbacks=[checkpoint])

    model.save('model.keras')

image_mask_dir = 'data/train'
train_model(image_mask_dir, batch_size=16)
