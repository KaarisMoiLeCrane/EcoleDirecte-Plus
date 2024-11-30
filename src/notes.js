(() => {
  const EcoleDirecte = imports('EcoleDirecte').from('./vendor/ecoledirecte.js');

  const rank = imports('rank').from('./src/Notes/rank.js');
  const coefficient = imports('coefficient').from('./src/Notes/coefficient.js');
  const addGradeId = imports('addGradeId').from('./src/Notes/add-grade-id.js');

  const calculateMeans = imports('calculateMeans').from(
    './src/Notes/functions/calculate-means.js'
  );

  const charts = imports('charts').from('./src/Notes/charts.js');

  const meanVariationValue = imports('meanVariationValue').from(
    './src/Notes/mean-variation-value.js'
  );

  const editGradeSimulation = imports('editGradeSimulation').from(
    './src/Notes/edit-grade-simulation.js'
  );
  const addGradeSimulation = imports('addGradeSimulation').from(
    './src/Notes/add-grade-simulation.js'
  );

  const goalSetup = imports('goalSetup').from('./src/Notes/goal.js');

  /**
   * Main function to set up the notes management.
   * @param {string} id - The ID of the user.
   * @param {string} token - The authentication token.
   */
  function main(id, token) {
    if (debug)
      console.log('[DEBUG]', 'main', 'Initializing notes management.', {id, token});

    const account = new EcoleDirecte(id, token);

    // Fetch all grades data and set up the environment
    const gradesData = account.getAllGrades();
    if (debug) console.log('[DEBUG]', 'main', 'Fetched all grades data.', gradesData);

    const globalQuotient = parseFloat(gradesData.parametrage?.moyenneSur);

    if (!globalQuotient) return

    const dataPeriodes = gradesData.periodes;

    exports({dataPeriodes}).to('./src/notes.js');

    document.kmlcWaitForElement("[class *= 'tab-content']").then((elm) => {
      let periode = getCurrentActivePeriod();
      setPeriodesInfos(dataPeriodes);

      executeModules(gradesData, globalQuotient, periode, id);
    });

    setupMutationObserver(gradesData, globalQuotient, id);
  }

  /**
   * Retrieves the current active period index.
   * @returns {number} The index of the current active period.
   */
  function getCurrentActivePeriod() {
    let periode = document.querySelector('#onglets-periodes > ul > li.active.nav-item');
    return Array.from(periode.parentNode.children).indexOf(periode);
  }

  /**
   * Executes the various modules related to notes management.
   * @param {object} gradesData - The grades data.
   * @param {number} globalQuotient - The global quotient for calculations.
   * @param {number} periode - The current active period index.
   * @param {string} id - The ID of the user.
   */
  function executeModules(gradesData, globalQuotient, periode, id) {
    if (debug)
      console.log('[DEBUG]', 'executeModules', 'Executing modules.', {
        gradesData,
        globalQuotient,
        periode,
        id
      });

    rank(gradesData);
    coefficient(gradesData);
    addGradeId(gradesData);

    calculateMeans(
      1,
      globalQuotient,
      true,
      'kmlc-moyenne-g',
      '',
      'kmlc-moyenne',
      '',
      true,
      ":not([class *= 'simu'])"
    );

    charts(gradesData, globalQuotient);

    addGradeSimulation(id, globalQuotient);
    editGradeSimulation(id, globalQuotient);

    goalSetup(id);

    meanVariationValue(periode, gradesData);
  }

  /**
   * Sets up the mutation observer to handle dynamic changes in the notes.
   * @param {object} gradesData - The grades data.
   * @param {number} globalQuotient - The global quotient for calculations.
   * @param {string} id - The ID of the user.
   */
  function setupMutationObserver(gradesData, globalQuotient, id) {
    const notesObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        try {
          if (
            mutation.target.children[0]?.innerText == 'Evaluations' &&
            mutation.target.children[0].nodeName == 'SPAN'
          ) {
            if (debug)
              console.log(
                '[DEBUG]',
                'setupMutationObserver',
                'Detected Evaluations change.',
                mutation
              );

            let periode = getCurrentActivePeriod();
            setPeriodesInfos(gradesData.periodes);

            executeModules(gradesData, globalQuotient, periode, id);
          }
        } catch (e) {
          if (debug)
            console.log(
              '[DEBUG]',
              'setupMutationObserver',
              'Error during mutation handling.',
              e
            );
        }
      });
    });

    executeNotesObserver(notesObserver);
  }

  /**
   * Executes the notes observer to monitor changes in the notes table.
   * @param {MutationObserver} observer - The mutation observer instance.
   */
  function executeNotesObserver(observer) {
    document.kmlcWaitForElement('.eleve-note').then((elm) => {
      observer.observe(elm, {
        characterData: false,
        attributes: true,
        attributeFilter: ['class'],
        childList: true,
        subtree: true
      });
      if (debug)
        console.log(
          '[DEBUG]',
          'executeNotesObserver',
          'Observer set up on .eleve-note.',
          elm
        );
    });
  }

  /**
   * Sets period information attributes to the period elements.
   * @param {object[]} periodes - Array of period data objects.
   */
  function setPeriodesInfos(periodes) {
    let elmPeriodes = document.querySelectorAll(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link']"
    );

    elmPeriodes.forEach((elmPeriode, i) => {
      if (elmPeriode.getAttribute('dateDebut')) return;

      periodes.forEach((periode, index) => {
        if (periode.periode == elmPeriode.textContent) {
          let dateDebut = periode.dateDebut.kmlcConvertToTimestamp();
          let dateFin = periode.dateFin.kmlcConvertToTimestamp();

          elmPeriode.setAttribute('dateDebut', dateDebut);
          elmPeriode.setAttribute('dateFin', dateFin);
          elmPeriode.setAttribute('codePeriode', periode.codePeriode);
          elmPeriode.setAttribute('islast', 'false');

          if (periode.codePeriode.includes('R')) {
            elmPeriode.setAttribute('R', 'true');
            elmPeriode.setAttribute('X', 'false');
            elmPeriode.setAttribute('Z', 'false');
          } else if (periode.codePeriode.replace(/[0-9]/g, '').length > 1) {
            elmPeriode.setAttribute('R', 'false');
            elmPeriode.setAttribute('X', 'true');
            elmPeriode.setAttribute('Z', 'false');
          } else {
            elmPeriode.setAttribute('R', 'false');
            elmPeriode.setAttribute('X', 'false');
            elmPeriode.setAttribute('Z', 'false');
          }

          if (periode.codePeriode.includes('Z')) {
            elmPeriode.setAttribute('R', 'false');
            elmPeriode.setAttribute('X', 'false');
            elmPeriode.setAttribute('Z', 'true');
            elmPeriode.setAttribute('islast', 'true');
          }

          if (!periode.codePeriode.includes('R') && periodes[index + 1]) {
            if (
              dateDebut == periodes[index + 1].dateDebut.kmlcConvertToTimestamp() &&
              dateFin == periodes[index + 1].dateFin.kmlcConvertToTimestamp()
            ) {
              elmPeriode.setAttribute('islast', 'true');
            }
          }
        }
      });
    });
  }

  exports({main}).to('./src/notes.js');
})();
