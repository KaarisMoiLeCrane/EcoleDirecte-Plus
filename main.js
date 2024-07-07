(() => {
  // Utility imports
  const {getToken, getUserId} = imports('*').from('./utils/utils.js');

  // Feature imports
  const CahierDeTexte = {main: imports('main').from('./features/cahierdetexte.js')};
  const EmploiDuTemps = {main: imports('main').from('./features/emploidutemps.js')};
  const Messagerie = {main: imports('main').from('./features/messagerie.js')};
  const Design = imports('*').from('./features/design.js');
  const Notes = {main: imports('main').from('./features/notes.js')};

  let lastUrl = window.location.href;

  /**
   * Initializes URL change observer.
   */
  function initUrlObserver() {
    new MutationObserver(handleUrlChange).observe(document, {
      subtree: true,
      childList: true
    });
  }

  /**
   * Handles URL change events.
   */
  function handleUrlChange() {
    const url = window.location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      main(1);
      removeEdMenuClass();
    }
  }

  /**
   * Removes 'ed-menu' CSS class from all menu elements.
   */
  function removeEdMenuClass() {
    const menuElements = document.querySelectorAll('div.menu.ed-menu');
    menuElements.forEach((element) => element.classList.remove('ed-menu'));
  }

  /**
   * Main function to handle different page behaviors based on URL.
   * @param {number} num - Identifier for the call instance.
   */
  function main(num) {
    if (lastUrl.includes('/login')) {
      Design.login();
    } else {
      const token = getToken();
      const userId = getUserId();
      if (debug)
        console.log('[DEBUG]', 'main ' + num, 'ID of the selected user.', userId);

      window.onload = Design.main;
      Design.main();

      if (debug)
        console.log('[DEBUG]', 'main ' + num, 'Token and last URL.', {token, lastUrl});

      handlePageSpecificChanges(token, userId);
    }
  }

  /**
   * Handles page-specific changes based on the current URL.
   * @param {string} token - Authentication token.
   * @param {string} userId - User ID.
   */
  function handlePageSpecificChanges(token, userId) {
    if (token && lastUrl.includes('CahierDeTexte')) {
      waitForElement('.all-devoirs', () => CahierDeTexte.main(userId, token));
    }

    if (token && lastUrl.includes('EmploiDuTemps')) {
      waitForElement('.dhx_cal_data > div:nth-child(7)', () =>
        EmploiDuTemps.main(userId, token)
      );
    }

    if (token && lastUrl.includes('Notes')) {
      waitForElement('td.discipline', () => Notes.main(userId, token));
    }

    if (token && lastUrl.includes('Messagerie')) {
      waitForElement('[class *= btn-group] > button:not([class *= dropdown])', () =>
        Messagerie.main(userId, token)
      );
    }
  }

  /**
   * Waits for a specific element to be loaded and then executes the callback.
   * @param {string} selector - CSS selector of the element to wait for.
   * @param {Function} callback - Callback to execute when the element is found.
   */
  function waitForElement(selector, callback) {
    document.kmlcWaitForElement(selector).then(() => {
      if (document.querySelector('.sidebar:hover')) {
        document.getElementById('main-part').classList.add('sidebarhover');
      }
      callback();
    });
  }

  /**
   * Executes the observer for the 'ed-menu' class changes.
   * @param {MutationObserver} observer - MutationObserver instance.
   */
  function executeEdMenuObserver(observer) {
    waitForElement('.menu-bar', () => {
      observer.observe(document.querySelector('.menu-bar'), {
        characterData: false,
        attributes: true,
        attributeFilter: ['class'],
        childList: true,
        subtree: true
      });
    });
  }

  // Observer for 'ed-menu' class changes in the navigation bar
  const edMenuObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.attributeName === 'class' &&
        mutation.target.className.includes('ed-menu')
      ) {
        mutation.target.classList.remove('ed-menu');
      }
    });
  });

  // Initialize the observer for the URL changes
  initUrlObserver();

  // Initialize the main function
  main(4);

  executeEdMenuObserver(edMenuObserver);

  // Trash, not executed anymore but still just in case of
  // Trash, not executed anymore but still just in case of
  // Trash, not executed anymore but still just in case of

  /**
   * Listens for changes in the loading page and reinitializes when loading is complete.
   */
  function loop2() {
    if (backdropScript) {
      waitForElement(
        "div[class *= 'ng-tns'][class *= 'ng-busy']:not([class *= 'backdrop'])",
        () => {
          backdropScript = false;
          new Promise((resolve) => {
            new MutationObserver((mutations, observer) => {
              mutations.forEach((mutation) => {
                mutation.removedNodes.forEach((removedNode) => {
                  try {
                    if (
                      removedNode.getAttribute('class').includes('ng-tns') &&
                      removedNode.getAttribute('class').includes('ng-busy') &&
                      !removedNode.getAttribute('class').includes('backdrop')
                    ) {
                      observer.disconnect();
                      resolve();
                    }
                  } catch (e) {
                    // Handle error silently
                  }
                });
              });
            }).observe(document.body, {
              subtree: true,
              childList: true
            });
          }).then(() => {
            backdropScript = true;
            main(3);
            loop2();
          });
        }
      );
    }
  }

  exports({main}).to('./main.js');
})();

// Listener for runtime messages from the Chrome extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message, sender);
  if (message.action === 'getCredential') {
    sendResponse({token: getToken(), id: window.location.pathname.split('/')[2]});
  }
});

document.addEventListener('kmlcIsolatedMainCom', function (data) {
  const main = imports('main').from('./main.js');
  const newToken = data.detail;
  main(5);
});
