// Self-invoking function to avoid polluting the global scope
(() => {
  // Importing necessary modules for different features
  const sidebar = imports('sidebar').from('./features/Design/sidebar.js');
  const credit = imports('credit').from('./features/Design/credit.js');
  const addPopupStyle = imports('addPopupStyle').from(
    './features/Design/add-popup-style.js'
  );
  const addTooltipStyle = imports('addTooltipStyle').from(
    './features/Design/add-tooltip-style.js'
  );
  const loginStyle = imports('loginStyle').from('./features/Design/login-style.js');

  /**
   * Main function to initialize and set up the design features
   */
  function main() {
    if (debug) console.log('[DEBUG] Main Init', 'Initializing main design features', {
      features: ['sidebar', 'credit', 'addPopupStyle', 'addTooltipStyle']
    });

    // Initialize sidebar
    sidebar();
    if (debug) console.log('[DEBUG] Sidebar Init', 'Sidebar initialized successfully');

    // Initialize credit section
    credit();
    if (debug) console.log('[DEBUG] Credit Init', 'Credit section initialized successfully');

    // Add popup styles
    addPopupStyle();
    if (debug) console.log('[DEBUG] Popup Style Init', 'Popup styles added successfully');

    // Add tooltip styles
    addTooltipStyle();
    if (debug) console.log('[DEBUG] Tooltip Style Init', 'Tooltip styles added successfully');
  }

  /**
   * Function to initialize and set up the login style
   */
  function login() {
    if (debug) console.log('[DEBUG] Login Init', 'Initializing login style');

    // Apply login styles
    loginStyle();
    if (debug) console.log('[DEBUG] Login Style Init', 'Login styles applied successfully');
  }

  // Exporting the main and login functions to be used in other modules
  exports({main, login}).to('./features/design.js');
})();
