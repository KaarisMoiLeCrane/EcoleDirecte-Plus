(() => {
  const ajouterObjectifNote = imports('ajouterObjectifNote').from(
    './features/Notes/functions/ajouter-objectif-note.js'
  );

  function calculerObjectifNote(goalsMeans) {
    const globalMeanGoalId = Date.now()
    const subjectNamesElement = document.querySelectorAll("[class *= 'nommatiere'] > b");
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
    );
    const subjectGoalsAndCoefficients = []

    for (let i = 0; i < subjectNamesElement.length; i++) {
      let skip = !false;
      const subjectNameElement = subjectNamesElement[i]
      const subjectName = subjectNameElement.textContent;
      const serializedSubjectName = subjectName
        .replaceAll(/[^a-zA-Z0-9 ]/g, '')
        .replaceAll(' ', '_');

      const userContent = goalsMeans.find((item) => {
        if (item) if (item.id) return item.id == globalThis.userId;
      });

      // console.log(userContent)

      let addedSubjectGoalValue = '';

      if (userContent.periodes) {
        // console.log(111111)

        for (let j = 0; j < userContent.periodes.length; j++) {
          const userContentPeriode = userContent.periodes[j];
          // console.log(222222)
          const addedSubjectGrades = userContentPeriode.objectif[subjectName];

          if (addedSubjectGrades) {
            if (
              Number(actualPeriodeElement.getAttribute('dateDebut')) <=
                userContentPeriode.dateDebut &&
              userContentPeriode.dateFin <=
                Number(actualPeriodeElement.getAttribute('dateFin'))
            ) {
              addedSubjectGoalValue = addedSubjectGrades.note;
              break;
            }
          }
        }
      }

      if (!addedSubjectGoalValue || addedSubjectGoalValue == "") return

      let subjectLine = subjectNameElement.parentElement.parentElement

      if (subjectLine.getAttribute("kmlc-variation")) subjectLine = subjectLine.parentElement.parentElement
      else subjectLine = subjectLine.parentElement
      
      const addedGoalSubjectCoefficient = Number(subjectLine.querySelector("[class *= 'coef']").textContent)

      subjectGoalsAndCoefficients.push([Number(addedSubjectGoalValue), addedGoalSubjectCoefficient])
    }

    if (subjectGoalsAndCoefficients == [] || subjectGoalsAndCoefficients.length == 0) return

    let sumOfSubjectGoalAverage = 0
    let sumOfSubjectGoalCoefficient = 0

    for (let i = 0; i < subjectGoalsAndCoefficients.length; i++) {
      const subjectGoalAndCoefficient = subjectGoalsAndCoefficients[i]
      const subjectGoalValue = subjectGoalAndCoefficient[0]
      const subjectGoalCoefficient = subjectGoalAndCoefficient[1]

      sumOfSubjectGoalAverage += subjectGoalValue*subjectGoalCoefficient
      sumOfSubjectGoalCoefficient += subjectGoalCoefficient
    }

    if (!sumOfSubjectGoalAverage || !sumOfSubjectGoalCoefficient) return

    const calculatedSubjectGoalGlobalMean = (sumOfSubjectGoalAverage/sumOfSubjectGoalCoefficient).toFixed(5)

    const globalMeanElement = document.querySelector('[kmlc-moyenne-g]')

    ajouterObjectifNote(globalMeanElement, calculatedSubjectGoalGlobalMean, globalMeanGoalId, 'kmlc-global-mean-objectif-set', 'kmlc-global-mean-parent', 'kmlc-global-mean-objectif')
    
    
    // const globalMean = Number(
    //   globalMeanElement.textContent.split(' ')[0]
    // );

    // let tooltipClass = ' kmlc-tooltip-red';

    // // console.log(matiereNote)

    // if (globalMean > calculatedSubjectGoalGlobalMean) {
    //   backgroundColor = ' background-color: rgb(0, 255, 0, 0.5);';
    //   tooltipClass = ' kmlc-tooltip-green';
    // } else if (globalMean < calculatedSubjectGoalGlobalMean) {
    //   backgroundColor = ' background-color: rgb(255, 0, 0, 0.5);';
    //   tooltipClass = ' kmlc-tooltip-red';
    // } else {
    //   backgroundColor = ' background-color: rgb(255, 255, 255);';
    //   tooltipClass = '';
    // }

    // if (
    //   globalMean.toString().split('.')[0] ==
    //   calculatedSubjectGoalGlobalMean.toString().split('.')[0]
    // ) {
    //   backgroundColor = ' background-color: rgb(255, 127.5, 0, 0.5);';
    //   tooltipClass = ' kmlc-tooltip-orange';
    // }

    // if (!globalMeanElement.parentElement.getAttribute('kmlc-global-mean-objectif-set')) {
    //   // console.log("objectif 2", backgroundColor, gradeValue, matiereNote)

    //   globalMeanElement.parentElement.className += ' kmlc-global-mean-parent';

    //   const tooltipElement = globalMeanElement.cloneNode(true);
    //   tooltipElement.className += tooltipClass;
    //   tooltipElement.textContent = 'Objectif de ' + calculatedSubjectGoalGlobalMean;
    //   tooltipElement.setAttribute("style", "font-weight: 400;")
    //   tooltipElement.setAttribute('kmlc-global-mean-objectif', 'true');
    //   tooltipElement.removeAttribute('kmlc-moyenne-g');

    //   globalMeanElement.parentElement.appendChild(tooltipElement);

    //   globalMeanElement.parentElement.setAttribute('style', backgroundColor);

    //   globalMeanElement.parentElement.setAttribute('kmlc-global-mean-objectif-set', 'true');
    // } else {
    //   // console.log("objectif 2", backgroundColor, gradeValue, matiereNote)

    //   const tooltipElement = globalMeanElement.parentElement.querySelector(
    //     "span[class *= 'kmlc-tooltip']"
    //   );
    //   tooltipElement.className = tooltipClass;
    //   tooltipElement.textContent = 'Objectif de ' + calculatedSubjectGoalGlobalMean;
    //   tooltipElement.setAttribute("style", "font-weight: 400;")
    //   tooltipElement.setAttribute('kmlc-global-mean-objectif', 'true');

    //   globalMeanElement.parentElement.setAttribute('style', backgroundColor);
    // }
  }

  exports({calculerObjectifNote}).to('./features/Notes/functions/calculer-objectif-moyenne.js')
})();