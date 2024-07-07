// Initialize browser variable and debug flag
var browser;
var debug = false;

/**
 * Logs the current debug status.
 * @param {boolean} debugStatus - The current debug status.
 */
function logDebugStatus(debugStatus) {
  const statusMessage = debugStatus ? 'ENABLED' : 'DISABLED';
  console.log(
    `%c[EcoleDirecte +] DEBUG mode ${statusMessage}`,
    'color: #0f8fd1; -webkit-text-stroke: 2px black; font-size: 42px; font-weight: bold;'
  );
}

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

// Display initial debug status
browser.storage.sync.get({debug: false}, function (data) {
  debug = data.debug;
});

logDebugStatus(debug);

// Module management
var exports, imports;
const modules = {};

/**
 * Exports variables to a specified namespace.
 * @param  {...any} args - Variables to be exported.
 * @returns {object} - Object with `to` method to specify the namespace.
 */
exports = (...args) => ({
  to(nameSpace) {
    modules[nameSpace] || (modules[nameSpace] = {});

    if (args.length === 1 && typeof args[0] === 'object') {
      const varsObj = args[0];
      for (let [k, v] of Object.entries(varsObj)) {
        modules[nameSpace][k] = v;
      }
    } else {
      for (let i = 0; i < args.length; i += 2) {
        modules[nameSpace][args[i]] = args[i + 1];
      }
    }
  }
});

// exports({main, login}).to('./features/design.js');
// exports({main}).to('./features/design.js'); exports({login}).to('./features/design.js');
// exports(main).to('./features/design.js');

/**
 * Imports variables from a specified namespace.
 * @param  {...any} args - Variables to be imported.
 * @returns {object} - Object with `from` method to specify the namespace.
 */
imports = (...args) => ({
  from(nameSpace) {
    const importedVars = modules[nameSpace];
    const result = [];

    if (args.length === 1 && args[0] === '*') {
      // Import all variables from the namespace
      return {...importedVars};
    }

    if (args.length === 1 && Array.isArray(args[0])) {
      const varsArr = args[0];
      varsArr.forEach((variable) => {
        result.push(importedVars[variable]);
      });
    } else {
      args.forEach((variable) => {
        result.push(importedVars[variable]);
      });
    }

    if (args.length === 1 && typeof args[0] === 'string') {
      return importedVars[args[0]];
    }

    return result;
  }
});

// const Design = {
//   main: imports('main').from('./features/design.js'),
//   login: imports('login').from('./features/design.js')
// };
// const Design = imports('*').from('./features/design.js');
//
// const DesignMain = imports('main').from('./features/design.js');
// const {design, login} = imports('*').from('./features/design.js');

// Listen for changes in browser storage and update debug status accordingly
browser.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.debug) {
    debug = changes.debug.newValue;
    logDebugStatus(debug);
  }
});
