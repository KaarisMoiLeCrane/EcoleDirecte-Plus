// Handle runtime events, such as extension startup and message passing
chrome.runtime.onInstalled.addListener(function () {
  console.log('[Background Script] Extension installed.');
});

// Listener for messages from popup or content scripts
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.toContent || message.toEveryone) {
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {...message, fromBackground: true});
    });
  } else if (message.toBackground) {
    if (message.fromPopup) {
      console.log('[Background Script] Message to background from popup:', message);
    } else {
      console.log('[Background Script] Message to background from someone:', message);
    }
  } else if (message.toEveryone) {
    if (message.fromPopup) {
      console.log('[Background Script] General message from popup:', message);
    } else {
      console.log('[Background Script] General message from someone:', message);
    }
  } else {
    console.log('[Background Script] Potential message from someone:', message);
  }

  // Optionally, send a response back
  // sendResponse('Message received by background script.');
});
