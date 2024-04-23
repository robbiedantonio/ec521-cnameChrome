document.addEventListener("DOMContentLoaded", async function() {
    const clearButton = document.querySelector(".btn-clear");
    const copyButton = document.querySelector(".btn-copy");
    const dumpTextarea = document.querySelector("#dump");

    async function loadText() {
        try {
            const result = await chrome.storage.local.get("malicious_domain");
            if (result.malicious_domain && Array.isArray(result.malicious_domain)) {
                dumpTextarea.value = result.malicious_domain.join("\n");
            } else {
                dumpTextarea.value = "";
            }
        } catch (error) {
            console.error("Error loading text from storage:", error);
        }
    }

    async function clearText() {
        if (dumpTextarea) {
            try {
                dumpTextarea.value = "";
                chrome.storage.local.set({ malicious_domain: [] });
                alert("Cleared CNAME dump.");
            } catch (error) {
                console.error("Failed to clear CNAME dump:", error);
                alert("Failed to clear CNAME dump.");
            }
        }
    }

    if (clearButton) {
        clearButton.addEventListener("click", clearText);
    }

    async function copyText() {
        if (dumpTextarea) {
            const text = dumpTextarea.value;
            try {
                await navigator.clipboard.writeText(text);
                alert("Copied CNAME dump.");
            } catch (error) {
                console.error("Failed to copy CNAME dump:", error);
                alert("Failed to copy CNAME dump.");
            }
        }
    }

    if (copyButton) {
        copyButton.addEventListener("click", copyText);
    }

    await loadText();
});