(() => {
  function ajouterObjectifNote(subjectNameOrElement, meanObjectifValue, gradeId, tooltipSetParentAttributeName, tooltipParentAttributeName, tooltipAttributeName) {
    let subjectAverage = false;

    if (subjectNameOrElement instanceof HTMLElement) {
      subjectAverage = subjectNameOrElement;
    } else if (typeof subjectNameOrElement == 'string') {
      const listSubjects = document.querySelectorAll("[class *= 'nommatiere']");

      for (let i = 0; i < listSubjects.length; i++) {
        const subject = listSubjects[i];

        // console.log(matiere, matiere.textContent, subjectGrade, subjectGrade == matiere.textContent)
        if (subject.textContent == subjectNameOrElement) {
          let subjectLine = subject.parentElement;

          if (subjectLine.getAttribute('kmlc-variation'))
            subjectLine = subjectLine.parentElement.parentElement;
          else subjectLine = subjectLine.parentElement;

          subjectAverage = subjectLine.querySelector('[kmlc-moyenne]');
        }
      }
    }

    // console.log(matiere, subjectLine, subjectLine.getAttribute("kmlc-variation"), moyenne, gradeValue, gradeValue == "")

    if (!subjectAverage) return;

    if (meanObjectifValue == '') {
      if (subjectAverage.parentElement.getAttribute(tooltipSetParentAttributeName)) {
        subjectAverage.parentElement
          .querySelector("span[class *= 'kmlc-tooltip']")
          .remove();
        subjectAverage.parentElement.removeAttribute('style');
      }
    } else {
      // console.log(!(!moyenne), matiere, matiere.textContent, subjectGrade, subjectGrade == matiere.textContent)

      const meanSubjectValue = parseFloat(
        subjectAverage.textContent
          .split(" ")[0]
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

      if (!subjectAverage.parentElement.getAttribute(tooltipSetParentAttributeName)) {
        // console.log("objectif 2", backgroundColor, gradeValue, matiereNote)

        subjectAverage.parentElement.className += " " + tooltipParentAttributeName;

        const tooltipElement = subjectAverage.cloneNode(true);
        tooltipElement.className += tooltipClass;
        tooltipElement.textContent = 'Objectif de ' + meanObjectifValue;
        tooltipElement.setAttribute("style", "font-weight: 400;")
        tooltipElement.setAttribute(tooltipAttributeName, 'true');
        tooltipElement.removeAttribute('kmlc-moyenne')
        tooltipElement.removeAttribute('kmlc-moyenne-g');

        subjectAverage.parentElement.appendChild(tooltipElement);

        subjectAverage.parentElement.setAttribute('style', backgroundColor);

        subjectAverage.parentElement.setAttribute(tooltipSetParentAttributeName, 'true');
      } else {
        // console.log("objectif 2", backgroundColor, gradeValue, matiereNote)

        const tooltipElement = subjectAverage.parentElement.querySelector(
          "span[class *= 'kmlc-tooltip']"
        );
        tooltipElement.className = tooltipClass;
        tooltipElement.textContent = 'Objectif de ' + meanObjectifValue;
        tooltipElement.setAttribute("style", "font-weight: 400;")
        tooltipElement.setAttribute(tooltipAttributeName, 'true');

        subjectAverage.parentElement.setAttribute('style', backgroundColor);
      }
    }
  }

  exports({ajouterObjectifNote}).to(
    './features/Notes/functions/ajouter-objectif-note.js'
  );
})();
