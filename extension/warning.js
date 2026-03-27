function getRiskColor(level) {
    if (level === "HIGH") return "#dc2626";
    if (level === "MODERATE") return "#f59e0b";
    return "#16a34a";
}

function getRiskMessage(level) {
    if (level === "HIGH")
        return "This site is highly likely to be a phishing attack.";
    if (level === "MODERATE")
        return "This site looks suspicious. Proceed carefully.";
    return "This site appears mostly safe.";
}

let loader = document.getElementById("loader");
let content = document.getElementById("mainContent");

chrome.storage.local.get(
    ["original_url", "risk_score", "risk_level", "explanation", "feature_importance", "domain_info"],
    (data) => {

        setTimeout(() => {

            loader.style.display = "none";
            content.style.display = "block";

            let level = data.risk_level || "LOW";

            // Badge
            let badge = document.getElementById("riskBadge");
            badge.innerText = level + " RISK";
            badge.style.background = getRiskColor(level);

            // Icon + Title
            let icon = document.getElementById("riskIcon");
            let title = document.getElementById("riskTitle");

            if (level === "HIGH") {
                icon.innerText = "🚨";
                title.innerText = "High Risk Phishing Site";
            } else if (level === "MODERATE") {
                icon.innerText = "⚠️";
                title.innerText = "Suspicious Website";
            } else {
                icon.innerText = "ℹ️";
                title.innerText = "Low Risk Website";
            }

            // Domain Info
            let domain = data.domain_info || {};

            document.getElementById("domainName").innerText =
                domain.hostname || "Unknown";

            document.getElementById("connectionType").innerText =
                domain.isSecure ? "🔒 Secure (HTTPS)" : "⚠️ Not Secure (HTTP)";

            // Explanation
            document.getElementById("explanation").innerText =
                getRiskMessage(level) +
                "\n\nReasons:\n• " + (data.explanation || "No details available");

            // Buttons
            document.getElementById("backBtn").onclick = () => {
                window.history.back();
            };

            document.getElementById("proceedBtn").onclick = () => {
                window.location.href = data.original_url;
            };

            // Feature Bars
            let featureList = document.getElementById("featureList");

            if (data.feature_importance && Object.keys(data.feature_importance).length > 0) {

                Object.entries(data.feature_importance).forEach(([key, value]) => {

                    let percent = Math.round(value * 100);

                    let div = document.createElement("div");
                    div.className = "feature";

                    div.innerHTML = `
                        <div>${key} (${percent}%)</div>
                        <div class="bar-container">
                            <div class="bar" style="width:${percent}%"></div>
                        </div>
                    `;

                    featureList.appendChild(div);
                });

            } else {
                featureList.innerHTML = "<p>No feature analysis available</p>";
            }

        }, 1000);
    }
);
