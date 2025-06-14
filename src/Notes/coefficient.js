(() => {
  /**
   * Inserts a new column with specified title text before a specified element.
   * @param {HTMLElement} titleElement - The title element before which the new column will be inserted.
   * @param {string} titleText - The text to be displayed in the new column.
   * @param {string} className - The class name for the new column.
   * @param {HTMLElement} beforeElement - The element before which the new column will be inserted.
   */
  function insertColumn(titleElement, titleText, className, beforeElement) {
    const newColumnTitle = titleElement.cloneNode(true);
    newColumnTitle.innerText = titleText;
    newColumnTitle.setAttribute('class', className);
    titleElement.parentElement.insertBefore(newColumnTitle, beforeElement);
    if (debug)
      console.log(
        '[DEBUG]',
        'insertColumn',
        `Inserted ${titleText} column.`,
        newColumnTitle
      );
  }

  /**
   * Clones and modifies elements to create a new column for coefficients.
   * @param {NodeList} elements - The elements to be cloned and modified.
   * @param {Object} gradesData - The grades data containing information about coefficients.
   * @param {number} periodIndex - The index of the active period.
   * @param {string} newClassName - The class name for the new column.
   */
  function cloneAndModifyElements(elements, gradesData, periodIndex, newClassName) {
<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/coefficient.js
=======
    let indexPhaseChange = 0;
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
    for (const [index, element] of elements.entries()) {
      if (
        gradesData.periodes[periodIndex].ensembleMatieres.disciplines[
          index + indexPhaseChange
        ].codeMatiere == ''
      )
        indexPhaseChange += 1;
      const clonedElement = element.cloneNode(true);
      const coefValue =
<<<<<<< HEAD
        gradesData.periodes[periodIndex].ensembleMatieres.disciplines[index].coef;
=======
    let indexPhaseChange = 0;
    for (const [index, element] of elements.entries()) {
      if (
        gradesData.periodes[periodIndex].ensembleMatieres.disciplines[
          index + indexPhaseChange
        ].codeMatiere == ''
      )
        indexPhaseChange += 1;
      const clonedElement = element.cloneNode(true);
      const coefValue =
=======
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
        gradesData.periodes[periodIndex].ensembleMatieres.disciplines[
          index + indexPhaseChange
        ].coef;

<<<<<<< HEAD
>>>>>>> features:src/Notes/coefficient.js
=======
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
      clonedElement.innerText = coefValue;
      clonedElement.className = `${element.className.replace(
        'relevemoyenne',
        newClassName
      )} text-center`;
      element.parentElement.insertBefore(
        clonedElement,
        element.parentElement.querySelector("[class *= 'relevemoyenne']")
      );
      if (debug)
        console.log(
          '[DEBUG]',
          'cloneAndModifyElements',
          `Modified element for coef with new class ${newClassName}.`,
          clonedElement
        );
    }
  }

  /**
   * Adds a coefficient column to the gradebook if it does not already exist.
   * @param {Object} gradesData - The grades data containing information about coefficients.
   */
  function coefficient(gradesData) {
    const coefColumnExists = document.querySelector(
<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/coefficient.js
      "th[class *= 'coef ng-star-inserted']"
    );
    if (!coefColumnExists) {
      const meanColumnClass = 'relevemoyenne ng-star-inserted';
=======
      "th[class *= 'coef']"
    );
    if (!coefColumnExists) {
      const meanColumnClass = 'relevemoyenne';
>>>>>>> features:src/Notes/coefficient.js
=======
      "th[class *= 'coef']"
    );
    if (!coefColumnExists) {
      const meanColumnClass = 'relevemoyenne';
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
      const meanColumnTitleElement = document.querySelector(
        `th[class *= '${meanColumnClass}']`
      );

      if (!meanColumnTitleElement) {
        console.error('Mean column title element not found.');
        return;
      }

      insertColumn(
        meanColumnTitleElement,
        'COEF.',
<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/coefficient.js
        'coef ng-star-inserted',
=======
        'coef',
>>>>>>> features:src/Notes/coefficient.js
=======
        'coef',
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
        meanColumnTitleElement.parentElement.querySelector(
          `[class *= '${meanColumnClass}']`
        )
      );

      const subjectMeansColumn = document.querySelectorAll(
        `td[class *= '${meanColumnClass}']`
      );
      if (debug)
        console.log(
          '[DEBUG]',
          'coefficient',
          'Fetched subject means column elements.',
          subjectMeansColumn
        );

      const activePeriodElement = document.querySelector('ul.nav-tabs > li.active');
      const activePeriodIndex = Array.from(
        activePeriodElement.parentElement.children
      ).indexOf(activePeriodElement);

      if (debug)
        console.log(
          '[DEBUG]',
          'coefficient',
          'Active period index determined.',
          activePeriodIndex
        );

      cloneAndModifyElements(subjectMeansColumn, gradesData, activePeriodIndex, 'coef');
    } else {
      if (debug)
        console.log(
          '[DEBUG]',
          'coefficient',
          'Coefficient column already exists.',
          coefColumnExists
        );
    }
  }

<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/coefficient.js
  exports({coefficient}).to('./features/Notes/coefficient.js');
=======
  exports({coefficient}).to('./src/Notes/coefficient.js');
>>>>>>> features:src/Notes/coefficient.js
=======
  exports({coefficient}).to('./src/Notes/coefficient.js');
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
})();
