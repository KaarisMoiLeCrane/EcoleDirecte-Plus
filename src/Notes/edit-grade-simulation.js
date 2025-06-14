(() => {
  // Import necessary modules from utils and functions
  const initPopup = imports('initPopup').from('./utils/utils.js');
  const getData = imports('getData').from('./utils/utils.js');
  const setData = imports('setData').from('./utils/utils.js');
  const initUserGradeSimulation = imports('initUserGradeSimulation').from(
    './utils/utils.js'
  );
  const calculateMeans = imports('calculateMeans').from(
<<<<<<< HEAD:features/Notes/edit-grade-simulation.js
    './features/Notes/functions/calculate-means.js'
  );
  const editGrade = imports('editGrade').from('./features/Notes/functions/edit-grade.js');
=======
    './src/Notes/functions/calculate-means.js'
  );
  const editGrade = imports('editGrade').from('./src/Notes/functions/edit-grade.js');
>>>>>>> features:src/Notes/edit-grade-simulation.js

  /**
   * Modifies the user simulation note by adding event listeners to grades and initializing popup.
   * @param {number} userId - The ID of the user.
   * @param {number} globalQuotient - The global quotient for the user.
   */
  function editGradeSimulation(userId, globalQuotient) {
    if (debug)
      console.log('[DEBUG] editGradeSimulation called', {userId, globalQuotient});

    // If the table caption does not have the edited grade legend, add it
    addEditedGradeLegend();

    // Get all grades that do not have the right-click listener
    const allNonListenedGrades = document.querySelectorAll(
      'span.valeur:not([kmlc-event-listener])'
    );
    if (debug)
      console.log('[DEBUG]', 'editGradeSimulation', 'Found non-listened grades', {
        count: allNonListenedGrades.length
      });

    // Add right-click listener to each grade
    allNonListenedGrades.forEach((gradeElement) => {
      if (debug)
        console.log(
          '[DEBUG]',
          'editGradeSimulation',
          'Adding event listener to grade element',
          {gradeElement}
        );
      gradeElement.setAttribute('kmlc-event-listener', 'true');
      gradeElement.addEventListener(
        'contextmenu',
        async function (e) {
          e.stopPropagation();
          e.preventDefault();

          const gradeModificationId = Date.now();
          const popupID = 'kmlc-modifierNote-popup';
          const blurID = 'kmlc-modifierNote-blur';

          let popup = document.querySelector(`#${popupID}`);
          let blur = document.querySelector(`#${blurID}`);

          if (!popup) {
            const popupDatas = initPopup(popupID, blurID);
            popup = popupDatas[0];
            blur = popupDatas[1];
          }

          const gradeId = gradeElement.parentElement.getAttribute('id') || false;

          await changePopupInnerHTML(
            userId,
            popup,
            blur,
            globalQuotient,
            gradeId,
            gradeElement
          );

          // Close the popup on blur click
          blur.addEventListener('click', function (event) {
            if (event.target.classList.contains('kmlc-blur')) {
              closePopup(popup, blur);
            }
          });

          restrictInputToNumbers();

          // Reset the popup after closing animation ends
          popup.addEventListener('animationend', function (event) {
            if (event.animationName === 'kmlc-popupCloseAnimation') {
              resetPopup(popup, blur);
            }
          });

          // Display popup
<<<<<<< HEAD:features/Notes/edit-grade-simulation.js
          popup.style.width = '80%';
          popup.style.height = '80%';
          blur.style.display = '';
          popup.style.display = '';
=======
          popup.style.setProperty('width', '80%');
          popup.style.setProperty('height', '80%');
          blur.style.setProperty('display', '');
          popup.style.setProperty('display', '');
>>>>>>> features:src/Notes/edit-grade-simulation.js
        },
        false
      );
    });
    reloadNoteSimulation(userId, globalQuotient);
  }

  /**
   * Adds the "Note modifiée" legend to the table caption.
   */
  function addEditedGradeLegend() {
<<<<<<< HEAD:features/Notes/edit-grade-simulation.js
    const tableCaptionTitleElement = document.querySelector('table caption');
=======
    const tableCaptionTitleElement = document.querySelector(
      '[class *= bloc][class *= bloc-legende]'
    );
>>>>>>> features:src/Notes/edit-grade-simulation.js
    if (
      !document.querySelector('[kmlc-legend-edited-grade]') &&
      tableCaptionTitleElement
    ) {
      const tableCaptionElement = tableCaptionTitleElement.parentElement;
      const tableCaptionItemElement = tableCaptionElement
        .kmlcGetElementsByContentText('(note)')
        .startsWith[0].cloneNode(true);
      tableCaptionItemElement.setAttribute('kmlc-legend-edited-grade', 'true');
      tableCaptionItemElement.children[0].textContent = '';
      tableCaptionItemElement.children[0].setAttribute('style', '');
      tableCaptionItemElement.children[1].textContent = 'Note modifiée';
      tableCaptionItemElement.setAttribute('kmlc-legend-edited-grade', 'true');

      const tableCaptionTextElement = document.createElement('SPAN');
      tableCaptionTextElement.textContent = 'note';
      tableCaptionTextElement.setAttribute('style', 'border-bottom: 1px solid green;');

      tableCaptionElement
        .kmlcGetElementsByContentText('(note)')
        .startsWith[0].kmlcInsertAfter(tableCaptionItemElement);
      tableCaptionItemElement.children[0].appendChild(tableCaptionTextElement);

      if (debug)
        console.log(
          '[DEBUG]',
          'addEditedGradeLegend',
          'Added edited grade legend to table caption'
        );
    }
  }

  /**
   * Closes the popup and blur elements.
   * @param {HTMLElement} popup - The popup element.
   * @param {HTMLElement} blur - The blur element.
   */
  function closePopup(popup, blur) {
    popup.classList.add('kmlc-popup-close');
    blur.classList.add('kmlc-blur-close');
  }

  /**
   * Restricts input fields to accept only numeric values.
   */
  function restrictInputToNumbers() {
    const editGradeSimulationInputs = document.querySelectorAll(
      '[id *= kmlc-grade-simulation-input]:not([id *= title])'
    );
    editGradeSimulationInputs.forEach(function (input) {
      input.addEventListener('keypress', function (event) {
        const characterCode = event.which ? event.which : event.keyCode;
        if (
          (characterCode !== 8 &&
            characterCode !== 44 &&
            characterCode !== 46 &&
            characterCode < 48) ||
          characterCode > 57
        ) {
          event.preventDefault();
        }
      });
    });
  }

  /**
   * Resets the popup and blur elements after the closing animation ends.
   * @param {HTMLElement} popup - The popup element.
   * @param {HTMLElement} blur - The blur element.
   */
  function resetPopup(popup, blur) {
<<<<<<< HEAD:features/Notes/edit-grade-simulation.js
    popup.style.display = 'none';
    blur.style.display = 'none';
=======
    popup.style.setProperty('display', 'none');
    blur.style.setProperty('display', 'none');
>>>>>>> features:src/Notes/edit-grade-simulation.js
    popup.classList.remove('kmlc-popup-close');
    blur.classList.remove('kmlc-blur-close');
    if (debug)
      console.log(
        '[DEBUG]',
        'resetPopup',
        'Popup and blur reset after closing animation'
      );
  }

  /**
   * Changes the inner HTML of the popup for grade simulation.
   *
   * @param {string} userId - The ID of the user.
   * @param {HTMLElement} popup - The popup element.
   * @param {HTMLElement} blur - The blur element.
   * @param {number} globalQuotient - The global quotient for the grades.
   * @param {string} gradeId - The ID of the grade.
   * @param {HTMLElement} gradeElement - The element containing the grade.
   */
  async function changePopupInnerHTML(
    userId,
    popup,
    blur,
    globalQuotient,
    gradeId,
    gradeElement
  ) {
    if (debug)
      console.log(
        '[DEBUG]',
        'changePopupInnerHTML',
        'Initializing user simulation note',
        {userId}
      );
    await initUserGradeSimulation(userId);
    const gradeSimulation = await getData('gradeSimulation');
    if (debug)
      console.log('[DEBUG]', 'changePopupInnerHTML', 'Retrieved simulation note', {
        gradeSimulation
      });

    const userContent = gradeSimulation.find((item) => item && item.id == userId);
    if (debug)
      console.log('[DEBUG]', 'changePopupInnerHTML', 'Retrieved user content', {
        userContent
      });

    const gradeSubject =
      gradeElement.parentElement.parentElement.parentElement.querySelector(
<<<<<<< HEAD:features/Notes/edit-grade-simulation.js
        '[class *= nommatiere] > b'
      ).textContent;
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
=======
        '[class *= nommatiere] > [class *= text-bold]'
      ).textContent;
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class*='nav-link'][class*='active']"
>>>>>>> features:src/Notes/edit-grade-simulation.js
    );
    if (debug)
      console.log(
        '[DEBUG]',
        'changePopupInnerHTML',
        'Retrieved grade subject and actual period element',
        {
          gradeSubject,
          actualPeriodeElement
        }
      );

    let popupHTML = `
        <h2>Modifier la Note pour Simulation</h2>
        <ul class="kmlc-list">
    `;

    let gradeTitle = '';
    let gradeValue = '';
    let gradeCoefficient = '';
    let gradeQuotient = '';
    let gradeSave = '';

    if (gradeElement.parentElement.getAttribute('title')) {
      gradeTitle = gradeElement.parentElement.getAttribute('title').trim();
    }
    if (gradeElement.childNodes[0]) {
      gradeValue = sanitizeGradeValue(gradeElement.childNodes[0].textContent);
    }
    if (gradeElement.querySelector('sup')) {
      gradeCoefficient = sanitizeGradeValue(
        gradeElement.querySelector('sup').textContent
      );
    }
    if (gradeElement.querySelector('sub')) {
      gradeQuotient = sanitizeGradeValue(gradeElement.querySelector('sub').textContent);
    }
    if (gradeId) {
      gradeSave = 'checked';
    }

    popupHTML += createPopupHTML(
      gradeSubject,
      gradeTitle,
      gradeValue,
      gradeCoefficient,
      gradeQuotient,
      gradeSave
    );
    popup.innerHTML = popupHTML;

    addEventListenersToButtons(
      popup,
      gradeElement,
      globalQuotient,
      userId,
      gradeId,
      blur
    );
  }

  /**
   * Sanitizes the grade value by removing unwanted characters.
   *
   * @param {string} value - The grade value to sanitize.
   * @returns {string} - The sanitized grade value.
   */
  function sanitizeGradeValue(value) {
    return value
      .replace(/[()\/\s]/g, '')
      .replace(',', '.')
      .replace(/[^\d+\-*/.\s]/g, '');
  }

  /**
   * Creates the HTML content for the popup.
   *
   * @param {string} gradeSubject - The subject of the grade.
   * @param {string} gradeTitle - The title of the grade.
   * @param {string} gradeValue - The value of the grade.
   * @param {string} gradeCoefficient - The coefficient of the grade.
   * @param {string} gradeQuotient - The quotient of the grade.
   * @param {string} gradeSave - The save status of the grade.
   * @returns {string} - The HTML content for the popup.
   */
  function createPopupHTML(
    gradeSubject,
    gradeTitle,
    gradeValue,
    gradeCoefficient,
    gradeQuotient,
    gradeSave
  ) {
    return `
        <ul class="kmlc-list">
            <li class="kmlc-item">
                <label class="kmlc-label">${gradeSubject}</label>
            </li>
            <li class="kmlc-item">
                <input type="text" class="kmlc-input" id="kmlc-edited-grade-simulation-input-title" placeholder="Entrez votre titre pour la note" value="${gradeTitle}">
                <input type="text" class="kmlc-input" id="kmlc-edited-grade-simulation-input-grade" placeholder="Entrez votre note" value="${gradeValue}">
            </li>
            <li class="kmlc-item">
                <input type="text" class="kmlc-input" id="kmlc-edited-grade-simulation-input-coeff" placeholder="Entrez votre coefficient pour la note" value="${gradeCoefficient}">
                <input type="text" class="kmlc-input" id="kmlc-edited-grade-simulation-input-quotient" placeholder="Entrez votre quotient de note" value="${gradeQuotient}">
            </li>
            <input type="checkbox" class="kmlc-checkbox" id="kmlc-edited-grade-simulation-button-save"${gradeSave}>
            <label for="kmlc-edited-grade-simulation-button-save" class="kmlc-edited-checkbox-label">Sauvegarder</label>
            <li class="kmlc-button-container" style="text-align: center;">
                <button id="kmlc-edited-add-grade-simulation-button" class="kmlc-add-button" subject="${gradeSubject}">Modifier la note</button>
                <button id="kmlc-edited-clear-grade-simulation-button" class="kmlc-remove-button" subject="${gradeSubject}">Réinitialiser</button>
            </li>
        </ul>
        <div class="kmlc-button-container">
            <button id="kmlc-edited-push-grade-simulation-button" class="kmlc-add-button">Sauvegarder et Calculer</button>
            <button id="kmlc-edited-remove-grade-simulation-button" class="kmlc-remove-button">Supprimer les notes modifiées</button>
        </div>
    `;
  }

  /**
   * Adds event listeners to the buttons in the popup.
   *
   * @param {HTMLElement} popup - The popup element.
   * @param {HTMLElement} gradeElement - The element containing the grade.
   * @param {number} globalQuotient - The global quotient for the grades.
   * @param {string} userId - The ID of the user.
   * @param {string} gradeId - The ID of the grade.
   * @param {HTMLElement} blur - The blur element.
   */
  function addEventListenersToButtons(
    popup,
    gradeElement,
    globalQuotient,
    userId,
    gradeId,
    blur
  ) {
    const addGradeButtons = popup.querySelectorAll(
      '[id = kmlc-edited-add-grade-simulation-button]'
    );
    addGradeButtons.forEach((button) => {
      button.addEventListener('click', async function (e) {
        if (debug)
          console.log(
            '[DEBUG]',
            'addEventListenersToButtons',
            'Add grade button clicked',
            {button}
          );
        await handleAddGradeClick(this, gradeElement, globalQuotient, userId, gradeId);
      });
    });

    const clearGradeModificationButtons = popup.querySelectorAll(
      '[id = kmlc-edited-clear-grade-simulation-button]'
    );
    clearGradeModificationButtons.forEach((button) => {
      button.addEventListener('click', function (e) {
        if (debug)
          console.log(
            '[DEBUG]',
            'addEventListenersToButtons',
            'Clear grade modification button clicked',
            {button}
          );
        clearInputsAndButtons(this.parentElement.parentElement);
      });
    });

    const removeGradeButton = popup.querySelector(
      '#kmlc-edited-remove-grade-simulation-button'
    );
    removeGradeButton.addEventListener('click', async function (e) {
      if (debug)
        console.log(
          '[DEBUG]',
          'addEventListenersToButtons',
          'Remove grade button clicked',
          {removeGradeButton}
        );
      await handleRemoveGradeClick(userId, blur, this);
    });

    const pushGradeButton = popup.querySelector(
      '#kmlc-edited-push-grade-simulation-button'
    );
    pushGradeButton.addEventListener('click', function (e) {
      if (debug)
        console.log(
          '[DEBUG]',
          'addEventListenersToButtons',
          'Push grade button clicked',
          {pushGradeButton}
        );
      e.stopPropagation();
      e.preventDefault();
      blur.click();
      calculateMeans(
        5,
        globalQuotient,
        true,
        'kmlc-simulation-edited-global-mean',
        'border-bottom: 1px solid green; color: green;',
        'kmlc-simulation-edited-means',
        'border-bottom: 1px solid green; color: green;'
      );
    });
  }

  /**
   * Handles the click event for adding a grade.
   *
   * @param {HTMLElement} button - The clicked button element.
   * @param {HTMLElement} gradeElement - The element containing the grade.
   * @param {number} globalQuotient - The global quotient for the grades.
   * @param {string} userId - The ID of the user.
   * @param {string} gradeId - The ID of the grade.
   */
  async function handleAddGradeClick(
    button,
    gradeElement,
    globalQuotient,
    userId,
    gradeId
  ) {
    const subjectGrade =
      gradeElement.parentElement.parentElement.parentElement.querySelector(
<<<<<<< HEAD:features/Notes/edit-grade-simulation.js
        "[class *= 'nommatiere'] > b"
=======
        "[class *= 'nommatiere'] > [class *= text-bold]"
>>>>>>> features:src/Notes/edit-grade-simulation.js
      ).textContent;
    const dateNow = Date.now();
    if (debug)
      console.log('[DEBUG]', 'handleAddGradeClick', 'Handling add grade click', {
        subjectGrade,
        dateNow
      });

    let newGradeTitle = button.parentElement.parentElement
      .querySelector('#kmlc-edited-grade-simulation-input-title')
      .value.trim();
    let newGradeValue = sanitizeGradeValue(
      button.parentElement.parentElement
        .querySelector('#kmlc-edited-grade-simulation-input-grade')
        .value.trim()
    );
    let newGradeCoefficient = sanitizeGradeValue(
      button.parentElement.parentElement
        .querySelector('#kmlc-edited-grade-simulation-input-coeff')
        .value.trim()
    );
    let newGradeQuotient = sanitizeGradeValue(
      button.parentElement.parentElement
        .querySelector('#kmlc-edited-grade-simulation-input-quotient')
        .value.trim()
    );
    let save = button.parentElement.parentElement.querySelector(
      '#kmlc-edited-grade-simulation-button-save'
    ).checked;
    if (debug)
      console.log('[DEBUG]', 'handleAddGradeClick', 'New grade values', {
        newGradeTitle,
        newGradeValue,
        newGradeCoefficient,
        newGradeQuotient,
        save
      });

    if (!newGradeTitle && !newGradeValue && !newGradeCoefficient && !newGradeQuotient)
      return;

    let skip = 0;
    if (
      !newGradeTitle ||
      newGradeTitle == gradeElement.parentElement.getAttribute('title').trim()
    ) {
      newGradeTitle = gradeElement.parentElement.getAttribute('title');
      skip += 1;
    } else {
      newGradeTitle = ' ' + newGradeTitle;
    }

    if (
      !newGradeValue ||
      newGradeValue == sanitizeGradeValue(gradeElement.childNodes[0].textContent)
    ) {
      newGradeValue = sanitizeGradeValue(gradeElement.childNodes[0].textContent);
      skip += 1;
    }

    if (
      !newGradeCoefficient ||
      (gradeElement.querySelector('sup') &&
        newGradeCoefficient ==
          sanitizeGradeValue(gradeElement.querySelector('sup').textContent))
    ) {
      newGradeCoefficient = gradeElement.querySelector('sup')
        ? sanitizeGradeValue(gradeElement.querySelector('sup').textContent)
        : '1.0';
      skip += 1;
    }

    if (
      !newGradeQuotient ||
      (gradeElement.querySelector('sub') &&
        newGradeQuotient ==
          sanitizeGradeValue(gradeElement.querySelector('sub').textContent)) ||
      newGradeQuotient == globalQuotient
    ) {
      newGradeQuotient = gradeElement.querySelector('sub')
        ? sanitizeGradeValue(gradeElement.querySelector('sub').textContent)
        : globalQuotient;
      skip += 1;
    }

    if (skip == 4) return;

    await applyGradeSimulationGoal(
      subjectGrade,
      newGradeTitle,
      newGradeValue,
      newGradeCoefficient,
      newGradeQuotient,
      globalQuotient,
      dateNow,
      gradeElement,
      gradeId,
      userId,
      save
    );

    clearInputsAndButtons(button.parentElement.parentElement);
  }

  /**
   * Handles the click event for removing grades.
   *
   * @param {string} userId - The ID of the user.
   * @param {HTMLElement} blur - The blur element.
   * @param {HTMLElement} button - The clicked button element.
   */
  async function handleRemoveGradeClick(userId, blur, button) {
    if (debug)
      console.log(
        '[DEBUG]',
        'handleRemoveGradeClick',
        'Initializing user simulation note for removal',
        {userId}
      );
    await initUserGradeSimulation(userId);
    const gradeSimulation = await getData('gradeSimulation');
    if (debug)
      console.log(
        '[DEBUG]',
        'handleRemoveGradeClick',
        'Retrieved simulation note for removal',
        {gradeSimulation}
      );

    const userContent = gradeSimulation.find((item) => item && item.id == userId);
    const indexOfUserContent = gradeSimulation.indexOf(userContent);
    if (debug)
      console.log(
        '[DEBUG]',
        'handleRemoveGradeClick',
        'Retrieved user content and index for removal',
        {
          userContent,
          indexOfUserContent
        }
      );

    clearInputsAndButtons(button.parentElement.parentElement);

    userContent.periodes.forEach((periode) => (periode.notes.modifier = {}));
    gradeSimulation[indexOfUserContent] = userContent;

    await setData('gradeSimulation', gradeSimulation);
    await initUserGradeSimulation(userId);

    document
      .querySelectorAll(
        'span[kmlc-simulation-edited-global-mean], span[kmlc-simulation-edited-means]'
      )
      .forEach((element) => element.remove());
    document
      .querySelectorAll('button[kmlc-simulation-edited-grades]')
      .forEach((element) => {
        const gradeSimulationElement = element.querySelector('[class *= valeur]');
<<<<<<< HEAD:features/Notes/edit-grade-simulation.js
        gradeSimulationElement.style.borderBottom =
          gradeSimulationElement.style.borderBottom.replace('1px solid green', '');
=======
        gradeSimulationElement.style.setProperty(
          'borderBottom',
          gradeSimulationElement.style.borderBottom.replace('1px solid green', '')
        );
>>>>>>> features:src/Notes/edit-grade-simulation.js
        gradeSimulationElement.childNodes[0].textContent =
          ' ' + gradeSimulationElement.getAttribute('initialGrade') + ' ';
        gradeSimulationElement.removeAttribute('initialGrade');
        gradeSimulationElement.querySelector('sup').textContent =
          gradeSimulationElement.getAttribute('initialCoefficient');
        gradeSimulationElement.removeAttribute('initialCoefficient');
        gradeSimulationElement.querySelector('sub').textContent =
          gradeSimulationElement.getAttribute('initialQuotient');
        gradeSimulationElement.removeAttribute('initialQuotient');
        gradeSimulationElement.parentElement.title =
          ' ' + gradeSimulationElement.parentElement.getAttribute('initialTitle');
        gradeSimulationElement.parentElement.removeAttribute('initialTitle');
      });

    blur.click();
  }

  /**
   * Clears the input fields and buttons within the given element.
   *
   * @param {HTMLElement} element - The element containing the inputs and buttons to clear.
   */
  function clearInputsAndButtons(element) {
    element.querySelectorAll('input[type="text"]').forEach((input) => (input.value = ''));
    element
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkbox) => (checkbox.checked = false));
  }

  /**
   * Clears the input fields and buttons within the given element.
   *
   * @param {HTMLElement} popupOrChild - The element containing the inputs and buttons to clear.
   */
  function clearInputsAndButtons(popupOrChild) {
    if (debug)
      console.log(
        '[DEBUG]',
        'clearInputsAndButtons',
        'Clearing input fields and buttons',
        {element: popupOrChild}
      );

    const inputBoxes = popupOrChild.querySelectorAll(
      'input[type="text"]:not([type="checkbox"])'
    );
    inputBoxes.forEach((inputBox) => {
      inputBox.value = '';
    });

    const saveButtons = popupOrChild.querySelectorAll('input[type="checkbox"]');
    saveButtons.forEach((saveButton) => {
      saveButton.checked = false;
    });
  }

  /**
   * Applies the grade simulation goal.
   *
   * @param {string} subjectGrade - The subject of the grade.
   * @param {string} gradeTitle - The title of the grade.
   * @param {string} gradeValue - The value of the grade.
   * @param {string} gradeCoefficient - The coefficient of the grade.
   * @param {string} gradeQuotient - The quotient of the grade.
   * @param {number} globalQuotient - The global quotient for the grades.
   * @param {string} gradeModificationId - The modification ID for the grade.
   * @param {HTMLElement} gradeElement - The element containing the grade.
   * @param {string} gradeId - The ID of the grade.
   * @param {string} userId - The ID of the user.
   * @param {boolean} save - Whether to save the grade.
   */
  async function applyGradeSimulationGoal(
    subjectGrade,
    gradeTitle,
    gradeValue,
    gradeCoefficient,
    gradeQuotient,
    globalQuotient,
    gradeModificationId,
    gradeElement,
    gradeId,
    userId,
    save
  ) {
    if (debug)
      console.log(
        '[DEBUG]',
        'applyGradeSimulationGoal',
        'Applying grade simulation goal',
        {
          subjectGrade,
          gradeTitle,
          gradeValue,
          gradeCoefficient,
          gradeQuotient,
          globalQuotient,
          gradeModificationId,
          gradeElement,
          gradeId,
          userId,
          save
        }
      );

    let go = editGrade(
      11,
      subjectGrade,
      gradeTitle,
      gradeValue,
      gradeCoefficient,
      gradeQuotient,
      globalQuotient,
      gradeModificationId,
      gradeElement,
      gradeId,
      save
    );

    if (!save || !gradeId) return;

    if (go) {
      await initUserGradeSimulation(userId);
      const gradeSimulation = await getData('gradeSimulation');
      const userContent = gradeSimulation.find((item) => item?.id === userId);
      const indexOfUserContent = gradeSimulation.indexOf(userContent);
      const actualPeriodeElement = document.querySelector(
<<<<<<< HEAD:features/Notes/edit-grade-simulation.js
        "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
=======
        "ul[class *= 'tabs'] > li > [class*='nav-link'][class*='active']"
>>>>>>> features:src/Notes/edit-grade-simulation.js
      );

      if (debug)
        console.log(
          '[DEBUG]',
          'applyGradeSimulationGoal',
          'User content and actual period element',
          {
            userContent,
            actualPeriodeElement
          }
        );

      userContent.periodes.forEach((periode) => {
        if (
          Number(actualPeriodeElement.getAttribute('dateDebut')) <= periode.dateDebut &&
          periode.dateFin <= Number(actualPeriodeElement.getAttribute('dateFin'))
        ) {
          if (!periode.notes.modifier[subjectGrade])
            periode.notes.modifier[subjectGrade] = [];
          let exist = false;

          periode.notes.modifier[subjectGrade].forEach((note) => {
            if (note.id === gradeId) {
              Object.assign(note, {
                titre: gradeTitle,
                note: parseFloat(gradeValue),
                coeff: parseFloat(gradeCoefficient),
                quotient: parseFloat(gradeQuotient),
                gradeModifId: gradeModificationId
              });
              exist = true;
            }
          });

          if (!exist) {
            periode.notes.modifier[subjectGrade].push({
              titre: gradeTitle,
              note: parseFloat(gradeValue),
              coeff: parseFloat(gradeCoefficient),
              quotient: parseFloat(gradeQuotient),
              id: parseFloat(gradeId),
              gradeModifId: gradeModificationId
            });
          }
        }
      });

      gradeSimulation[indexOfUserContent] = userContent;
      await setData('gradeSimulation', gradeSimulation);
    } else {
      if (debug)
        console.log(
          '[ERROR]',
          'applyGradeSimulationGoal',
          'Unable to apply grade simulation goal',
          {userId}
        );
    }
  }

  /**
   * Reloads the grade simulation modifications for the user.
   *
   * @param {string} userId - The ID of the user.
   * @param {number} globalQuotient - The global quotient for the grades.
   */
  async function reloadNoteSimulation(userId, globalQuotient) {
    if (debug)
      console.log('[DEBUG]', 'reloadNoteSimulation', 'Reloading note simulation', {
        userId,
        globalQuotient
      });

    await initUserGradeSimulation(userId);
    const gradeSimulation = await getData('gradeSimulation');
    const userContent = gradeSimulation.find((item) => item?.id === userId);
<<<<<<< HEAD:features/Notes/edit-grade-simulation.js
    const subjectGrades = document.querySelectorAll("[class *= 'nommatiere'] > b");
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
=======
    const subjectGrades = document.querySelectorAll(
      "[class *= 'nommatiere'] > [class *= text-bold]"
    );
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class*='nav-link'][class*='active']"
>>>>>>> features:src/Notes/edit-grade-simulation.js
    );

    if (debug)
      console.log(
        '[DEBUG]',
        'reloadNoteSimulation',
        'User content and actual period element',
        {
          userContent,
          actualPeriodeElement
        }
      );

    const addedAndEditedGradesListDatas = [];

    userContent.periodes?.forEach((periode) => {
      if (
        Number(actualPeriodeElement.getAttribute('dateDebut')) <= periode.dateDebut &&
        periode.dateFin <= Number(actualPeriodeElement.getAttribute('dateFin'))
      ) {
        subjectGrades.forEach((subjectGradeElement) => {
          const gradesData = periode.notes.modifier[subjectGradeElement.textContent];
          if (!gradesData) return;

          gradesData.forEach((gradeData) => {
            addedAndEditedGradesListDatas.push({
              subjectName: subjectGradeElement.textContent,
              title: gradeData.titre,
              value: gradeData.note,
              coefficient: gradeData.coeff,
              quotient: gradeData.quotient,
              id: gradeData.id,
              idModification: gradeData.gradeModifId,
              save: true
            });
          });
        });
      }
    });

    addedAndEditedGradesListDatas.forEach((gradeData, index) => {
      const calculateGlobalMean = index === addedAndEditedGradesListDatas.length - 1;
      editGrade(
        12,
        gradeData.subjectName,
        gradeData.title,
        gradeData.value,
        gradeData.coefficient,
        gradeData.quotient,
        globalQuotient,
        gradeData.idModification,
        false,
        gradeData.id,
        gradeData.save,
        calculateGlobalMean
      );
    });
  }

<<<<<<< HEAD:features/Notes/edit-grade-simulation.js
  exports({editGradeSimulation}).to('./features/Notes/edit-grade-simulation.js');
=======
  exports({editGradeSimulation}).to('./src/Notes/edit-grade-simulation.js');
>>>>>>> features:src/Notes/edit-grade-simulation.js
})();
