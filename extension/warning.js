const params = new URLSearchParams(window.location.search);

const url = params.get("url");
const source = params.get("source");
const reasons = params.get("reasons");

const probParam = params.get("prob");
const prob = probParam ? parseFloat(probParam) : null;

document.getElementById("url").textContent = url || "Unknown";
document.getElementById("source").textContent = source || "Unknown";

const riskText = document.getElementById("riskLevel");
const message = document.getElementById("mainMessage");
const probabilitySection = document.getElementById("probabilitySection");
const probDisplay = document.getElementById("prob");
const reasonsList = document.getElementById("reasons");
const continueBtn = document.getElementById("continueBtn");
const backBtn = document.getElementById("backBtn");

let riskLevel = "Moderate Risk";
let riskColor = "#f57c00";

probabilitySection.style.display = "none";
continueBtn.style.display = "none";


// ===== PHISHTANK HARD BLOCK =====
if (source === "Verified Phishing Database") {

    riskLevel = "CRITICAL RISK";
    riskColor = "#c62828";

    message.textContent =
        "This website is officially listed in a verified phishing database. Access has been blocked for your protection.";
}

// ===== ML DETECTION =====
else if (prob !== null) {

    if (prob > 0.95) {
        riskLevel = "CRITICAL RISK";
        riskColor = "#c62828";
    } 
    else if (prob > 0.85) {
        riskLevel = "HIGH RISK";
        riskColor = "#d84315";
    } 
    else if (prob > 0.70) {
        riskLevel = "MODERATE RISK";
        riskColor = "#f57c00";
    } 
    else {
        riskLevel = "LOW RISK";
        riskColor = "#f9a825";
    }

    message.textContent =
        "This website appears suspicious based on URL pattern analysis. Do NOT enter passwords, OTPs, or banking details.";

    if (prob > 0.85) {
        probabilitySection.style.display = "block";
        probDisplay.textContent =
            (prob * 100).toFixed(2) + "% malicious likelihood";
    }

    // Show Continue button for ML detection only
    continueBtn.style.display = "inline-block";

    continueBtn.addEventListener("click", function () {

        chrome.runtime.sendMessage(
            {
                action: "allowUrl",
                url: url
            },
            function () {
                window.location.href = url;
            }
        );

    });
}


// Apply risk styling
riskText.textContent = riskLevel;
riskText.style.color = riskColor;


// Display threat indicators
if (reasons) {
    reasons.split(" | ").forEach(reason => {
        const li = document.createElement("li");
        li.textContent = reason;
        reasonsList.appendChild(li);
    });
}


// Return to Safety
backBtn.addEventListener("click", function () {
    window.location.href = "https://www.google.com";
});