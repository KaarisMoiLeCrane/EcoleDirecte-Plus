(() => {
  // Importing necessary functions from other modules
  const calculateMeans = imports('calculateMeans').from(
<<<<<<< HEAD:features/Notes/functions/add-grade.js
    './features/Notes/functions/calculate-means.js'
  );
  const editGradeSimulation = imports('editGradeSimulation').from(
    './features/Notes/edit-grade-simulation.js'
=======
    './src/Notes/functions/calculate-means.js'
  );
  const editGradeSimulation = imports('editGradeSimulation').from(
    './src/Notes/edit-grade-simulation.js'
>>>>>>> features:src/Notes/functions/add-grade.js
  );

  /**
   * Adds a grade to a subject.
   *
   * @param {string} subjectName - Name of the subject.
   * @param {string} gradeTitle - Title of the grade.
   * @param {number} gradeValue - Numeric value of the grade.
   * @param {number} gradePower - Power coefficient of the grade.
   * @param {number} gradeQuotient - Quotient associated with the grade.
   * @param {number} globalQuotient - Global quotient for calculating means.
   * @param {string} gradeId - Unique identifier for the grade.
   * @param {boolean} saveGrade - Whether the grade should be saved.
   * @param {boolean} doCalculateMeans - Whether to calculate means after adding the grade.
   */
  function addGrade(
    userId,
    subjectName,
    gradeTitle,
    gradeValue,
    gradePower,
    gradeQuotient,
    globalQuotient,
    gradeId,
    saveGrade = false,
    doCalculateMeans = true
  ) {
    if (debug)
      console.log(
        '[DEBUG]',
        'addGrade',
        'Function called',
        subjectName,
        gradeTitle,
        gradeValue,
        gradePower,
        gradeQuotient,
        globalQuotient,
        gradeId,
        saveGrade,
        doCalculateMeans
      );

    const existingGradeElement = document.querySelector(`[id='${gradeId}']`);

    if (!existingGradeElement) {
      if (debug)
        console.log('[DEBUG]', 'addGrade', 'No existing grade element found', gradeId);

      const newGradeElement = document.createElement('button');
      newGradeElement.setAttribute('kmlc-grade-simulation-temp', 'true');

      const listSubjects = document.querySelectorAll('[class *= nommatiere]');
      if (debug)
        console.log('[DEBUG]', 'addGrade', 'List of subjects retrieved', listSubjects);

      for (const subject of listSubjects) {
        if (subject.textContent.trim() === subjectName) {
          if (debug)
            console.log('[DEBUG]', 'addGrade', 'Matching subject found', {
              subjectName,
              subject
            });

          const subjectRow = subject.closest('.kmlc-tooltip-parent')
            ? subject.closest('.kmlc-tooltip-parent').parentElement
            : subject.parentElement.parentElement;
          const gradesContainer = subjectRow.querySelector("[class *= 'notes']");
          gradesContainer.appendChild(newGradeElement);

          const classNewGradeElement =
            document.querySelector('button.note')?.className ||
<<<<<<< HEAD:features/Notes/functions/add-grade.js
            'btn text-normal note margin-whitespace no-background no-padding ng-star-inserted';
=======
            'btn text-normal note margin-whitespace no-background no-padding';
>>>>>>> features:src/Notes/functions/add-grade.js
          if (debug)
            console.log(
              '[DEBUG]',
              'addGrade',
              'Class for new grade element determined',
              classNewGradeElement
            );

          newGradeElement.outerHTML = `
            <button type="button" kmlc-simulation-grades="true" id="${gradeId}" class="${classNewGradeElement}" title="${gradeTitle}" save="${saveGrade}">
<<<<<<< HEAD:features/Notes/functions/add-grade.js
              <span class="valeur ng-star-inserted" style="color: green;">
                ${gradeValue}
                <sup class="coef ng-star-inserted"> (${gradePower}) </sup>
                <sub class="coef ng-star-inserted"> /${gradeQuotient} </sub>
=======
              <span class="valeur" style="color: green;">
                ${gradeValue}
                <sup class="coef"> (${gradePower}) </sup>
                <sub class="coef"> /${gradeQuotient} </sub>
>>>>>>> features:src/Notes/functions/add-grade.js
              </span>
            </button>
          `;
          if (debug)
            console.log('[DEBUG]', 'addGrade', 'New grade element added', subjectName);
        }
      }
    } else {
      if (debug)
        console.log('[DEBUG]', 'addGrade', 'Grade element already exists', gradeId);
    }

    if (doCalculateMeans) {
      if (debug) console.log('[DEBUG]', 'addGrade', 'Calculating averages');
      calculateMeans(
        6,
        globalQuotient,
        true,
        'kmlc-simulation-global-mean',
        'color: green;',
        'kmlc-simulation-means',
        'color: green;',
        true
      );

      if (document.querySelector('[kmlc-simulation-edited-grades]')) {
        if (debug) console.log('[DEBUG]', 'addGrade', 'Calculating modifier averages');
        calculateMeans(
          7,
          globalQuotient,
          true,
          'kmlc-simulation-edited-global-mean',
          'border-bottom: 1px solid green; color: green;',
          'kmlc-simulation-edited-means',
          'border-bottom: 1px solid green; color: green;'
        );
      }
    }

    editGradeSimulation(userId, globalQuotient);
    if (debug) console.log('[DEBUG]', 'addGrade', 'Note simulation modified');
  }

<<<<<<< HEAD:features/Notes/functions/add-grade.js
  exports({addGrade}).to('./features/Notes/functions/add-grade.js');
=======
  exports({addGrade}).to('./src/Notes/functions/add-grade.js');
>>>>>>> features:src/Notes/functions/add-grade.js
})();
