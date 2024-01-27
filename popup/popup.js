// CORRUP //

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
