import os
import cv2
import numpy as np

from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.metrics import MeanIoU, Precision, Recall
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import ModelCheckpoint

from sklearn.model_selection import train_test_split
from tqdm import tqdm

def load_data(image_mask_dir, batch_size=16):
    images, masks = [], []
    
    categories = ['Dyskeratotic', 'Koilocytotic', 'Metaplastic', 'Parabasal', 'Superficial']
    
    for category in categories:
        category_path = os.path.join(image_mask_dir, category)
        
        files = [file for file in os.listdir(category_path) if file.endswith('.bmp') and not file.endswith('_mask.bmp')]
        for file in tqdm(files, desc=f"Loading {category}", ncols=100):
            img_path = os.path.join(category_path, file)
            img = cv2.imread(img_path)
            img = cv2.resize(img, (512, 512))
            img = img_to_array(img)
            images.append(img)

            mask = np.zeros((512, 512), dtype=np.uint8)
            
            for i in range(1, 6):
                mask_file = file.replace('.bmp', f'_{str(i).zfill(2)}_mask.bmp')
                mask_path = os.path.join(category_path, mask_file)

                if os.path.exists(mask_path):
                    mask_part = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
                    mask_part = cv2.resize(mask_part, (512, 512), interpolation=cv2.INTER_NEAREST)
                    mask[mask_part == 255] = i

            masks.append(mask)

            if len(images) >= batch_size:
                yield np.array(images), np.array(masks)
                images, masks = [], []

    if len(images) > 0:
        yield np.array(images), np.array(masks)

def build_unet(input_shape=(512, 512, 3)):
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

def predict_and_segregate_instances(image_path, model):
    image = cv2.imread(image_path)
    image_resized = cv2.resize(image, (512, 512)) / 255.0
    image_resized = np.expand_dims(image_resized, axis=0)
    
    predictions = model.predict(image_resized)
    predicted_mask = np.argmax(predictions[0], axis=-1)
    
    instances = extract_instances_from_mask(predicted_mask)
    
    return predicted_mask, instances

def visualize_instances(image_path, instances):
    image = cv2.imread(image_path)
    image_resized = cv2.resize(image, (512, 512))

    for instance in instances:
        x, y, w, h = instance['bbox']
        cv2.rectangle(image_resized, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(image_resized, f"ID: {instance['instance_id']}", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
    
    cv2.imshow("Predicted Instances", image_resized)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

images, masks = [], []

image_mask_dir = 'data/train'
total_images = len([f for f in os.listdir(image_mask_dir) if f.endswith('.bmp')])

for batch_images, batch_masks in load_data(image_mask_dir, batch_size=16):
    images.append(batch_images)
    masks.append(batch_masks)

images = np.concatenate(images, axis=0) / 255.0
masks = np.concatenate(masks, axis=0)

masks = to_categorical(masks, num_classes=6)  


X_train, X_val, y_train, y_val = train_test_split(images, masks, test_size=0.2, random_state=42)

model = build_unet()


# from tensorflow.keras.models import load_model

# model = load_model('512x512_Checkpoint.h5', 
#                    custom_objects={
#                        'MeanIoU': MeanIoU, 
#                        'Precision': Precision, 
#                        'Recall': Recall
#                    })

model.compile(optimizer=Adam(), loss='categorical_crossentropy',
    metrics=[
        'accuracy',  
        MeanIoU(num_classes=6),
        Precision(),
        Recall() 
    ]
)

checkpoint = ModelCheckpoint('models/512x512_Checkpoint.h5', save_best_only=True, monitor='val_loss', mode='min')
history = model.fit(X_train, y_train, validation_data=(X_val, y_val), batch_size=4, epochs=20, callbacks=[checkpoint])

model.save('models/512x512.h5')
