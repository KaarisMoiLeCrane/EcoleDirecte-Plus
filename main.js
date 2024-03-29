// Listen to all url changes
var lastUrl = location.href;

const watchAnyObject = imports('watchAnyObject').from('./utils/utils.js');

const CahierDeTexte = {main: imports('main').from('./features/cahierdetexte.js')};
const EmploiDuTemps = {main: imports('main').from('./features/emploidutemps.js')};
const Messagerie = {main: imports('main').from('./features/messagerie.js')};
const Design = {main: imports('main').from('./features/design.js')};
const Notes = {main: imports('main').from('./features/notes.js')};

// This part of the code is the core of the code
new MutationObserver(() => {
  var url = location.href;
  if (url !== lastUrl) {
    // The URL changed so we replace the old url with the new and recover each time the token
    lastUrl = url;

    // A kind of loop. It listen for any changes in sessionStorage (work but not perfectly, so I reload the page to make it work) and for each changes we recover the token and we check the page and see if there is anything to change
    //loop()

    main(1);

    // Each time the url change we remove the ed-menu css class from all element so the UI changes can be applied
    if (document.querySelectorAll('div.menu.ed-menu'))
      for (let i = 0; i < document.querySelectorAll('div.menu.ed-menu').length; i++)
        document.querySelectorAll('div.menu.ed-menu')[i].classList.remove('ed-menu');
  }
}).observe(document, {
  subtree: true,
  childList: true
});

function main(num) {
  if (!lastUrl.includes('/login')) {
    // Get the token of the account and the id of the aimed student
    globalThis.token = getToken();
    globalThis.accountType = getAccountType();
    globalThis.userId = window.location.pathname.split('/')[2];

    // console.log(globalThis.userId)

    // Apply the visual changes
    window.onload = () => {
      Design.main();
    };
    Design.main();

    // loop2();

    // If there is a token and the user is on the schedule or the text book or the grades then we wait for a specific element to load and then we apply the changes
    // console.log(globalThis.token, window.location.href)
    if (globalThis.token && window.location.href.includes('CahierDeTexte')) {
      if (globalThis.userId != undefined) {
        document.kmlcWaitForElement('.all-devoirs').then(() => {
          if (document.querySelector('.sidebar:hover'))
            document.getElementById('main-part').classList.add('sidebarhover');

          CahierDeTexte.main(globalThis.userId, globalThis.token);
        });
      }
    }

    if (globalThis.token && window.location.href.includes('EmploiDuTemps')) {
      if (globalThis.userId != undefined) {
        document.kmlcWaitForElement('.dhx_cal_data > div:nth-child(7)').then(() => {
          document.getElementById('main-part').classList.remove('sidebarhover');

          EmploiDuTemps.main(globalThis.userId, globalThis.token);
        });
      }
    }

    if (globalThis.token && window.location.href.includes('Notes')) {
      if (globalThis.userId != undefined) {
        document.kmlcWaitForElement('td.discipline').then(() => {
          if (document.querySelector('.sidebar:hover'))
            document.getElementById('main-part').classList.add('sidebarhover');

          Notes.main(globalThis.userId, globalThis.token);
        });
      }
    }

    if (globalThis.token && window.location.href.includes('Messagerie')) {
      if (globalThis.userId != undefined) {
        document
          .kmlcWaitForElement('[class *= btn-group] > button:not([class *= dropdown])')
          .then(() => {
            if (document.querySelector('.sidebar:hover'))
              document.getElementById('main-part').classList.add('sidebarhover');

            Messagerie.main(globalThis.userId, globalThis.token);
          });
      }
    }
  }
}

// A kind of loop. It listen for any changes in sessionStorage (work but not perfectly, so I reload the page to make it work) and for each changes we recover the token and we check the page and see if there is anything to change
//loop()

// loop2()

// A kind of loop. It listen for any changes in sessionStorage (work but not perfectly, so I reload the page to make it work) and for each changes we recover the token and we check the page and see if there is anything to change
function loop() {
  watchAnyObject(
    window.sessionStorage,
    ['setItem', 'getItem', 'removeItem'],
    (method, key, ...args) => {
      if ((method == 'setItem' && key == 'accounts') || key == 'credentials') {
        globalThis.token = getToken();
        let prom = new Promise((resolve) => {
          new MutationObserver((mutations, observer) => {
            for (let mutation of mutations) {
              for (let removedNode of mutation.removedNodes) {
                // If the relogin page is unloaded (because the user relogged) we check the page and see if there is anything to change
                if (removedNode.tagName === 'MODAL-CONTAINER') {
                  observer.disconnect();
                  resolve();
                }
              }
            }
          }).observe(document.body, {
            childList: true,
            subtree: true
          });
        });

        prom.then(() => {
          document.kmlcWaitForElement('ed-modal-reconnexion').then((elm) => {
            window.sessionStorage.removeItem('credentials'); // Remove the token item so the token can be reset with the new one
            window.sessionStorage.setItem('a', '0'); // The "a" item is the name of the item that let the whole extension to know that the user is trying to login (0) and if he logged successfully (get removed)
            window.location.reload(); // Page reloading
          });

          main(2);
          loop(); // We relaunch the loop
        });
      }
    }
  );
}

function loop2() {
  // If there is the loading page we wait for it to be deleted
  if (backdropScript) {
    document
      .kmlcWaitForElement(
        "div[class *= 'ng-tns'][class *= 'ng-busy']:not([class *= 'backdrop'])"
      )
      .then((elm) => {
        backdropScript = false;
        let prom = new Promise((resolve) => {
          new MutationObserver((mutations, observer) => {
            for (let mutation of mutations) {
              for (let removedNode of mutation.removedNodes) {
                try {
                  if (
                    removedNode.getAttribute('class').includes('ng-tns') &&
                    removedNode.getAttribute('class').includes('ng-busy') &&
                    !removedNode.getAttribute('class').includes('backdrop')
                  ) {
                    observer.disconnect();
                    resolve();
                  }
                } catch (e) {}
              }
            }
          }).observe(document.body, {
            subtree: true,
            childList: true
          });
        });

        prom.then(() => {
          backdropScript = true;
          main(3);
          loop2(); // We relaunch the loop
        });
      });
  }
}

// If the user logged
if (window.sessionStorage.a != '0') {
  document.kmlcWaitForElement('ed-modal-reconnexion').then((elm) => {
    // Wait for the relogin page to remove the token (so the website can reset his value with the new value) and we set the "a" value to 0 so we know that he have to login
    window.sessionStorage.removeItem('credentials');
    window.sessionStorage.setItem('a', '0');
    window.location.href = 'https://' + window.location.host + '/login'; // We do that because the script doesn't work well
  });
} else {
  window.sessionStorage.removeItem('a');
  //loop()
}

main(4);

var edMenuObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // Like before, each time the navigation bar change, we remove ed-menu css class from all element so the UI changes can be applied
    if (
      mutation.attributeName == 'class' &&
      mutation.target.className.includes('ed-menu')
    ) {
      mutation.target.classList.remove('ed-menu');
    }
  });
});

executeEdMenuObserver(edMenuObserver);

function executeEdMenuObserver(observer) {
  document.kmlcWaitForElement('.menu-bar').then((elm) => {
    observer.observe(elm, {
      characterData: false,
      attributes: true,
      attributeFilter: ['class'],
      childList: true,
      subtree: true
    });
  });
}

function getToken() {
  if (window.sessionStorage.credentials)
    return JSON.parse(window.sessionStorage.credentials).payload.authToken
      ? JSON.parse(window.sessionStorage.credentials).payload.authToken
      : NaN;

  return NaN;
}

function getAccountType() {
  if (window.sessionStorage.accounts)
    return JSON.parse(window.sessionStorage.accounts).payload.accounts[0].typeCompte ==
      "'E'"
      ? 'eleves'
      : 'familles';

  return NaN;
}
