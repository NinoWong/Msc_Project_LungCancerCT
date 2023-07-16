from flask import Flask, render_template, request, jsonify
from PIL import Image
import torch
import torchvision.transforms as transforms
import torch.nn as nn


app = Flask(__name__, static_folder='static')

class CNN(nn.Module):
    def __init__(self, num_classes=3):
        super(CNN, self).__init__()
        self.conv1 = nn.Sequential(
            nn.Conv2d(in_channels=3, out_channels=8, kernel_size=5, padding=2),
            nn.BatchNorm2d(8),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.LeakyReLU()
        )
        self.conv2 = nn.Sequential(
            nn.Conv2d(in_channels=8, out_channels=16, kernel_size=5, padding=2),
            nn.BatchNorm2d(16),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.LeakyReLU()
        )
        self.fc1 = nn.Linear(in_features=16 * 64 * 64, out_features=num_classes)

    def forward(self, x):
        out = self.conv1(x)
        out = self.conv2(out)
        out = out.reshape(out.size(0), -1)
        out = self.fc1(out)
        return out


def load_model():
    global model
    results_path = 'model/CNN30epochs.pt'  # Replace with the path to your model file
    checkpoint = torch.load(results_path, map_location=torch.device('cpu'))
    model = CNN()
    model.load_state_dict(checkpoint['state_dict'])
    model.eval()


def preprocess_image(image):
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
        transforms.Normalize([0.4802, 0.4481, 0.3975], [0.2302, 0.2265, 0.2262])
    ])
    preprocessed_image = transform(image).unsqueeze(0)
    return preprocessed_image


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        print("No file found")
        return "No file found"

    file = request.files['file']
    image = Image.open(file.stream).convert("RGB")
    preprocessed_image = preprocess_image(image)

    output = model(preprocessed_image)
    _, predicted = torch.max(output, 1)
    predicted_class = predicted.item()
    class_labels = ["Bengin", "Malignant", "Normal"]
    predicted_label = class_labels[predicted_class]


    return jsonify(prediction=predicted_label)


if __name__ == '__main__':
    load_model()
    app.run()
