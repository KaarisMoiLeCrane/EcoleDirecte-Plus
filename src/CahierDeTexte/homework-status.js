(() => {
  const numToDate = imports('numToDate').from('./utils/utils.js');

  /**
   * Main function to refresh the status of homework.
   * @param {Object} homeworks - The homework data indexed by date.
   */
  function homeworkStatus(homeworks) {
    if (Object.entries(homeworks).length == 0) return;

    const homeworksDates = Object.keys(homeworks);

    // Wait for the elements with homework dates to be available
    document.kmlcWaitForElement('h3[class *= date]').then(() => {
      homeworksDates.forEach((homeworksDate) => {
        if (homeworks[homeworksDate].length != 0) {
          const cahierDeTexteDates = document.querySelectorAll('h3[class *= date]');
          homeworks[homeworksDate].forEach((homework) => {
            const {backgroundColor, symbol} = getHomeworkStyle(homework);

            cahierDeTexteDates.forEach((cahierDeTexteDate) => {
              if (isMatchingDate(cahierDeTexteDate, homeworksDate)) {
                updateDateStyle(cahierDeTexteDate, backgroundColor);
                updateHomeworkSymbol(cahierDeTexteDate, homework, symbol);
              }
            });
          });
        }
      });
    });
  }

  /**
   * Get the background color and symbol based on the homework status.
   * @param {Object} homework - The homework object.
   * @returns {Object} - The background color and symbol.
   */
  function getHomeworkStyle(homework) {
    let backgroundColor, symbol;
    if (homework.effectue === true) {
      backgroundColor = 'rgba(0, 255, 0, 0.5)';
      symbol = ' /✓\\';
    } else if (homework.effectue === false) {
      backgroundColor = 'rgba(255, 127.5, 0, 0.5)';
      symbol = ' /!\\';
    } else {
      backgroundColor = '';
      symbol = ' /ERROR\\';
    }
    return {backgroundColor, symbol};
  }

  /**
   * Check if the date in the DOM matches the homework date.
   * @param {HTMLElement} element - The DOM element containing the date.
   * @param {string} homeworksDate - The date string from the homeworks object.
   * @returns {boolean} - True if the dates match, false otherwise.
   */
  function isMatchingDate(element, homeworksDate) {
    const dateText = element.textContent.split(' ');
    const scheduleDate = `${dateText[1]} ${dateText[2]}`.toLowerCase();
    const homeworkDate = `${parseInt(homeworksDate.split('-')[2])} ${
      numToDate(homeworksDate.split('-')[1]).norm
    }`.toLowerCase();
    return scheduleDate === homeworkDate;
  }

  /**
   * Update the background color of the element containing the date.
   * @param {HTMLElement} element - The DOM element containing the date.
   * @param {string} backgroundColor - The background color to be applied.
   */
  function updateDateStyle(element, backgroundColor) {
    const parentElement = element.parentElement;
    parentElement.style.setProperty(
      'background-color',
      backgroundColor.replace('0.5', '0.0')
    );
    parentElement.parentElement.style.setProperty('background-color', backgroundColor);
    if (debug)
      console.log('[DEBUG]', 'updateDateStyle', 'Updated date style', {
        element,
        backgroundColor
      });
  }

  /**
   * Update the symbol for the homework based on its status.
   * @param {HTMLElement} dateElement - The DOM element containing the date.
   * @param {Object} homework - The homework object.
   * @param {string} symbol - The symbol to be added for the homework.
   */
  function updateHomeworkSymbol(dateElement, homework, symbol) {
    let cahierDeTexteHomeworkSubject =
      dateElement.parentElement.parentElement.kmlcGetElementsByContentText(
        ' ' + homework.matiere
      ).startsWith;

    if (cahierDeTexteHomeworkSubject[0]) {
      cahierDeTexteHomeworkSubject =
        cahierDeTexteHomeworkSubject[cahierDeTexteHomeworkSubject.length - 1];
      if (!cahierDeTexteHomeworkSubject.outerHTML.includes(symbol)) {
        const subjectCard = cahierDeTexteHomeworkSubject.parentElement.parentElement;
        subjectCard.outerHTML = subjectCard.outerHTML.replace(
          ' ' + homework.matiere.kmlcHtmlEncode(),
          symbol + ' ' + homework.matiere.kmlcHtmlEncode()
        );
        if (debug)
          console.log('[DEBUG]', 'updateHomeworkSymbol', 'Updated homework symbol', {
            subjectCard,
            symbol
          });
      }
    }
  }

  exports({homeworkStatus}).to('./src/CahierDeTexte/homework-status.js');
})();
