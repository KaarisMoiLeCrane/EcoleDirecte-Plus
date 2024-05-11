(() => {
  const initPopup = imports('initPopup').from('./utils/utils.js');

  const getData = imports('getData').from('./utils/utils.js');
  const setData = imports('setData').from('./utils/utils.js');

  const initUserSimulationNote = imports('initUserSimulationNote').from(
    './utils/utils.js'
  );

  const ajouterNote = imports('ajouterNote').from(
    './features/Notes/functions/ajouter-note.js'
  );
  const calculerMoyennes = imports('calculerMoyennes').from(
    './features/Notes/functions/calculer-moyennes.js'
  );

  function ajouterNoteSimulation(userId, globalQuotient) {
    // Selector to get the "Evaluations" button
    const buttonSelector = 'ul.nav-pills > li.active';

    // Check if the text in the bottom was changed and then add the text "Note ajoutée pour simulation" if it was not changed
    if (
      !document.querySelector('[kmlc-text-note]') &&
      document.querySelector('table caption')
    ) {
      const legendGradeSimulationElement = document
        .querySelector('table caption')
        .parentElement.kmlcGetElementsByContentText('(note)')
        .startsWith[0].cloneNode(true);
      legendGradeSimulationElement.setAttribute('kmlc-text-note', 'true');

      legendGradeSimulationElement.children[0].textContent = 'note';
      legendGradeSimulationElement.children[0].setAttribute('style', 'color: green;');

      legendGradeSimulationElement.children[1].textContent =
        'Note ajoutée pour simulation';

      document
        .querySelector('table caption')
        .parentElement.kmlcGetElementsByContentText('(note)')
        .startsWith[0].kmlcInsertAfter(legendGradeSimulationElement);
    }

    // If there is no button to add the grades then we add it
    if (!document.querySelector('[kmlc-bouton-note]')) {
      const activeButton = document.querySelector(buttonSelector);

      const popupID = 'kmlc-simulationNote-popup';
      const blurID = 'kmlc-simulationNote-blur';

      let popup = document.querySelector('#' + popupID);
      let blur = document.querySelector('#' + blurID);

      if (popup) {
        popup.remove();
        blur.remove();
      }

      const buttonAddGrade = activeButton.cloneNode(true);
      buttonAddGrade.className = buttonAddGrade.className.replace('active', '');
      buttonAddGrade.setAttribute('kmlc-bouton-note', 'true');

      buttonAddGrade.children[0].removeAttribute('href');
      buttonAddGrade.children[0].children[0].textContent = 'Ajouter une note';

      buttonAddGrade.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        popup = document.querySelector('#' + popupID);
        blur = document.querySelector('#' + blurID);

        if (!popup) {
          // console.log(789, items.objectifMoyenne)
          const popupDatas = initPopup(popupID, blurID);
          popup = popupDatas[0];
          blur = popupDatas[1];

          await changePopupInnerHTML(userId, popup, blur, globalQuotient);

          // Fermer la popup
          function closePopup() {
            popup.classList.add('kmlc-popup-close');
            blur.classList.add('kmlc-blur-close');
          }

          // Événement pour fermer la popup en cliquant à l'extérieur
          blur.addEventListener('click', function (event) {
            if (event.target.classList.contains('kmlc-blur')) {
              closePopup();
            }
          });

          const gradeSimulationInputs = document.querySelectorAll(
            '[id *= kmlc-grade-simulation-input]:not([id *= title])'
          );

          gradeSimulationInputs.forEach(function (input) {
            input.addEventListener('keypress', function (event) {
              const charCode = event.which ? event.which : event.keyCode;

              // console.log(charCode)

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

          // Réinitialiser la popup après l'animation de fermeture
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
      });

      activeButton.parentElement.insertBefore(buttonAddGrade, activeButton);
    }

    reloadNoteSimulation(userId, globalQuotient);
  }

  async function changePopupInnerHTML(userId, popup, blur, globalQuotient) {
    await initUserSimulationNote(userId);
    const simulationNote = await getData('simulationNote');

    const subjectNames = document.querySelectorAll("[class *= 'nommatiere'] > b");
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
    );

    // console.log(simulationNote)

    let popupHTML = `
    <h2>Ajouter des Notes pour Simulation</h2>
    <ul class="kmlc-list">
    `;

    for (let i = 0; i < subjectNames.length; i++) {
      const subjectName = subjectNames[i].textContent;
      const subjectNameSerialized = subjectName
        .replaceAll(/[^a-zA-Z0-9 ]/g, '')
        .replaceAll(' ', '_');

      const userContent = simulationNote.find((item) => {
        if (item) if (item.id) return item.id == userId;
      });

      // console.log(userContent)
      let addedSubjectGradeTitle = '';
      let addedSubjectGradeValue = '';
      let addedSubjectGradeCoefficient = '';
      let addedSubjectGradeQuotient = '';

      if (userContent.periodes) {
        // console.log(111111)

        for (let j = 0; j < userContent.periodes.length; j++) {
          const userContentPeriode = userContent.periodes[j];
          // console.log(222222)
          const addedSubjectGrades = userContentPeriode.notes.ajouter[subjectName];
          // console.log(notesMatiere)

          if (addedSubjectGrades) {
            if (
              Number(actualPeriodeElement.getAttribute('dateDebut')) <=
                userContentPeriode.dateDebut &&
              userContentPeriode.dateFin <=
                Number(actualPeriodeElement.getAttribute('dateFin'))
            ) {
              addedSubjectGradeTitle =
                addedSubjectGrades[addedSubjectGrades.length - 1].titre;
              addedSubjectGradeValue =
                addedSubjectGrades[addedSubjectGrades.length - 1].note;
              addedSubjectGradeCoefficient =
                addedSubjectGrades[addedSubjectGrades.length - 1].coeff;
              addedSubjectGradeQuotient =
                addedSubjectGrades[addedSubjectGrades.length - 1].quotient;

              break;
            }
          }
        }
      }

      popupHTML +=
        `
      <ul class="kmlc-list">
        <li class="kmlc-item">
          <label class="kmlc-label">` +
        subjectName +
        `</label>
        </li>
        <li class="kmlc-item">
          <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-title-` +
        subjectNameSerialized +
        `" placeholder="Entrez le titre de la note" value="` +
        addedSubjectGradeTitle +
        `">
          <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-grade-` +
        subjectNameSerialized +
        `" placeholder="Entrez la valeur de la note" value="` +
        addedSubjectGradeValue +
        `">
        </li>
        <li class="kmlc-item">
          <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-coeff-` +
        subjectNameSerialized +
        `" placeholder="Entrez le coefficient de la note" value="` +
        addedSubjectGradeCoefficient +
        `">
          <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-quotient-` +
        subjectNameSerialized +
        `" placeholder="Entrez le quotient de la note" value="` +
        addedSubjectGradeQuotient +
        `">
        </li>
      <input type="checkbox" class="kmlc-checkbox" id="kmlc-grade-simulation-button-save-` +
        subjectNameSerialized +
        `">
      <label for="kmlc-grade-simulation-button-save-` +
        subjectNameSerialized +
        `" class="kmlc-checkbox-label">Sauvegarder</label>
        <li class="kmlc-item">
          <button id="kmlc-add-grade-simulation-button-` +
        subjectNameSerialized +
        `" class="kmlc-add-button" subject="` +
        subjectName +
        `">Ajouter la note</button>
        </li>
      </ul>
      `;
    }

    popupHTML += `
    </ul>
    <div class="kmlc-button-container">
      <button id="kmlc-remove-grade-simulation-button" class="kmlc-remove-button">Supprimer les notes ajoutées</button>
      <button id="kmlc-add-grade-simulation-button" class="kmlc-add-button">Valider les notes ajoutées</button>
    </div>
    `;

    popup.innerHTML = popupHTML;

    popup
      .querySelector('#kmlc-remove-grade-simulation-button')
      .addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        const inputBoxes = this.parentElement.parentElement.querySelectorAll('input');
        for (let i = 0; i < inputBoxes.length; i++) {
          inputBoxes[i].value = '';
        }

        await initUserSimulationNote(userId);
        const simulationNote = await getData('simulationNote');

        // console.log(simulationNote)

        const userContent = simulationNote.find((item) => {
          if (item) if (item.id) return item.id == userId;
        });

        const index = simulationNote.indexOf(userContent);

        const newUserContent = {id: userId, periodes: []};

        if (!simulationNote[index]) simulationNote.push(newUserContent);
        else simulationNote[index] = newUserContent;

        // console.log(dummy, userContent, index, simulationNote)

        await setData('simulationNote', simulationNote);
        await initUserSimulationNote(userId);

        await changePopupInnerHTML(userId, popup, blur, globalQuotient);

        const allSimulationElements = Array.from(document.querySelectorAll('*')).filter(
          (element) => {
            const attributes = Array.from(element.attributes);
            return attributes.some((attr) => attr.name.includes('kmlc-simu'));
          }
        );

        for (let i = 0; i < allSimulationElements.length; i++) {
          allSimulationElements[i].remove();
        }

        const allSimulationGradeElements = Array.from(
          document.querySelectorAll('*')
        ).filter((element) => {
          const attributes = Array.from(element.attributes);
          return attributes.some((attr) => attr.name.includes('kmlc-note-simu'));
        });

        for (let i = 0; i < allSimulationGradeElements.length; i++) {
          allSimulationGradeElements[i].remove();
        }
      });

    popup
      .querySelector('#kmlc-add-grade-simulation-button')
      .addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        blur.click();
        calculerMoyennes(3,
          globalQuotient,
          true,
          'kmlc-simu-moyenne-g',
          'color: green;',
          'kmlc-simu-moyenne',
          'color: green;',
          true
        );
        calculerMoyennes(4,
          globalQuotient,
          true,
          'kmlc-simu-modifier-moyenne-g',
          'border-bottom: 1px solid green; color: green;',
          'kmlc-simu-modifier-moyenne',
          'border-bottom: 1px solid green; color: green;'
        );
      });

    const addGradeButtons = popup.querySelectorAll(
      '[id *= kmlc-add-grade-simulation-button-]'
    );
    for (let i = 0; i < addGradeButtons.length; i++) {
      addGradeButtons[i].addEventListener('click', async function (e) {
        const subjectName = this.getAttribute('subject');
        const subjectNameSerialized = subjectName
          .replaceAll(/[^a-zA-Z0-9 ]/g, '')
          .replaceAll(' ', '_');

        // console.log(this, subjectGrade, this.parentElement.parentElement, this.parentElement.parentElement.querySelector("#" + "kmlc-grade-simulation-input-title-" + subjectGrade))

        let gradeTitle = this.parentElement.parentElement.querySelector(
          '#' + 'kmlc-grade-simulation-input-title-' + subjectNameSerialized
        ).value;
        let gradeValue = this.parentElement.parentElement
          .querySelector(
            '#' + 'kmlc-grade-simulation-input-grade-' + subjectNameSerialized
          )
          .value.replace(/[()\/\s]/g, '')
          .replace(',', '.')
          .replace(/[^\d+\-*/.\s]/g, '');
        let gradeCoefficient = this.parentElement.parentElement
          .querySelector(
            '#' + 'kmlc-grade-simulation-input-coeff-' + subjectNameSerialized
          )
          .value.replace(/[()\/\s]/g, '')
          .replace(',', '.')
          .replace(/[^\d+\-*/.\s]/g, '');
        let gradeQuotient = this.parentElement.parentElement
          .querySelector(
            '#' + 'kmlc-grade-simulation-input-quotient-' + subjectNameSerialized
          )
          .value.replace(/[()\/\s]/g, '')
          .replace(',', '.')
          .replace(/[^\d+\-*/.\s]/g, '');
        let saveGrade = this.parentElement.parentElement.querySelector(
          '#' + 'kmlc-grade-simulation-button-save-' + subjectNameSerialized
        ).checked;
        // console.log(save, this.parentElement.parentElement)

        if (gradeValue != '' && gradeValue != null) {
          if (gradeTitle == '' || gradeTitle == null) gradeTitle = 'Évaluation';

          if (gradeCoefficient == '' || gradeCoefficient == null) gradeCoefficient = '1';

          if (gradeQuotient == '' || gradeQuotient == null || gradeQuotient)
            gradeQuotient = globalQuotient;

          const dateNow = Date.now();

          await applyGradeSimulationGoal(
            subjectName,
            gradeTitle,
            gradeValue,
            gradeCoefficient,
            gradeQuotient,
            globalQuotient,
            dateNow,
            saveGrade
          );

          const inputBoxes = this.parentElement.parentElement.querySelectorAll('input');
          for (let j = 0; j < inputBoxes.length; j++) {
            inputBoxes[j].value = '';
          }
        }
      });
    }
  }

  async function applyGradeSimulationGoal(
    subjectName,
    gradeTitle,
    gradeValue,
    gradeCoefficient,
    gradeQuotient,
    globalQuotient,
    gradeId,
    saveGrade
  ) {
    ajouterNote(
      subjectName,
      gradeTitle,
      gradeValue,
      gradeCoefficient,
      gradeQuotient,
      globalQuotient,
      gradeId,
      saveGrade,
      false // Calculate global mean
    );

    if (!saveGrade) return;

    await initUserSimulationNote(userId);
    const simulationNote = await getData('simulationNote');
    const userContent = simulationNote.find((item) => {
      if (item) if (item.id) return item.id == userId;
    });

    const index = simulationNote.indexOf(userContent);
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
    );

    let skip = !false;

    for (let j = 0; j < userContent.periodes.length; j++) {
      const userContentPeriode = userContent.periodes[j];
      // If the subject exist we add the goal
      if (
        Number(actualPeriodeElement.getAttribute('dateDebut')) <=
          userContentPeriode.dateDebut &&
        userContentPeriode.dateFin <= Number(actualPeriodeElement.getAttribute('dateFin'))
      ) {
        if (userContentPeriode.notes.ajouter[subjectName]) {
          userContentPeriode.notes[subjectName].ajouter.push({
            titre: gradeTitle,
            note: gradeValue,
            coeff: gradeCoefficient,
            quotient: gradeQuotient,
            id: gradeId
          });
          skip = !true;
        }

        // If the subject not exist we add it and with the goal
        if (skip) {
          userContentPeriode.notes.ajouter[subjectName] = [];
          userContentPeriode.notes.ajouter[subjectName].push({
            titre: gradeTitle,
            note: gradeValue,
            coeff: gradeCoefficient,
            quotient: gradeQuotient,
            id: gradeId
          });
        }
      }
    }

    simulationNote[index] = userContent;

    // console.log(userContent)

    await setData('simulationNote', simulationNote);
  }

  async function reloadNoteSimulation(userId, globalQuotient) {
    await initUserSimulationNote(userId);

    const simulationNote = await getData('simulationNote');
    const userContent = simulationNote.find((item) => {
      if (item) if (item.id) return item.id == userId;
    });

    const subjectNames = document.querySelectorAll("[class *= 'nommatiere'] > b");
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
    );

    const addedGradesListDatas = []

    for (let i = 0; i < subjectNames.length; i++) {
      const subjectName = subjectNames[i].textContent;

      if (userContent.periodes) {
        for (let j = 0; j < userContent.periodes.length; j++) {
          // console.log(periodeElm.getAttribute("dateDebut"), userContent.periodes[j].dateDebut, periodeElm.getAttribute("dateFin"), userContent.periodes[j].dateFin)
          if (
            Number(actualPeriodeElement.getAttribute('dateDebut')) <=
              userContent.periodes[j].dateDebut &&
            userContent.periodes[j].dateFin <=
              Number(actualPeriodeElement.getAttribute('dateFin'))
          ) {
            const subjectGrades = userContent.periodes[j].notes.ajouter[subjectName];
            if (!subjectGrades) break;

            for (let k = 0; k < subjectGrades.length; k++) {
              const subjectGrade = subjectGrades[k];

              const subjectGradeName = subjectName;
              const gradeTitle = subjectGrade.titre;
              const gradeValue = subjectGrade.note;
              const gradeCoefficient = subjectGrade.coeff;
              const gradeQuotient = subjectGrade.quotient;
              const gradeId = subjectGrade.id;
              const save = true;
              
              addedGradesListDatas.push({
                subjectName: subjectGradeName,
                title: gradeTitle,
                value: gradeValue,
                coefficient: gradeCoefficient,
                quotient: gradeQuotient,
                id: gradeId,
                save: save
              })
            }
          }
        }
      }
    }

    for (let i = 0; i < addedGradesListDatas.length; i++) {
      let calculateGlobalMean = false;

      if (i == addedGradesListDatas.length - 1) {
        calculateGlobalMean = true;
      }

      ajouterNote(
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
  exports({ajouterNoteSimulation}).to('./features/Notes/ajouter-note-simulation.js');
})();

// function customSerialize(object) {
// if (Array.isArray(object)) {
// return object.map(item => customSerialize(item))
// } else if (typeof object === 'object' && object !== null) {
// const serializableobject = {}

// for (const key in object) {
// if (object.hasOwnProperty(key)) {
// serializableobject[key] = customSerialize(object[key])
// }
// }

// return serializableobject
// } else {
// return object
// }
// }
