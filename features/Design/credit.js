(() => {
  /**
   * Adds a credit button to the footer if it doesn't already exist.
   * @param {string} footerSelector - The selector for the footer element.
   * @param {string} buttonText - The text to display on the button.
   * @param {string} buttonLink - The URL to link to from the button.
   */
  function credit(
    footerSelector = '#footer ul',
    buttonText = 'ED+ par KMLC',
    buttonLink = 'https://github.com/KaarisMoiLeCrane/EcoleDirecte-Plus'
  ) {
    // Check if the credit button already exists
    if (!document.querySelector('[kmlc_credit]')) {
      if (debug)
        console.log(
          '[DEBUG] credit',
          'Credit button not found, proceeding to create one',
          {
            footerSelector
          }
        );

      // Wait for the footer element to be available in the DOM
      document
        .kmlcWaitForElement(footerSelector)
        .then((footerButtons) => {
          if (debug)
            console.log('[DEBUG] credit', 'Footer buttons element found', {
              footerButtons
            });

          // Create a new list item for the credit button
          const creditButton = document.createElement('LI');
          creditButton.setAttribute('kmlc_credit', 'true');

          // Append the credit button to the footer buttons
          footerButtons.appendChild(creditButton);
          if (debug)
            console.log('[DEBUG] credit', 'Credit button appended to footer', {
              creditButton
            });

          // Set the HTML content for the credit button
          document.querySelector('[kmlc_credit]').outerHTML = `
          <li kmlc_credit="true" class="list-inline-item" style="display: inline-block; margin: 15px 0; padding: 5px; background: #e2e7ed; border-radius: 3px; background-size: 10px;">
            <a href="${buttonLink}" target="_blank" rel="noopener noreferrer" style="color: #000">${buttonText}</a>
          </li>`;
          if (debug)
            console.log('[DEBUG] credit', 'Credit button HTML set', {
              buttonText,
              buttonLink
            });
        })
        .catch((error) => {
          console.error('[ERROR] credit', 'Failed to find footer buttons element', {
            footerSelector,
            error
          });
        });
    } else {
      if (debug)
        console.log('[DEBUG] credit', 'Credit button already exists, no action taken');
    }
  }

  // Export the credit function as a module
  exports({credit}).to('./features/Design/credit.js');
})();
