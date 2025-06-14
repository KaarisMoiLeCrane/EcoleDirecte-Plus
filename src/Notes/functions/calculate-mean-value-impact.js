(() => {
  /**
   * Calculates the impact of mean value on global mean and optionally adds variation to DOM.
   *
   * @param {HTMLElement|Object} elementDisciplineSubjectToCalculate - The element or object representing subjects to calculate the impact for.
   * @param {boolean} [addVariation=false] - Flag to add variation element to DOM.
   * @param {boolean} [gradePeriode=false] - Flag to indicate grade period.
   * @param {boolean} [grades=false] - Flag to indicate if grades are provided.
   * @returns {number} - The calculated variation value.
   */
  function calculateMeanValueImpact(
    elementDisciplineSubjectToCalculate,
    addVariation = false,
    gradePeriode = false,
    grades = false
  ) {
    if (debug)
      console.log('[DEBUG]', 'calculateMeanValueImpact', 'Function called with:', {
        elementDisciplineSubjectToCalculate,
        addVariation,
        gradePeriode,
        grades
      });

    // Retrieving all subject mean elements
    const allSubjectsMeans = document.querySelectorAll('[kmlc-moyenne]');

    // Parsing global mean
    const globalMean = parseGlobalMean(document.querySelector('[kmlc-moyenne-g]'));

    // Calculating total subject grade coefficients
    const totalSubjectGradeCoefficients =
      calculateTotalSubjectGradeCoefficients(allSubjectsMeans);

    // Variables to store summed means and coefficients
    let summedSubjectsMeans = 0.0;
    let summedSubjectsCoefficients = 0.0;

    // Conditionally computing summed means and coefficients based on input type
    if (elementDisciplineSubjectToCalculate instanceof HTMLElement) {
      const results = getMeanAndCoefficientForSingleElement(
        allSubjectsMeans,
        elementDisciplineSubjectToCalculate
      );
      summedSubjectsMeans = results.subjectMean;
      summedSubjectsCoefficients = results.summedGrades;
    } else if (elementDisciplineSubjectToCalculate instanceof Object) {
      const results = getMeansAndCoefficientsSumForMultipleElements(
        allSubjectsMeans,
        elementDisciplineSubjectToCalculate
      );
      summedSubjectsMeans = results.subjectMean;
      summedSubjectsCoefficients = results.summedGrades;
    }

    // Calculating variation value
    const calculatedVariationValue = calculateVariationValue(
      globalMean,
      totalSubjectGradeCoefficients,
      summedSubjectsMeans,
      summedSubjectsCoefficients
    );

    // Logging and returning NaN if calculated variation is not a number
    if (isNaN(calculatedVariationValue)) {
      if (debug)
        console.log(
          '[DEBUG]',
          'calculateMeanValueImpact',
          'Calculated variation is NaN.'
        );
      return NaN;
    }

    // Adding variation element to DOM if requested
    if (addVariation) {
      if (debug)
        console.log(
          '[DEBUG]',
          'calculateMeanValueImpact',
          'Adding variation element to the DOM'
        );
      addVariationElement(
        elementDisciplineSubjectToCalculate,
        calculatedVariationValue,
        gradePeriode,
        grades
      );
    }

    return calculatedVariationValue;
  }

  /**
   * Parses the global mean value.
   * @param {HTMLElement} globalMeanElement - The element containing the global mean value.
   * @returns {number} - The parsed global mean value.
   */
  function parseGlobalMean(globalMeanElement) {
    return parseFloat(
      globalMeanElement.innerText
        .split(' ')[0]
        .replace(/[()\/\s]/g, '')
        .replace(',', '.')
        .replace(/[^\d+\-*/.\s]/g, '')
    );
  }

  /**
   * Calculates the total subject grade coefficients.
   * @param {NodeList} allSubjectsMeans - All elements representing subject means.
   * @returns {number} - The total subject grade coefficients.
   */
  function calculateTotalSubjectGradeCoefficients(allSubjectsMeans) {
    let total = 0.0;
    for (const subjectMeanElement of allSubjectsMeans) {
      const subjectLine = subjectMeanElement.parentElement.parentElement;
      total += parseFloat(
        subjectLine
          .querySelector('[class *= coef]')
          .innerText.replace(/[()\/\s]/g, '')
          .replace(',', '.')
          .replace(/[^\d+\-*/.\s]/g, '')
      );
    }
    return total;
  }

  /**
   * Gets the mean and coefficient for a single element.
   * @param {NodeList} allSubjectsMeans - All elements representing subject means.
   * @param {HTMLElement} element - The single element representing the discipline subject for which to calculate the mean and coefficient.
   * @returns {Object} - Object containing the subject mean and summed grades.
   */
  function getMeanAndCoefficientForSingleElement(allSubjectsMeans, element) {
    let subjectMean = 0.0;
    let summedGrades = 0.0;

    for (const subjectMeanElement of allSubjectsMeans) {
      const subjectLine = subjectMeanElement.parentElement.parentElement;
      if (subjectLine.querySelector('[class *= discipline]') === element) {
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
      }
    }

    return {subjectMean, summedGrades};
  }

  /**
   * Gets the means and coefficients sum for multiple elements.
   * @param {NodeList} allSubjectsMeans - All elements representing subject means.
   * @param {Array<HTMLElement>} elements - The elements representing the discipline subjects for which to calculate the mean and coefficient.
   * @returns {Object} - Object containing the subject mean and summed grades.
   */
  function getMeansAndCoefficientsSumForMultipleElements(allSubjectsMeans, elements) {
    let subjectMean = 0.0;
    let summedGrades = 0.0;

    for (const element of elements) {
      for (const subjectMeanElement of allSubjectsMeans) {
        const subjectLine = subjectMeanElement.parentElement.parentElement;
        if (subjectLine.querySelector('[class *= discipline]') === element) {
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
        }
      }
    }

    return {subjectMean, summedGrades};
  }

  /**
   * Calculates the variation value.
   * @param {number} globalMean - The global mean value.
   * @param {number} totalCoefficients - The total coefficients of all subjects.
   * @param {number} subjectMean - The mean value of the subject.
   * @param {number} summedGrades - The summed grades of the subject.
   * @returns {number} - The calculated variation value.
   */
  function calculateVariationValue(
    globalMean,
    totalCoefficients,
    subjectMean,
    summedGrades
  ) {
    return (
      globalMean -
      (globalMean * totalCoefficients - subjectMean * summedGrades) /
        (totalCoefficients - summedGrades)
    ).toFixed(5);
  }

  /**
   * Adds a variation element to the DOM.
   * @param {HTMLElement|Object} element - The element representing the discipline subject to which the variation element will be added.
   * @param {number} variationValue - The calculated variation value.
   * @param {boolean} gradePeriode - A boolean flag indicating whether the grades are for a specific period.
   * @param {Object} grades - Grades data.
   */
  function addVariationElement(element, variationValue, gradePeriode, grades) {
    const {style, impact, tooltipClass} = getVariationStyleAndImpact(variationValue);

    const variationElement = document.createElement('SPAN');
    variationElement.style = style;
    variationElement.setAttribute('kmlc-variation', 'true');

    if (element instanceof HTMLElement) {
      handleSingleElementParentForVariationTooltip(
        element,
        variationElement,
        variationValue,
        impact,
        tooltipClass,
        gradePeriode,
        grades
      );
    } else if (element instanceof Object) {
      handleMultipleElementsParentsForVariationTooltips(
        element,
        variationElement,
        variationValue,
        impact,
        tooltipClass,
        gradePeriode,
        grades
      );
    }
  }

  /**
   * Gets the style and impact of the variation value.
   * @param {number} value - The calculated variation value.
   * @returns {Object} - Object containing the style, impact, and tooltip class.
   */
  function getVariationStyleAndImpact(value) {
<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/functions/calculate-mean-value-impact.js
    let style = 'background-color: rgb(255, 255, 255, 0.250); border-radius: 3px;';
=======
    let style = 'background-color: rgba(255, 255, 255, 0.250); border-radius: 3px;';
>>>>>>> features:src/Notes/functions/calculate-mean-value-impact.js
=======
    let style = 'background-color: rgba(255, 255, 255, 0.250); border-radius: 3px;';
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
    let impact = 'neutre';
    let tooltipClass = '';

    if (value > 0.2) {
<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/functions/calculate-mean-value-impact.js
      style = 'background-color: rgb(0, 255, 0, 0.250); border-radius: 3px;';
=======
      style = 'background-color: rgba(0, 255, 0, 0.250); border-radius: 3px;';
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
      impact = 'très positive';
      tooltipClass = ' kmlc-tooltip kmlc-tooltip-green';
    } else if (value <= 0.2 && value > 0) {
      style = 'background-color: rgba(255, 127.5, 0, 0.250); border-radius: 3px;';
      impact = 'positive';
      tooltipClass = ' kmlc-tooltip kmlc-tooltip-orange';
    } else {
<<<<<<< HEAD
      style = 'background-color: rgb(255, 0, 0, 0.250); border-radius: 3px;';
=======
      style = 'background-color: rgba(0, 255, 0, 0.250); border-radius: 3px;';
      impact = 'très positive';
      tooltipClass = ' kmlc-tooltip kmlc-tooltip-green';
    } else if (value <= 0.2 && value > 0) {
      style = 'background-color: rgba(255, 127.5, 0, 0.250); border-radius: 3px;';
      impact = 'positive';
      tooltipClass = ' kmlc-tooltip kmlc-tooltip-orange';
    } else {
      style = 'background-color: rgba(255, 0, 0, 0.250); border-radius: 3px;';
>>>>>>> features:src/Notes/functions/calculate-mean-value-impact.js
=======
      style = 'background-color: rgba(255, 0, 0, 0.250); border-radius: 3px;';
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
      impact = 'négative';
      tooltipClass = ' kmlc-tooltip kmlc-tooltip-red';
    }

    return {style, impact, tooltipClass};
  }

  /**
   * Handles the addition of a variation tooltip for a single element parent.
   * @param {HTMLElement} element - The element representing the discipline subject to which the variation tooltip will be added.
   * @param {HTMLElement} variationElement - The variation element to be added.
   * @param {number} variationValue - The calculated variation value.
   * @param {string} impact - The impact of the variation.
   * @param {string} tooltipClass - The CSS class for the tooltip.
   * @param {boolean} gradePeriode - A boolean flag indicating whether the grades are for a specific period.
   * @param {Object} grades - Grades data.
   */
  function handleSingleElementParentForVariationTooltip(
    element,
    variationElement,
    variationValue,
    impact,
    tooltipClass,
    gradePeriode,
    grades
  ) {
    const subjectExcludeLine = element.parentElement;
    const subjectExcludeLineIndex = Array.from(
      subjectExcludeLine.parentNode.children
    ).indexOf(subjectExcludeLine);

<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/functions/calculate-mean-value-impact.js
=======
    let elementVariation = element.querySelector('[kmlc-variation]');

    if (!elementVariation) {
      element.appendChild(variationElement);
      elementVariation = element.querySelector('[kmlc-variation]');
    }

>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
    for (
      let i = 0;
      i < element.children.length;
      /*grades.periodes[gradePeriode].ensembleMatieres.disciplines[subjectExcludeLineIndex]
        .professeurs.length +
        1;*/
      i++
    ) {
<<<<<<< HEAD
      let elementVariation = element.querySelector('[kmlc-variation]');

      if (!elementVariation) {
        element.appendChild(variationElement);
        elementVariation = element.querySelector('[kmlc-variation]');
      }

=======
    let elementVariation = element.querySelector('[kmlc-variation]');

    if (!elementVariation) {
      element.appendChild(variationElement);
      elementVariation = element.querySelector('[kmlc-variation]');
    }

    for (
      let i = 0;
      i < element.children.length;
      /*grades.periodes[gradePeriode].ensembleMatieres.disciplines[subjectExcludeLineIndex]
        .professeurs.length +
        1;*/
      i++
    ) {
>>>>>>> features:src/Notes/functions/calculate-mean-value-impact.js
=======
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
      if (element.children[0] !== elementVariation) {
        elementVariation.appendChild(element.children[0]);
      }
    }

    if (!element.className.includes('kmlc-tooltip-parent')) {
      const variationTooltipElement = document.createElement('SPAN');
      variationTooltipElement.textContent =
        'Variation ' + impact + ' de ' + variationValue;
      variationTooltipElement.className = tooltipClass;

      element.className += ' kmlc-tooltip-parent';
      element.appendChild(variationTooltipElement);
    }
  }

  /**
   * Handles the addition of variation tooltips for multiple elements parents.
   * @param {Array<HTMLElement>} elements - The elements representing the discipline subjects to which the variation tooltips will be added.
   * @param {HTMLElement} variationElement - The variation element to be added.
   * @param {number} variationValue - The calculated variation value.
   * @param {string} impact - The impact of the variation.
   * @param {string} tooltipClass - The CSS class for the tooltip.
   * @param {boolean} gradePeriode - A boolean flag indicating whether the grades are for a specific period.
   * @param {Object} grades - Grades data.
   */
  function handleMultipleElementsParentsForVariationTooltips(
    elements,
    variationElement,
    variationValue,
    impact,
    tooltipClass,
    gradePeriode,
    grades
  ) {
    for (const element of elements) {
      const subjectExcludeLine = element.parentElement;
      const subjectExcludeLineIndex = Array.from(
        subjectExcludeLine.parentNode.children
      ).indexOf(subjectExcludeLine);

<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/functions/calculate-mean-value-impact.js
=======
      let elementVariation = element.querySelector('[kmlc-variation]');

      if (!elementVariation) {
        element.appendChild(variationElement);
        elementVariation = element.querySelector('[kmlc-variation]');
      }

>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
      for (
        let j = 0;
        j < element.children.length;
        /*grades.periodes[gradePeriode].ensembleMatieres.disciplines[
          subjectExcludeLineIndex
        ].professeurs.length +
          1;*/
        j++
      ) {
<<<<<<< HEAD
        let elementVariation = element.querySelector('[kmlc-variation]');

        if (!elementVariation) {
          element.appendChild(variationElement);
          elementVariation = element.querySelector('[kmlc-variation]');
        }

=======
      let elementVariation = element.querySelector('[kmlc-variation]');

      if (!elementVariation) {
        element.appendChild(variationElement);
        elementVariation = element.querySelector('[kmlc-variation]');
      }

      for (
        let j = 0;
        j < element.children.length;
        /*grades.periodes[gradePeriode].ensembleMatieres.disciplines[
          subjectExcludeLineIndex
        ].professeurs.length +
          1;*/
        j++
      ) {
>>>>>>> features:src/Notes/functions/calculate-mean-value-impact.js
=======
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
        if (element.children[0] !== elementVariation) {
          elementVariation.appendChild(element.children[0]);
        }
      }

      if (!element.className.includes('kmlc-tooltip-parent')) {
        const variationTooltipElement = document.createElement('SPAN');
        variationTooltipElement.textContent =
          'Variation commune ' + impact + ' de ' + variationValue;
        variationTooltipElement.className = tooltipClass;

        element.className += ' kmlc-tooltip-parent';
        element.appendChild(variationTooltipElement);
      }
    }
  }

  exports({calculateMeanValueImpact}).to(
<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/functions/calculate-mean-value-impact.js
    './features/Notes/functions/calculate-mean-value-impact.js'
=======
    './src/Notes/functions/calculate-mean-value-impact.js'
>>>>>>> features:src/Notes/functions/calculate-mean-value-impact.js
=======
    './src/Notes/functions/calculate-mean-value-impact.js'
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
  );
})();
