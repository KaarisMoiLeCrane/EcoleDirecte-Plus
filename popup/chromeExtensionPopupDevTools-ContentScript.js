chrome.runtime.onMessage.addListener(function (receivedData, sender, sendResponse) {
	if (receivedData && receivedData.messageForContentScript) {
		console.log("[Content Script] Received:", receivedData.message, receivedData.payload);
		chrome.runtime.sendMessage({ message: "Message Received from Content Script 5/5", payload: receivedData.payload, messageForPopupScript: true });
	}
	if (receivedData && receivedData.generalMessage) {
		console.log("[Content Script] Received a General Message:", receivedData.message, receivedData.payload);
		chrome.runtime.sendMessage({ message: "General Message Received from Content Script 5/5", payload: receivedData.payload, messageForPopupScript: true });
	}
	if (receivedData && !receivedData.messageForPopupScript && !receivedData.messageForContentScript && !receivedData.messageForBackgroundScript && !receivedData.generalMessage) {
		console.log("[Content Script] Supposedly Received:",  receivedData);
		chrome.runtime.sendMessage({ message: "Message Supposedly Received from Content Script 5/5", payload: receivedData.payload, messageForPopupScript: true });
	}
});