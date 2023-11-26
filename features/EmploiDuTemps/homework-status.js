(() => {
  function homeworkStatus(homeworks) {
    // For each day with homeworks
    const homeworksDates = Object.keys(homeworks);
    for (let i = 0; i < homeworksDates.length; i++) {
      const homeworksDate = homeworksDates[i];
      document.waitForElement('div [class *= dhx_scale_holder]:nth-child(7)').then(() => {
        // Get the date of each day displayed in the schedule
        const scheduleDates = document.querySelectorAll('[class *= dhx_scale_bar]');

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
        if (dev[homeworksDate][i].effectue == true) {
          // Homework done

          // Green color with 0.5 opacity
          backgroundColor = ' background-color: rgb(0, 255, 0, 0.5);';
          symbol = '/✓\\ ';
        } else if (dev[homeworksDate][i].effectue == false) {
          // Homework not done

          // Red color with 0.5 opacity
          backgroundColor = ' background-color: rgb(255, 127.5, 0, 0.5);';
          symbol = '/!\\ ';
        } else {
          // We never know

          backgroundColor = '';
          symbol = '/ERROR\\ ';
        }
        */

          // For each homeworks check until we find the correct date and then apply the changes
          for (let k = 0; k < scheduleDates.length; k++) {
            const scheduleDate = scheduleDates[k];
            if (
              (
                scheduleDate.textContent.split(' ')[1] +
                ' ' +
                scheduleDate.textContent.split(' ')[2]
              ).toLowerCase() ==
              (
                parseInt(homeworksDate.split('-')[2]) +
                ' ' +
                globalThis.Utils.numToDate(homeworksDate.split('-')[1]).abrv
              ).toLowerCase()
            ) {
              // Change the background color of the date of the homework
              if (scheduleDate.getAttribute('style')) {
                if (
                  !scheduleDate
                    .getAttribute('style')
                    .includes('background-color: rgb(255, 127.5, 0, 0.5);')
                )
                  scheduleDate.setAttribute(
                    'style',
                    scheduleDate
                      .getAttribute('style')
                      .replace('background-color: rgb(0, 255, 0, 0.5);', '') +
                      backgroundColor
                  );
              } else {
                scheduleDate.setAttribute('style', backgroundColor);
              }

              // Search for the correct subject and then add the correct symbol for the subject
              const subjects = document
                .querySelectorAll('div [class *= dhx_scale_holder]')
                [k].getElementsByContentText(homework.matiere).startsWith;
              if (subjects) {
                for (let l = 0; l < subjects.length; l++) {
                  if (!subjects[l].outerHTML.includes(symbol))
                    subjects[l].outerHTML = subjects[l].outerHTML.replace(
                      homework.matiere.htmlEncode(),
                      symbol + '<br>' + homework.matiere.htmlEncode()
                    );
                }
              }
            }
          }
        }
      });
    }
  }

  exports({homeworkStatus}).to('./features/EmploiDuTemps/homework-status.js');
})();
