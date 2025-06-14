(() => {
  // Import the calculateMeans function
  const calculateMeans = imports('calculateMeans').from(
<<<<<<< HEAD:features/Notes/functions/edit-grade.js
    './features/Notes/functions/calculate-means.js'
=======
    './src/Notes/functions/calculate-means.js'
>>>>>>> features:src/Notes/functions/edit-grade.js
  );

  /**
   * Edits a grade in the gradebook.
   * @param {number} num - Not used.
   * @param {string} subjectName - The name of the subject.
   * @param {string} gradeTitle - The title of the grade.
   * @param {number} gradeValue - The value of the grade.
   * @param {number} gradeCoefficient - The coefficient of the grade.
   * @param {number} gradeQuotient - The quotient of the grade.
   * @param {number} globalQuotient - The global quotient value.
   * @param {string} gradeModificationId - The ID of the grade modification.
   * @param {HTMLElement} gradeElement - The grade element.
   * @param {string} gradeId - The ID of the grade.
   * @param {boolean} saveGradeModification - Flag to indicate whether to save the grade modification.
   * @param {boolean} calculateGlobalMean - Flag to indicate whether to recalculate the global mean after modification.
   * @returns {boolean} - True if the operation was successful, false otherwise.
   */
  function editGrade(
    num,
    subjectName,
    gradeTitle,
    gradeValue,
    gradeCoefficient,
    gradeQuotient,
    globalQuotient,
    gradeModificationId,
    gradeElement = false,
    gradeId = false,
    saveGradeModification = false,
    calculateGlobalMean = true
  ) {
    let skip = true;

    if (debug)
      console.log(
        '[DEBUG]',
        'editGrade',
        'Function called',
        num,
        subjectName,
        gradeTitle,
        gradeValue,
        gradeCoefficient,
        gradeQuotient,
        globalQuotient,
        gradeModificationId,
        gradeElement,
        gradeId,
        saveGradeModification,
        calculateGlobalMean
      );

    // Check if gradeElement is a valid HTMLElement
    if (!(gradeElement instanceof HTMLElement)) {
      if (debug)
        console.log(
          '[DEBUG]',
          'editGrade',
          'gradeElement is not an HTMLElement. Looking for element by gradeId:',
          gradeId
        );

      // Try to find the grade element by gradeId
      const foundGradeElement = document.querySelector(`[id='${gradeId}']`);
      if (foundGradeElement) {
        gradeElement = foundGradeElement.querySelector('[class*=valeur]');
        skip = true;
      } else {
        if (debug) console.log('[DEBUG]', 'Grade element not found. Unable to proceed.');
        skip = false;
      }
    }

    // If all required parameters are provided and element was found or created
    if (subjectName && gradeTitle && gradeCoefficient && gradeQuotient && skip) {
      if (debug)
        console.log(
          '[DEBUG]',
          'editGrade',
          'All required parameters are provided. Proceeding to modify grade.',
          'Save: ' + saveGradeModification
        );

      // Add the attribute to indicate the grade has been modified
      gradeElement.parentElement.setAttribute('kmlc-simulation-edited-grades', 'true');

      // Save the initial grade, coefficient, and quotient in attributes for potential restoration
      saveInitialAttributes(gradeElement);

      // Update the grade, title, coefficient, and quotient in the element
      updateGradeElement(
        gradeElement,
        gradeValue,
        gradeTitle,
        gradeCoefficient,
        gradeQuotient
      );

      // Add a green underline to indicate the grade was modified
      addGreenUnderline(gradeElement);
    }

    // Recalculate the means if required
    if (calculateGlobalMean) {
      if (debug)
        console.log(
          '[DEBUG]',
          'editGrade',
          'Calculating global mean after modification.'
        );

      calculateMeans(
        8,
        globalQuotient,
        true,
        'kmlc-simulation-edited-global-mean',
        'border-bottom: 1px solid green; color: green;',
        'kmlc-simulation-edited-means',
        'border-bottom: 1px solid green; color: green;'
      );
    }

    return skip;
  }

  // Function to save the initial attributes of the grade element
  function saveInitialAttributes(gradeElement) {
    if (debug)
      console.log('[DEBUG]', 'saveInitialAttributes', 'Function called', gradeElement);
    gradeElement.parentElement.setAttribute(
      'initialTitle',
      gradeElement.parentElement.getAttribute('title').trim()
    );

    if (gradeElement.getAttribute('initialGrade') == null) {
      gradeElement.setAttribute(
        'initialGrade',
        gradeElement.childNodes[0].nodeValue.replace(/[\/\s]/g, '').replace(',', '.')
      );
    }

    const gradeElementCoefficient = gradeElement.querySelector('sup');
    if (gradeElementCoefficient) {
      if (gradeElement.getAttribute('initialCoefficient') == null) {
        gradeElement.setAttribute(
          'initialCoefficient',
          ` (${gradeElementCoefficient.textContent
            .replace(/[()\/\s]/g, '')
            .replace(',', '.')
            .replace(/[^\d+\-*/.\s]/g, '')}) `
        );
      }
    } else {
      if (gradeElement.getAttribute('initialCoefficient') == null) {
        gradeElement.setAttribute('initialCoefficient', '');
      }
    }

    const gradeElementQuotient = gradeElement.querySelector('sub');
    if (gradeElementQuotient) {
      if (gradeElement.getAttribute('initialQuotient') == null) {
        gradeElement.setAttribute(
          'initialQuotient',
          `/${gradeElementQuotient.textContent
            .replace(/[()\/\s]/g, '')
            .replace(',', '.')
            .replace(/[^\d+\-*/.\s]/g, '')}`
        );
      }
    } else {
      if (gradeElement.getAttribute('initialQuotient') == null) {
        gradeElement.setAttribute('initialQuotient', '');
      }
    }
  }

  // Function to update the grade, title, coefficient, and quotient in the grade element
  function updateGradeElement(
    gradeElement,
    gradeValue,
    gradeTitle,
    gradeCoefficient,
    gradeQuotient
  ) {
    if (debug)
      console.log(
        '[DEBUG]',
        'updateGradeElement',
        'Function called',
        gradeElement,
        gradeValue,
        gradeTitle,
        gradeCoefficient,
        gradeQuotient
      );
    gradeElement.childNodes[0].nodeValue = ` ${gradeValue} `;
    gradeElement.parentElement.setAttribute('title', gradeTitle);

    const gradeElementCoefficient = gradeElement.querySelector('sup');
    if (gradeElementCoefficient) {
      gradeElementCoefficient.textContent = ` (${gradeCoefficient}) `;
    } else {
      const coefficientElement = document.createElement('SUP');
      coefficientElement.setAttribute('kmlc-sup-modifier', 'true');
      gradeElement.appendChild(coefficientElement);
      gradeElement.querySelector(
        'sup'
<<<<<<< HEAD:features/Notes/functions/edit-grade.js
      ).outerHTML = `<sup class="coef ng-star-inserted"> (${gradeCoefficient}) <span class="margin-whitespace"></span></sup>`;
=======
      ).outerHTML = `<sup class="coef"> (${gradeCoefficient}) <span class="margin-whitespace"></span></sup>`;
>>>>>>> features:src/Notes/functions/edit-grade.js
    }

    const gradeElementQuotient = gradeElement.querySelector('sub');
    if (gradeElementQuotient) {
      gradeElementQuotient.textContent = `/${gradeQuotient} `;
    } else {
      const quotientElement = document.createElement('SUB');
      quotientElement.setAttribute('kmlc-sub-modifier', 'true');
      gradeElement.appendChild(quotientElement);
      gradeElement.querySelector(
        'sub'
<<<<<<< HEAD:features/Notes/functions/edit-grade.js
      ).outerHTML = `<sub class="quotient ng-star-inserted"> /${gradeQuotient} <span class="margin-whitespace"></span></sub>`;
=======
      ).outerHTML = `<sub class="quotient"> /${gradeQuotient} <span class="margin-whitespace"></span></sub>`;
>>>>>>> features:src/Notes/functions/edit-grade.js
    }
  }

  // Function to add a green underline to the grade element
  function addGreenUnderline(gradeElement) {
    if (debug)
      console.log('[DEBUG]', 'addGreenUnderline', 'Function called', gradeElement);
    const gradeElementStyle = gradeElement.getAttribute('style');
    if (gradeElementStyle) {
<<<<<<< HEAD:features/Notes/functions/edit-grade.js
      gradeElement.style.borderBottom = '1px solid green';
=======
      gradeElement.style.setProperty('border-bottom', '1px solid green');
>>>>>>> features:src/Notes/functions/edit-grade.js
    } else {
      gradeElement.setAttribute('style', 'border-bottom: 1px solid green;');
    }
  }

<<<<<<< HEAD:features/Notes/functions/edit-grade.js
  exports({editGrade}).to('./features/Notes/functions/edit-grade.js');
=======
  exports({editGrade}).to('./src/Notes/functions/edit-grade.js');
>>>>>>> features:src/Notes/functions/edit-grade.js
})();
