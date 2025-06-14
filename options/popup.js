let data = '';

// Initialize browser variable
var browser;

/**
 * Detects the browser and assigns the appropriate API to the `browser` variable.
 */
function detectBrowser() {
  if (location.protocol.includes('-extension:')) {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      browser = chrome;
    } else if (typeof browser !== 'undefined' && browser.runtime) {
      // Browser already assigned
    } else if (typeof msBrowser !== 'undefined' && msBrowser.runtime) {
      browser = msBrowser;
    } else if (typeof browserPolyfill !== 'undefined' && browserPolyfill.runtime) {
      browser = browserPolyfill;
    }
  } else {
    browser =
      window.chrome || window.browser || window.msBrowser || window.browserPolyfill;
  }
}

// Detect the browser
detectBrowser();

document.addEventListener('DOMContentLoaded', async function () {
  await browser.storage.sync.get({debug: false}, (data) => {
    const debugValue = data.debug;
    document.getElementById('activateDebug').textContent = debugValue
      ? 'Disable debug'
      : 'Enable debug';
  });

  // Fetch all keys from browser.storage.sync
  let allSyncDatas = await browser.storage.sync.get(null);
  allSyncDatas = Object.keys(allSyncDatas);

  // Select the <select> element and populate options
  const selectElement = document.getElementById('selectData');
  addOption(selectElement, 'All Datas', null);

  allSyncDatas.forEach((key) => {
    addOption(selectElement, key, key);
  });

  // Event listener for Log Data button
  document.getElementById('logData').addEventListener('click', async function () {
    const selectedKey = selectElement.value;

    if (selectedKey === 'null') {
      const payload = await new Promise((resolve) => {
        browser.storage.sync.get(null, (data) => resolve(data));
      });

      console.log('[Popup Script] Data in browser.storage.sync:', payload);
      sendMessage({
        message: 'Data in browser.storage.sync',
        payload,
        fromPopup: true,
        toContent: true
      });

      document.querySelector('#messageContainer').innerHTML = syntaxHighlight(
        JSON.stringify(payload, undefined, 2)
      );

      data = payload;
    } else {
      const payload = await new Promise((resolve) => {
        browser.storage.sync.get(selectedKey, (data) => resolve(data));
      });

      console.log('[Popup Script] Data for key ' + selectedKey + ':', payload);
      sendMessage({
        message: 'Data for key ' + selectedKey,
        payload,
        fromPopup: true,
        toContent: true
      });

      document.querySelector('#messageContainer').innerHTML = syntaxHighlight(
        JSON.stringify(payload, undefined, 2)
      );

      data = payload;
    }
  });

  // Event listener for Clear Data button
  document.getElementById('clearData').addEventListener('click', async function () {
    const selectedKey = selectElement.value;

    if (selectedKey === 'null') {
      await new Promise((resolve) => {
        browser.storage.sync.clear(() => resolve());
      });
      console.log('[Popup Script] Data cleared: All Keys');
      sendMessage({
        message: 'Data cleared: All Keys',
        fromPopup: true,
        toContent: true
      });

      await new Promise((resolve, reject) => {
        const data = {debug: true};
        browser.storage.sync.set(data, function () {
          if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);
          } else {
            console.log('[DEBUG]', 'data reseted', {debug: true});
            resolve();
          }
        });
      });
    } else {
      await new Promise((resolve) => {
        browser.storage.sync.remove(selectedKey, () => resolve());
      });

      console.log('[Popup Script] Data cleared: ' + selectedKey);
      sendMessage({
        message: 'Data cleared: ' + selectedKey,
        fromPopup: true,
        toContent: true
      });

      await new Promise((resolve, reject) => {
        const data = {debug: true};
        browser.storage.sync.set(data, function () {
          if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);
          } else {
            console.log('[DEBUG]', 'data reseted', {debug: true});
            resolve();
          }
        });
      });
    }
  });

  // Event listener for Reload Extension button
  document.getElementById('reloadExtension').addEventListener('click', async function () {
    await browser.runtime.reload();
  });

  // Event listener for Send General Message button
  document.getElementById('sendMessage').addEventListener('click', async function () {
    const message = 'Hello from the popup!';
    console.log('[Popup Script] ' + message);
    sendMessage({message, fromPopup: true, toEveryone: true});
  });

  // Event listener for Send to Content Script button
  document
    .getElementById('sendMessageToContentScript')
    .addEventListener('click', async function () {
      const message = document.getElementById('messageInput').value;
      sendMessage({message, fromPopup: true, toContent: true});
    });

  // Event listener for Send to Background Script button
  document
    .getElementById('sendMessageToBackgroundScript')
    .addEventListener('click', async function () {
      const message = document.getElementById('messageInput').value;
      sendMessage({message, fromPopup: true, toBackground: true});
    });

  // Event listener for Copy button
  document
    .querySelector('[class = "copy-button"]')
    .addEventListener('click', copyToClipboard);

  // Event listener for Debug button
  document.getElementById('activateDebug').addEventListener('click', async function () {
    if (this.textContent.includes('Enable')) {
      this.textContent = 'Disable debug';
      await new Promise((resolve, reject) => {
        const data = {debug: true};
        browser.storage.sync.set(data, function () {
          if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);
          } else {
            console.log('[DEBUG]', 'Debug set', {debug: true});
            resolve();
          }
        });
      });
    } else if (this.textContent.includes('Disable')) {
      this.textContent = 'Enable debug';
      await new Promise((resolve, reject) => {
        const data = {debug: false};
        browser.storage.sync.set(data, function () {
          if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);
          } else {
            console.log('[DEBUG]', 'Debug set', {debug: false});
            resolve();
          }
        });
      });
    }
  });

  // Function to add an option to a <select> element
  function addOption(selectElement, text, value) {
    const option = document.createElement('option');
    option.textContent = text;
    option.value = value;
    selectElement.appendChild(option);
  }

  // Function to send message
  function sendMessage(message) {
    browser.runtime.sendMessage({
      ...message,
      fromPopup: true
    });
  }
});

// Listener for messages from other parts of the extension
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('[Popup Script] Message received:', message);
  // Handle the received message as needed
  // For example, update UI or perform actions based on the message
});

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
}

function copyToClipboard() {
  const el = document.createElement('textarea');
  el.value = JSON.stringify(data, null, 2);
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
