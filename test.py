import os
import cv2
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model

def load_data_from_directory(directory, batch_size=16):
    images, masks = [], []
    files = [f for f in os.listdir(directory) if f.endswith('.bmp') and '_mask' not in f]

    for file in files:
        img_path = os.path.join(directory, file)
        img = cv2.imread(img_path, cv2.IMREAD_COLOR)
        img = cv2.resize(img, (256, 256))
        images.append(img)

        combined_mask = np.zeros((256, 256), dtype=np.uint8)

        for i in range(1, 6):
            cytoplasm_mask_path = os.path.join(directory, file.replace('.bmp', f'_cyt{str(i)}_mask.bmp'))
            nucleus_mask_path = os.path.join(directory, file.replace('.bmp', f'_nuc{str(i)}_mask.bmp'))

            if os.path.exists(cytoplasm_mask_path):
                cytoplasm_mask = cv2.imread(cytoplasm_mask_path, cv2.IMREAD_GRAYSCALE)
                cytoplasm_mask = cv2.resize(cytoplasm_mask, (256, 256), interpolation=cv2.INTER_NEAREST)
                combined_mask[cytoplasm_mask == 255] = 1  # Assign 1 for cytoplasm

            if os.path.exists(nucleus_mask_path):
                nucleus_mask = cv2.imread(nucleus_mask_path, cv2.IMREAD_GRAYSCALE)
                nucleus_mask = cv2.resize(nucleus_mask, (256, 256), interpolation=cv2.INTER_NEAREST)
                combined_mask[nucleus_mask == 255] = 2  # Assign 2 for nucleus

        masks.append(combined_mask)

        if len(images) >= batch_size:
            yield np.array(images), np.array(masks)
            images, masks = [], []

    if len(images) > 0:
        yield np.array(images), np.array(masks)



def test_model(model, test_images, test_masks, class_labels=None):
    predictions = model.predict(test_images)

    if class_labels is None:
        class_labels = {0: 'Background', 1: 'Cytoplasm', 2: 'Nucleus'}


    for i, pred in enumerate(predictions):
        print(f"[DEBUG] Prediction stats for image {i+1}: min={pred.min()}, max={pred.max()}, mean={pred.mean()}")

        plt.figure(figsize=(18, 12))

        plt.subplot(2, 3, 2)
        plt.imshow(test_images[i])
        plt.title(f'Original Image {i+1}')
        plt.axis('off')

        plt.subplot(2, 3, 3)
        plt.imshow(test_masks[i], cmap='gray')
        plt.title(f'Train Mask {i+1}')
        plt.axis('off')

        thresholds = {}
        for class_idx in range(pred.shape[-1]):
            class_pred = pred[..., class_idx]
            class_pred = (class_pred - np.min(class_pred)) / (np.max(class_pred) - np.min(class_pred))  # Normalize
            thresholds[class_idx] = np.percentile(class_pred, 68) 

            if class_idx == 2:
                thresholds[class_idx] = 0.2

            plt.subplot(2, 3, class_idx + 4)
            plt.imshow(class_pred, cmap='gray')
            plt.title(f'Class {class_idx}: {class_labels.get(class_idx, f"Class {class_idx}")}\n thresh: {thresholds[class_idx]:.2f}')
            plt.colorbar()
            plt.axis('off')

        thresholded_labels = np.zeros(pred.shape[:2], dtype=np.uint8)
        for class_idx in range(pred.shape[-1]):
            class_pred = pred[..., class_idx]
            class_pred = (class_pred - np.min(class_pred)) / (np.max(class_pred) - np.min(class_pred))  # Normalize
            class_mask = (class_pred > thresholds[class_idx]).astype(np.uint8) * class_idx
            thresholded_labels[class_mask > 0] = class_idx 

        print(f"[DEBUG] Unique values in thresholded labels: {np.unique(thresholded_labels)}")

        plt.subplot(2, 3, 1)
        im = plt.imshow(thresholded_labels, cmap='jet', interpolation='nearest')
        plt.title(f'Thresholded Predicted Mask {i+1}')
        plt.axis('off')

        cbar = plt.colorbar(im, ax=plt.gca(), orientation='vertical', ticks=range(len(class_labels)))
        cbar.ax.set_yticklabels([class_labels[k] for k in range(len(class_labels))])

        plt.tight_layout()
        plt.show()




if __name__ == '__main__':
    model_path = 'model/recent.h5'
    test_dir = 'data/test'
    
    model = load_model(model_path)
    print("[LOG] Model loaded successfully.")

    batch_size = 16
    for test_images, test_masks in load_data_from_directory(test_dir, batch_size=batch_size):
        test_images = test_images / 255.0  # Normalize images
        test_model(model, test_images, test_masks)
