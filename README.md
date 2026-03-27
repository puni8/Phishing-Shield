# 🛡️ Phishing Shield – Hybrid AI-Based Phishing Detection System

## 🚀 Overview

**Phishing Shield** is a real-time browser-based phishing detection system that uses a **hybrid machine learning model** combined with **Explainable AI (XAI)** techniques to detect and explain malicious websites.

The system integrates a **Chrome Extension frontend** with a **Flask-based backend API**, enabling real-time URL analysis and user-friendly security warnings.

---

## 🧠 Key Features

* 🔍 **Hybrid ML Model**
  Combines:

  * Random Forest 🌲
  * XGBoost ⚡
  * LightGBM 🌿
    using **soft voting (ensemble learning)** for improved accuracy.

* 🧠 **Explainable AI (XAI)**

  * **SHAP** → Accurate feature importance visualization
  * **LIME** → Human-readable explanations

* 🌐 **Real-Time Detection**
  Detects phishing websites instantly via browser extension.

* ⚠️ **User-Friendly Warning UI**

  * Risk Level (High / Moderate / Low)
  * Domain information (HTTPS, hostname)
  * Feature-based explanation
  * Action buttons (Go Back / Continue)

* 🔄 **Live API Integration**

  * Flask backend deployed on cloud
  * Chrome extension communicates via REST API

---

## 🏗️ System Architecture

```
User → Chrome Extension
        ↓
   Flask API (Backend)
        ↓
 Hybrid ML Model (RF + XGB + LGBM)
        ↓
 Prediction + Probability
        ↓
 SHAP + LIME Explanation
        ↓
 Warning UI (Risk + Visual Insights)
```

---

## 🧪 Machine Learning Model

### 🔹 Hybrid Ensemble Model

* Implemented using `VotingClassifier (soft voting)`
* Improves generalization and reduces model bias

### 🔹 Feature Engineering

Extracted from URL:

* URL Length
* Domain Length
* Subdomains
* Obfuscation (% encoding)
* TLD Encoding
* Special character patterns

---

## 📊 Explainability

### 🔸 SHAP (SHapley Additive Explanations)

* Provides **feature importance scores**
* Used for **visual bar representation in UI**

### 🔸 LIME (Local Interpretable Model-Agnostic Explanations)

* Provides **human-readable reasoning**
* Displays top contributing features

---

## 💻 Tech Stack

### 🔹 Backend

* Python 🐍
* Flask
* Scikit-learn
* XGBoost
* LightGBM
* SHAP
* LIME

### 🔹 Frontend (Extension)

* HTML, CSS, JavaScript
* Chrome Extension APIs

### 🔹 Deployment

* Render (Cloud Hosting)
* GitHub (Version Control)

---

## 📂 Project Structure

```
Phishing-Shield/
│
├── backend/
│   ├── app.py
│   ├── model.pkl              # Hybrid model
│   ├── xgb_model.pkl          # For SHAP + LIME
│   ├── scaler.pkl
│   ├── feature_order.pkl
│   ├── requirements.txt
│   ├── Procfile
│   └── runtime.txt
│
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── warning.html
│   ├── warning.js
│   └── style.css
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 Backend (Local)

```bash
pip install -r requirements.txt
python app.py
```

---

### 🔹 Chrome Extension

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select `extension/` folder

---

## 🌍 Deployment

* Backend deployed using **Render**
* API Endpoint:

```
https://your-app.onrender.com/predict
```

---

## 📡 API Usage

### POST `/predict`

#### Request:

```json
{
  "url": "http://example.com"
}
```

#### Response:

```json
{
  "prediction": "Phishing",
  "confidence": 85.2,
  "lime_explanation": ["URL too long", "has obfuscation"],
  "feature_importance": {
    "URLLength": 0.92,
    "NoOfSubDomain": 0.81
  }
}
```

---

## 🎯 Results

* ✅ Improved accuracy using hybrid ensemble model
* ✅ Real-time phishing detection
* ✅ Explainable predictions (SHAP + LIME)
* ✅ User-centric warning interface

---

## 🧠 Future Enhancements

* 🌐 WHOIS API integration (domain age detection)
* 📊 SHAP graph visualization
* 🧾 Logging & analytics dashboard
* 🛡️ Blacklist/whitelist system
* 📦 Chrome Web Store deployment

---

## 👨‍💻 Author

Developed as a **Final Year B.Tech Cyber Security Project**
Focused on **real-world phishing detection with Explainable AI**

---

## 📜 License

This project is for academic and educational purposes.
