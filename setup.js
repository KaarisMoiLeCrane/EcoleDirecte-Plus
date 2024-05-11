var browser;

if (location.protocol.includes('-extension:')) {
  // Check for Chrome
  if (chrome && chrome.runtime) {
    browser = chrome;
  }
  // Check for Firefox
  else if (browser && browser.runtime) {
    // No need to change anything; already assigned to browser
  }
  // Check for Edge
  else if (msBrowser && msBrowser.runtime) {
    browser = msBrowser;
  }
  // Check for other browsers with standard WebExtension API support
  else if (browserPolyfill && browserPolyfill.runtime) {
    browser = browserPolyfill;
  }
} else {
  browser = window.chrome || window.browser || window.msBrowser || window.browserPolyfill;
}

var exports, imports;

const modules = {};

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

imports = (...args) => ({
  from(nameSpace) {
    const importedVars = modules[nameSpace];
    const result = [];

    if (args.length === 1 && args[0] === '*') {
      // If "*" is provided, import all variables from the namespace
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
      // If "*" is provided, import all variables from the namespace
      return importedVars[args[0]];
    }

    return result;
  }
});
