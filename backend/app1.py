from flask import Flask, request, jsonify
import joblib
import pandas as pd
from urllib.parse import urlparse
import numpy as np
from lime.lime_tabular import LimeTabularExplainer

app = Flask(__name__)

# FEATURE EXTRACTION
def extract_features(url):
    parsed = urlparse(url)
    features = {}

    features['URLLength'] = len(url)
    features['DomainLength'] = len(parsed.netloc)
    features['NoOfSubDomain'] = len(parsed.netloc.split('.')) - 2
    features['TLDLength'] = len(parsed.netloc.split('.')[-1]) if '.' in parsed.netloc else 0

    features['HasObfuscation'] = 1 if '%' in url else 0
    features['NoOfObfuscatedChar'] = url.count('%')

    tld = parsed.netloc.split('.')[-1] if '.' in parsed.netloc else 'unknown'
    features['tld'] = hash(tld) % 100  # simple encoding

    # Default values
    features['URLSimilarityIndex'] = 0
    features['CharContinuationRate'] = 0
    features['URLCharProb'] = 0
    features['HasTitle'] = 0
    features['HasFavicon'] = 0
    features['IsResponsive'] = 0
    features['Robots'] = 0

    return features


# LIME EXPLAINER
explainer = LimeTabularExplainer(
    training_data=np.zeros((1, len(feature_order))),
    feature_names=feature_order,
    class_names=['Legitimate', 'Phishing'],
    mode='classification'
)

# API
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    url = data['url']

    features = extract_features(url)
    df = pd.DataFrame([features])

    df = df[feature_order]
    df_scaled = scaler.transform(df)

    prediction = model.predict(df_scaled)[0]
    prob = model.predict_proba(df_scaled)[0][1]

    # LIME explanation
    exp = explainer.explain_instance(
        df_scaled[0],
        model.predict_proba,
        num_features=5
    )

    explanation = [f[0] for f in exp.as_list()]

    result = "Phishing" if prediction == 1 else "Legitimate"

    return jsonify({
        "prediction": result,
        "confidence": float(prob),
        "explanation": explanation
    })


# RUN
if __name__ == '__main__':
    app.run(debug=True)
