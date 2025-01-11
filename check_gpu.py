import tensorflow as tf

physical_devices = tf.config.list_physical_devices('GPU')
if len(physical_devices) > 0:
  print("GPU available:", physical_devices)
else:
  print("No GPU available. Using CPU.")
