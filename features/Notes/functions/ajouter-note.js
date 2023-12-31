(() => {
  const calculerMoyennes = imports('calculerMoyennes').from(
    './features/Notes/functions/calculer-moyennes.js'
  );

  const modifierNoteSimulation = imports('modifierNoteSimulation').from(
    './features/Notes/modifier-note-simulation.js'
  );

  function ajouterNote(
    subjectName,
    gradeTitle,
    gradeValue,
    gradePower,
    gradeQuotient,
    gradeId,
    saveGrade = false,
    calculateMeans = true
  ) {
    if (!document.querySelector("[id = '" + gradeId + "']")) {
      // Create the element containing the grade
      const newGradeElement = document.createElement('BUTTON');
      newGradeElement.setAttribute('kmlc-grade-simulation-temp', 'true');

      const listSubjects = document.querySelectorAll('[class *= nommatiere]');

      /*
       * I can copy a grade and modify everything but for the moment I use the outerHTML. It's unreliable in the long term
       * But It can be an advantage if there is no grade
       */

      for (let i = 0; i < listSubjects.length; i++) {
        const subject = listSubjects[i];

        if (subject.textContent == subjectName) {
          let subjectRow = subject.parentElement.parentElement;

          if (subjectRow.className.includes('kmlc-note-parent'))
            subjectRow = subjectRow.parentElement;

          subjectRow.querySelector("[class *= 'notes']").appendChild(newGradeElement);

          const classNewGradeElement =
            document.querySelector('button.note') != null
              ? document.querySelector('button.note').className
              : 'btn text-normal note margin-whitespace no-background no-padding ng-star-inserted';

          subjectRow.querySelector('[kmlc-grade-simulation-temp]').outerHTML =
            '<button type="button" kmlc-note-simu="true" id="' +
            gradeId +
            '" class="' +
            classNewGradeElement +
            '" title=" ' +
            gradeTitle +
            '" save="' +
            saveGrade +
            '"><span class="valeur ng-star-inserted" style="color: green;"> ' +
            gradeValue +
            ' <sup class="coef ng-star-inserted"> (' +
            gradePower +
            ') <span class="margin-whitespace"></span></sup><sub class="coef ng-star-inserted"> /' +
            gradeQuotient +
            ' <span class="margin-whitespace"></span></sub></span></button>';
        }
      }
    }

    // We calculate the averages
    if (calculateMeans) {
      calculerMoyennes(
        true,
        'kmlc-simu-moyenne-g',
        'color: green;',
        'kmlc-simu-moyenne',
        'color: green;',
        true
      );

      if (document.querySelector('[kmlc-note-simu-modifier]')) {
        calculerMoyennes(
          true,
          'kmlc-simu-modifier-moyenne-g',
          'border-bottom: 1px solid green; color: green;',
          'kmlc-simu-modifier-moyenne',
          'border-bottom: 1px solid green; color: green;'
        );
      }
    }

    modifierNoteSimulation();
  }

  exports({ajouterNote}).to('./features/Notes/functions/ajouter-note.js');
})();
