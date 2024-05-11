(() => {
  function ajouterNoteId(gradesData) {
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
    );

    const actualCodePeriode = actualPeriodeElement.getAttribute('codePeriode');
    const actualDateStart = Number(actualPeriodeElement.getAttribute('dateDebut'));
    const actualDateEnd = Number(actualPeriodeElement.getAttribute('dateFin'));

    const actualPeriodeIsR = JSON.parse(actualPeriodeElement.getAttribute('R'));
    const actualPeriodeIsX = JSON.parse(actualPeriodeElement.getAttribute('X'));
    const actualPeriodeIsZ = JSON.parse(actualPeriodeElement.getAttribute('Z'));

    const elementSubjectsGrades = document.querySelectorAll('.notes:has(button)');

    // console.log(codePeriode, dateDebut, dateFin, isR)

    const gradesDataClean = [];

    // We duplicate the response of the http request because we will modify it later
    const gradesDataDuplicate = JSON.parse(JSON.stringify(gradesData));

    // For each grade
    for (let i = 0; i < gradesDataDuplicate.notes.length; i++) {
      // console.log(dateDebut, varNote.notes[i].date.kmlcConvertToTimestamp(), varNote.notes[i].dateSaisie.kmlcConvertToTimestamp(), dateFin)

      // Is significant
      let skip = !true;
      const dateSaisie = gradesDataDuplicate.notes[i].dateSaisie.kmlcConvertToTimestamp();
      const date = gradesDataDuplicate.notes[i].date.kmlcConvertToTimestamp();

      // console.log(codePeriode, codePeriode.includes("R"))
      // We check if each grade is between the date of start and end
      if (
        actualPeriodeIsR &&
        !actualPeriodeIsX &&
        !actualPeriodeIsZ &&
        actualDateStart <= date &&
        date <= actualDateEnd
      )
        skip = !false;

      if (
        !actualPeriodeIsR &&
        !actualPeriodeIsX &&
        !actualPeriodeIsZ &&
        actualDateStart <= dateSaisie &&
        dateSaisie <= actualDateEnd
      )
        skip = !false;

      if (
        !actualPeriodeIsR &&
        actualPeriodeIsX &&
        !actualPeriodeIsZ &&
        actualDateStart <= dateSaisie &&
        dateSaisie <= actualDateEnd &&
        gradesDataDuplicate.notes[i].codePeriode.includes(actualCodePeriode)
      )
        skip = !false;

      if (
        !actualPeriodeIsR &&
        !actualPeriodeIsX &&
        actualPeriodeIsZ &&
        actualDateStart <= dateSaisie &&
        dateSaisie <= actualDateEnd
      )
        skip = !false;

      if (skip) {
        // console.log(gradesDataDuplicate.notes[i], actualPeriodeIsR, actualCodePeriode, actualDateStart, actualDateEnd)
        gradesDataDuplicate.notes[i].id = Number(gradesDataDuplicate.notes[i].id);
        gradesDataClean.push(gradesDataDuplicate.notes[i]);
      }
    }

    if (gradesDataClean.length) {
      // For each grade

      const sortedGrades = {};
      for (let i = 0; i < gradesDataClean.length; i++) {
        // We get all the grades before the actual grade and the actual grade and we push the whole array to sortedGrades
        // We sort all the grades by subject in an object (and also by date)

        const gradeSubjectName = gradesDataClean[i].libelleMatiere;

        if (!sortedGrades[gradeSubjectName]) {
          sortedGrades[gradeSubjectName] = [];
        }

        sortedGrades[gradeSubjectName].push(gradesDataClean[i]);
      }

      console.log(sortedGrades);

      for (let i = 0; i < elementSubjectsGrades.length; i++) {
        const elementSubjectGrades = elementSubjectsGrades[i];
        const subjectName =
          elementSubjectGrades.parentElement.querySelector('.nommatiere').textContent;
        const subjectGrades = sortedGrades[subjectName];

        for (let j = 0; j < subjectGrades.length; j++) {
          elementSubjectGrades.children[j].setAttribute('id', subjectGrades[j].id);
        }
      }
    }
  }

  exports({ajouterNoteId}).to('./features/Notes/ajouter-note-id.js');
})();
