(() => {
  const ajouterObjectifNote = imports('ajouterObjectifNote').from(
    './features/Notes/functions/ajouter-objectif-note.js'
  );

  function objectifSetup() {
    // Selector to get the "Evaluations" button
    const buttonSelector = 'ul.nav-pills > li.active';
    const activeButton = document.querySelector(buttonSelector);

    // If there is no button to see the goals then we add it
    if (!document.querySelector('#kmlc-bouton-objectif')) {
      // We duplicate the "Evaluations" button, we add the attribute to know that he exist, and we add the click listener
      const objectifButton = document.querySelector(buttonSelector).cloneNode(true);
      objectifButton.id = 'kmlc-bouton-objectif';

      objectifButton.children[0].removeAttribute('href');
      objectifButton.children[0].children[0].textContent = 'Objectifs';
      objectifButton.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        // We get the goals and we add them to a multi-line string

        await globalThis.Utils.initUserObjectif(globalThis.userId);
        const meansGoals = await globalThis.Utils.getData('objectifMoyenne');
        // console.log(objectifMoyenne)

        const popupID = 'kmlc-objectif-popup';
        const blurID = 'kmlc-objectif-blur';

        let popup = document.querySelector('#' + popupID);
        let blur = document.querySelector('#' + blurID);

        if (!popup) {
          // console.log(789, items.objectifMoyenne)
          const popupDatas = globalThis.Utils.initPopup(popupID, blurID);
          popup = popupDatas[0];
          blur = popupDatas[1];

          await changePopupInnerHTML(popup, blur);

          // Fermer la popup
          function closePopup() {
            popup.classList.add('kmlc-popup-close');
            blur.classList.add('kmlc-blur-close');
          }

          // Event to close the popup by clicking in the blur outside
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
                (charCode !== 8 && // Touche de suppression (Backspace)
                  charCode !== 44 && // Virgule (,)
                  charCode !== 46 && // Point (.)
                  charCode < 48) || // Chiffres (0-9)
                charCode > 57
              ) {
                event.preventDefault();
              }
            });
          });

          // Reinit the popup after the close animation
          popup.addEventListener('animationend', function (event) {
            if (event.animationName === 'kmlc-popupCloseAnimation') {
              // Hide the elements
              popup.style.display = 'none';
              blur.style.display = 'none';

              // Reset the animation
              popup.classList.remove('kmlc-popup-close');
              blur.classList.remove('kmlc-blur-close');
            }
          });
        }

        popup.setAttribute('style', 'width: 80%; height: 80%;');
        blur.setAttribute('style', '');
        // })
      });

      activeButton.parentElement.insertBefore(objectifButton, activeButton);
    }

    reloadObjectifNote();
  }

  async function changePopupInnerHTML(popup, blur) {
    // browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
    // console.log(items.objectifMoyenne)
    const subjectNamesElement = document.querySelectorAll("[class *= 'nommatiere'] > b");
    const meansGoals = await globalThis.Utils.getData('objectifMoyenne');
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
    );

    let popupHTML = `
<h2>Objectif de Note pour l'Année</h2>
<ul class="kmlc-list">
`;

    for (let i = 0; i < subjectNamesElement.length; i++) {
      let skip = !false;
      const subjectName = subjectNamesElement[i].textContent;
      const serializedSubjectName = subjectName
        .replaceAll(/[^a-zA-Z0-9 ]/g, '')
        .replaceAll(' ', '_');

      const userContent = meansGoals.find((item) => {
        if (item) if (item.id) return item.id == globalThis.userId;
      });

      // console.log(userContent)

      let addedSubjectGradeValue = '';

      if (userContent.periodes) {
        // console.log(111111)

        for (let j = 0; j < userContent.periodes.length; j++) {
          const userContentPeriode = userContent.periodes[j];
          // console.log(222222)
          const addedSubjectGrades = userContentPeriode.objectif[subjectName];
          // console.log(notesMatiere)

          if (addedSubjectGrades) {
            if (
              Number(actualPeriodeElement.getAttribute('dateDebut')) <=
                userContentPeriode.dateDebut &&
              userContentPeriode.dateFin <=
                Number(actualPeriodeElement.getAttribute('dateFin'))
            ) {
              addedSubjectGradeValue =
                addedSubjectGrades[addedSubjectGrades.length - 1].note;

              break;
            }
          } else {
            break;
          }
        }
      }

      popupHTML +=
        `
<li class="kmlc-item">
	<label class="kmlc-label">` +
        subjectName +
        `</label>
	<input type="text" class="kmlc-input" id="kmlc-goal-input-` +
        serializedSubjectName +
        `" subject="` +
        subjectName +
        `" placeholder="Entrez votre objectif de note" value="` +
        addedSubjectGradeValue +
        `">
<div class="kmlc-label">
		<input type="checkbox" class="kmlc-checkbox" id="kmlc-goal-button-save-` +
        serializedSubjectName +
        `">
	<label for="kmlc-goal-button-save-` +
        serializedSubjectName +
        `" class="kmlc-checkbox-label">Sauvegarder</label>
	</div>
</li>`;
    }

    popupHTML += `
</ul>
<div class="kmlc-button-container">
<button id="kmlc-remove-objectif-button" class="kmlc-remove-button">Supprimer les objectifs</button>
<button id="kmlc-add-objectif-button" class="kmlc-add-button">Valider les objectifs</button>
</div>
`;

    popup.innerHTML = popupHTML;

    popup
      .querySelector('#kmlc-remove-objectif-button')
      .addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        const inputBoxes = document.querySelectorAll(
          'li[class = "kmlc-subject-item"] > input[type="text"][id *= kmlc-goal-input]'
        );
        for (let i = 0; i < inputBoxes.length; i++) {
          inputBoxes[i].value = '';
        }

        // let dummy = items.objectifMoyenne
        // dummy[id] = []

        await globalThis.Utils.initUserObjectif(globalThis.userId);
        const meansGoals = await globalThis.Utils.getData('objectifMoyenne');

        // console.log(objectifMoyenne)

        let userContent = meansGoals.find((item) => {
          if (item) if (item.id) return item.id == globalThis.userId;
        });

        let indexOfUserContent = meansGoals.indexOf(userContent);

        userContent = {id: globalThis.userId, periodes: []};

        if (!meansGoals[indexOfUserContent]) meansGoals.push(userContent);
        else meansGoals[indexOfUserContent] = userContent;

        // console.log(dummy, userContent, index)

        await globalThis.Utils.setData('objectifMoyenne', meansGoals);

        // browser.storage.sync.set({["simulationNote"]: dummy}, function () {
        // if (browser.runtime.lastError) {
        // console.error("Error setting data:", browser.runtime.lastError);
        // } else {
        // console.log("Data set successfully.");
        // }
        // });
        // console.log(1)

        await globalThis.Utils.initUserObjectif(globalThis.userId);
        // console.log(5)

        // applyGradeSimualtionGoal(popup)
        await changePopupInnerHTML(popup, blur);

        // browser.storage.sync.set({"objectifMoyenne": dummy})

        const allMeansTooltips = document.querySelectorAll(
          '[kmlc-objectif][class *= kmlc-tooltip]'
        );
        for (let i = 0; i < allMeansTooltips.length; i++) {
          allMeansTooltips[i].remove();
        }

        const allSetMeansGoalsWithTooltips = document.querySelectorAll(
          '[kmlc-objectif-moyenne-set]'
        );
        for (let i = 0; i < allSetMeansGoalsWithTooltips.length; i++) {
          allSetMeansGoalsWithTooltips[i].removeAttribute('kmlc-objectif-moyenne-set');
          allSetMeansGoalsWithTooltips[i].removeAttribute('style');
          allSetMeansGoalsWithTooltips[i].className =
            allSetMeansGoalsWithTooltips[i].className.replace(' kmlc-note-parent');
        }
      });

    popup
      .querySelector('#kmlc-add-objectif-button')
      .addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        blur.click();

        const inputBoxes = document.querySelectorAll('[id *= kmlc-goal-input-]');

        for (let i = 0; i < inputBoxes.length; i++) {
          let inputBoxValue = inputBoxes[i].value
            .replace(/[()\/\s]/g, '')
            .replace(',', '.')
            .replace(/[^\d+\-*/.\s]/g, '');
          // console.log(inputBoxValue)

          // if (inputBoxValue != '') {
          const subjectGoalMean = inputBoxes[i].getAttribute('subject');
          const subjectGoalMeanSerialized = subjectGoalMean
            .replaceAll(/[^a-zA-Z0-9 ]/g, '')
            .replaceAll(' ', '_');

          // console.log(this, subjectGrade, this.parentElement, this.parentElement.parentElement)

          const goalMeanValue = inputBoxes[i].value
            .replace(/[()\/\s]/g, '')
            .replace(',', '.')
            .replace(/[^\d+\-*/.\s]/g, '');
          let save = this.parentElement.parentElement.querySelector(
            '#' + 'kmlc-goal-button-save-' + subjectGoalMeanSerialized
          ).checked;

          const goalMeanId = Date.now();

          await applyMeanGoal(subjectGoalMean, goalMeanValue, goalMeanId, save);
        }
      });
  }

  async function applyMeanGoal(subjectGoalMean, goalMeanValue, goalMeanId, save) {
    ajouterObjectifNote(subjectGoalMean, goalMeanValue, goalMeanId);
    // console.log(1111)
    if (!save) return;

    await globalThis.Utils.initUserObjectif(globalThis.userId);
    const goalsMeans = await globalThis.Utils.getData('objectifMoyenne');
    // let dataPeriodes = globalThis.Notes.dataPeriodes

    // Create the goal section associated with the id of the student
    const userContent = goalsMeans.find((item) => {
      if (item) if (item.id) return item.id == globalThis.userId;
    });

    const indexOfUserContent = goalsMeans.indexOf(userContent);

    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
    );

    for (let j = 0; j < userContent.periodes.length; j++) {
      // If the subject exist we add the goal

      if (
        Number(actualPeriodeElement.getAttribute('dateDebut')) <=
          userContent.periodes[j].dateDebut &&
        userContent.periodes[j].dateFin <=
          Number(actualPeriodeElement.getAttribute('dateFin'))
      ) {
        userContent.periodes[j].objectif[subjectGoalMean] = {};
        // console.log(userContent, userContent.periodes[j].objectif, userContent.periodes[j].objectif[subjectGrade])
        userContent.periodes[j].objectif[subjectGoalMean]['note'] = goalMeanValue;
        userContent.periodes[j].objectif[subjectGoalMean]['id'] = goalMeanId;

        if (goalMeanValue == '') delete userContent.periodes[j].objectif[subjectGoalMean];
      }
    }

    goalsMeans[indexOfUserContent] = userContent;

    // console.log(subjectGrade, objectifMoyenne)

    await globalThis.Utils.setData('objectifMoyenne', goalsMeans);

    // console.log(objectifMoyenne)
  }

  async function reloadObjectifNote() {
    // console.log(123456789)

    await globalThis.Utils.initUserObjectif(globalThis.userId);
    const goalsMeans = await globalThis.Utils.getData('objectifMoyenne');

    const userContent = goalsMeans.find((item) => {
      if (item) if (item.id) return item.id == globalThis.userId;
    });

    const subjectNames = document.querySelectorAll("[class *= 'nommatiere'] > b");
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
    );

    // console.log(userContent)

    for (let i = 0; i < subjectNames.length; i++) {
      if (userContent.periodes) {
        for (let j = 0; j < userContent.periodes.length; j++) {
          if (
            Number(actualPeriodeElement.getAttribute('dateDebut')) <=
              userContent.periodes[j].dateDebut &&
            userContent.periodes[j].dateFin <=
              Number(actualPeriodeElement.getAttribute('dateFin'))
          ) {
            const goalMeanDatas =
              userContent.periodes[j].objectif[subjectNames[i].textContent];
            if (!goalMeanDatas) break;

            const subjectGrade = subjectNames[i].textContent;
            const gradeValue = goalMeanDatas.note;
            const gradeId = goalMeanDatas.id;

            ajouterObjectifNote(subjectGrade, gradeValue, gradeId);
          }
        }
      }
    }
  }

  exports({objectifSetup}).to('./features/Notes/objectif.js');
})();
