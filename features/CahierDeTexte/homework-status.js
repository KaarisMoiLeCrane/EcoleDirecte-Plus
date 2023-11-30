(() => {
  const numToDate = imports('numToDate').from('./utils/utils.js');

  function homeworkStatus(homeworks) {
    // For each day with homeworks
    const homeworksDates = Object.keys(homeworks);

    document.kmlcWaitForElement('h3[class *= date]').then(() => {
      for (let i = 0; i < homeworksDates.length; i++) {
        const homeworksDate = homeworksDates[i];
        // Get the date of each homework displayed on the homework section
        const cahierDeTexteDates = document.querySelectorAll('h3[class *= date]');

        // For each day with homeworks we will check if each homework is done or not
        for (let j = 0; j < homeworks[homeworksDate].length; j++) {
          const homework = homeworks[homeworksDate][j];
          const backgroundColor =
            homework.effectue == true
              ? 'background-color: rgb(0, 255, 0, 0.5);'
              : homework.effectue == false
              ? 'background-color: rgb(255, 127.5, 0, 0.5);'
              : '';

          const symbol =
            homework.effectue == true
              ? ' /✓\\'
              : homework.effectue == false
              ? ' /!\\'
              : ' /ERROR\\';

          /*
          if (dev[date][i].effectue == true) {
            // Homework done
  
            // Green color with 0.5 opacity
            backgroundColor = 'background-color: rgb(0, 255, 0, 0.5);';
            symbol = ' /✓\\';
          } else if (dev[date][i].effectue == false) {
            // Homework not done
  
            // Red color with 0.5 opacity
            backgroundColor = 'background-color: rgb(255, 127.5, 0, 0.5);';
            symbol = ' /!\\';
          } else {
            // We never know
  
            backgroundColor = '';
            symbol = ' /ERROR\\ ';
          }
          */

          // For each homeworks check until we find the correct date and then apply the changes
          for (let k = 0; k < cahierDeTexteDates.length; k++) {
            /*
            console.log(
              123,
              (
                devDateCDT[j].textContent.split(' ')[1] +
                ' ' +
                devDateCDT[j].textContent.split(' ')[2]
              ).toLowerCase(),
              (
                parseInt(date.split('-')[2]) +
                ' ' +
                numToDate(date.split('-')[1]).norm
              ).toLowerCase()
            );
            */
            if (
              (
                cahierDeTexteDates[k].textContent.split(' ')[1] +
                ' ' +
                cahierDeTexteDates[k].textContent.split(' ')[2]
              ).toLowerCase() ==
              (
                parseInt(homeworksDate.split('-')[2]) +
                ' ' +
                numToDate(homeworksDate.split('-')[1]).norm
              ).toLowerCase()
            ) {
              // Change the background color of the card containing the specific date
              if (cahierDeTexteDates[k].parentElement.getAttribute('style')) {
                if (
                  !cahierDeTexteDates[k].parentElement
                    .getAttribute('style')
                    .includes('background-color: rgb(255, 127.5, 0, 0.0);')
                ) {
                  cahierDeTexteDates[k].parentElement.setAttribute(
                    'style',
                    cahierDeTexteDates[k].parentElement
                      .getAttribute('style')
                      .replace('background-color: rgb(0, 255, 0, 0.0);', '') +
                      backgroundColor.replace('0.5', '0.0')
                  );
                  cahierDeTexteDates[k].parentElement.parentElement.setAttribute(
                    'style',
                    cahierDeTexteDates[k].parentElement
                      .getAttribute('style')
                      .replace('background-color: rgb(0, 255, 0, 0.5);', '') +
                      backgroundColor
                  );
                }
              } else {
                cahierDeTexteDates[k].parentElement.setAttribute(
                  'style',
                  backgroundColor.replace('0.5', '0.0')
                );
                cahierDeTexteDates[k].parentElement.parentElement.setAttribute(
                  'style',
                  backgroundColor
                );
              }

              // Search for the correct subject and then add the correct symbol for the subject
              let cahierDeTexteHomeworkSubject = cahierDeTexteDates[
                k
              ].parentElement.parentElement.kmlcGetElementsByContentText(
                ' ' + homework.matiere
              ).startsWith;

              if (cahierDeTexteHomeworkSubject[0]) {
                cahierDeTexteHomeworkSubject =
                  cahierDeTexteHomeworkSubject[cahierDeTexteHomeworkSubject.length - 1];
                if (!cahierDeTexteHomeworkSubject.outerHTML.includes(symbol)) {
                  // Change the background color of the card containing the homework of a specific date
                  const subjectCard =
                    cahierDeTexteHomeworkSubject.parentElement.parentElement;

                  subjectCard.outerHTML = subjectCard.outerHTML.replace(
                    ' ' + homework.matiere.kmlcHtmlEncode(),
                    symbol + ' ' + homework.matiere.kmlcHtmlEncode()
                  );

                  /*
                  if (matCard.getAttribute('style')) {
                    if (
                      matCard
                        .getAttribute('style')
                        .includes('background-color: rgb(255, 127.5, 0, 0.5);')
                    ) {
                      matCard.setAttribute(
                        'style',
                        matCard
                          .getAttribute('style')
                          .replace('background-color: rgb(255, 127.5, 0, 0.5);', '') +
                          backgroundColor
                      );
                    } else {
                      matCard.setAttribute(
                        'style',
                        matCard
                          .getAttribute('style')
                          .replace('background-color: rgb(0, 255, 0, 0.5);', '') +
                          backgroundColor
                      );
                    }
                  } else {
                    matCard.setAttribute('style', backgroundColor);
                  }

                  console.log(matCard, mat, dev[date][i]);
                  */
                }
              }
            }
          }
        }
      }
    });
  }

  exports({homeworkStatus}).to('./features/CahierDeTexte/homework-status.js');
})();
