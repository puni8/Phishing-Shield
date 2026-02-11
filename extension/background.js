let temporarilyAllowed = new Set();

const safeDomains = [
    "google.com",
    "bing.com",
    "yahoo.com",
    "duckduckgo.com",
    "youtube.com",
    "wikipedia.org",
    "github.com",
    "microsoft.com",
    "amazon.com",
    "facebook.com"
];

function extractDomain(url) {
    try {
        return new URL(url).hostname.replace("www.", "");
    } catch {
        return "";
    }
}

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {

    if (details.frameId !== 0) return;

    const tabId = details.tabId;
    const url = details.url;

    if (!url.startsWith("http")) return;
    if (url.startsWith("chrome-extension://")) return;

    if (temporarilyAllowed.has(url)) {
        temporarilyAllowed.delete(url);
        return;
    }

    const domain = extractDomain(url);

    if (safeDomains.some(d => domain.endsWith(d))) {
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: url })
        });

        const result = await response.json();

        if (result.status === "phishing") {

            const warningUrl =
                chrome.runtime.getURL("warning.html") +
                `?url=${encodeURIComponent(url)}` +
                `&source=${encodeURIComponent(result.source)}` +
                `&prob=${result.probability || ""}` +
                `&reasons=${encodeURIComponent(
                    result.reasons ? result.reasons.join(" | ") : ""
                )}`;

            chrome.tabs.update(tabId, { url: warningUrl });
        }

    } catch (error) {
        console.log("Fetch error:", error);
    }

}, { url: [{ schemes: ["http", "https"] }] });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action === "allowUrl" && message.url) {
        temporarilyAllowed.add(message.url);
        sendResponse({ status: "allowed" });
    }

});