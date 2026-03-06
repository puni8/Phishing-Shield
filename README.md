# 🛡 Phishing Shield - Real-Time Phishing Detection Extension

A browser extension that detects phishing websites in real-time using:

- Verified PhishTank database
- Machine Learning URL analysis
- Explainable security warning system

---

##  Features

-  URL-based phishing detection
-  ML model for unknown threats
-  Database-based hard blocking
-  Structured warning page with risk level
-  Continue option for ML-only detections
-  Hard block for verified phishing URLs
-  No interference with legitimate sites

---

## 🏗 Architecture

User URL  
↓  
Extension intercepts navigation  
↓  
Flask backend API  
↓  
 PhishTank database check  
 ML prediction  
↓  
Explanation engine  
↓  
Warning UI (if phishing)

---

##  ML Model

- TF-IDF vectorization
- Logistic Regression classifier
- Trained on:
  - PhishTank dataset
  - Tranco top domains

---

##  Installation

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py

Backend runs on:
http://127.0.0.1:5000

Extension Setup

1. Open Chrome
2. Go to chrome://extensions
3. Enable Developer Mode
4. Click "Load Unpacked"
5. Select extension/ folder

🛡 Detection Logic

Case	                    Behavior
URL in PhishTank	    Hard block
ML High Risk	            Warning + Continue
Legitimate	            No UI

📌 Disclaimer

This project is for educational purposes only.
