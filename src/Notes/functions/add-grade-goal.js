(() => {
  /**
   * Retrieves an element based on the subject name or returns the element if it's already an HTMLElement.
   *
   * @param {string | HTMLElement} subjectNameOrElement - Name of the subject or an HTMLElement.
   * @returns {HTMLElement | null} - The HTMLElement representing the subject's average or null if not found.
   */
  function getSubjectAverageElement(subjectNameOrElement) {
    if (subjectNameOrElement instanceof HTMLElement) {
      if (debug)
        console.log(
          '[DEBUG]',
          'getSubjectAverageElement',
          'Received HTMLElement directly.',
          subjectNameOrElement
        );
      return subjectNameOrElement;
    } else if (typeof subjectNameOrElement === 'string') {
      const listSubjects = document.querySelectorAll("[class *= 'nommatiere']");
      if (debug)
        console.log(
          '[DEBUG]',
          'getSubjectAverageElement',
          'Searching for subject by name.',
          subjectNameOrElement
        );

      for (const subject of listSubjects) {
        if (subject.textContent.trim() === subjectNameOrElement) {
          let subjectLine = subject.parentElement;
          subjectLine = subjectLine.getAttribute('kmlc-variation')
            ? subjectLine.parentElement.parentElement
            : subjectLine.parentElement;
          const result = subjectLine.querySelector('[kmlc-moyenne]');
          if (debug)
            console.log('[DEBUG]', 'getSubjectAverageElement', 'Subject found.', result);
          return result;
        }
      }
    }
    if (debug)
      console.log(
        '[DEBUG]',
        'getSubjectAverageElement',
        'No subject found for given identifier.',
        subjectNameOrElement
      );
    return null;
  }

  /**
   * Parses and cleans the mean value from a text string.
   *
   * @param {string} meanText - Text containing the mean value.
   * @returns {number} - The parsed mean value.
   */
  function cleanAndParseMean(meanText) {
    const parsedMean = parseFloat(
      meanText
        .split(' ')[0]
        .replace(/[()\/\s]/g, '')
        .replace(',', '.')
        .replace(/[^\d+\-*/.\s]/g, '')
    );
    if (debug)
      console.log('[DEBUG]', 'cleanAndParseMean', 'Parsed mean value.', parsedMean);
    return parsedMean;
  }

  /**
   * Determines background color and tooltip classes based on mean comparisons.
   *
   * @param {number} meanSubjectValue - The mean value of the subject.
   * @param {number} meanObjectifValue - The target mean value.
   * @returns {object} - Object containing backgroundColor and tooltipClass properties.
   */
  function determineTooltipAttributes(meanSubjectValue, meanObjectifValue) {
    let backgroundColor = '';
    let tooltipClass = ' kmlc-tooltip kmlc-tooltip-red';

    if (isNaN(meanSubjectValue)) {
      tooltipClass = ' kmlc-tooltip kmlc-tooltip-blue';
    } else if (meanSubjectValue > meanObjectifValue) {
      backgroundColor = 'background-color: rgba(0, 255, 0, 0.5);';
      tooltipClass = ' kmlc-tooltip kmlc-tooltip-green';
    } else if (meanSubjectValue < meanObjectifValue) {
      backgroundColor = 'background-color: rgba(255, 0, 0, 0.5);';
    } else {
      backgroundColor = 'background-color: rgb(255, 255, 255);';
    }

    if (Math.floor(meanSubjectValue) === Math.floor(meanObjectifValue)) {
      backgroundColor = 'background-color: rgba(255, 127.5, 0, 0.5);';
      tooltipClass = ' kmlc-tooltip kmlc-tooltip-orange';
    }

    if (debug)
      console.log(
        '[DEBUG]',
        'determineTooltipAttributes',
        'Attributes determined based on mean values.',
        {backgroundColor, tooltipClass}
      );
    return {backgroundColor, tooltipClass};
  }

  /**
   * Adds a goal grade tooltip to a subject element.
   *
   * @param {string | HTMLElement} subjectNameOrElement - Name of the subject or an HTMLElement representing it.
   * @param {number | string} meanObjectifValue - The target mean value.
   * @param {string} gradeId - Unique identifier for the grade.
   * @param {string} tooltipSetParentAttributeName - Attribute name to set on the parent element to indicate the tooltip's presence.
   * @param {string} tooltipParentAttributeName - Class name to add to the parent element for styling purposes.
   * @param {string} tooltipAttributeName - Attribute name to set on the tooltip element.
   */
  function addGradeGoal(
    subjectNameOrElement,
    meanObjectifValue,
    gradeId,
    tooltipSetParentAttributeName,
    tooltipParentAttributeName,
    tooltipAttributeName
  ) {
    if (debug)
      console.log('[DEBUG]', 'addGradeGoal', 'Initiating addGradeGoal.', {
        subjectNameOrElement,
        meanObjectifValue
      });

    const subjectAverage = getSubjectAverageElement(subjectNameOrElement);
    if (!subjectAverage) return;

    const meanSubjectValue = cleanAndParseMean(subjectAverage.textContent);
    const {backgroundColor, tooltipClass} = determineTooltipAttributes(
      meanSubjectValue,
      meanObjectifValue
    );

    const parentElement = subjectAverage.parentElement;
    const tooltipSelector = "span[class *= 'kmlc-tooltip']";
    let tooltipElement = parentElement.querySelector(tooltipSelector);

    if (meanObjectifValue === '') {
      if (tooltipElement) {
        tooltipElement.remove();
        parentElement.removeAttribute('style');
      }
      if (debug)
        console.log(
          '[DEBUG]',
          'addGradeGoal',
          'Removed existing tooltip due to empty meanObjectifValue.'
        );
      return;
    }

    if (!tooltipElement) {
      parentElement.classList.add(tooltipParentAttributeName);
      tooltipElement = subjectAverage.cloneNode(true);
      parentElement.appendChild(tooltipElement);
      if (debug)
        console.log(
          '[DEBUG]',
          'addGradeGoal',
          'New tooltip element created and added.',
          tooltipElement
        );
    }

    tooltipElement.className = tooltipClass;
    tooltipElement.textContent = `Objectif de ${meanObjectifValue}`;
    tooltipElement.setAttribute(
      'style',
      `font-weight: 400; ${backgroundColor.replace('0.5', '1')}`
    );
    tooltipElement.setAttribute(tooltipAttributeName, 'true');
    parentElement.setAttribute('style', backgroundColor);
    parentElement.setAttribute(tooltipSetParentAttributeName, 'true');
  }

  // Exporting the addGradeGoal function to be reused in other parts of the application
  exports({addGradeGoal}).to('./src/Notes/functions/add-grade-goal.js');
})();
