(() => {
  const EcoleDirecte = imports('EcoleDirecte').from('./vendor/ecoledirecte.js');
  const homeworkStatus = imports('homeworkStatus').from(
    './src/EmploiDuTemps/homework-status.js'
  );

  let backdropScript = true;

  /**
   * Main function to initialize the application.
   * @param {string} id - User ID for EcoleDirecte.
   * @param {string} token - Authentication token for EcoleDirecte.
   */
  async function main(id, token) {
    const account = new EcoleDirecte(id, token);

    // Retrieve and process homeworks
    const homeworksData = account.getHomeworks();
    if (debug) console.log('[DEBUG]', 'main', 'Homeworks data retrieved', homeworksData);

    emploidutempsMain(homeworksData, 1);

    if (backdropScript) {
      if (debug)
        console.log(
          '[DEBUG]',
          'main-backdropScript',
          'Launch waitForBackdropToDisappear',
          backdropScript
        );
      waitForBackdropToDisappear(homeworksData, emploidutempsMain);
    }
  }

  /**
   * Main function to handle the schedule and homework status updates.
   * @param {Object} homeworksData - Data containing homeworks.
   */
  function emploidutempsMain(homeworksData, num) {
    homeworkStatus(homeworksData, num);

    // Add button to view homework
    document.kmlcWaitForElement('#export-pdf').then((buttonExportPDF) => {
      if (!document.querySelector('#devoirs')) {
        createHomeworkButton(buttonExportPDF, homeworksData);
      }
    });

    // Add event listeners to schedule navigation buttons
    addNavigationButtonListener('.dhx_cal_prev_button', homeworksData);
    addNavigationButtonListener('.dhx_cal_next_button', homeworksData);
    addTodayButtonListener('#view-today', homeworksData);
  }

  /**
   * Create and insert the button to view homework.
   * @param {HTMLElement} buttonExportPDF - The export PDF button element.
   * @param {Object} homeworksData - Data containing homeworks.
   */
  function createHomeworkButton(buttonExportPDF, homeworksData) {
    const devButton = document.createElement('div');
    devButton.setAttribute('id', 'devoirs');
    devButton.setAttribute(
      'style',
      'left: 125px; cursor:pointer; background-color:none; background-repeat:no-repeat; height:30px; text-align:center; font-size:inherit; font-weight:700; color:#747473; right:123px; background-image:none; background-position:-62px 0; width:80px; border:1px solid #cecece; border-radius:5px; text-decoration:none; text-transform:none; line-height:30px; margin:0; padding:0; box-sizing:content-box;'
    );
    devButton.innerText = 'Devoirs';
    devButton.onclick = function () {
      this.innerText = 'Devoirs';
      const x = scrollX;
      const y =
        scrollY +
        document.querySelector('div.dhx_cal_header').getBoundingClientRect().y +
        1;
      scrollTo(x, y);

      homeworkStatus(homeworksData, 2);
    };
    if (!document.querySelector('#devoirs')) {
      buttonExportPDF.parentElement.insertBefore(devButton, buttonExportPDF);
    }
    if (debug)
      console.log(
        '[DEBUG]',
        'createHomeworkButton',
        'Homework button created and inserted'
      );
  }

  /**
   * Add event listeners to navigation buttons.
   * @param {string} selector - The CSS selector for the button.
   * @param {Object} homeworksData - Data containing homeworks.
   */
  function addNavigationButtonListener(selector, homeworksData) {
    document.kmlcWaitForElement(selector).then((button) => {
      if (!button.getAttribute(`kmlc-${selector}-button`)) {
        button.setAttribute(`kmlc-${selector}-button`, 'true');
        button.addEventListener('click', function (e) {
          e.stopPropagation();
          e.preventDefault();

          waitForScheduleUpdate(homeworksData);
        });
        if (debug)
          console.log(
            '[DEBUG]',
            'addNavigationButtonListener',
            `${selector} button listener added`
          );
      }
    });
  }

  /**
   * Add event listener to the "today" button.
   * @param {string} selector - The CSS selector for the button.
   * @param {Object} homeworksData - Data containing homeworks.
   */
  function addTodayButtonListener(selector, homeworksData) {
    document.kmlcWaitForElement(selector).then((button) => {
      if (!button.getAttribute('kmlc-today-button')) {
        button.setAttribute('kmlc-today-button', 'true');
        button.addEventListener('click', function (e) {
          e.stopPropagation();
          e.preventDefault();

          waitForScheduleUpdate(homeworksData);
        });
        if (debug)
          console.log('[DEBUG]', 'addTodayButtonListener', 'Today button listener added');
      }
    });
  }

  /**
   * Wait for the schedule to update and then apply changes.
   * @param {Object} homeworksData - Data containing homeworks.
   */
  function waitForScheduleUpdate(homeworksData) {
    const prom = new Promise((resolve) => {
      new MutationObserver((mutations, observer) => {
        for (const mutation of mutations) {
          for (const removedNode of mutation.removedNodes) {
            try {
              if (removedNode?.getAttribute('aria-label')?.includes('Dim')) {
                observer.disconnect();
                resolve();
              }
            } catch (e) {
              if (debug)
                console.log(
                  '[DEBUG]',
                  'waitForScheduleUpdate',
                  'Error during mutation observation',
                  e
                );
            }
          }
        }
      }).observe(document.body, {
        subtree: true,
        childList: true
      });
    });

    prom.then(() => {
      document.kmlcWaitForElement('div.dhx_scale_holder:nth-child(7)').then(() => {
        homeworkStatus(homeworksData, 3);
      });
    });
  }

  /**
   * Wait for the backdrop to disappear before proceeding.
   * @param {Object} homeworksData - Data containing homeworks.
   * @param {Function} callback - Callback function to execute after backdrop disappears.
   */
  function waitForBackdropToDisappear(homeworksData, callback) {
    if (debug)
      console.log(
        '[DEBUG]',
        'waitForBackdropToDisappear',
        'Wait for the backdrop to disappear',
        backdropScript
      );
    if (backdropScript) {
      backdropScript = false;
      document
        .kmlcWaitForElement(
          "div[class *= 'ng-tns'][class *= 'ng-busy']:not([class *= 'backdrop'])"
        )
        .then(() => {
          const prom = new Promise((resolve) => {
            new MutationObserver((mutations, observer) => {
              for (const mutation of mutations) {
                for (const removedNode of mutation.removedNodes) {
                  try {
                    if (
                      removedNode?.getAttribute('class')?.includes('ng-tns') &&
                      removedNode?.getAttribute('class')?.includes('ng-busy') &&
                      !removedNode?.getAttribute('class')?.includes('backdrop')
                    ) {
                      observer.disconnect();
                      resolve();
                    }
                  } catch (e) {
                    if (debug)
                      console.log(
                        '[DEBUG]',
                        'waitForBackdropToDisappear',
                        'Error during mutation observation',
                        e
                      );
                  }
                }
              }
            }).observe(document.body, {
              subtree: true,
              childList: true
            });
          });

          prom.then(() => {
            backdropScript = true;
            if (window.location.href.includes('EmploiDuTemps')) {
              callback(homeworksData, 4);
              waitForBackdropToDisappear(homeworksData, callback);
            }
          });
        });
    }
  }

  exports({main}).to('./src/emploidutemps.js');
})();
