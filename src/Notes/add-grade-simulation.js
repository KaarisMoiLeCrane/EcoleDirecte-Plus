(() => {
  const initPopup = imports('initPopup').from('./utils/utils.js');
  const getData = imports('getData').from('./utils/utils.js');
  const setData = imports('setData').from('./utils/utils.js');
  const initUserGradeSimulation = imports('initUserGradeSimulation').from(
    './utils/utils.js'
  );
<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/add-grade-simulation.js
  const addGrade = imports('addGrade').from('./features/Notes/functions/add-grade.js');
  const calculateMeans = imports('calculateMeans').from(
    './features/Notes/functions/calculate-means.js'
=======
  const addGrade = imports('addGrade').from('./src/Notes/functions/add-grade.js');
  const calculateMeans = imports('calculateMeans').from(
    './src/Notes/functions/calculate-means.js'
>>>>>>> features:src/Notes/add-grade-simulation.js
=======
  const addGrade = imports('addGrade').from('./src/Notes/functions/add-grade.js');
  const calculateMeans = imports('calculateMeans').from(
    './src/Notes/functions/calculate-means.js'
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
  );

  /**
   * Adds simulation notes for a user and reloads the note simulation.
   * @param {string} userId - The ID of the user.
   * @param {number} globalQuotient - The global quotient value.
   */
  function addGradeSimulation(userId, globalQuotient) {
    const buttonSelector = 'ul.nav-pills > li.active';
    checkAndAddGradeSimulationText();
    addButtonIfNotExists(buttonSelector, userId, globalQuotient);
    reloadNoteSimulation(userId, globalQuotient);
  }

  /**
   * Checks if the simulation note text exists and adds it if not.
   */
  function checkAndAddGradeSimulationText() {
    if (
      !document.querySelector('[kmlc-legend-grade-text]') &&
<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/add-grade-simulation.js
      document.querySelector('table caption')
    ) {
      const legendGradeSimulationElement = createLegendGradeSimulationElement();
      document
        .querySelector('table caption')
=======
      document.querySelector('[class *= bloc][class *= bloc-legende]')
    ) {
      const legendGradeSimulationElement = createLegendGradeSimulationElement();
      document
        .querySelector('[class *= bloc][class *= bloc-legende]')
>>>>>>> features:src/Notes/add-grade-simulation.js
=======
      document.querySelector('[class *= bloc][class *= bloc-legende]')
    ) {
      const legendGradeSimulationElement = createLegendGradeSimulationElement();
      document
        .querySelector('[class *= bloc][class *= bloc-legende]')
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
        .parentElement.kmlcGetElementsByContentText('(note)')
        .startsWith[0].kmlcInsertAfter(legendGradeSimulationElement);
      if (debug)
        console.log(
          '[DEBUG]',
          'checkAndAddGradeSimulationText',
          'Legend text added for simulation note',
          {
            element: legendGradeSimulationElement
          }
        );
    }
  }

  /**
   * Creates a legend element for grade simulation.
   * @returns {HTMLElement} The created legend element.
   */
  function createLegendGradeSimulationElement() {
    const legendElement = document
<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/add-grade-simulation.js
      .querySelector('table caption')
=======
      .querySelector('[class *= bloc-legende]')
>>>>>>> features:src/Notes/add-grade-simulation.js
=======
      .querySelector('[class *= bloc-legende]')
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
      .parentElement.kmlcGetElementsByContentText('(note)')
      .startsWith[0].cloneNode(true);
    legendElement.setAttribute('kmlc-legend-grade-text', 'true');
    legendElement.children[0].textContent = 'note';
    legendElement.children[0].setAttribute('style', 'color: green;');
    legendElement.children[1].textContent = 'Note ajoutée pour simulation';
    return legendElement;
  }

  /**
   * Adds a button for adding a grade if it does not already exist.
   * @param {string} buttonSelector - The CSS selector for the button.
   * @param {string} userId - The ID of the user.
   * @param {number} globalQuotient - The global quotient value.
   */
  function addButtonIfNotExists(buttonSelector, userId, globalQuotient) {
    if (!document.querySelector('[kmlc-grade-button]')) {
      const activeButton = document.querySelector(buttonSelector);
      const popupID = 'kmlc-gradeSimulation-popup';
      const blurID = 'kmlc-gradeSimulation-blur';
      let popup = document.querySelector('#' + popupID);
      let blur = document.querySelector('#' + blurID);

      if (popup) {
        popup.remove();
        blur.remove();
      }

      const buttonAddGrade = createAddGradeButton(activeButton);
      buttonAddGrade.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        popup = document.querySelector('#' + popupID);
        blur = document.querySelector('#' + blurID);

        if (!popup) {
          const popupDatas = initPopup(popupID, blurID);
          popup = popupDatas[0];
          blur = popupDatas[1];

          await changePopupInnerHTML(userId, popup, blur, globalQuotient);
          addPopupEventListeners(popup, blur);
        }

        popup.setAttribute('style', 'width: 80%; height: 80%;');
        blur.setAttribute('style', '');
        if (debug)
          console.log('[DEBUG]', 'addButtonIfNotExists', 'Popup opened', {
            userId,
            popup,
            blur
          });
      });

      activeButton.parentElement.insertBefore(buttonAddGrade, activeButton);
      if (debug)
        console.log('[DEBUG]', 'addButtonIfNotExists', 'Add grade button added', {
          buttonAddGrade
        });
    }
  }

  /**
   * Creates a button for adding a grade.
   * @param {HTMLElement} activeButton - The currently active button element.
   * @returns {HTMLElement} The created add grade button.
   */
  function createAddGradeButton(activeButton) {
    const buttonAddGrade = activeButton.cloneNode(true);
    buttonAddGrade.className = buttonAddGrade.className.replace('active', '');
    buttonAddGrade.setAttribute('kmlc-grade-button', 'true');
    buttonAddGrade.children[0].removeAttribute('href');
    buttonAddGrade.children[0].children[0].textContent = 'Ajouter une note';
    return buttonAddGrade;
  }

  /**
   * Adds event listeners to the popup and blur elements.
   * @param {HTMLElement} popup - The popup element.
   * @param {HTMLElement} blur - The blur element.
   */
  function addPopupEventListeners(popup, blur) {
    blur.addEventListener('click', function (event) {
      if (event.target.classList.contains('kmlc-blur')) {
<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/add-grade-simulation.js
        closePopup(popup, blur);
=======
        closePopup();
>>>>>>> features:src/Notes/add-grade-simulation.js
=======
        closePopup();
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
      }
    });

    const gradeSimulationInputs = document.querySelectorAll(
      '[id *= kmlc-grade-simulation-input]:not([id *= title])'
    );
    gradeSimulationInputs.forEach(function (input) {
      input.addEventListener('keypress', function (event) {
        const charCode = event.which ? event.which : event.keyCode;
        if (
          (charCode !== 8 && charCode !== 44 && charCode !== 46 && charCode < 48) ||
          charCode > 57
        ) {
          event.preventDefault();
        }
      });
    });

    popup.addEventListener('animationend', function (event) {
      if (event.animationName === 'kmlc-popupCloseAnimation') {
<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/add-grade-simulation.js
        popup.style.display = 'none';
        blur.style.display = 'none';
=======
        popup.style.setProperty('display', 'none');
        blur.style.setProperty('display', 'none');
>>>>>>> features:src/Notes/add-grade-simulation.js
=======
        popup.style.setProperty('display', 'none');
        blur.style.setProperty('display', 'none');
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
        popup.classList.remove('kmlc-popup-close');
        blur.classList.remove('kmlc-blur-close');
      }
    });
    if (debug)
      console.log(
        '[DEBUG]',
        'addPopupEventListeners',
        'Event listeners added to popup and blur',
        {popup, blur}
      );
<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/add-grade-simulation.js
  }

  /**
   * Closes the popup and blur elements.
   * @param {HTMLElement} popup - The popup element.
   * @param {HTMLElement} blur - The blur element.
   */
  function closePopup(popup, blur) {
    popup.classList.add('kmlc-popup-close');
    blur.classList.add('kmlc-blur-close');
    if (debug)
      console.log('[DEBUG]', 'closePopup', 'Popup and blur closing', {popup, blur});
=======

=======

>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
    function closePopup() {
      popup.classList.add('kmlc-popup-close');
      blur.classList.add('kmlc-blur-close');
      if (debug)
        console.log('[DEBUG]', 'closePopup', 'Popup and blur closing', {popup, blur});
    }
<<<<<<< HEAD
>>>>>>> features:src/Notes/add-grade-simulation.js
=======
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
  }

  /**
   * Changes the inner HTML of the popup and sets up event listeners.
   * @param {string} userId - The ID of the user.
   * @param {HTMLElement} popup - The popup element.
   * @param {HTMLElement} blur - The blur background element.
   * @param {number} globalQuotient - The global quotient value.
   */
  async function changePopupInnerHTML(userId, popup, blur, globalQuotient) {
    // Initialize user simulation note
    await initUserGradeSimulation(userId);
    const gradeSimulation = await getData('gradeSimulation');
    if (debug)
      console.log('[DEBUG]', 'changePopupInnerHTML', 'Fetched simulation note data', {
        gradeSimulation
      });

<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/add-grade-simulation.js
    const subjectNames = document.querySelectorAll("[class *= 'nommatiere'] > b");
=======
    const subjectNames = document.querySelectorAll(
      "[class *= 'nommatiere'] > [class *= text-bold]"
    );
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
=======
    const subjectNames = document.querySelectorAll(
      "[class *= 'nommatiere'] > [class *= text-bold]"
    );
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class*='nav-link'][class*='active']"
>>>>>>> features:src/Notes/add-grade-simulation.js
    );
    if (debug)
      console.log(
        '[DEBUG]',
        'changePopupInnerHTML',
        'Found subject names and active period',
        {
          subjectNames,
          actualPeriodeElement
        }
      );

    let popupHTML = `
  <h2>Ajouter des Notes pour Simulation</h2>
  <ul class="kmlc-list">
  `;

    for (let i = 0; i < subjectNames.length; i++) {
      const subjectName = subjectNames[i].textContent;
      const subjectNameSerialized = serializeSubjectName(subjectName);

      const userContent = gradeSimulation.find((item) => item?.id === userId);
      let {
        addedSubjectGradeTitle,
        addedSubjectGradeValue,
        addedSubjectGradeCoefficient,
        addedSubjectGradeQuotient
      } = getAddedSubjectGrades(userContent, actualPeriodeElement, subjectName);

      popupHTML += generateSubjectGradeHTML(
        subjectName,
        subjectNameSerialized,
        addedSubjectGradeTitle,
        addedSubjectGradeValue,
        addedSubjectGradeCoefficient,
        addedSubjectGradeQuotient
      );
    }

    popupHTML += generatePopupFooterHTML();
    popup.innerHTML = popupHTML;

    setupPopupEventListeners(popup, blur, userId, globalQuotient);
  }

  /**
   * Serializes the subject name to a valid HTML ID format.
   * @param {string} subjectName - The name of the subject.
   * @returns {string} - The serialized subject name.
   */
  function serializeSubjectName(subjectName) {
    return subjectName.replaceAll(/[^a-zA-Z0-9 ]/g, '').replaceAll(' ', '_');
  }

  /**
   * Retrieves the added subject grades for a user within the active period.
   * @param {Object} userContent - The user content object.
   * @param {HTMLElement} actualPeriodeElement - The active period element.
   * @param {string} subjectName - The name of the subject.
   * @returns {Object} - The grades and other details.
   */
  function getAddedSubjectGrades(userContent, actualPeriodeElement, subjectName) {
    let addedSubjectGradeTitle = '';
    let addedSubjectGradeValue = '';
    let addedSubjectGradeCoefficient = '';
    let addedSubjectGradeQuotient = '';

    if (userContent?.periodes) {
      for (let j = 0; j < userContent.periodes.length; j++) {
        const userContentPeriode = userContent.periodes[j];
        const addedSubjectGrades = userContentPeriode.notes?.ajouter?.[subjectName];

        if (addedSubjectGrades) {
          const periodStart = Number(actualPeriodeElement.getAttribute('dateDebut'));
          const periodEnd = Number(actualPeriodeElement.getAttribute('dateFin'));

          if (
            periodStart <= userContentPeriode.dateDebut &&
            userContentPeriode.dateFin <= periodEnd
          ) {
            const lastAddedGrade = addedSubjectGrades[addedSubjectGrades.length - 1];
            addedSubjectGradeTitle = lastAddedGrade.titre;
            addedSubjectGradeValue = lastAddedGrade.note;
            addedSubjectGradeCoefficient = lastAddedGrade.coeff;
            addedSubjectGradeQuotient = lastAddedGrade.quotient;

            break;
          }
        }
      }
    }

    return {
      addedSubjectGradeTitle,
      addedSubjectGradeValue,
      addedSubjectGradeCoefficient,
      addedSubjectGradeQuotient
    };
  }

  /**
   * Generates the HTML for a subject grade input section.
   * @param {string} subjectName - The name of the subject.
   * @param {string} subjectNameSerialized - The serialized subject name.
   * @param {string} gradeTitle - The title of the grade.
   * @param {string} gradeValue - The value of the grade.
   * @param {string} gradeCoefficient - The coefficient of the grade.
   * @param {string} gradeQuotient - The quotient of the grade.
   * @returns {string} - The generated HTML string.
   */
  function generateSubjectGradeHTML(
    subjectName,
    subjectNameSerialized,
    gradeTitle,
    gradeValue,
    gradeCoefficient,
    gradeQuotient
  ) {
    return `
  <ul class="kmlc-list">
      <li class="kmlc-item">
          <label class="kmlc-label">${subjectName}</label>
      </li>
      <li class="kmlc-item">
          <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-title-${subjectNameSerialized}" placeholder="Entrez le titre de la note" value="${gradeTitle}">
          <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-grade-${subjectNameSerialized}" placeholder="Entrez la valeur de la note" value="${gradeValue}">
      </li>
      <li class="kmlc-item">
          <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-coeff-${subjectNameSerialized}" placeholder="Entrez le coefficient de la note" value="${gradeCoefficient}">
          <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-quotient-${subjectNameSerialized}" placeholder="Entrez le quotient de la note" value="${gradeQuotient}">
      </li>
      <input type="checkbox" class="kmlc-checkbox" id="kmlc-grade-simulation-button-save-${subjectNameSerialized}">
      <label for="kmlc-grade-simulation-button-save-${subjectNameSerialized}" class="kmlc-checkbox-label">Sauvegarder</label>
      <li class="kmlc-item">
          <button id="kmlc-add-grade-simulation-button-${subjectNameSerialized}" class="kmlc-add-button" subject="${subjectName}">Ajouter la note</button>
      </li>
  </ul>
  `;
  }

  /**
   * Generates the footer HTML for the popup.
   * @returns {string} - The generated HTML string.
   */
  function generatePopupFooterHTML() {
    return `
  </ul>
  <div class="kmlc-button-container">
      <button id="kmlc-remove-grade-simulation-button" class="kmlc-remove-button">Supprimer les notes ajoutées</button>
      <button id="kmlc-add-grade-simulation-button" class="kmlc-add-button">Valider les notes ajoutées</button>
  </div>
  `;
  }

  /**
   * Sets up event listeners for the popup elements.
   * @param {HTMLElement} popup - The popup element.
   * @param {HTMLElement} blur - The blur background element.
   * @param {string} userId - The ID of the user.
   * @param {number} globalQuotient - The global quotient value.
   */
  function setupPopupEventListeners(popup, blur, userId, globalQuotient) {
    // Event listener for removing grades
    popup
      .querySelector('#kmlc-remove-grade-simulation-button')
      .addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();
        await handleRemoveGrades(userId, popup, blur, globalQuotient);
      });

    // Event listener for adding grades
    popup
      .querySelector('#kmlc-add-grade-simulation-button')
      .addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        handleAddGrades(globalQuotient, blur);
      });

    // Event listeners for individual grade addition buttons
    const addGradeButtons = popup.querySelectorAll(
      '[id *= kmlc-add-grade-simulation-button-]'
    );
    addGradeButtons.forEach((button) => {
      button.addEventListener('click', async function (e) {
        await handleIndividualGradeAddition(this, globalQuotient, userId);
      });
    });
  }

  /**
   * Handles the removal of grades.
   * @param {string} userId - The ID of the user.
   * @param {HTMLElement} popup - The popup element.
   * @param {HTMLElement} blur - The blur background element.
   * @param {number} globalQuotient - The global quotient value.
   */
  async function handleRemoveGrades(userId, popup, blur, globalQuotient) {
    const inputBoxes = popup.querySelectorAll('input');
    inputBoxes.forEach((input) => (input.value = ''));

    await initUserGradeSimulation(userId);
    const gradeSimulation = await getData('gradeSimulation');

    const userContent = gradeSimulation.find((item) => item?.id === userId);
    const index = gradeSimulation.indexOf(userContent);

    const newUserContent = {id: userId, periodes: []};
    if (!gradeSimulation[index]) gradeSimulation.push(newUserContent);
    else gradeSimulation[index] = newUserContent;

    await setData('gradeSimulation', gradeSimulation);
    await initUserGradeSimulation(userId);
    await changePopupInnerHTML(userId, popup, blur, globalQuotient);

    const allSimulationElements = Array.from(document.querySelectorAll('*')).filter(
      (element) => {
        const attributes = Array.from(element.attributes);
        return attributes.some((attr) => attr.name.includes('kmlc-simu'));
      }
    );
    allSimulationElements.forEach((element) => element.remove());

    const allSimulationGradeElements = Array.from(document.querySelectorAll('*')).filter(
      (element) => {
        const attributes = Array.from(element.attributes);
        return attributes.some((attr) => attr.name.includes('kmlc-simulation-grades'));
      }
    );
    allSimulationGradeElements.forEach((element) => element.remove());
  }

  /**
   * Handles the addition of grades and calculates means.
   * @param {number} globalQuotient - The global quotient value.
   * @param {HTMLElement} blur - The blur background element.
   */
  function handleAddGrades(globalQuotient, blur) {
    blur.click();
    calculateMeans(
      3,
      globalQuotient,
      true,
      'kmlc-simulation-global-mean',
      'color: green;',
      'kmlc-simulation-means',
      'color: green;',
      true
    );
    calculateMeans(
      4,
      globalQuotient,
      true,
      'kmlc-simulation-edited-global-mean',
      'border-bottom: 1px solid green; color: green;',
      'kmlc-simulation-edited-means',
      'border-bottom: 1px solid green; color: green;'
    );
  }

  /**
   * Handles the addition of an individual grade.
   * @param {HTMLElement} button - The button element that triggered the event.
   * @param {number} globalQuotient - The global quotient value.
   * @param {string} userId - The ID of the user.
   */
  async function handleIndividualGradeAddition(button, globalQuotient, userId) {
    const subjectName = button.getAttribute('subject');
    const subjectNameSerialized = serializeSubjectName(subjectName);

    const gradeTitleElement = button.parentElement.parentElement.querySelector(
      `#kmlc-grade-simulation-input-title-${subjectNameSerialized}`
    );
    const gradeValueElement = button.parentElement.parentElement.querySelector(
      `#kmlc-grade-simulation-input-grade-${subjectNameSerialized}`
    );
    const gradeCoefficientElement = button.parentElement.parentElement.querySelector(
      `#kmlc-grade-simulation-input-coeff-${subjectNameSerialized}`
    );
    const gradeQuotientElement = button.parentElement.parentElement.querySelector(
      `#kmlc-grade-simulation-input-quotient-${subjectNameSerialized}`
    );
    const saveGradeElement = button.parentElement.parentElement.querySelector(
      `#kmlc-grade-simulation-button-save-${subjectNameSerialized}`
    );

    let gradeTitle = gradeTitleElement.value;
    let gradeValue = gradeValueElement.value
      .replace(/[()\/\s]/g, '')
      .replace(',', '.')
      .replace(/[^\d+\-*/.\s]/g, '');
    let gradeCoefficient = gradeCoefficientElement.value
      .replace(/[()\/\s]/g, '')
      .replace(',', '.')
      .replace(/[^\d+\-*/.\s]/g, '');
    let gradeQuotient = gradeQuotientElement.value
      .replace(/[()\/\s]/g, '')
      .replace(',', '.')
      .replace(/[^\d+\-*/.\s]/g, '');
    let saveGrade = saveGradeElement.checked;

    if (gradeValue !== '') {
      if (gradeTitle === '') gradeTitle = 'Évaluation';
      if (gradeCoefficient === '') gradeCoefficient = '1';
      if (gradeQuotient === '') gradeQuotient = globalQuotient;

      const dateNow = Date.now();

      await applyGradeSimulationGoal(
        subjectName,
        gradeTitle,
        gradeValue,
        gradeCoefficient,
        gradeQuotient,
        globalQuotient,
        dateNow,
        userId,
        saveGrade
      );

      const inputBoxes = button.parentElement.parentElement.querySelectorAll('input');
      inputBoxes.forEach((input) => (input.value = ''));
    }
  }

  /**
   * Applies the grade simulation goal and optionally saves it.
   * @param {string} subjectName - The name of the subject.
   * @param {string} gradeTitle - The title of the grade.
   * @param {number} gradeValue - The value of the grade.
   * @param {number} gradeCoefficient - The coefficient of the grade.
   * @param {number} gradeQuotient - The quotient of the grade.
   * @param {number} globalQuotient - The global quotient value.
   * @param {number} gradeId - The ID of the grade.
   * @param {string} userId - The ID of the user.
   * @param {boolean} saveGrade - Whether to save the grade.
   */
  async function applyGradeSimulationGoal(
    subjectName,
    gradeTitle,
    gradeValue,
    gradeCoefficient,
    gradeQuotient,
    globalQuotient,
    gradeId,
    userId,
    saveGrade
  ) {
    // Add the grade for simulation
    addGrade(
      userId,
      subjectName,
      gradeTitle,
      gradeValue,
      gradeCoefficient,
      gradeQuotient,
      globalQuotient,
      gradeId,
      saveGrade,
      false // Do not calculate global mean here
    );

    if (!saveGrade) return;

    // Initialize and fetch user simulation note
    await initUserGradeSimulation(userId);
    const gradeSimulation = await getData('gradeSimulation');
    const userContent = gradeSimulation.find((item) => item?.id === userId);
    const index = gradeSimulation.indexOf(userContent);
    const actualPeriodeElement = document.querySelector(
<<<<<<< HEAD:features/Notes/add-grade-simulation.js
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
=======
      "ul[class *= 'tabs'] > li > [class*='nav-link'][class*='active']"
>>>>>>> features:src/Notes/add-grade-simulation.js
    );

    if (debug)
      console.log(
        '[DEBUG]',
        'applyGradeSimulationGoal',
        'Fetched user content and simulation note',
        {
          userContent,
          gradeSimulation
        }
      );

    let skip = true;

    // Iterate over user's periods to find and update the relevant period
    for (let j = 0; j < userContent.periodes.length; j++) {
      const userContentPeriode = userContent.periodes[j];
      const periodStart = Number(actualPeriodeElement.getAttribute('dateDebut'));
      const periodEnd = Number(actualPeriodeElement.getAttribute('dateFin'));

      if (
        periodStart <= userContentPeriode.dateDebut &&
        userContentPeriode.dateFin <= periodEnd
      ) {
        if (userContentPeriode.notes.ajouter[subjectName]) {
          userContentPeriode.notes.ajouter[subjectName].push({
            titre: gradeTitle,
            note: gradeValue,
            coeff: gradeCoefficient,
            quotient: gradeQuotient,
            id: gradeId
          });
          skip = false;
        }

        if (skip) {
          userContentPeriode.notes.ajouter[subjectName] = [
            {
              titre: gradeTitle,
              note: gradeValue,
              coeff: gradeCoefficient,
              quotient: gradeQuotient,
              id: gradeId
            }
          ];
        }
      }
    }

    // Update and save simulation note
    gradeSimulation[index] = userContent;
    if (debug)
      console.log(
        '[DEBUG]',
        'applyGradeSimulationGoal',
        'Updated user content in simulation note',
        {userContent}
      );

    await setData('gradeSimulation', gradeSimulation);
  }

  /**
   * Reloads the note simulation for the user.
   * @param {string} userId - The ID of the user.
   * @param {number} globalQuotient - The global quotient value.
   */
  async function reloadNoteSimulation(userId, globalQuotient) {
    // Initialize and fetch user simulation note
    await initUserGradeSimulation(userId);
    const gradeSimulation = await getData('gradeSimulation');
    const userContent = gradeSimulation.find((item) => item?.id === userId);

<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/add-grade-simulation.js
    const subjectNames = document.querySelectorAll("[class *= 'nommatiere'] > b");
=======
    const subjectNames = document.querySelectorAll(
      "[class *= 'nommatiere'] > [class *= text-bold]"
    );
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
=======
    const subjectNames = document.querySelectorAll(
      "[class *= 'nommatiere'] > [class *= text-bold]"
    );
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class*='nav-link'][class*='active']"
>>>>>>> features:src/Notes/add-grade-simulation.js
    );
    const addedGradesListDatas = [];

    if (debug)
      console.log(
        '[DEBUG]',
        'reloadNoteSimulation',
        'Fetched user content and subject names',
        {
          userContent,
          subjectNames
        }
      );

    // Collect added grades data for the current period
    for (let i = 0; i < subjectNames.length; i++) {
      const subjectName = subjectNames[i].textContent;

      if (userContent.periodes) {
        for (let j = 0; j < userContent.periodes.length; j++) {
          const periodStart = Number(actualPeriodeElement.getAttribute('dateDebut'));
          const periodEnd = Number(actualPeriodeElement.getAttribute('dateFin'));
          const userContentPeriode = userContent.periodes[j];

          if (
            periodStart <= userContentPeriode.dateDebut &&
            userContentPeriode.dateFin <= periodEnd
          ) {
            const subjectGrades = userContentPeriode.notes.ajouter[subjectName];
            if (!subjectGrades) break;

            for (let k = 0; k < subjectGrades.length; k++) {
              const subjectGrade = subjectGrades[k];
              addedGradesListDatas.push({
                subjectName: subjectName,
                title: subjectGrade.titre,
                value: subjectGrade.note,
                coefficient: subjectGrade.coeff,
                quotient: subjectGrade.quotient,
                id: subjectGrade.id,
                save: true
              });
            }
          }
        }
      }
    }

    if (debug)
      console.log('[DEBUG]', 'reloadNoteSimulation', 'Collected added grades list data', {
        addedGradesListDatas
      });

    // Add collected grades and optionally calculate global mean
    for (let i = 0; i < addedGradesListDatas.length; i++) {
      let calculateGlobalMean = i === addedGradesListDatas.length - 1;
      addGrade(
        userId,
        addedGradesListDatas[i].subjectName,
        addedGradesListDatas[i].title,
        addedGradesListDatas[i].value,
        addedGradesListDatas[i].coefficient,
        addedGradesListDatas[i].quotient,
        globalQuotient,
        addedGradesListDatas[i].id,
        addedGradesListDatas[i].save,
        calculateGlobalMean
      );
    }
  }

<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/add-grade-simulation.js
  exports({addGradeSimulation}).to('./features/Notes/add-grade-simulation.js');
=======
  exports({addGradeSimulation}).to('./src/Notes/add-grade-simulation.js');
>>>>>>> features:src/Notes/add-grade-simulation.js
=======
  exports({addGradeSimulation}).to('./src/Notes/add-grade-simulation.js');
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
})();
