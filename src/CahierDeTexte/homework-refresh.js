(() => {
  const numToDate = imports('numToDate').from('./utils/utils.js');

  /**
   * Refreshes the homework list by observing mutations in the DOM.
   * @param {Object} homeworks - The homework data indexed by date.
   */
  function homeworkRefresh(homeworks) {
    if (Object.entries(homeworks).length == 0) return;

    let homeworkRefreshObserver;

    // Disconnect existing observer if any
    if (homeworkRefreshObserver) {
      homeworkRefreshObserver.disconnect();
      if (debug)
        console.log('[DEBUG]', 'homeworkRefresh', 'Disconnected existing observer');
    }

    // Create a new MutationObserver
    homeworkRefreshObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const cahierDeTexteHomework = mutation.target;

        // Ensure mutation is of type 'childList' and element is of class 'ed-card' but not 'devoiravenir'
        if (
          mutation.type === 'childList' &&
          cahierDeTexteHomework.className.includes('ed-card') &&
          !cahierDeTexteHomework.className.includes('devoiravenir')
        ) {
          const scheduleDate = cahierDeTexteHomework.parentElement.parentElement;
          const homeworksDates = Object.keys(homeworks);

          // Iterate over homework dates
          homeworksDates.forEach((homeworksDate) => {
            const formattedDate = formatScheduleDate(scheduleDate);
            const targetDate = formatHomeworkDate(homeworksDate);

            // Check if the formatted dates match
            if (formattedDate === targetDate) {
              // Iterate over homework entries for the matched date
              if (homeworks[homeworksDate].length != 0) {
                homeworks[homeworksDate].forEach((homework) => {
                  const homeworkSubject = homework.matiere
                    .replace(/ /g, '')
                    .toLowerCase();
                  const boxEffectuee =
                    cahierDeTexteHomework.querySelector('#checkEffectue');

                  // Verify the subject of the homework
                  if (isMatchingSubject(boxEffectuee, homeworkSubject)) {
                    // Attach a click listener if not already attached
                    if (!boxEffectuee.getAttribute('kmlc-effectuee-listener')) {
                      boxEffectuee.setAttribute('kmlc-effectuee-listener', 'true');
                      boxEffectuee.addEventListener('click', () => {
                        homework.effectue = boxEffectuee.checked;
                        if (debug)
                          console.log(
                            '[DEBUG]',
                            'homeworkEffectue',
                            'Homework effectue status updated',
                            homework
                          );
                      });
                    }
                  }
                });
              }
            }
          });
        }
      });
    });

    // Execute the observer
    executeHomeworkRefreshObserver(homeworkRefreshObserver);
  }

  /**
   * Helper function to format the schedule date from the DOM element.
   * @param {HTMLElement} scheduleDateElement - The DOM element containing the schedule date.
   * @returns {string} - The formatted schedule date.
   */
  function formatScheduleDate(scheduleDateElement) {
    return (
      scheduleDateElement.textContent.split(' ')[1] +
      ' ' +
      scheduleDateElement.textContent.split(' ')[2]
    ).toLowerCase();
  }

  /**
   * Helper function to format the homework date.
   * @param {string} homeworksDate - The date string from the homeworks object.
   * @returns {string} - The formatted homework date.
   */
  function formatHomeworkDate(homeworksDate) {
    return (
      parseInt(homeworksDate.split('-')[2]) +
      ' ' +
      numToDate(homeworksDate.split('-')[1]).norm
    ).toLowerCase();
  }

  /**
   * Checks if the subject of the homework matches with the DOM element.
   * @param {HTMLElement} boxEffectuee - The DOM element for the checkbox.
   * @param {string} homeworkSubject - The subject of the homework.
   * @returns {boolean} - True if subjects match, false otherwise.
   */
  function isMatchingSubject(boxEffectuee, homeworkSubject) {
    const subjectElement =
      boxEffectuee.parentElement.parentElement.parentElement.querySelector('h3');
    return subjectElement.innerText.replace(/ /g, '').toLowerCase() === homeworkSubject;
  }

  /**
   * Executes the MutationObserver to watch for changes in the homework section of the DOM.
   * @param {MutationObserver} observer - The MutationObserver instance.
   */
  function executeHomeworkRefreshObserver(observer) {
    document.kmlcWaitForElement('.cahierdetexteimprimable').then((elm) => {
      observer.observe(elm, {
        attributes: true,
        childList: true,
        subtree: true
      });
      if (debug)
        console.log(
          '[DEBUG]',
          'executeHomeworkRefreshObserver',
          'Observer is now watching for changes'
        );
    });
  }

  exports({homeworkRefresh}).to('./src/CahierDeTexte/homework-refresh.js');
})();
