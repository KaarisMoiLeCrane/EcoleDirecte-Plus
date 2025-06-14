(() => {
  // Import necessary functions
  const initPopup = imports('initPopup').from('./utils/utils.js');
  const getData = imports('getData').from('./utils/utils.js');
  const setData = imports('setData').from('./utils/utils.js');
  const initUserObjectif = imports('initUserObjectif').from('./utils/utils.js');
  const addGradeGoal = imports('addGradeGoal').from(
    './src/Notes/functions/add-grade-goal.js'
  );
  const calculateGlobalMeanGoal = imports('calculateGlobalMeanGoal').from(
    './src/Notes/functions/calculate-global-mean-goal.js'
  );

  /**
   * Setup the user objectives.
   * @param {string} userId - The ID of the user.
   */
  function goalSetup(userId) {
    if (debug) console.log('[DEBUG]', 'goalSetup', 'Initializing goal setup', {userId});

    const buttonSelector = 'ul.nav-pills > li.active';
    const activeButton = document.querySelector(buttonSelector);

    if (!document.querySelector('#kmlc-button-goal')) {
      const goalButton = activeButton.cloneNode(true);
      goalButton.id = 'kmlc-button-goal';

      const popupID = 'kmlc-goal-popup';
      const blurID = 'kmlc-goal-blur';

      let popup = document.querySelector('#' + popupID);
      let blur = document.querySelector('#' + blurID);

      if (popup) {
        popup.remove();
        blur.remove();
      }

      goalButton.children[0].removeAttribute('href');
      goalButton.children[0].children[0].textContent = 'Objectifs';
      goalButton.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        await initUserObjectif(userId);
        if (debug)
          console.log('[DEBUG]', 'goalSetup', 'User goals initialized', {userId});

        popup = document.querySelector('#' + popupID);
        blur = document.querySelector('#' + blurID);

        if (!popup) {
          const popupDatas = initPopup(popupID, blurID);
          popup = popupDatas[0];
          blur = popupDatas[1];

          await changePopupInnerHTML(userId, popup, blur);

          setupPopupEvents(popup, blur);
        }

        popup.setAttribute('style', 'width: 80%; height: 80%;');
        blur.setAttribute('style', '');
      });

      activeButton.parentElement.insertBefore(goalButton, activeButton);
    }

    reloadGoalsValues(userId);
    if (debug) console.log('[DEBUG]', 'goalSetup', 'Goal setup completed', {userId});
  }

  /**
   * Sets up events for the popup and blur elements.
   * @param {HTMLElement} popup - The popup element.
   * @param {HTMLElement} blur - The blur element.
   */
  function setupPopupEvents(popup, blur) {
    if (debug)
      console.log('[DEBUG]', 'setupPopupEvents', 'Setting up popup events', {
        popupID: popup.id,
        blurID: blur.id
      });

    function closePopup() {
      popup.classList.add('kmlc-popup-close');
      blur.classList.add('kmlc-blur-close');
      if (debug)
        console.log('[DEBUG]', 'closePopup', 'Popup close initiated', {
          popupID: popup.id,
          blurID: blur.id
        });
    }

    blur.addEventListener('click', function (event) {
      if (event.target.classList.contains('kmlc-blur')) {
        closePopup();
      }
    });

    const allGoalsInputs = document.querySelectorAll('[id *= kmlc-goal-input]');
    allGoalsInputs.forEach(function (input) {
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
        popup.style.setProperty('display', 'none');
        blur.style.setProperty('display', 'none');
        popup.classList.remove('kmlc-popup-close');
        blur.classList.remove('kmlc-blur-close');
        if (debug)
          console.log('[DEBUG]', 'popupAnimationEnd', 'Popup close animation ended', {
            popupID: popup.id,
            blurID: blur.id
          });
      }
    });
  }

  /**
   * Updates the inner HTML of the popup with user-specific grade goals.
   *
   * @param {string} userId - The ID of the user.
   * @param {HTMLElement} popup - The popup element to update.
   * @param {HTMLElement} blur - The blur element to trigger click events.
   */
  async function changePopupInnerHTML(userId, popup, blur) {
    if (debug)
      console.log(
        'changePopupInnerHTML',
        'changePopupInnerHTML',
        'Initializing popup content',
        {
          userId
        }
      );

    const subjectNamesElement = document.querySelectorAll(
      "[class *= 'nommatiere'] > [class *= text-bold]"
    );
    const meansGoals = await getData('objectifMoyenne');
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class*='nav-link'][class*='active']"
    );

    let popupHTML = `
<h2>Objectif de Note pour l'Année</h2>
<ul class="kmlc-list">
`;

    for (let i = 0; i < subjectNamesElement.length; i++) {
      const subjectName = subjectNamesElement[i].textContent;
      const serializedSubjectName = serializeSubjectName(subjectName);
      const userContent = findUserContent(meansGoals, userId);

      let addedSubjectGradeValue = getSubjectGradeValue(
        userContent,
        subjectName,
        actualPeriodeElement
      );

      popupHTML += createSubjectItemHTML(
        subjectName,
        serializedSubjectName,
        addedSubjectGradeValue
      );
    }

    popupHTML += createPopupButtonsHTML();

    popup.innerHTML = popupHTML;

    addEventListenersToPopup(popup, userId, blur);
  }

  /**
   * Serializes the subject name by removing special characters and replacing spaces with underscores.
   *
   * @param {string} subjectName - The name of the subject to serialize.
   * @returns {string} - The serialized subject name.
   */
  function serializeSubjectName(subjectName) {
    return subjectName.replaceAll(/[^a-zA-Z0-9 ]/g, '').replaceAll(' ', '_');
  }

  /**
   * Finds the user content from the goals data.
   *
   * @param {Array} meansGoals - The array of goal data.
   * @param {string} userId - The ID of the user.
   * @returns {Object|null} - The user content object or null if not found.
   */
  function findUserContent(meansGoals, userId) {
    return meansGoals.find((item) => item && item.id === userId) || null;
  }

  /**
   * Retrieves the subject grade value for the specified period.
   *
   * @param {Object} userContent - The user content object.
   * @param {string} subjectName - The name of the subject.
   * @param {HTMLElement} actualPeriodeElement - The element representing the current period.
   * @returns {string} - The subject grade value.
   */
  function getSubjectGradeValue(userContent, subjectName, actualPeriodeElement) {
    if (userContent && userContent.periodes) {
      for (const periode of userContent.periodes) {
        const addedSubjectGrades = periode.objectif[subjectName];
        if (
          addedSubjectGrades &&
          Number(actualPeriodeElement.getAttribute('dateDebut')) <= periode.dateDebut &&
          periode.dateFin <= Number(actualPeriodeElement.getAttribute('dateFin'))
        ) {
          return addedSubjectGrades.note;
        }
      }
    }
    return '';
  }

  /**
   * Creates the HTML for a subject item in the popup.
   *
   * @param {string} subjectName - The name of the subject.
   * @param {string} serializedSubjectName - The serialized subject name.
   * @param {string} addedSubjectGradeValue - The grade value for the subject.
   * @returns {string} - The HTML string for the subject item.
   */
  function createSubjectItemHTML(
    subjectName,
    serializedSubjectName,
    addedSubjectGradeValue
  ) {
    return `
<li class="kmlc-item">
  <label class="kmlc-label">${subjectName}</label>
  <input type="text" class="kmlc-input" id="kmlc-goal-input-${serializedSubjectName}" subject="${subjectName}" placeholder="Entrez votre objectif de note" value="${addedSubjectGradeValue}">
  <div class="kmlc-label">
      <input type="checkbox" class="kmlc-checkbox" id="kmlc-goal-button-save-${serializedSubjectName}">
      <label for="kmlc-goal-button-save-${serializedSubjectName}" class="kmlc-checkbox-label">Sauvegarder</label>
  </div>
</li>`;
  }

  /**
   * Creates the HTML for the popup buttons.
   *
   * @returns {string} - The HTML string for the popup buttons.
   */
  function createPopupButtonsHTML() {
    return `
</ul>
<div class="kmlc-button-container">
  <button id="kmlc-remove-objectif-button" class="kmlc-remove-button">Supprimer les objectifs</button>
  <button id="kmlc-add-objectif-button" class="kmlc-add-button">Valider les objectifs</button>
</div>`;
  }

  /**
   * Adds event listeners to the popup buttons.
   *
   * @param {HTMLElement} popup - The popup element.
   * @param {string} userId - The ID of the user.
   * @param {HTMLElement} blur - The blur element to trigger click events.
   */
  function addEventListenersToPopup(popup, userId, blur) {
    popup
      .querySelector('#kmlc-remove-objectif-button')
      .addEventListener('click', async function (e) {
        await handleRemoveObjectives(e, userId);
      });

    popup
      .querySelector('#kmlc-add-objectif-button')
      .addEventListener('click', async function (e) {
        await handleAddGoalsButtons(e, userId, blur);
      });
  }

  /**
   * Handles the removal of objectives.
   *
   * @param {Event} e - The event object.
   * @param {string} userId - The ID of the user.
   */
  async function handleRemoveObjectives(e, userId) {
    e.stopPropagation();
    e.preventDefault();
    if (debug)
      console.log('[DEBUG]', 'handleRemoveObjectives', 'Removing objectives', {userId});

    const inputBoxes = document.querySelectorAll(
      'li[class = "kmlc-subject-item"] > input[type="text"][id *= kmlc-goal-input]'
    );
    inputBoxes.forEach((inputBox) => (inputBox.value = ''));

    await initUserObjectif(userId);
    const meansGoals = await getData('objectifMoyenne');

    let userContent = findUserContent(meansGoals, userId) || {
      id: userId,
      periodes: []
    };
    let indexOfUserContent = meansGoals.indexOf(userContent);

    if (indexOfUserContent === -1) {
      meansGoals.push(userContent);
    } else {
      meansGoals[indexOfUserContent] = userContent;
    }

    await setData('objectifMoyenne', meansGoals);
    await initUserObjectif(userId);
    await changePopupInnerHTML(userId, popup, blur);
    clearTooltips();
  }

  /**
   * Handles the addition of objectives.
   *
   * @param {Event} e - The event object.
   * @param {string} userId - The ID of the user.
   * @param {HTMLElement} blur - The blur element to trigger click events.
   */
  async function handleAddGoalsButtons(e, userId, blur) {
    e.stopPropagation();
    e.preventDefault();
    if (debug)
      console.log('[DEBUG]', 'handleAddGoalsButtons', 'Adding objectives', {userId});

    blur.click();

    const inputBoxes = document.querySelectorAll('[id *= kmlc-goal-input-]');
    for (const inputBox of inputBoxes) {
      const inputBoxValue = sanitizeInputValue(inputBox.value);
      const subjectGoalMean = inputBox.getAttribute('subject');
      const subjectGoalMeanSerialized = serializeSubjectName(subjectGoalMean);
      const goalMeanValue = sanitizeInputValue(inputBox.value);
      const save = inputBox.parentElement.parentElement.querySelector(
        '#kmlc-goal-button-save-' + subjectGoalMeanSerialized
      ).checked;
      const goalMeanId = Date.now();

      await applyMeanGoal(userId, subjectGoalMean, goalMeanValue, goalMeanId, save);
    }
  }

  /**
   * Sanitizes the input value by removing unwanted characters.
   *
   * @param {string} value - The input value to sanitize.
   * @returns {string} - The sanitized input value.
   */
  function sanitizeInputValue(value) {
    return value
      .replace(/[()\/\s]/g, '')
      .replace(',', '.')
      .replace(/[^\d+\-*/.\s]/g, '');
  }

  /**
   * Clears all tooltips related to means goals.
   */
  function clearTooltips() {
    document
      .querySelectorAll('[kmlc-goal][class *= kmlc-tooltip]')
      .forEach((tooltip) => tooltip.remove());
    const globalTooltip = document.querySelector(
      '[kmlc-global-mean-goal][class *= kmlc-tooltip]'
    );
    if (globalTooltip) globalTooltip.remove();
    document.querySelectorAll('[kmlc-goal-mean-set]').forEach((element) => {
      element.removeAttribute('kmlc-goal-mean-set');
      element.removeAttribute('style');
      element.className = element.className.replace(' kmlc-tooltip-parent', '');
    });
    const globalMeanTooltip = document.querySelector('[kmlc-global-mean-goal-set]');
    if (globalMeanTooltip) {
      globalMeanTooltip.removeAttribute('kmlc-global-mean-goal-set');
      globalMeanTooltip.removeAttribute('style');
      globalMeanTooltip.className = globalMeanTooltip.className.replace(
        'kmlc-global-mean-parent',
        ''
      );
    }
  }

  /**
   * Applies the mean goal for a subject and updates the user data.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} subjectGoalMean - The name of the subject for the goal.
   * @param {string} goalMeanValue - The value of the goal mean.
   * @param {string} goalMeanId - The ID of the goal mean.
   * @param {boolean} save - Flag to determine if the goal should be saved.
   */
  async function applyMeanGoal(userId, subjectGoalMean, goalMeanValue, goalMeanId, save) {
    if (debug)
      console.log('[DEBUG]', 'applyMeanGoal', 'Applying mean goal', {
        userId,
        subjectGoalMean,
        goalMeanValue,
        goalMeanId,
        save
      });

    // Add the grade goal visually
    addGradeGoal(
      subjectGoalMean,
      goalMeanValue,
      goalMeanId,
      'kmlc-goal-mean-set',
      'kmlc-tooltip-parent',
      'kmlc-goal'
    );

    // If save is not required, return early
    if (!save) return;

    await initUserObjectif(userId);
    const meansGoals = await getData('objectifMoyenne');

    const userContent = findUserContent(meansGoals, userId);
    const indexOfUserContent = meansGoals.indexOf(userContent);
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class*='nav-link'][class*='active']"
    );

    updateUserContentWithGoal(
      userContent,
      actualPeriodeElement,
      subjectGoalMean,
      goalMeanValue,
      goalMeanId
    );

    meansGoals[indexOfUserContent] = userContent;
    await setData('objectifMoyenne', meansGoals);
    if (debug)
      console.log('[DEBUG]', 'applyMeanGoal', 'Updated user content with mean goal', {
        meansGoals
      });
  }

  /**
   * Updates the user content with the specified goal.
   *
   * @param {Object} userContent - The user content object.
   * @param {HTMLElement} actualPeriodeElement - The element representing the current period.
   * @param {string} subjectGoalMean - The name of the subject for the goal.
   * @param {string} goalMeanValue - The value of the goal mean.
   * @param {string} goalMeanId - The ID of the goal mean.
   */
  function updateUserContentWithGoal(
    userContent,
    actualPeriodeElement,
    subjectGoalMean,
    goalMeanValue,
    goalMeanId
  ) {
    for (let j = 0; j < userContent.periodes.length; j++) {
      const periode = userContent.periodes[j];

      if (isWithinCurrentPeriod(actualPeriodeElement, periode)) {
        periode.objectif[subjectGoalMean] = {
          note: goalMeanValue,
          id: goalMeanId
        };

        if (goalMeanValue === '') {
          delete periode.objectif[subjectGoalMean];
        }
      }
    }
  }

  /**
   * Checks if the specified period is within the current period.
   *
   * @param {HTMLElement} actualPeriodeElement - The element representing the current period.
   * @param {Object} periode - The period object to check.
   * @returns {boolean} - True if the period is within the current period, false otherwise.
   */
  function isWithinCurrentPeriod(actualPeriodeElement, periode) {
    const startDate = Number(actualPeriodeElement.getAttribute('dateDebut'));
    const endDate = Number(actualPeriodeElement.getAttribute('dateFin'));

    return startDate <= periode.dateDebut && periode.dateFin <= endDate;
  }

  /**
   * Checks if the specified period is within the current period.
   *
   * @param {HTMLElement} actualPeriodeElement - The element representing the current period.
   * @param {Object} periode - The period object to check.
   * @returns {boolean} - True if the period is within the current period, false otherwise.
   */
  function isInCurrentPeriod(actualPeriodeElement, periode) {
    const startDate = Number(actualPeriodeElement.getAttribute('dateDebut'));
    const endDate = Number(actualPeriodeElement.getAttribute('dateFin'));

    return startDate == periode.dateDebut && periode.dateFin == endDate;
  }

  /**
   * Reloads the goals grades for the user.
   *
   * @param {string} userId - The ID of the user.
   */
  async function reloadGoalsValues(userId) {
    if (debug)
      console.log('[DEBUG]', 'reloadGoalsValues', 'Reloading goals values', {userId});

    await initUserObjectif(userId);
    const goalsMeans = await getData('objectifMoyenne');

    const userContent = findUserContent(goalsMeans, userId);
    const subjectNames = document.querySelectorAll(
      "[class *= 'nommatiere'] > [class *= text-bold]"
    );
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class*='nav-link'][class*='active']"
    );

    updateSubjectsWithGoals(userContent, subjectNames, actualPeriodeElement);
    calculateGlobalMeanGoal(userId, goalsMeans);
  }

  /**
   * Updates the subjects with the goals for the user.
   *
   * @param {Object} userContent - The user content object.
   * @param {NodeList} subjectNames - The list of subject name elements.
   * @param {HTMLElement} actualPeriodeElement - The element representing the current period.
   */
  function updateSubjectsWithGoals(userContent, subjectNames, actualPeriodeElement) {
    for (let i = 0; i < subjectNames.length; i++) {
      const subjectName = subjectNames[i].textContent;

      if (userContent && userContent.periodes) {
        for (let j = 0; j < userContent.periodes.length; j++) {
          const periode = userContent.periodes[j];

          if (isWithinCurrentPeriod(actualPeriodeElement, periode)) {
            const goalMeanDatas = periode.objectif[subjectName];
            if (!goalMeanDatas) break;

            const gradeValue = goalMeanDatas.note;
            const gradeId = goalMeanDatas.id;

            addGradeGoal(
              subjectName,
              gradeValue,
              gradeId,
              'kmlc-goal-mean-set',
              'kmlc-tooltip-parent',
              'kmlc-goal'
            );
          }

          if (isInCurrentPeriod(actualPeriodeElement, periode)) {
            const goalMeanDatas = periode.objectif[subjectName];
            if (!goalMeanDatas) break;

            const gradeValue = goalMeanDatas.note;
            const gradeId = goalMeanDatas.id;

            addGradeGoal(
              subjectName,
              gradeValue,
              gradeId,
              'kmlc-goal-mean-set',
              'kmlc-tooltip-parent',
              'kmlc-goal'
            );

            break;
          }
        }
      }
    }
  }

  /**
   * Finds the user content from the goals data.
   *
   * @param {Array} meansGoals - The array of goal data.
   * @param {string} userId - The ID of the user.
   * @returns {Object|null} - The user content object or null if not found.
   */
  function findUserContent(meansGoals, userId) {
    return meansGoals.find((item) => item && item.id === userId) || null;
  }

  exports({goalSetup}).to('./src/Notes/goal.js');
})();
