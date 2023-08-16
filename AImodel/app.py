from flask import Flask, render_template, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf

app = Flask(__name__, static_folder='static')

model = None
img_size = 256  

def load_model():
    global model
    model = tf.keras.models.load_model('model/model_vgg.h5')
    model.summary()

def preprocess_image(image):
    image = image.resize((img_size, img_size))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return "No file found", 400

    file = request.files['file']
    image = Image.open(file.stream).convert("RGB")
    preprocessed_image = preprocess_image(image)

    if model is None:
        return "Model not loaded", 500

    with tf.device('/CPU:0'):  
        predictions = model.predict(preprocessed_image)
        predicted_class = np.argmax(predictions)
        predicted_score = float(predictions[0][predicted_class]) 
        class_labels = ["Bengin", "Malignant", "Normal"]
        predicted_label = class_labels[predicted_class]

    return jsonify(prediction=predicted_label, score=predicted_score)


if __name__ == '__main__':
    load_model()
    app.run()
