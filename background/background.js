try {
  importScripts('/setup.js');
  importScripts('/vendor/ecoledirecte.js');
} catch (e) {
  // console.log(e);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Send a message to the content script when the page is loaded
    chrome.tabs.sendMessage(tabId, {action: 'getCredential'}, async (response) => {
      if (chrome.runtime.lastError) return;

      if (response && response.id && response.token) {
        const {id, token} = response;

        console.log(id, token);

        // Import EcoleDirecte
        const EcoleDirecte = imports('EcoleDirecte').from('./vendor/ecoledirecte.js');

        // Create an instance of EcoleDirecte
        const account = new EcoleDirecte('', '', true, );

        // Get homeworks data
        try {
          await account.login();
          const homeworksData = await account.getHomeworks();
          console.log('Homeworks Data:', homeworksData);
        } catch (error) {
          // console.error('Error fetching homeworks:', error);
        }
      } else {
        // console.error('Credentials not available in the response.');
      }
    });
  }
});

// createNotification('Anglais', 'Nouvelle note : 18/20');

function createNotification(title, message) {
  var date = Date.now();
  var opt = {
    type: 'basic',
    title: title,
    message: message,
    iconUrl: '/assets/images/icons/icon_128.png'
  };
  browser.notifications.create('notificationName-' + date, opt, function () {
    console.log('created!');
  });

  setTimeout(function () {
    browser.notifications.clear('notificationName-' + date, function () {});
  }, 5000);
}
