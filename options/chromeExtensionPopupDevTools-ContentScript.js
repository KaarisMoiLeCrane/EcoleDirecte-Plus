// Listen for messages from background or popup scripts
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.toContent) {
    if (message.fromBackground && !message.fromPopup) {
      if (debug) console.log('[Content Script] Message for content from background:', message);
    } else if (message.fromPopup) {
      if (debug) console.log(
        '[Content Script] Message for content from popup through background:',
        message
      );
    }
  } else if (message.toEveryone) {
    if (message.fromPopup) {
      if (debug) console.log('[Content Script] General message from popup:', message);
    } else {
      if (debug) console.log('[Content Script] General message from someone:', message);
    }
  } else {
    if (debug) console.log('[Content Script] Potential message from someone:', message);
  }

  // Optionally, send a response back
  // sendResponse({...message, fromContent: true});
});
