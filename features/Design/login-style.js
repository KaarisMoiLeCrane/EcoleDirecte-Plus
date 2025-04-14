(() => {
  /**
   * Applies custom styles to the login page by removing specific elements and adjusting the login container.
   * @param {string} infoContainerSelector - The selector for the info container element.
   * @param {string} headerSelector - The selector for the header element.
   * @param {string} loginContainerSelector - The selector for the login container element.
   */
  function loginStyle(
    infoContainerSelector = "[class *= 'info-container']",
    headerSelector = 'header',
    loginContainerSelector = "[class *= 'login-container']"
  ) {
    // Check if the custom login style has already been applied
    if (!document.querySelector('[kmlc_login]')) {
      if (debug)
        console.log(
          '[DEBUG] loginStyle',
          'Custom login style not found, proceeding to apply'
        );

      // Select the necessary elements
      let infoContainer = document.querySelector(infoContainerSelector);
      let header = document.querySelector(headerSelector);
      let loginContainer = document.querySelector(loginContainerSelector);

      if (debug)
        console.log('[DEBUG] loginStyle', 'Elements selected', {
          infoContainer,
          header,
          loginContainer
        });

      if (infoContainer && header && loginContainer) {
        // Remove the info container and header elements
        infoContainer.remove();
        header.remove();
        if (debug)
          console.log('[DEBUG] loginStyle', 'Removed info container and header', {
            infoContainerSelector,
            headerSelector
          });

        // Center the login container and mark it as styled
        loginContainer.style.margin = 'auto';
        loginContainer.setAttribute('kmlc_login', 'true');
        if (debug)
          console.log('[DEBUG] loginStyle', 'Styled login container', {
            loginContainerSelector,
            style: loginContainer.style
          });
      } else {
        console.error('ERROR: loginStyle', 'One or more elements not found', {
          infoContainer,
          header,
          loginContainer
        });
      }
    } else {
      if (debug)
        console.log(
          '[DEBUG] loginStyle',
          'Custom login style already applied, no action taken'
        );
    }
  }

  // Export the loginStyle function as a module
  exports({loginStyle}).to('./features/Design/login-style.js');
})();
