chrome.runtime.onMessage.addListener(function (receivedData, sender, sendResponse) {
	if (receivedData && receivedData.messageForBackgroundScript) {
		console.log("[Background Script] Received:", receivedData.message, receivedData.payload);
		chrome.runtime.sendMessage({ message: "Message Received from Background Script 5/5", payload: receivedData.payload, messageForPopupScript: true });
	}
	if (receivedData && receivedData.generalMessage) {
		console.log("[Background Script] Received a General Message:", receivedData.message, receivedData.payload);
		chrome.runtime.sendMessage({ message: "General Message Received from Background Script 5/5", payload: receivedData.payload, messageForPopupScript: true });
	}
	if (receivedData && !receivedData.messageForPopupScript && !receivedData.messageForContentScript && !receivedData.messageForBackgroundScript && !receivedData.generalMessage) {
		console.log("[Background Script] Supposedly Received:",  receivedData);
		chrome.runtime.sendMessage({ message: "Message Supposedly Received from Background Script 5/5", payload: receivedData, messageForPopupScript: true });
	}
});
