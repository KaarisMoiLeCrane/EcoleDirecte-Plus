(() => {
  /**
   * Adds note IDs to the grade elements in the DOM based on the current period.
   * @param {Object} gradesData - The data containing the grades information.
   */
  function addGradeId(gradesData) {
    const actualPeriodeElement = document.querySelector(
<<<<<<< HEAD:features/Notes/add-grade-id.js
      "ul[class*='tabs'] > li > [class*='nav-link active']"
=======
      "ul[class*='tabs'] > li > [class*='nav-link'][class*='active']"
>>>>>>> features:src/Notes/add-grade-id.js
    );

    const actualCodePeriode = actualPeriodeElement.getAttribute('codePeriode');
    const actualDateStart = Number(actualPeriodeElement.getAttribute('dateDebut'));
    const actualDateEnd = Number(actualPeriodeElement.getAttribute('dateFin'));

    const actualPeriodeIsR = JSON.parse(actualPeriodeElement.getAttribute('R'));
    const actualPeriodeIsX = JSON.parse(actualPeriodeElement.getAttribute('X'));
    const actualPeriodeIsZ = JSON.parse(actualPeriodeElement.getAttribute('Z'));

    const elementSubjectsGrades = document.querySelectorAll('.notes:has(button)');

    if (debug)
      console.log('[DEBUG] addGradeId', 'Period Information:', {
        actualCodePeriode,
        actualDateStart,
        actualDateEnd,
        actualPeriodeIsR,
        actualPeriodeIsX,
        actualPeriodeIsZ
      });

    const gradesDataClean = [];

    // Duplicate the response of the HTTP request to modify it later
    const gradesDataDuplicate = JSON.parse(JSON.stringify(gradesData));

    // Process each grade
    gradesDataDuplicate.notes.forEach((note, index) => {
      let skip = false;
      const dateSaisie = note.dateSaisie.kmlcConvertToTimestamp();
      const date = note.date.kmlcConvertToTimestamp();

      // Check if the grade is within the period
      if (
        (actualPeriodeIsR &&
          !actualPeriodeIsX &&
          !actualPeriodeIsZ &&
          actualDateStart <= date &&
          date <= actualDateEnd) ||
        (!actualPeriodeIsR &&
          !actualPeriodeIsX &&
          !actualPeriodeIsZ &&
          actualDateStart <= dateSaisie &&
          dateSaisie <= actualDateEnd) ||
        (!actualPeriodeIsR &&
          actualPeriodeIsX &&
          !actualPeriodeIsZ &&
          actualDateStart <= dateSaisie &&
          dateSaisie <= actualDateEnd &&
          note.codePeriode.includes(actualCodePeriode)) ||
        (!actualPeriodeIsR &&
          !actualPeriodeIsX &&
          actualPeriodeIsZ &&
          actualDateStart <= dateSaisie &&
          dateSaisie <= actualDateEnd)
      ) {
        skip = true;
      }

      if (skip) {
        note.id = Number(note.id);
        gradesDataClean.push(note);
      }

      if (debug)
        console.log('[DEBUG] addGradeId', 'Processed Grade', {
          index,
          skip,
          note
        });
    });

    if (gradesDataClean.length) {
      const sortedGrades = sortGradesBySubject(gradesDataClean);

      if (debug) console.log('[DEBUG] addGradeId', 'Sorted Grades', sortedGrades);

      assignGradeIdsToElements(sortedGrades, elementSubjectsGrades);
    }
  }

  /**
   * Sorts grades by their subject.
   * @param {Array} gradesDataClean - The cleaned list of grades.
   * @returns {Object} - The sorted grades by subject.
   */
  function sortGradesBySubject(gradesDataClean) {
    const sortedGrades = {};

    gradesDataClean.forEach((grade) => {
      const gradeSubjectName = grade.libelleMatiere;

      if (!sortedGrades[gradeSubjectName]) {
        sortedGrades[gradeSubjectName] = [];
      }

      sortedGrades[gradeSubjectName].push(grade);
    });

    return sortedGrades;
  }

  /**
   * Assigns grade IDs to the corresponding elements in the DOM.
   * @param {Object} sortedGrades - The sorted grades by subject.
   * @param {NodeList} elementSubjectsGrades - The elements representing subjects' grades.
   */
  function assignGradeIdsToElements(sortedGrades, elementSubjectsGrades) {
    elementSubjectsGrades.forEach((elementSubjectGrades) => {
      const subjectName =
        elementSubjectGrades.parentElement.querySelector('.nommatiere').textContent;
      const subjectGrades = sortedGrades[subjectName];

      if (subjectGrades) {
        subjectGrades.forEach((grade, index) => {
          elementSubjectGrades.children[index].setAttribute('id', grade.id);
        });
      }
    });
  }

<<<<<<< HEAD:features/Notes/add-grade-id.js
  exports({addGradeId}).to('./features/Notes/add-grade-id.js');
=======
  exports({addGradeId}).to('./src/Notes/add-grade-id.js');
>>>>>>> features:src/Notes/add-grade-id.js
})();
