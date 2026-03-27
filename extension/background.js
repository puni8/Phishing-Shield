chrome.webNavigation.onCompleted.addListener(function(details) {

    if (details.frameId !== 0) return;

    chrome.tabs.get(details.tabId, function(tab) {
        let url = tab.url;

        if (!url || !url.startsWith("http")) return;
        if (url.includes("warning.html")) return;

        fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: url })
        })
        .then(res => res.json())
        .then(data => {

            if (data.prediction === "Phishing") {

                let score = Math.round(data.confidence);

                let level = "LOW";
                if (score >= 70) level = "HIGH";
                else if (score >= 40) level = "MODERATE";

                let explanationText = "";
                if (Array.isArray(data.explanation)) {
                    explanationText = data.explanation.join("\n• ");
                } else if (typeof data.explanation === "object") {
                    explanationText = Object.values(data.explanation).join("\n• ");
                } else {
                    explanationText = data.explanation || "No details available";
                }

                // Domain Info
                let urlObj = new URL(url);
                let domainInfo = {
                    hostname: urlObj.hostname,
                    protocol: urlObj.protocol,
                    isSecure: urlObj.protocol === "https:"
                };

                chrome.storage.local.set({
                    original_url: url,
                    risk_score: score,
                    risk_level: level,
                    explanation: explanationText,
                    feature_importance: data.feature_importance || {},
                    domain_info: domainInfo
                }, () => {

                    chrome.tabs.update(details.tabId, {
                        url: chrome.runtime.getURL("warning.html")
                    });

                });
            }
        })
        .catch(err => console.log("Error:", err));
    });

});
