document.addEventListener('DOMContentLoaded', async function () {
	// Data to be added to the select element
	var allSyncDatas = await chrome.storage.sync.get(null);
	allSyncDatas = Object.getOwnPropertyNames(allSyncDatas)
	
	// Select the <select> element
	const selectElement = document.getElementById('selectData');
	addOption(selectElement, "All Datas", null)
	
	for (let i = 0; i < allSyncDatas.length; i++) {
		addOption(selectElement, allSyncDatas[i], allSyncDatas[i])
	}
	
	// Log Data Button
	document.getElementById('logData').addEventListener('click', async function () {
		var selectedKey = selectData.value;
		var dataToGet = {};
		dataToGet[selectedKey] = null;
		
		if (selectedKey == "null") {
			await chrome.storage.sync.get(null, async function (payload) {
				let message = 'Data in chrome.storage.sync:' // + JSON.stringify(data, null, 2)
				console.log("[Popup Script] " + message, payload);
				await chrome.runtime.sendMessage({ message: message, payload: payload, generalMessage: true });
			});
			return
		}
		
		await chrome.storage.sync.get(dataToGet, async function (payload) {
			let message = 'Data in chrome.storage.sync:' // + JSON.stringify(data, null, 2)
			console.log("[Popup Script] " + message, payload);
			await chrome.runtime.sendMessage({ message: message, payload: payload, generalMessage: true });
		});
	});

	// Clear Data Button
	document.getElementById('clearData').addEventListener('click', async function () {
		var selectedKey = selectData.value;
		var dataToClear = [];
		dataToClear.push(selectedKey)
		
		if (selectedKey == "null") {
			await chrome.storage.sync.remove(null, async function (result) {
				let message = 'Data cleared:' // + JSON.stringify(selectedKey, null, 2)
				console.log("[Popup Script] " + message, "All Keys");
				await chrome.runtime.sendMessage({ message: message, payload: selectedKey, generalMessage: true });
			});
			return
		}
		
		await chrome.storage.sync.remove(dataToClear, async function (result) {
			let message = 'Data cleared:' // + JSON.stringify(selectedKey, null, 2)
			console.log("[Popup Script] " + message, selectedKey);
			await chrome.runtime.sendMessage({ message: message, payload: selectedKey, generalMessage: true });
		});
	});

	// Reload Extension Button (for development)
	document.getElementById('reloadExtension').addEventListener('click', async function () {
		await chrome.runtime.reload();
	});

	// Send a message to the background script to log a message
	document.getElementById('sendMessage').addEventListener('click', async function () {
		let message = 'Hello from the popup!'
		console.log("[Popup Script] " + message)
		await chrome.runtime.sendMessage({ message: message, payload: null, generalMessage: true });
	});
	
	// Send a message from the popup to the content script
	document.getElementById('sendMessageToContentScript').addEventListener('click', async function () {
		let message = document.getElementById('messageInput').value;
		await chrome.runtime.sendMessage({ message: message, payload: null, messageForContentScript: true });
	});
	
	// Send a message from the popup to the background script
	document.getElementById('sendMessageToBackgroundScript').addEventListener('click', async function () {
		let message = document.getElementById('messageInput').value;
		await chrome.runtime.sendMessage({ message: message, payload: null, messageForBackgroundScript: true });
	});
});

// Content Script: Display messages from the background script
chrome.runtime.onMessage.addListener(function (receivedData, sender, sendResponse) {
	if (receivedData && receivedData.messageForPopupScript) {
		console.log("[Popup Script] Received:", receivedData.message, receivedData.payload);
		var messageContainer = document.getElementById('messageContainer');
		messageContainer.textContent = receivedData.message + " " + JSON.stringify(receivedData.payload, null, 2);
	}
	if (receivedData && receivedData.generalMessage) {
		console.log("[Popup Script] Received a General Messal:/**/*.ipynb","*.{jpg,jpe,jpeg,png,bmp,gif,ico,webp,avif}","*.{mp3,wav,ogg,oga}","*.{mp4,webm}","*.cpuprofile","*.heapprofile","git-rebase-todo","walkThrough:/**","vscode-terminal:/**"]:�zECrangav.vscode-thunder-client{"tc.version-key":"2.16.2"}�	�yY�Kmemento/mainThreadWebviewPanel.origins{"{\"viewType\":\"gitlens.welcome\",\"key\":\"eamodio.gitlens\"}":"48e4fe1c-3444-4434-9b1f-f62ff1562b6c","{\"viewType\":\"tc.markdown-view\",\"key\":\"rangav.vscode-thunder-client\"}":"60acced1-0b05-42bc-855c-51fb454c441f"}A-��   � �    r������������i� K                                 �cQ�workbench.activity.pinnedViewlets2[{"id":"workbench.view.explorer","pinned":true,"order":0},{"id":"workbench.view.