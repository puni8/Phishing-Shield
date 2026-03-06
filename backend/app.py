from flask import Flask, request, jsonify
import joblib
import pandas as pd
import re

app = Flask(__name__)

# ==========================
# URL Normalization Function
# ==========================
def normalize_url(url):
    url = url.lower().strip()
    url = re.sub(r'^https?://', '', url)   # remove http/https
    url = re.sub(r'^www\.', '', url)      # remove www
    url = url.rstrip('/')                 # remove trailing slash
    return url


# ==========================
# Load ML model + vectorizer
# ==========================
model = joblib.load("phishing_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")


# ==========================
# Load dataset
# ==========================
df = pd.read_csv("final_dataset.csv")
df["url"] = df["url"].apply(normalize_url)

phishing_urls = set(df[df["label"] == 1]["url"])
legitimate_urls = set(df[df["label"] == 0]["url"])

print("Phishing URLs loaded:", len(phishing_urls))
print("Legitimate URLs loaded:", len(legitimate_urls))


# ==========================
# Trusted Whitelist (High Reputation Domains)
# ==========================
trusted_domains = {
    "google.com",
    "amazon.com",
    "microsoft.com",
    "facebook.com",
    "apple.com",
    "youtube.com",
    "linkedin.com"
}


# ==========================
# Explanation Engine
# ==========================
def generate_explanations(url):
    reasons = []

    # IP-based URL
    if re.search(r"\d+\.\d+\.\d+\.\d+", url):
        reasons.append("IP-based URL detected")

    # Long URL
    if len(url) > 75:
        reasons.append("Unusually long URL detected")

    # Suspicious keywords
    suspicious_words = ["login", "verify", "update", "secure", "bank", "account"]
    for word in suspicious_words:
        if word in url:
            reasons.append(f"Suspicious keyword detected: '{word}'")

    # @ symbol
    if "@" in url:
        reasons.append("URL contains '@' symbol")

    # Multiple subdomains
    if url.count('.') > 4:
        reasons.append("Multiple subdomains detected")

    return reasons


# ==========================
# Prediction Route
# ==========================
@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    if not data or "url" not in data:
        return jsonify({"error": "URL not provided"}), 400

    # Normalize input
    url = normalize_url(data["url"])

    # 1️⃣ Verified phishing database
    if url in phishing_urls:
        return jsonify({
            "status": "phishing",
            "source": "Verified Phishing Database",
            "probability": 1.0,
            "reasons": ["URL found in verified phishing dataset"]
        })

    # 2️⃣ Verified legitimate database
    if url in legitimate_urls:
        return jsonify({
            "status": "legitimate",
            "source": "Verified Legitimate Database",
            "probability": 0.0
        })

    # 3️⃣ Trusted whitelist
    if url in trusted_domains:
        return jsonify({
            "status": "legitimate",
            "source": "Trusted Domain Whitelist",
            "probability": 0.0
        })

    # 4️⃣ ML Prediction (fallback)
    url_vec = vectorizer.transform([url])
    prediction = model.predict(url_vec)[0]
    probability = model.predict_proba(url_vec)[0][1]

    if prediction == 1:
        reasons = generate_explanations(url)

        return jsonify({
            "status": "phishing",
            "source": "Machine Learning Model",
            "probability": round(float(probability), 3),
            "reasons": reasons
        })

    else:
        return jsonify({
            "status": "legitimate",
            "source": "Machine Learning Model",
            "probability": round(float(probability), 3)
        })


if __name__ == "__main__":
    app.run(debug=True)