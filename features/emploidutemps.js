(() => {
  const EcoleDirecte = imports('EcoleDirecte').from('./vendor/ecoledirecte.js');

  const homeworkStatus = imports('homeworkStatus').from(
    './features/EmploiDuTemps/homework-status.js'
  );

  let backdropScript = true;

  function main(id, token) {
    const account = new EcoleDirecte(id, token);

    // When we receive all the homeworks we save it and send it
    const homeworksData = account.getHomeworks();

    emploidutempsMain(homeworksData);

    if (backdropScript) waitForBackdropToDisappear(homeworksData, emploidutempsMain);

    function emploidutempsMain(homeworksData) {
      homeworkStatus(homeworksData);

      // Wait for the button to return to today in the schedule
      document.waitForElement('#export-pdf').then((buttonExportPDF) => {
        // Check if the button to get the homeworks exist

        if (!document.querySelector('#devoirs')) {
          // Creating the button to get the homeworks

          const devButton = document.createElement('div');
          devButton.setAttribute('id', 'devoirs');
          devButton.setAttribute('class', 'dhx_cal_today_button');
          devButton.setAttribute('style', 'left: 125px');
          devButton.innerText = 'Devoirs';
          devButton.onclick = function () {
            const x = scrollX;
            const y =
              scrollY +
              document.querySelector('div.dhx_cal_header').getBoundingClientRect().y +
              1;
            scrollTo(x, y);

            homeworkStatus(homeworksData);
          };

          buttonExportPDF.parentElement.insertBefore(devButton, buttonExportPDF);
        }
      });

      // Wait for the previous button to appear and add a click listener
      document.waitForElement('.dhx_cal_prev_button').then((buttonPreviousSchedule) => {
        if (!buttonPreviousSchedule.getAttribute('kmlc-prev-button')) {
          buttonPreviousSchedule.setAttribute('kmlc-prev-button', 'true');
          buttonPreviousSchedule.addEventListener(
            'click',
            function (e) {
              e.stopPropagation();
              e.preventDefault();

              const prom = new Promise((resolve) => {
                new MutationObserver((mutations, observer) => {
                  for (let mutation of mutations) {
                    for (let removedNode of mutation.removedNodes) {
                      try {
                        // Wait until the schedule to change and then apply changes

                        /*
                         *
                         * TO-DO   : Create a wait for delete/remove function
                         * PROBLEM : When the funciton was created first,
                         *     it crash, consum a lot and/or work only once
                         *
                         */

                        if (removedNode.getAttribute('aria-label').includes('Dim')) {
                          observer.disconnect();
                          resolve();
                        }
                      } catch (e) {}
                    }
                  }
                }).observe(document.body, {
                  subtree: true,
                  childList: true
                });
              });

              prom.then(() => {
                // Wait for the last day (day 7) to be displayed in the schedule

                document.waitForElement('div.dhx_scale_holder:nth-child(7)').then(() => {
                  homeworkStatus(homeworksData);
                });
              });
            },
            false
          );
        }
      });

      // Wait for the next button to appear and add a click listener
      document.waitForElement('.dhx_cal_next_button').then((buttonNextSchedule) => {
        if (!buttonNextSchedule.getAttribute('kmlc-next-button')) {
          buttonNextSchedule.setAttribute('kmlc-next-button', 'true');
          buttonNextSchedule.addEventListener(
            'click',
            function (e) {
              e.stopPropagation();
              e.preventDefault();

              const prom = new Promise((resolve) => {
                new MutationObserver((mutations, observer) => {
                  for (let mutation of mutations) {
                    for (let removedNode of mutation.removedNodes) {
                      try {
                        // Wait until the schedule to change and then apply changes

                        /*
                         *
                         * TO-DO : Create a wait for delete/remove function
                         * PROBLEM : Crash, consum a lot and/or work only once
                         *
                         */

                        if (removedNode.getAttribute('aria-label').includes('Dim')) {
                          observer.disconnect();
                          resolve();
                        }
                      } catch (e) {}
                    }
                  }
                }).observe(document.body, {
                  subtree: true,
                  childList: true
                });
              });

              prom.then(() => {
                // Wait for the last day (day 7) to be displayed in the schedule

                document.waitForElement('div.dhx_scale_holder:nth-child(7)').then(() => {
                  homeworkStatus(homeworksData);
                });
              });
            },
            false
          );
        }
      });

      // Wait for the button to return to today in the schedule to appear and add a click listener
      document.waitForElement('#view-today').then((buttonTodaySchedule) => {
        if (!buttonTodaySchedule.getAttribute('kmlc-today-button')) {
          buttonTodaySchedule.setAttribute('kmlc-today-button', 'true');
          buttonTodaySchedule.addEventListener(
            'click',
            function (e) {
              e.stopPropagation();
              e.preventDefault();

              const prom = new Promise((resolve) => {
                new MutationObserver((mutations, observer) => {
                  for (let mutation of mutations) {
                    for (let removedNode of mutation.removedNodes) {
                      try {
                        // Wait until the schedule to change and then apply changes

                        /*
                         *
                         * TO-DO : Create a wait for delete/remove function
                         * PROBLEM : Crash, consum a lot and/or work only once
                         *
                         */

                        if (removedNode.getAttribute('aria-label').includes('Dim')) {
                          observer.disconnect();
                          resolve();
                        }
                      } catch (e) {}
                    }
                  }
                }).observe(document.body, {
                  subtree: true,
                  childList: true
                });
              });

              prom.then(() => {
                // Wait for the last day (day 7) to be displayed in the schedule

                document.waitForElement('div.dhx_scale_holder:nth-child(7)').then(() => {
                  homeworkStatus(homeworksData);
                });
              });
            },
            false
          );
        }
      });

      // document.waitForElement(".filtres-agenda > *:nth-child(2)").then((elm) => {
      // elm = elm.parentElement
      // for (let i = 0; i < elm.children.length; i++) {
      // if (!elm.children[i].getAttribute("kmlc-filtre-button")) {
      // elm.children[i].setAttribute("kmlc-filtre-button", "true")
      // elm.children[i].addEventListener('click', function(e) {
      // e.stopPropagation()
      // e.preventDefault()

      // document.waitForElement("div.dhx_scale_holder:nth-child(7)").then((elm) => {
      // homeworkStatus(dev)
      // })
      // }, false);
      // }
      // }
      // })
    }
  }

  function waitForBackdropToDisappear(homeworksData, callback) {
    // If there is the loading page we wait for it to be deleted
    if (backdropScript) {
      backdropScript = false;
      document
        .waitForElement(
          "div[class *= 'ng-tns'][class *= 'ng-busy']:not([class *= 'backdrop'])"
        )
        .then(() => {
          const prom = new Promise((resolve) => {
            new MutationObserver((mutations, observer) => {
              for (let mutation of mutations) {
                for (let removedNode of mutation.removedNodes) {
                  try {
                    if (
                      removedNode.getAttribute('class').includes('ng-tns') &&
                      removedNode.getAttribute('class').includes('ng-busy') &&
                      !removedNode.getAttribute('class').includes('backdrop')
                    ) {
                      observer.disconnect();
                      resolve();
                    }
                  } catch (e) {}
                }
              }
            }).observe(document.body, {
              subtree: true,
              childList: true
            });
          });

          prom.then(() => {
            backdropScript = true;
            callback(homeworksData);
            waitForBackdropToDisappear(homeworksData, callback);
          });
        });
    }
  }

  exports({main}).to('./features/emploidutemps.js');
})();
