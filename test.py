import os
import cv2
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model
import random

def rotate_image_and_mask(image, mask):
    rotations = [0, 90, 180, 270]
    rotation_angle = random.choice(rotations)
    
    if rotation_angle == 90:
        image = cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    elif rotation_angle == 180:
        image = cv2.rotate(image, cv2.ROTATE_180)
    elif rotation_angle == 270:
        image = cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)
    
    if rotation_angle == 90:
        mask = cv2.rotate(mask, cv2.ROTATE_90_CLOCKWISE)
    elif rotation_angle == 180:
        mask = cv2.rotate(mask, cv2.ROTATE_180)
    elif rotation_angle == 270:
        mask = cv2.rotate(mask, cv2.ROTATE_90_COUNTERCLOCKWISE)

    return image, mask

def load_data_from_directory(directory, batch_size=16):
    images, masks = [], []
    files = [f for f in os.listdir(directory) if f.endswith('.bmp') and '_mask' not in f]

    for file in files:
        img_path = os.path.join(directory, file)
        img = cv2.imread(img_path, cv2.IMREAD_COLOR)
        img = cv2.resize(img, (512, 512))

        images.append(img)

        combined_mask = np.zeros((512, 512), dtype=np.uint8)

        for i in range(1, 6):
            mask_path = os.path.join(directory, file.replace('.bmp', f'_{str(i)}_mask.bmp'))

            if os.path.exists(mask_path):
                mask_part = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
                mask_part = cv2.resize(mask_part, (512, 512), interpolation=cv2.INTER_NEAREST)
                combined_mask[mask_part == 255] = i

        img, combined_mask = rotate_image_and_mask(img, combined_mask)

        masks.append(combined_mask)

        if len(images) >= batch_size:
            yield np.array(images), np.array(masks)
            images, masks = [], []

    if len(images) > 0:
        yield np.array(images), np.array(masks)

def extract_instances_from_mask(mask):
    instances = []
    for class_id in range(1, 6):
        class_mask = (mask == class_id).astype(np.uint8)
        contours, _ = cv2.findContours(class_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        instance_id = 1
        
        for contour in contours:
            if len(contour) >= 5:
                x, y, w, h = cv2.boundingRect(contour)
                instance_mask = np.zeros_like(mask, dtype=np.uint8)
                cv2.drawContours(instance_mask, [contour], -1, instance_id, thickness=cv2.FILLED)

                instances.append({
                    'instance_mask': instance_mask,
                    'bbox': (x, y, w, h),
                    'class_id': class_id,
                    'instance_id': instance_id
                })
                
                instance_id += 1
    return instances

def test_model(model, test_images, test_masks, class_labels=None):
    predictions = model.predict(test_images)


    if class_labels is None:
        class_labels = {0: 'Background', 1: 'Dyskeratotic', 2: 'Koilocytotic', 
                        3: 'Metaplastic', 4: 'Parabasal', 5: 'Superficial'}

    for i, pred in enumerate(predictions):
        print(f"[DEBUG] Prediction stats for image {i+1}: min={pred.min()}, max={pred.max()}, mean={pred.mean()}")

        
        for j in range(6):
            print(f"Pred[{i}]: Shape: {pred[j].shape} Unique: {np.unique(pred[j].shape)}")
        
        print(f"Pred shape: {pred.shape}")
        predicted_mask = np.argmax(pred, axis=-1)
        instances = extract_instances_from_mask(predicted_mask)
        
        print(f"[DEBUG] Raw predicted values (center pixel): {pred}")

        plt.figure(figsize=(18, 12))

        plt.subplot(2, 5, 1)
        plt.imshow(test_images[i])
        plt.title(f'Original Image {i+1}')
        plt.axis('off')

        plt.subplot(2, 5, 2)
        plt.imshow(test_masks[i], cmap='jet')
        plt.title(f'True Mask {i+1}')
        plt.axis('off')

        thresholds = {}
        thresholded_labels = np.zeros(pred.shape[:2], dtype=np.uint8)
        for class_idx in range(pred.shape[-1]):
            class_pred = pred[..., class_idx]
            class_pred = (class_pred - np.min(class_pred)) / (np.max(class_pred) - np.min(class_pred))
            thresholds[class_idx] = np.percentile(class_pred, 68)
            class_mask = (class_pred > thresholds[class_idx]).astype(np.uint8) * class_idx
            thresholded_labels[class_mask > 0] = class_idx

        plt.subplot(2, 5, 3)
        im = plt.imshow(thresholded_labels, cmap='jet', interpolation='nearest')
        plt.title(f'Thresholded Predicted Mask {i+1}')
        plt.axis('off')

        for class_idx in range(1, 6):
            class_pred = pred[..., class_idx]
            class_pred = (class_pred - np.min(class_pred)) / (np.max(class_pred) - np.min(class_pred))
            class_mask = (class_pred > thresholds[class_idx]).astype(np.uint8) * class_idx

            plt.subplot(2, 5, class_idx + 5)
            plt.imshow(class_mask, cmap='gray')
            plt.title(f'Class {class_idx}: {class_labels.get(class_idx, f"Class {class_idx}")}')
            plt.axis('off')

        plt.tight_layout()
        plt.show()

if __name__ == '__main__':
    model_path = 'model/512x512_Checkpoint.h5'
    test_dir = 'data/test'
    
    model = load_model(model_path)
    print("[LOG] Model loaded successfully.")

    batch_size = 16
    for test_images, test_masks in load_data_from_directory(test_dir, batch_size=batch_size):
        test_images = test_images / 255.0

    test_model(model, test_images, test_masks)
