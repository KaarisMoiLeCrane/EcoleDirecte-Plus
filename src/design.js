// Self-invoking function to avoid polluting the global scope
(() => {
  // Importing necessary modules for different features
  const cleaner = imports('cleaner').from('./src/Design/cleaner.js');
  const sidebar = imports('sidebar').from('./src/Design/sidebar.js');
  const credit = imports('credit').from('./src/Design/credit.js');
  const addPopupStyle = imports('addPopupStyle').from('./src/Design/add-popup-style.js');
  const addTooltipStyle = imports('addTooltipStyle').from(
    './src/Design/add-tooltip-style.js'
  );
  const loginStyle = imports('loginStyle').from('./src/Design/login-style.js');

  /**
   * Main function to initialize and set up the design features
   */
  function main() {
    if (debug)
      console.log('[DEBUG] Main Init', 'Initializing main design features', {
        features: ['sidebar', 'credit', 'addPopupStyle', 'addTooltipStyle']
      });

    // Initialize cleaner
    cleaner();
    if (debug) console.log('[DEBUG] Cleaner Init', 'Cleaner initialized successfully');

    // Initialize sidebar
    sidebar();
    if (debug) console.log('[DEBUG] Sidebar Init', 'Sidebar initialized successfully');

    // Initialize credit section
    credit();
    if (debug)
      console.log('[DEBUG] Credit Init', 'Credit section initialized successfully');

    // Add popup styles
    addPopupStyle();
    if (debug) console.log('[DEBUG] Popup Style Init', 'Popup styles added successfully');

    // Add tooltip styles
    addTooltipStyle();
    if (debug)
      console.log('[DEBUG] Tooltip Style Init', 'Tooltip styles added successfully');
  }

  /**
   * Function to initialize and set up the login style
   */
  function login() {
    if (debug) console.log('[DEBUG] Login Init', 'Initializing login style');

    // Apply login styles

    // Select the necessary elements
    let infoContainer = document.querySelector("[class *= 'info-container']");
    let header = true
    let loginContainer = document.querySelector("[class *= 'login-container']");

    loginStyle(
      infoContainer,
      header,
      loginContainer,
      "[class *= 'info-container']",
      '#login -> img -> closest .text-center',
      "[class *= 'login-container']"
    );

    if (debug)
      console.log('[DEBUG] Login Style Init', 'Login styles applied successfully');
  }

  // Exporting the main and login functions to be used in other modules
  exports({main, login}).to('./src/design.js');
})();
