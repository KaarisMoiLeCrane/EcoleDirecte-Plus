(() => {
  // Importing the required modules
  const EcoleDirecte = imports('EcoleDirecte').from('./vendor/ecoledirecte.js');
  const homeworkStatus = imports('homeworkStatus').from(
    './src/CahierDeTexte/homework-status.js'
  );
  const homeworkRefresh = imports('homeworkRefresh').from(
    './src/CahierDeTexte/homework-refresh.js'
  );

  /**
   * Main function to initialize the EcoleDirecte account and handle homework data.
   * @param {string} id - The ID of the user.
   * @param {string} token - The authentication token.
   */
  function main(id, token) {
    if (debug)
      console.log('[DEBUG]', 'main', 'Initializing EcoleDirecte account.', {id, token});

    const account = new EcoleDirecte(id, token);

    // Retrieve all homeworks and process them
    const homeworksData = account.getHomeworks();
    if (debug) console.log('[DEBUG]', 'main', 'Homeworks data retrieved.', homeworksData);

    // Update homework status and refresh the homework view
    homeworkStatus(homeworksData);
    homeworkRefresh(homeworksData);

    // Wait for the "À venir" button in the bottom right and set up a click listener
    waitForAvenirButton(homeworksData);
  }

  /**
   * Waits for the "À venir" button to appear and sets up a click listener.
   * @param {Object} homeworksData - The data of the homeworks.
   */
  function waitForAvenirButton(homeworksData) {
    if (debug)
      console.log('[DEBUG]', 'waitForAvenirButton', 'Waiting for "À venir" button.');

    document.kmlcWaitForElement('ed-cdt-eleve-onglets').then((divOnglets) => {
      divOnglets
        .kmlcWaitForElement("[class *= 'secondary'] > button")
        .then((buttonAVenir) => {
          if (buttonAVenir.getAttribute('kmlc-click-listener') !== 'true') {
            buttonAVenir.setAttribute('kmlc-click-listener', 'true');
            buttonAVenir.onclick = function () {
              if (debug)
                console.log(
                  '[DEBUG]',
                  'waitForAvenirButton',
                  '"À venir" button clicked.',
                  homeworksData
                );
              homeworkStatus(homeworksData);
            };
            if (debug)
              console.log(
                '[DEBUG]',
                'waitForAvenirButton',
                'Click listener added to "À venir" button.',
                buttonAVenir
              );
          }
        });
    });
  }

  exports({main}).to('./src/cahierdetexte.js');
})();
