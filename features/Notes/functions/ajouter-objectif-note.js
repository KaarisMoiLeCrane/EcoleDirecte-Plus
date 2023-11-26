(() => {
  function ajouterObjectifNote(subjectName, meanObjectifValue, gradeId) {
    // console.log(123)
    const listSubjects = document.querySelectorAll("[class *= 'nommatiere']");

    // browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
    // console.log(items.objectifMoyenne)
    // let dummy = items.objectifMoyenne;

    for (let i = 0; i < listSubjects.length; i++) {
      const subject = listSubjects[i];

      // console.log(matiere, matiere.textContent, subjectGrade, subjectGrade == matiere.textContent)
      if (subject.textContent == subjectName) {
        let subjectLine = subject.parentElement;

        if (subjectLine.getAttribute('kmlc-variation'))
          subjectLine = subjectLine.parentElement.parentElement;
        else subjectLine = subjectLine.parentElement;

        const subjectAverage = subjectLine.querySelector('[kmlc-moyenne]');

        // console.log(matiere, subjectLine, subjectLine.getAttribute("kmlc-variation"), moyenne, gradeValue, gradeValue == "")

        if (!subjectAverage) return;

        if (meanObjectifValue == '') {
          if (subjectAverage.parentElement.getAttribute('kmlc-objectif-moyenne-set')) {
            subjectAverage.parentElement
              .querySelector("span[class *= 'kmlc-tooltip']")
              .remove();
            subjectAverage.parentElement.removeAttribute('style');
          }
        } else {
          // console.log(!(!moyenne), matiere, matiere.textContent, subjectGrade, subjectGrade == matiere.textContent)

          const meanSubjectValue = parseFloat(
            subjectAverage.textContent
              .replace(/[()\/\s]/g, '')
              .replace(',', '.')
              .replace(/[^\d+\-*/.\s]/g, '')
          ); // Complete cleaning
          let tooltipClass = ' kmlc-tooltip-red';

          // console.log(matiereNote)

          if (meanSubjectValue > meanObjectifValue) {
            backgroundColor = ' background-color: rgb(0, 255, 0, 0.5);';
            tooltipClass = ' kmlc-tooltip-green';
          } else if (meanSubjectValue < meanObjectifValue) {
            backgroundColor = ' background-color: rgb(255, 0, 0, 0.5);';
            tooltipClass = ' kmlc-tooltip-red';
          } else {
            backgroundColor = ' background-color: rgb(255, 255, 255);';
            tooltipClass = '';
          }

          if (
            meanSubjectValue.toString().split('.')[0] ==
            meanObjectifValue.toString().split('.')[0]
          ) {
            backgroundColor = ' background-color: rgb(255, 127.5, 0, 0.5);';
            tooltipClass = ' kmlc-tooltip-orange';
          }

          if (!subjectAverage.parentElement.getAttribute('kmlc-objectif-moyenne-set')) {
            // console.log("objectif 2", backgroundColor, gradeValue, matiereNote)

            subjectAverage.parentElement.className += ' kmlc-note-parent';

            const tooltipElement = subjectAverage.cloneNode(true);
            tooltipElement.className += tooltipClass;
            tooltipElement.textContent = 'Objectif de ' + meanObjectifValue;
            tooltipElement.setAttribute('kmlc-objectif', 'true');
            tooltipElement.removeAttribute('kmlc-moyenne');

            subjectAverage.parentElement.appendChild(tooltipElement);

            subjectAverage.parentElement.setAttribute('style', backgroundColor);

            subjectAverage.parentElement.setAttribute(
              'kmlc-objectif-moyenne-set',
              'true'
            );
          } else {
            // console.log("objectif 2", backgroundColor, gradeValue, matiereNote)

            const tooltipElement = subjectAverage.parentElement.querySelector(
              "span[class *= 'kmlc-tooltip']"
            );
            tooltipElement.className = tooltipClass;
            tooltipElement.textContent = 'Objectif de ' + meanObjectifValue;
            tooltipElement.setAttribute('kmlc-objectif', 'true');

            subjectAverage.parentElement.setAttribute('style', backgroundColor);
          }
        }
      }
    }
  }
  exports({ajouterObjectifNote}).to(
    './features/Notes/functions/ajouter-objectif-note.js'
  );
})();
