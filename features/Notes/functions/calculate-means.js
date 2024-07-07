(() => {
  /**
   * Retrieves the coefficient of a grade.
   * @param {HTMLElement} subjectGrade - The grade element.
   * @param {boolean} withOldGradeDatas - Flag indicating if old grade data should be considered.
   * @returns {number} - The coefficient of the grade.
   */
  function getGradeCoefficient(subjectGrade, withOldGradeDatas) {
    if (debug)
      console.log(
        '[DEBUG]',
        'getGradeCoefficient',
        'Function called',
        subjectGrade,
        withOldGradeDatas
      );

    let gradeCoefficient = 1.0;

    if (
      withOldGradeDatas &&
      subjectGrade.parentElement.getAttribute('kmlc-simulation-edited-grades')
    ) {
      // If old grade data is available, use the old coefficient
      const subjectGradeOldCoefficient = subjectGrade.getAttribute('initialCoefficient');
      if (subjectGradeOldCoefficient) {
        gradeCoefficient = parseFloat(
          subjectGradeOldCoefficient.replace(/[()\/\s]/g, '').replace(',', '.')
        );
      }
    } else {
      // Otherwise, get the coefficient from the current grade
      const subjectGradeCoefficient = subjectGrade.querySelector('sup');
      if (subjectGradeCoefficient) {
        gradeCoefficient = parseFloat(
          subjectGradeCoefficient.textContent.replace(/[()\/\s]/g, '').replace(',', '.')
        );
      }
    }

    return gradeCoefficient;
  }

  /**
   * Retrieves the quotient of a grade.
   * @param {HTMLElement} subjectGrade - The grade element.
   * @param {number} globalQuotient - The global quotient value.
   * @param {boolean} withOldGradeDatas - Flag indicating if old grade data should be considered.
   * @returns {number} - The quotient of the grade.
   */
  function getGradeQuotient(subjectGrade, globalQuotient, withOldGradeDatas) {
    if (debug)
      console.log(
        '[DEBUG]',
        'getGradeQuotient',
        'Function called',
        subjectGrade,
        globalQuotient,
        withOldGradeDatas
      );

    let gradeQuotient = globalQuotient;

    if (
      withOldGradeDatas &&
      subjectGrade.parentElement.getAttribute('kmlc-simulation-edited-grades')
    ) {
      const subjectGradeOldQuotient = subjectGrade.getAttribute('initialQuotient');
      if (subjectGradeOldQuotient) {
        gradeQuotient = parseFloat(
          subjectGradeOldQuotient.replace(/[()\/\s]/g, '').replace(',', '.')
        );
      }
    } else {
      const subjectGradeQuotient = subjectGrade.querySelector('sub');
      if (subjectGradeQuotient) {
        gradeQuotient = parseFloat(
          subjectGradeQuotient.textContent.replace(/[()\/\s]/g, '').replace(',', '.')
        );
      }
    }

    return gradeQuotient;
  }

  /**
   * Retrieves the value of a grade.
   * @param {HTMLElement} subjectGrade - The grade element.
   * @param {boolean} withOldGradeDatas - Flag indicating if old grade data should be considered.
   * @returns {number} - The value of the grade.
   */
  function getGradeValue(subjectGrade, withOldGradeDatas) {
    if (debug)
      console.log(
        '[DEBUG]',
        'getGradeValue',
        'Function called',
        subjectGrade,
        withOldGradeDatas
      );

    let gradeValue = 0.0;
    let significative = false;

    if (
      withOldGradeDatas &&
      subjectGrade.parentElement.getAttribute('kmlc-simulation-edited-grades')
    ) {
      // If old grade data is available, use the old value
      let subjectGradeOldValue = subjectGrade.getAttribute('initialGrade');
      if (subjectGradeOldValue) {
        subjectGradeOldValue = subjectGradeOldValue.replace(/[^\d+\-.\s]/g, '');
        if (subjectGradeOldValue != '') {
          gradeValue = subjectGradeOldValue;
          significative = true;
        }
      }
    }

    if (!significative) {
      // If old data is not significant, get the value from the current grade
      gradeValue = subjectGrade.childNodes[0].nodeValue;
      significative =
        subjectGrade.parentElement.querySelectorAll(':scope > span').length <= 1;
    }

    if (significative) {
      // Process the grade value if it's significant
      gradeValue = gradeValue
        .replace(/[\/\s]/g, '')
        .replace(',', '.')
        .replace(/[^\d+\-.\s]/g, '');
    } else {
      gradeValue = NaN;
    }

    return gradeValue;
  }

  /**
   * Calculates the mean value of a subject.
   * @param {HTMLElement} subjectRow - The subject row element.
   * @param {number} globalQuotient - The global quotient value.
   * @param {boolean} withOldGradeDatas - Flag indicating if old grade data should be considered.
   * @returns {Object} - An object containing subject mean, coefficient, and total coefficients.
   */
  function calculateSubjectMean(subjectRow, globalQuotient, withOldGradeDatas) {
    if (debug)
      console.log(
        '[DEBUG]',
        'calculateSubjectMean',
        'Function called',
        subjectRow,
        globalQuotient,
        withOldGradeDatas
      );

    const allSubjectGrades = subjectRow.querySelectorAll('span.valeur');
    let summedGrades = 0.0;
    let totalSubjectGradeCoefficients = 0.0;

    allSubjectGrades.forEach((subjectGrade) => {
      // Calculate the grade coefficient, quotient, and value
      const gradeCoefficient = getGradeCoefficient(subjectGrade, withOldGradeDatas);
      const gradeQuotient = getGradeQuotient(
        subjectGrade,
        globalQuotient,
        withOldGradeDatas
      );
      let gradeValue = getGradeValue(subjectGrade, withOldGradeDatas);

      if (gradeValue) {
        // Adjust the grade value based on the global quotient and subject quotient
        gradeValue = (parseFloat(gradeValue) * globalQuotient) / gradeQuotient;
        summedGrades += parseFloat(gradeValue * gradeCoefficient);
        totalSubjectGradeCoefficients += gradeCoefficient;
      }
    });

    // Calculate and return the subject mean
    const subjectMean = summedGrades / totalSubjectGradeCoefficients;
    const subjectCoefficient = parseFloat(
      subjectRow
        .querySelector('td.coef')
        .innerText.replace(/[()\/\s]/g, '')
        .replace(',', '.')
        .replace(/[^\d+\-*/.\s]/g, '')
    );

    return {subjectMean, subjectCoefficient, totalSubjectGradeCoefficients};
  }

  /**
   * Updates the subject average element in the DOM.
   * @param {HTMLElement} subjectRow - The subject row element.
   * @param {number} subjectMean - The calculated mean value for the subject.
   * @param {boolean} displayCalculatedMeansValues - Flag indicating whether to display calculated mean values.
   * @param {string} attributeMean - Attribute name for the subject mean element.
   * @param {string} styleMean - CSS style for the subject mean element.
   * @param {string} brHTMLAttributes - HTML attributes for the line break element.
   */
  function updateSubjectAverageElement(
    subjectRow,
    subjectMean,
    displayCalculatedMeansValues,
    attributeMean,
    styleMean,
    brHTMLAttributes
  ) {
    if (debug)
      console.log(
        '[DEBUG]',
        'updateSubjectAverageElement',
        'Function called',
        subjectRow,
        subjectMean,
        displayCalculatedMeansValues,
        attributeMean,
        styleMean,
        brHTMLAttributes
      );

    const averageElement = subjectRow.querySelector('td.relevemoyenne').cloneNode(true);
    averageElement.textContent = subjectMean.toFixed(5);

    if (displayCalculatedMeansValues) {
      // Update the subject average element with calculated mean value
      if (!subjectRow.querySelector(`[${attributeMean}]`)) {
        subjectRow.querySelector(
          'td.relevemoyenne'
        ).innerHTML += `<br ${brHTMLAttributes}><span ${attributeMean}="true" style="${styleMean}">${averageElement.innerHTML}</span>`;
      } else {
        subjectRow.querySelector(`[${attributeMean}]`).textContent =
          subjectMean.toFixed(5);
      }
    }
  }

  /**
   * Updates the overall average element in the DOM.
   * @param {string} calculatedGlobalMeanRound5 - The calculated global mean value rounded to 5 decimal places.
   * @param {string} calculatedGlobalMeanRound2 - The calculated global mean value rounded to 2 decimal places.
   * @param {boolean} displayCalculatedMeansValues - Flag indicating whether to display calculated mean values.
   * @param {string} attributeGlobalMean - Attribute name for the global mean element.
   * @param {string} styleGlobalMean - CSS style for the global mean element.
   * @param {string} brHTMLAttributes - HTML attributes for the line break element.
   */
  function updateOverallAverageElement(
    calculatedGlobalMeanRound5,
    calculatedGlobalMeanRound2,
    displayCalculatedMeansValues,
    attributeGlobalMean,
    styleGlobalMean,
    brHTMLAttributes
  ) {
    if (debug)
      console.log(
        '[DEBUG]',
        'updateOverallAverageElement',
        'Function called',
        calculatedGlobalMeanRound5,
        calculatedGlobalMeanRound2,
        displayCalculatedMeansValues,
        attributeGlobalMean,
        styleGlobalMean,
        brHTMLAttributes
      );

    if (displayCalculatedMeansValues) {
      // Update the overall average element with calculated mean value
      const existingOverallAverageElement = document.querySelector(
        'tr > td.moyennegenerale-valeur'
      );
      const overallAverageHTML = `${calculatedGlobalMeanRound5} (${calculatedGlobalMeanRound2})`;

      if (existingOverallAverageElement) {
        const overallAverageElement = existingOverallAverageElement.cloneNode(true);
        overallAverageElement.textContent = overallAverageHTML;

        if (!document.querySelector(`[${attributeGlobalMean}]`)) {
          existingOverallAverageElement.innerHTML += `<br ${brHTMLAttributes}><span ${attributeGlobalMean}="true" style="${styleGlobalMean}">${overallAverageElement.innerHTML}</span>`;
        } else {
          document.querySelector(`[${attributeGlobalMean}]`).textContent =
            overallAverageHTML;
        }
      } else {
        const overallAverageElement = document.createElement('tr');
        overallAverageElement.innerHTML = `<tr class="ng-star-inserted"><td colspan="2" class="text-right moyennegeneralelibelle">Moyenne générale</td><td colspan="2" class="moyennegenerale-valeur"><span ${attributeGlobalMean}="true" style="${styleGlobalMean}">${overallAverageHTML}</span></td></tr>`;

        document.querySelector('table.ed-table tbody').appendChild(overallAverageElement);
      }
    }
  }

  /**
   * Calculates means for subjects.
   * @param {number} num - Not used.
   * @param {number} globalQuotient - The global quotient value.
   * @param {boolean} displayCalculatedMeansValues - Flag indicating whether to display calculated mean values.
   * @param {string} attributeGlobalMean - Attribute name for the global mean element.
   * @param {string} styleGlobalMean - CSS style for the global mean element.
   * @param {string} attributeMean - Attribute name for the subject mean element.
   * @param {string} styleMean - CSS style for the subject mean element.
   * @param {boolean} withOldGradeDatas - Flag indicating if old grade data should be considered.
   * @param {string} attributeOfSubjectsToCalculate - Attribute of subjects to calculate means for.
   * @param {HTMLElement|Array<HTMLElement>} elementDisciplineSubjectToExclude - Elements to exclude from mean calculations.
   * @returns {Object} - An object containing the calculated global mean rounded to 5 and 2 decimal places.
   */
  function calculateMeans(
    num,
    globalQuotient,
    displayCalculatedMeansValues = false,
    attributeGlobalMean = '',
    styleGlobalMean = '',
    attributeMean = '',
    styleMean = '',
    withOldGradeDatas = false,
    attributeOfSubjectsToCalculate = '',
    elementDisciplineSubjectToExclude = ''
  ) {
    if (debug)
      console.log(
        '[DEBUG]',
        'calculateMeans',
        'Function called',
        num,
        globalQuotient,
        displayCalculatedMeansValues,
        attributeGlobalMean,
        styleGlobalMean,
        attributeMean,
        styleMean,
        withOldGradeDatas,
        attributeOfSubjectsToCalculate,
        elementDisciplineSubjectToExclude
      );

    const allGrades = document.querySelectorAll(
      'span.valeur' + attributeOfSubjectsToCalculate
    );
    const listSubjectRow = [];
    const brHTMLAttributes = attributeGlobalMean.includes('simu')
      ? 'kmlc-simu="true"'
      : '';

    let calculatedGlobalMean = 0.0;
    let allSubjectsMeans = 0.0;
    let extraSubjectsCoefficient = 0.0;
    let allSubjectsCoefficients = 0.0;

    // Iterate through all grades to gather subject rows
    allGrades.forEach((grade) => {
      const subjectGradeRow = grade.parentElement.parentElement.parentElement;

      if (elementDisciplineSubjectToExclude instanceof HTMLElement) {
        // Exclude specified subject
        if (
          !listSubjectRow.includes(subjectGradeRow) &&
          subjectGradeRow.querySelector("[class *= 'discipline']") !=
            elementDisciplineSubjectToExclude
        ) {
          listSubjectRow.push(subjectGradeRow);
        }
      } else if (Array.isArray(elementDisciplineSubjectToExclude)) {
        // Exclude multiple specified subjects
        elementDisciplineSubjectToExclude.forEach((excludeElement) => {
          if (
            !listSubjectRow.includes(subjectGradeRow) &&
            subjectGradeRow.querySelector("[class *= 'discipline']") != excludeElement
          ) {
            listSubjectRow.push(subjectGradeRow);
          }
        });
      } else {
        // Include all subjects
        if (!listSubjectRow.includes(subjectGradeRow)) {
          listSubjectRow.push(subjectGradeRow);
        }
      }
    });

    // Calculate means for each subject row
    listSubjectRow.forEach((subjectRow) => {
      const {subjectMean, subjectCoefficient, totalSubjectGradeCoefficients} =
        calculateSubjectMean(subjectRow, globalQuotient, withOldGradeDatas);

      if (totalSubjectGradeCoefficients == 0.0) {
        extraSubjectsCoefficient += subjectCoefficient;
      } else {
        allSubjectsCoefficients += subjectCoefficient;
        allSubjectsMeans += subjectMean * subjectCoefficient;
        updateSubjectAverageElement(
          subjectRow,
          subjectMean,
          displayCalculatedMeansValues,
          attributeMean,
          styleMean,
          brHTMLAttributes
        );
      }
    });

    // Calculate the overall mean
    calculatedGlobalMean = allSubjectsMeans / allSubjectsCoefficients;
    const calculatedGlobalMeanRound5 = calculatedGlobalMean.toFixed(5);
    const calculatedGlobalMeanRound2 = calculatedGlobalMean.toFixed(2);

    // Update the overall average element in the DOM
    updateOverallAverageElement(
      calculatedGlobalMeanRound5,
      calculatedGlobalMeanRound2,
      displayCalculatedMeansValues,
      attributeGlobalMean,
      styleGlobalMean,
      brHTMLAttributes
    );

    // Return the calculated means
    return {calculatedGlobalMeanRound5, calculatedGlobalMeanRound2};
  }

  exports({calculateMeans}).to('./features/Notes/functions/calculate-means.js');
})();
