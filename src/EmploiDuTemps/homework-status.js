(() => {
  const numToDate = imports('numToDate').from('./utils/utils.js');

  /**
   * Main function to refresh the status of homework.
   * @param {Object} homeworks - The homework data indexed by date.
   */
  function homeworkStatus(homeworks, num) {
    if (Object.entries(homeworks).length == 0) return;

    const homeworksDates = Object.keys(homeworks);

    homeworksDates.forEach((homeworksDate) => {
      document
        .kmlcWaitForElement('div [class *= dhx_scale_holder]:nth-child(7)')
        .then(() => {
          if (homeworks[homeworksDate].length != 0) {
            const scheduleDates = document.querySelectorAll('[class *= dhx_scale_bar]');
            homeworks[homeworksDate].forEach((homework) => {
              const {backgroundColor, symbol} = getHomeworkStyle(homework);

              scheduleDates.forEach((scheduleDate) => {
                if (isMatchingDate(scheduleDate, homeworksDate)) {
                  if (debug)
                    console.log(
                      '[DEBUG]',
                      'homeworkStatus',
                      'Homeworks matching the date ' + scheduleDate.textContent,
                      {
                        num,
                        homeworks
                      }
                    );
                  updateDateStyle(scheduleDate, backgroundColor);
                  updateHomeworkSymbols(scheduleDate, homework, symbol);
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
      numToDate(homeworksDate.split('-')[1]).abrv
    }`.toLowerCase();
    return scheduleDate === homeworkDate;
  }

  /**
   * Update the background color of the element containing the date.
   * @param {HTMLElement} element - The DOM element containing the date.
   * @param {string} backgroundColor - The background color to be applied.
   */
  function updateDateStyle(element, backgroundColor) {
    element.style.setProperty('background-color', backgroundColor);
    if (debug)
      console.log('[DEBUG] updateDateStyle', 'Updated date style', {
        element,
        backgroundColor
      });
  }

  /**
   * Update the symbols for the homework based on its status.
   * @param {HTMLElement} dateElement - The DOM element containing the date.
   * @param {Object} homework - The homework object.
   * @param {string} symbol - The symbol to be added for the homework.
   */
  function updateHomeworkSymbols(dateElement, homework, symbol) {
    const subjects = document
      .querySelectorAll('div [class *= dhx_scale_holder]')
      .item([...dateElement.parentElement.children].indexOf(dateElement))
      .kmlcGetElementsByContentText(homework.matiere).startsWith;
    if (debug)
      console.log(
        '[DEBUG] updateHomeworkSymbols',
        'Subjects retrieved for homework symbol change',
        {subjects, homework}
      );

    if (subjects) {
      subjects.forEach((subject) => {
        if (!subject.outerHTML.includes(symbol)) {
          subject.outerHTML = subject.outerHTML.replace(
            homework.matiere.kmlcHtmlEncode(),
            `${symbol}<br>${homework.matiere.kmlcHtmlEncode()}`
          );
          if (debug)
            console.log('[DEBUG] updateHomeworkSymbols', 'Updated homework symbol', {
              subject,
              symbol
            });
        }
      });
    }
  }

  exports({homeworkStatus}).to('./src/EmploiDuTemps/homework-status.js');
})();
