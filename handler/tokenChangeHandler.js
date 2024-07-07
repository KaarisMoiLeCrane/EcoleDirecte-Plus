(() => {
  let initialToken = getToken();
  // Initialize the token change handler
  tokenChangeHandler();

  /**
   * Listens for changes in sessionStorage and especially for the 'credentials' value
   */
  function tokenChangeHandler() {
    // Handler for intercepting sessionStorage.setItem
    const handler = {
      apply: function (target, thisArg, argumentsList) {
        const [key, value] = argumentsList;
        const newToken = retrieveToken(value);

        // Call the original setItem method
        target.apply(thisArg, argumentsList);

        if (key === 'credentials' && newToken && initialToken != newToken) {
          initialToken = newToken;
          document.dispatchEvent(
            new CustomEvent('kmlcIsolatedMainCom', {detail: newToken})
          );
        }

        return true;
      }
    };

    // Create a proxy around sessionStorage.setItem
    sessionStorage.setItem = new Proxy(sessionStorage.setItem, handler);
  }

  /**
   * Get the token of the account.
   * @returns {number|string} The token.
   */
  function getToken() {
    let json;
    if (window.sessionStorage.credentials) {
      try {
        json = JSON.parse(window.sessionStorage.credentials).payload.authToken;
      } catch (e) {
        json = NaN;
      }
    }

    return json ? json : NaN;
  }

  /**
   * Retrieve the token of the account.
   * @param {string} sessionStorageValue The sessionStorage credentials value.
   * @returns {number|string} The token.
   */
  function retrieveToken(sessionStorageValue) {
    try {
      return JSON.parse(sessionStorageValue).payload.authToken;
    } catch (e) {
      return NaN;
    }
  }
})();
