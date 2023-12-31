(() => {
  const calculerMoyennes = imports('calculerMoyennes').from(
    './features/Notes/functions/calculer-moyennes.js'
  );
  const modifierNote = imports('modifierNote').from(
    './features/Notes/functions/modifier-note.js'
  );

  function modifierNoteSimulation() {
    // If the table in the bottom was changed and then we add the text "Note modifiée"
    const tableCaptionTitleElement = document.querySelector('table caption');
    if (
      !document.querySelector('[kmlc-text-modifier-note]') &&
      tableCaptionTitleElement
    ) {
      const tableCaptionElement = tableCaptionTitleElement.parentElement;
      const tableCaptionItemElement = tableCaptionElement
        .getElementsByContentText('(note)')
        .startsWith[0].cloneNode(true);
      tableCaptionItemElement.setAttribute('kmlc-text-modifier-note', 'true');
      tableCaptionItemElement.children[0].textContent = '';
      tableCaptionItemElement.children[0].setAttribute('style', '');
      tableCaptionItemElement.children[1].textContent = 'Note modifiée';
      tableCaptionItemElement.setAttribute('kmlc-text-modifier-note', 'true');

      const tableCaptionTextElement = document.createElement('SPAN');
      tableCaptionTextElement.textContent = 'note';
      tableCaptionTextElement.setAttribute('style', 'border-bottom: 1px solid green;');

      tableCaptionElement
        .getElementsByContentText('(note)')
        .startsWith[0].insertAfter(tableCaptionItemElement);
      tableCaptionItemElement.children[0].appendChild(tableCaptionTextElement);
    }

    // Get all the grades that they don't have the right click listener
    const allNonListenedGrades = document.querySelectorAll(
      'span.valeur:not([kmlc-event-listener])'
    );
    // console.log("No right click listener", matNotes)

    for (let i = 0; i < allNonListenedGrades.length; i++) {
      // console.log(matNotes[i])
      // Add the attribute to know that the click listener has been added
      allNonListenedGrades[i].setAttribute('kmlc-event-listener', 'true');
      allNonListenedGrades[i].addEventListener(
        'contextmenu',
        async function (e) {
          e.stopPropagation();
          e.preventDefault();
          const gradeModificationId = Date.now();
          const gradeElement = this;

          const popupID = 'kmlc-modifierNote-popup';
          const blurID = 'kmlc-modifierNote-blur';

          let popup = document.querySelector('#' + popupID);
          let blur = document.querySelector('#' + blurID);

          if (!popup) {
            const popupDatas = globalThis.Utils.initPopup(popupID, blurID);
            popup = popupDatas[0];
            blur = popupDatas[1];
          }

          let gradeId = gradeElement.parentElement.getAttribute('id');
          if (!gradeId) gradeId = false;

          await changePopupInnerHTML(popup, blur, gradeId, gradeElement);

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

          const editGradeSimulationInputs = document.querySelectorAll(
            '[id *= kmlc-grade-simulation-input]:not([id *= title])'
          );

          editGradeSimulationInputs.forEach(function (input) {
            input.addEventListener('keypress', function (event) {
              const characterCode = event.which ? event.which : event.keyCode;
              if (
                (characterCode !== 8 && // Touche de suppression (Backspace)
                  characterCode !== 44 && // Virgule (,)
                  characterCode !== 46 && // Point (.)
                  characterCode < 48) || // Chiffres (0-9)
                characterCode > 57
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

          popup.setAttribute('style', 'width: 80%; height: 80%;');
          blur.setAttribute('style', '');
        },
        false
      );
    }
    reloadNoteSimulation();
  }

  async function changePopupInnerHTML(popup, blur, gradeId, gradeElement) {
    await globalThis.Utils.initUserSimulationNote(globalThis.userId);
    const simulationNote = await globalThis.Utils.getData('simulationNote');

    const userContent = simulationNote.find((item) => {
      if (item) if (item.id) return item.id == globalThis.userId;
    });

    const gradeSubject =
      gradeElement.parentElement.parentElement.parentElement.querySelector(
        '[class *= nommatiere] > b'
      ).textContent;
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
    );

    // console.log(simulationNote)

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
      gradeTitle = gradeElement.parentElement.getAttribute('title').substring(1);
    }
    if (gradeElement.childNodes[0]) {
      gradeValue = gradeElement.childNodes[0].textContent
        .replace(/[()\/\s]/g, '')
        .replace(',', '.')
        .replace(/[^\d+\-*/.\s]/g, '');
    }
    if (gradeElement.querySelector('sup')) {
      gradeCoefficient = gradeElement
        .querySelector('sup')
        .textContent.replace(/[()\/\s]/g, '')
        .replace(',', '.')
        .replace(/[^\d+\-*/.\s]/g, '');
    }
    if (gradeElement.querySelector('sub')) {
      gradeQuotient = gradeElement
        .querySelector('sub')
        .textContent.replace(/[()\/\s]/g, '')
        .replace(',', '.')
        .replace(/[^\d+\-*/.\s]/g, '');
    }
    if (gradeId) {
      gradeSave = true;
    }

    popupHTML +=
      `
  <ul class="kmlc-list">
    <li class="kmlc-item">
      <label class="kmlc-label">` +
      gradeSubject +
      `</label>
    </li>
    <li class="kmlc-item">
      <input type="text" class="kmlc-input" id="kmlc-modification-grade-simulation-input-title" placeholder="Entrez votre titre pour la note" value="` +
      gradeTitle +
      `">
      <input type="text" class="kmlc-input" id="kmlc-modification-grade-simulation-input-grade" placeholder="Entrez votre note" value="` +
      gradeValue +
      `">
    </li>
    <li class="kmlc-item">
      <input type="text" class="kmlc-input" id="kmlc-modification-grade-simulation-input-coeff" placeholder="Entrez votre coefficient pour la note" value="` +
      gradeCoefficient +
      `">
      <input type="text" class="kmlc-input" id="kmlc-modification-grade-simulation-input-quotient" placeholder="Entrez votre quotient de note" value="` +
      gradeQuotient +
      `">
    </li>
	<input type="checkbox" class="kmlc-checkbox" id="kmlc-modification-grade-simulation-button-save" checked=` +
      gradeSave +
      `>
	<label for="kmlc-modification-grade-simulation-button-save" class="kmlc-modification-checkbox-label">Sauvegarder</label>
	<li class="kmlc-button-container" style="text-align: center;">
      <button id="kmlc-modification-add-grade-simulation-button" class="kmlc-add-button" subject="` +
      gradeSubject +
      `">Modifier la note</button>
      <button id="kmlc-modification-clear-grade-simulation-button" class="kmlc-remove-button" subject="` +
      gradeSubject +
      `">Réinitialiser</button>
	</li>
  </ul>`;

    popupHTML += `
</ul>
<div class="kmlc-button-container">
  <button id="kmlc-modification-push-grade-simulation-button" class="kmlc-add-button">Sauvegarder et Calculer</button>
  <button id="kmlc-modification-remove-grade-simulation-button" class="kmlc-remove-button">Supprimer les notes modifiées</button>
</div>
`;

    popup.innerHTML = popupHTML;

    const addGradeButtons = popup.querySelectorAll(
      '[id = kmlc-modification-add-grade-simulation-button]'
    );
    for (let i = 0; i < addGradeButtons.length; i++) {
      addGradeButtons[i].addEventListener('click', async function (e) {
        let subjectGrade =
          gradeElement.parentElement.parentElement.parentElement.querySelector(
            "[class *= 'nommatiere'] > b"
          ).textContent;
        let dateNow = Date.now();

        // console.log(gradeElement, subjectGrade)

        const newGradeTitle = this.parentElement.parentElement.querySelector(
          '#kmlc-modification-grade-simulation-input-title'
        ).value;
        const newGradeValue = this.parentElement.parentElement
          .querySelector('#kmlc-modification-grade-simulation-input-grade')
          .value.replace(/[()\/\s]/g, '')
          .replace(',', '.')
          .replace(/[^\d+\-*/.\s]/g, '');
        const newGradeCoefficient = this.parentElement.parentElement
          .querySelector('#kmlc-modification-grade-simulation-input-coeff')
          .value.replace(/[()\/\s]/g, '')
          .replace(',', '.')
          .replace(/[^\d+\-*/.\s]/g, '');
        const newGradeQuotient = this.parentElement.parentElement
          .querySelector('#kmlc-modification-grade-simulation-input-quotient')
          .value.replace(/[()\/\s]/g, '')
          .replace(',', '.')
          .replace(/[^\d+\-*/.\s]/g, '');
        let save = this.parentElement.parentElement.querySelector(
          '#kmlc-modification-grade-simulation-button-save'
        ).checked;

        // console.log(123)

        // If nothing return
        if (
          newGradeTitle != '' &&
          newGradeValue != '' &&
          newGradeCoefficient != '' &&
          newGradeQuotient != ''
        )
          return;

        let skip = 0;

        // If he put a new value but it's the same than the old one or he put an invalid value we add 1 to the pass variable
        if (newGradeTitle == '') {
          newGradeTitle = gradeElement.parentElement.getAttribute('title');
          skip += 1;
        } else {
          if (newGradeTitle == gradeElement.parentElement.getAttribute('title')) {
            skip += 1;
          } else {
            newGradeTitle = ' ' + newGradeTitle;
          }
        }

        newGradeValue = newGradeValue
          .replace(/[()\/\s]/g, '')
          .replace(',', '.')
          .replace(/[^\d+\-*/.\s]/g, '');
        if (newGradeValue == '') {
          newGradeValue = gradeElement.childNodes[0].nodeValue
            .replace(/[()\/\s]/g, '')
            .replace(',', '.')
            .replace(/[^\d+\-*/.\s]/g, '');
          skip += 1;
        } else {
          newGradeValue = newGradeValue
            .replace(/[()\/\s]/g, '')
            .replace(',', '.')
            .replace(/[^\d+\-*/.\s]/g, '');

          if (
            newGradeValue ==
            gradeElement.childNodes[0].nodeValue
              .replace(/[()\/\s]/g, '')
              .replace(',', '.')
              .replace(/[^\d+\-*/.\s]/g, '')
          )
            skip += 1;
        }

        newGradeCoefficient = newGradeCoefficient
          .replace(/[()\/\s]/g, '')
          .replace(',', '.')
          .replace(/[^\d+\-*/.\s]/g, '');
        if (newGradeCoefficient == '') {
          if (gradeElement.querySelector('sup'))
            newGradeCoefficient = gradeElement
              .querySelector('sup')
              .textContent.replace(/[()\/\s]/g, '')
              .replace(',', '.')
              .replace(/[^\d+\-*/.\s]/g, '');
          else newGradeCoefficient = 1.0;

          skip += 1;
        } else {
          if (gradeElement.querySelector('sup'))
            if (
              newGradeCoefficient ==
              gradeElement
                .querySelector('sup')
                .textContent.replace(/[()\/\s]/g, '')
                .replace(',', '.')
                .replace(/[^\d+\-*/.\s]/g, '')
            )
              skip += 1;
        }

        newGradeQuotient = newGradeQuotient
          .replace(/[()\/\s]/g, '')
          .replace(',', '.')
          .replace(/[^\d+\-*/.\s]/g, '');
        if (newGradeQuotient == '') {
          if (gradeElement.querySelector('sub'))
            newGradeQuotient = gradeElement
              .querySelector('sub')
              .textContent.replace(/[()\/\s]/g, '')
              .replace(',', '.')
              .replace(/[^\d+\-*/.\s]/g, '');
          else newGradeQuotient = globalThis.quotient;

          skip += 1;
        } else {
          if (gradeElement.querySelector('sub'))
            if (
              newGradeQuotient ==
              gradeElement
                .querySelector('sub')
                .textContent.replace(/[()\/\s]/g, '')
                .replace(',', '.')
                .replace(/[^\d+\-*/.\s]/g, '')
            )
              skip += 1;
          if (newGradeQuotient == globalThis.quotient) skip += 1;
        }

        // If pass == 4 it means that no changes have to be done
        if (skip == 4) return;

        await applyGradeSimulationGoal(
          subjectGrade,
          newGradeTitle,
          newGradeValue,
          newGradeCoefficient,
          newGradeQuotient,
          dateNow,
          gradeElement,
          gradeId,
          save
        );

        clearInputsAndButtons(this.parentElement.parentElement);
      });
    }

    const clearGradeModificationButtons = popup.querySelectorAll(
      '[id = kmlc-modification-clear-grade-simulation-button]'
    );
    for (let i = 0; i < addGradeButtons.length; i++) {
      clearGradeModificationButtons[i].addEventListener('click', async function (e) {
        clearInputsAndButtons(this.parentElement.parentElement);
      });
    }

    popup
      .querySelector('#kmlc-modification-remove-grade-simulation-button')
      .addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        await globalThis.Utils.initUserSimulationNote(globalThis.userId);
        const simulationNote = await globalThis.Utils.getData('simulationNote');

        const userContent = simulationNote.find((item) => {
          if (item) if (item.id) return item.id == globalThis.userId;
        });

        const indexOfUserContent = simulationNote.indexOf(userContent);

        clearInputsAndButtons(this.parentElement.parentElement);

        for (let i = 0; i < userContent.periodes.length; i++) {
          userContent.periodes[i].notes.modifier = {};
        }

        simulationNote[indexOfUserContent] = userContent;

        await globalThis.Utils.setData('simulationNote', simulationNote);
        await globalThis.Utils.initUserSimulationNote(globalThis.userId);

        const allSimulationSubjectMeansElements = Array.from(
          document.querySelectorAll('*')
        ).filter((element) => {
          const attributes = Array.from(element.attributes);
          return attributes.some((attr) => attr.name.includes('kmlc-simu-modifier'));
        });

        for (let i = 0; i < allSimulationSubjectMeansElements.length; i++) {
          allSimulationSubjectMeansElements[i].remove();
        }

        const allGradesSimulationElements = Array.from(
          document.querySelectorAll('*')
        ).filter((element) => {
          const attributes = Array.from(element.attributes);
          return attributes.some((attr) => attr.name.includes('kmlc-note-simu-modifier'));
        });

        for (let i = 0; i < allGradesSimulationElements.length; i++) {
          const gradeSimulationElement =
            allGradesSimulationElements[i].querySelector('[class *= valeur]');
          gradeSimulationElement.setAttribute(
            'style',
            gradeSimulationElement
              .getAttribute('style')
              .replace('border-bottom: 1px solid green;', '')
          );

          gradeSimulationElement.childNodes[0].textContent =
            ' ' + gradeSimulationElement.getAttribute('ancienneNote') + ' ';
          gradeSimulationElement.removeAttribute('ancienneNote');

          gradeSimulationElement.querySelector('sup').textContent =
            gradeSimulationElement.getAttribute('ancienCoeff');
          gradeSimulationElement.removeAttribute('ancienCoeff');

          gradeSimulationElement.querySelector('sub').textContent =
            gradeSimulationElement.getAttribute('ancienQuotient');
          gradeSimulationElement.removeAttribute('ancienQuotient');
        }

        blur.click();
      });

    popup
      .querySelector('#kmlc-modification-push-grade-simulation-button')
      .addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        blur.click();
        calculerMoyennes(
          true,
          'kmlc-simu-modifier-moyenne-g',
          'border-bottom: 1px solid green; color: green;',
          'kmlc-simu-modifier-moyenne',
          'border-bottom: 1px solid green; color: green;'
        );
      });
  }

  function clearInputsAndButtons(popupOrChild) {
    // console.log("supp")
    const inputBoxes = popupOrChild.querySelectorAll(
      'input[type="text"]:not([type="checkbox"])'
    );
    for (let i = 0; i < inputBoxes.length; i++) {
      inputBoxes[i].value = '';
    }

    const saveButtons = popupOrChild.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < saveButtons.length; i++) {
      saveButtons[i].checked = false;
    }
  }

  async function applyGradeSimulationGoal(
    subjectGrade,
    gradeTitle,
    gradeValue,
    gradeCoefficient,
    gradeQuotient,
    gradeModificationId,
    gradeElement,
    gradeId,
    save
  ) {
    let go = globalThis.Notes.modifierNote(
      subjectGrade,
      gradeTitle,
      gradeValue,
      gradeCoefficient,
      gradeQuotient,
      gradeModificationId,
      gradeElement,
      gradeId,
      save
    );

    if (!save) return;

    if (go) {
      await globalThis.Utils.initUserSimulationNote(globalThis.userId);
      const simulationNote = await globalThis.Utils.getData('simulationNote');

      const userContent = simulationNote.find((item) => {
        if (item) if (item.id) return item.id == globalThis.userId;
      });

      const indexOfUserContent = simulationNote.indexOf(userContent);
      const actualPeriodeElement = document.querySelector(
        "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
      );

      for (let i = 0; i < userContent.periodes.length; i++) {
        if (
          Number(actualPeriodeElement.getAttribute('dateDebut')) <=
            userContent.periodes[i].dateDebut &&
          userContent.periodes[i].dateFin <=
            Number(actualPeriodeElement.getAttribute('dateFin'))
        ) {
          let exist = false;

          if (userContent.periodes[i].notes.modifier[subjectGrade] == undefined)
            userContent.periodes[i].notes.modifier[subjectGrade] = [];

          for (
            let j = 0;
            j < userContent.periodes[i].notes.modifier[subjectGrade].length;
            j++
          ) {
            if (
              userContent.periodes[i].notes.modifier[subjectGrade][j].gradeSimulationId ==
              gradeId
            ) {
              userContent.periodes[i].notes.modifier[subjectGrade][j].titre = gradeTitle;
              userContent.periodes[i].notes.modifier[subjectGrade][j].note =
                parseFloat(gradeValue);
              userContent.periodes[i].notes.modifier[subjectGrade][j].coeff =
                parseFloat(gradeCoefficient);
              userContent.periodes[i].notes.modifier[subjectGrade][j].quotient =
                parseFloat(gradeQuotient);
              userContent.periodes[i].notes.modifier[subjectGrade][j].gradeModifId =
                gradeModificationId;
              exist = true;
            }
          }

          // If the subject not exist we add it and with the goal
          if (!exist) {
            userContent.periodes[i].notes.modifier[subjectGrade] = [];
            // console.log(userContent, userContent.periodes[i].notes, userContent.periodes[i].notes[subjectGrade])
            userContent.periodes[i].notes.modifier[subjectGrade].push({
              titre: gradeTitle,
              note: parseFloat(gradeValue),
              coeff: parseFloat(gradeCoefficient),
              quotient: parseFloat(gradeQuotient),
              gradeSimulationId: parseFloat(gradeId),
              gradeModifId: gradeModificationId
            });
          }

          // console.log(userContent, existe)
        }
      }

      simulationNote[indexOfUserContent] = userContent;
      await globalThis.Utils.setData('simulationNote', simulationNote);
    } else {
      console.log('You are asking a very hard work');
    }
  }

  async function reloadNoteSimulation() {
    await globalThis.Utils.initUserSimulationNote(globalThis.userId);
    const simulationNote = await globalThis.Utils.getData('simulationNote');

    const userContent = simulationNote.find((item) => {
      if (item) if (item.id) return item.id == globalThis.userId;
    });

    const subjectGrades = document.querySelectorAll("[class *= 'nommatiere'] > b");
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
    );

    // console.log(userContent)

    for (let i = 0; i < subjectGrades.length; i++) {
      if (userContent.periodes) {
        for (let j = 0; j < userContent.periodes.length; j++) {
          // console.log(periodeElm.getAttribute("dateDebut"), userContent.periodes[j].dateDebut, periodeElm.getAttribute("dateFin"), userContent.periodes[j].dateFin)
          if (
            Number(actualPeriodeElement.getAttribute('dateDebut')) <=
              userContent.periodes[j].dateDebut &&
            userContent.periodes[j].dateFin <=
              Number(actualPeriodeElement.getAttribute('dateFin'))
          ) {
            let notesMatiere =
              userContent.periodes[j].notes.modifier[subjectGrades[i].textContent];
            // console.log(notesMatiere, nomMatieres[i].textContent, userContent)
            if (!notesMatiere) continue;

            for (let k = 0; k < notesMatiere.length; k++) {
              let subjectGrade = subjectGrades[i].textContent;
              let titleGrade = notesMatiere[k].titre;
              let gradeValue = notesMatiere[k].note;
              let coeffGrade = notesMatiere[k].coeff;
              let quotientGrade = notesMatiere[k].quotient;
              let gradeSimulationId = notesMatiere[k].gradeSimulationId;
              let gradeModifId = notesMatiere[k].gradeModifId;
              let save = true;

              console.log(
                subjectGrade,
                titleGrade,
                gradeValue,
                coeffGrade,
                quotientGrade,
                gradeModifId,
                false,
                gradeSimulationId,
                save
              );

              modifierNote(
                subjectGrade,
                titleGrade,
                gradeValue,
                coeffGrade,
                quotientGrade,
                gradeModifId,
                false,
                gradeSimulationId,
                save
              );
            }
          }
        }
      }
    }
  }

  exports({modifierNoteSimulation}).to('./features/Notes/modifier-note-simulation.js');
})();
