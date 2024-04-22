document.addEventListener("DOMContentLoaded", async function() {
    const onOffButton = document.querySelector(".btn-enable");
    const statusElement = document.querySelector("#toggle");

    const copyButton = document.querySelector(".btn-copy");
    const dumpTextarea = document.querySelector("#dump");

    async function loadText() {
        try {
            const result = await chrome.storage.local.get("malicious_domain");
            if (result.savedText) {
                dumpTextarea.value = result.savedText;
            }
        } catch (error) {
            console.error("Error loading text from storage:", error);
        }
    }

    const loadStatus = async() => {
        try {
            const result = await chrome.storage.local.get("status");
            if (result.status) {
                statusElement.innerText = `Status: ${result.status}`;
            } else {
                statusElement.innerText = "Status: ON";
            }
        } catch (error) {
            console.error("Error loading status:", error);
            statusElement.innerText = "Status: ON";
        }
    };

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

    async function toggleStatus() {
        if (statusElement) {
            const currentStatus = statusElement.innerText;
            let newStatus = "ON";

            if (currentStatus.includes("ON")) {
                newStatus = "OFF";
            }

            statusElement.innerText = `Status: ${newStatus}`;

            try {
                await chrome.storage.local.set({ status: newStatus });
            } catch (error) {
                console.error("Error saving status:", error);
            }
        }
    }

    if (copyButton) {
        copyButton.addEventListener("click", copyText);
    }

    if (onOffButton) {
        onOffButton.addEventListener("click", toggleStatus);
    }

    await loadStatus();
    await loadText();
});