importScripts('browser-polyfill.min.js');

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'save-position') {
        // Save the position in the browser's local storage
        browser.storage.local.set({ clockPosition: msg.position }).then(() => {
            sendResponse({ status: 'saved' });
        });
        return true; // Keep the message channel open
    }

    if (msg.type === 'load-position') {
        // Retrieve the saved position from the local storage
        browser.storage.local.get('clockPosition').then((data) => {
            sendResponse({ position: data.clockPosition });
        });
        return true; // Keep the message channel open
    }
});
