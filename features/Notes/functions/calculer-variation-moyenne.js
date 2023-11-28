(() => {
  function calculerVariationMoyenne(
    elementDisciplineSubjectToCalculate,
    addVariation = false,
    gradePeriode = false,
    grades = false
  ) {
    const allSubjectsMeans = document.querySelectorAll('[kmlc-moyenne]');
    const globalMean = parseFloat(
      document
        .querySelector('[kmlc-moyenne-g]')
        .innerText.replace(/[()\/\s]/g, '')
        .replace(',', '.')
        .replace(/[^\d+\-*/.\s]/g, '')
    );

    let subjectMean = 0.0;
    let totalSubjectGradeCoefficients = 0.0;
    let summedGrades = 0.0;

    for (let i = 0; i < allSubjectsMeans.length; i++) {
      const subjectMeanElement = allSubjectsMeans[i];
      const subjectLine = subjectMeanElement.parentElement.parentElement;

      totalSubjectGradeCoefficients += parseFloat(
        subjectLine
          .querySelector('[class *= coef]')
          .innerText.replace(/[()\/\s]/g, '')
          .replace(',', '.')
          .replace(/[^\d+\-*/.\s]/g, '')
      );
    }

    if (elementDisciplineSubjectToCalculate instanceof HTMLElement) {
      for (let i = 0; i < allSubjectsMeans.length; i++) {
        const subjectMeanElement = allSubjectsMeans[i];
        const subjectLine = subjectMeanElement.parentElement.parentElement;

        if (
          subjectLine.querySelector('[class *= discipline]') ==
          elementDisciplineSubjectToCalculate
        ) {
          subjectMean += parseFloat(
            subjectMeanElement.innerText
              .replace(/[()\/\s]/g, '')
              .replace(',', '.')
              .replace(/[^\d+\-*/.\s]/g, '')
          );
          summedGrades += parseFloat(
            subjectLine
              .querySelector('[class *= coef]')
              .innerText.replace(/[()\/\s]/g, '')
              .replace(',', '.')
              .replace(/[^\d+\-*/.\s]/g, '')
          );

          break;
        }
      }
    } else if (elementDisciplineSubjectToCalculate instanceof Object) {
      for (let i = 0; i < elementDisciplineSubjectToCalculate.length; i++) {
        for (let j = 0; j < allSubjectsMeans.length; j++) {
          const subjectMeanElement = allSubjectsMeans[j];
          const subjectLine = subjectMeanElement.parentElement.parentElement;

          if (
            subjectLine.querySelector('[class *= discipline]') ==
            elementDisciplineSubjectToCalculate[i]
          ) {
            subjectMean += parseFloat(
              allSubjectsMeans[j].innerText
                .replace(/[()\/\s]/g, '')
                .replace(',', '.')
                .replace(/[^\d+\-*/.\s]/g, '')
            );
            summedGrades += parseFloat(
              subjectLine
                .querySelector('[class *= coef]')
                .innerText.replace(/[()\/\s]/g, '')
                .replace(',', '.')
                .replace(/[^\d+\-*/.\s]/g, '')
            );

            break;
          }
        }
      }
    }

    const calculatedVariationValue = (
      globalMean -
      (globalMean * totalSubjectGradeCoefficients - subjectMean * summedGrades) /
        (totalSubjectGradeCoefficients - summedGrades)
    ).toFixed(5);

    if (calculatedVariationValue == NaN) return NaN

    let variationStyle =
      'background-color: rgb(255, 255, 255, 0.250); border-radius: 3px;';
    let variationImpact = 'neutre';
    let tooltipClass = '';

    if (calculatedVariationValue > 0.2) {
      variationStyle = 'background-color: rgb(0, 255, 0, 0.250); border-radius: 3px;';
      variationImpact = 'très positive';
      tooltipClass = ' kmlc-tooltip-green';
    } else if (calculatedVariationValue <= 0.2 && calculatedVariationValue > 0) {
      variationStyle = 'background-color: rgb(255, 127.5, 0, 0.250); border-radius: 3px;';
      variationImpact = 'positive';
      tooltipClass = ' kmlc-tooltip-orange';
    } else {
      variationStyle = 'background-color: rgb(255, 0, 0, 0.250); border-radius: 3px;';
      variationImpact = 'négative';
      tooltipClass = ' kmlc-tooltip-red';
    }

    if (addVariation) {
      const variationElement = document.createElement('SPAN');
      variationElement.style = variationStyle;
      variationElement.setAttribute('kmlc-variation', 'true');

      if (elementDisciplineSubjectToCalculate instanceof HTMLElement) {
        const subjectExcludeLine = elementDisciplineSubjectToCalculate.parentElement;
        const subjectExcludeLineIndex = Array.from(
          subjectExcludeLine.parentNode.children
        ).indexOf(subjectExcludeLine);

        for (
          let i = 0;
          i <
          grades.periodes[gradePeriode].ensembleMatieres.disciplines[
            subjectExcludeLineIndex
          ].professeurs.length +
            1;
          i++
        ) {
          let elementDisciplineSubjectToCalculateVariation =
            elementDisciplineSubjectToCalculate.querySelector('[kmlc-variation]');

          if (!elementDisciplineSubjectToCalculateVariation) {
            elementDisciplineSubjectToCalculate.appendChild(variationElement);
            elementDisciplineSubjectToCalculateVariation =
              elementDisciplineSubjectToCalculate.querySelector('[kmlc-variation]');
          }

          if (
            elementDisciplineSubjectToCalculate.children[0] !=
            elementDisciplineSubjectToCalculateVariation
          ) {
            elementDisciplineSubjectToCalculateVariation.appendChild(
              elementDisciplineSubjectToCalculate.children[0]
            );
          }
        }

        if (!elementDisciplineSubjectToCalculate.className.includes('kmlc-note-parent')) {
          const variationTooltipElement = document.createElement('SPAN');
          variationTooltipElement.textContent =
            'Variation ' + variationImpact + ' de ' + calculatedVariationValue;
          variationTooltipElement.className = tooltipClass;

          elementDisciplineSubjectToCalculate.className += ' kmlc-note-parent';
          elementDisciplineSubjectToCalculate.appendChild(variationTooltipElement);
        }

        // disciplineElmExclusion.setAttribute("title", "Variation " + signe + " de " + variation)
      } else if (elementDisciplineSubjectToCalculate instanceof Object) {
        for (let i = 0; i < elementDisciplineSubjectToCalculate.length; i++) {
          const subjectExcludeLine = elementDisciplineSubjectToCalculate[i].parentElement;
          const subjectExcludeLineIndex = Array.from(
            subjectExcludeLine.parentNode.children
          ).indexOf(subjectExcludeLine);

          for (
            let j = 0;
            j <
            grades.periodes[gradePeriode].ensembleMatieres.disciplines[
              subjectExcludeLineIndex
            ].professeurs.length +
              1;
            j++
          ) {
            const elementDisciplineSubjectToCalculateVariation =
              elementDisciplineSubjectToCalculate[i].querySelector('[kmlc-variation]');

            if (!elementDisciplineSubjectToCalculateVariation)
              elementDisciplineSubjectToCalculate[i].appendChild(variationElement);

            if (
              elementDisciplineSubjectToCalculate[i].children[0] !=
              elementDisciplineSubjectToCalculateVariation
            )
              elementDisciplineSubjectToCalculateVariation.appendChild(
                elementDisciplineSubjectToCalculate[i].children[0]
              );
          }

          if (
            !elementDisciplineSubjectToCalculate[i].className.includes('kmlc-note-parent')
          ) {
            const variationTooltipElement = document.createElement('SPAN');
            variationTooltipElement.textContent =
              'Variation commune ' + variationImpact + ' de ' + calculatedVariationValue;
            variationTooltipElement.className = tooltipClass;

            elementDisciplineSubjectToCalculate[i].className += ' kmlc-note-parent';
            elementDisciplineSubjectToCalculate[i].appendChild(variationTooltipElement);
          }

          // disciplineElmExclusion[i].setAttribute("title", "Variation " + signe + " commune de " + variation)
        }
      }
    }

    return calculatedVariationValue;
  }

  exports({calculerVariationMoyenne}).to(
    './features/Notes/functions/calculer-variation-moyenne.js'
  );
})();
