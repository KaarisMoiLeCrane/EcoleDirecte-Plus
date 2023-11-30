(() => {
  const numToDate = imports('numToDate').from('./utils/utils.js');

  function homeworkRefresh(homeworks) {
    if (homeworkRefreshObserver) {
      homeworkRefreshObserver.disconnect();
    }

    var homeworkRefreshObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (cahierDeTexteHomeworkMutation) {
        const cahierDeTexteHomework = cahierDeTexteHomeworkMutation.target;
        if (
          cahierDeTexteHomeworkMutation.type === 'childList' &&
          cahierDeTexteHomework.className.includes('ed-card') &&
          !cahierDeTexteHomework.className.includes('devoiravenir')
        ) {
          const scheduleDate = cahierDeTexteHomework.parentElement.parentElement;
          const homeworksDates = Object.keys(homeworks);

          for (let i = 0; i < homeworksDates.length; i++) {
            const homeworksDate = homeworksDates[i];

            if (
              (
                scheduleDate.textContent.split(' ')[1] +
                ' ' +
                scheduleDate.textContent.split(' ')[2]
              ).toLowerCase() ==
              (
                parseInt(homeworksDate.split('-')[2]) +
                ' ' +
                numToDate(homeworksDate.split('-')[1]).norm
              ).toLowerCase()
            ) {
              for (let j = 0; j < homeworks[homeworksDate].length; j++) {
                const homework = homeworks[homeworksDate][j];
                const homeworkSubject = homework.matiere.replace(/ /g, '').toLowerCase();
                const boxEffectuee =
                  cahierDeTexteHomework.querySelector('#checkEffectue');

                if (
                  homeworkSubject ==
                  boxEffectuee.parentElement.parentElement.parentElement
                    .querySelector('h3')
                    .innerText.replace(/ /g, '')
                    .toLowerCase()
                ) {
                  if (!boxEffectuee.getAttribute('kmlc-effectuee-listener')) {
                    boxEffectuee.setAttribute('kmlc-effectuee-listener', 'true');
                    boxEffectuee.addEventListener('click', function () {
                      homework.effectue = this.checked;
                    });
                  }
                }
              }
            }
          }
        }
      });
    });

    executeHomeworkRefreshObserver(homeworkRefreshObserver);
  }

  function executeHomeworkRefreshObserver(observer) {
    document.kmlcWaitForElement('.cahierdetexteimprimable').then((elm) => {
      observer.observe(elm, {
        attributes: true,
        childList: true,
        subtree: true
      });
    });
  }

  exports({homeworkRefresh}).to('./features/CahierDeTexte/homework-refresh.js');
})();
