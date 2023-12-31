(() => {
  function main(id, token) {
    const EcoleDirecte = imports('EcoleDirecte').from('./vendor/ecoledirecte.js');

    const rang = imports('rang').from('./features/Notes/rang.js');
    const coeff = imports('coeff').from('./features/Notes/coeff.js');

    const calculerMoyennes = imports('calculerMoyennes').from(
      './features/Notes/functions/calculer-moyennes.js'
    );

    const charts = imports('charts').from('./features/Notes/charts.js');

    const variationMoyenne = imports('variationMoyenne').from(
      './features/Notes/variation-moyenne.js'
    );

    const modifierNoteSimulation = imports('modifierNoteSimulation').from(
      './features/Notes/modifier-note-simulation.js'
    );
    const ajouterNoteSimulation = imports('ajouterNoteSimulation').from(
      './features/Notes/ajouter-note-simulation.js'
    );

    const objectifSetup = imports('objectifSetup').from('./features/Notes/objectif.js');

    const account = new EcoleDirecte(id, token);

    // When we receive all the grades datas we save them and send them
    const gradesData = account.getAllGrades();
    globalThis.quotient = parseFloat(gradesData.parametrage.moyenneSur);

    globalThis.Notes.dataPeriodes = gradesData.periodes;

    document.kmlcWaitForElement("[class *= 'tab-content']").then((elm) => {
      let periode = document.querySelector('#onglets-periodes > ul > li.active.nav-item');
      periode = Array.from(periode.parentNode.children).indexOf(periode);

      setPeriodesInfos(globalThis.Notes.dataPeriodes);

      rang(gradesData);
      coeff(gradesData);

      calculerMoyennes(
        1,
        true,
        'kmlc-moyenne-g',
        '',
        'kmlc-moyenne',
        '',
        true,
        ":not([class *= 'simu'])"
      );

      charts(gradesData);

      modifierNoteSimulation();
      ajouterNoteSimulation();

      objectifSetup();

      variationMoyenne(periode, gradesData);
    });
    // console.log(1)
    var notesObserver = new MutationObserver(function (mutations) {
      // console.log(2)
      mutations.forEach(function (mutation) {
        try {
          // console.log(mutation.target)
          // if (mutation.target.children[0].innerText == "Moyennes" || mutation.target.children[0].innerText == "Evaluations") {
          if (
            mutation.target.children[0].innerText == 'Evaluations' &&
            mutation.target.children[0].nodeName == 'SPAN'
          ) {
            // console.log(mutation.target.children[0])

            let periode = document.querySelector(
              '#onglets-periodes > ul > li.active.nav-item'
            );
            periode = Array.from(periode.parentNode.children).indexOf(periode);

            setPeriodesInfos(globalThis.Notes.dataPeriodes);

            rang(gradesData);
            coeff(gradesData);

            calculerMoyennes(
              2,
              true,
              'kmlc-moyenne-g',
              '',
              'kmlc-moyenne',
              '',
              true,
              ":not([class *= 'simu'])"
            );

            charts(gradesData);

            modifierNoteSimulation();
            ajouterNoteSimulation();

            objectifSetup();

            variationMoyenne(periode, gradesData);
          }
        } catch (e) {
          // console.log(e)
        }
      });
    });

    executeNotesObserver(notesObserver);

    function executeNotesObserver(observer) {
      // Wait for the parent containing the table that isn't modified or removed when something in the table change
      document.kmlcWaitForElement('.eleve-note').then((elm) => {
        // console.log(789)
        observer.observe(elm, {
          characterData: false,
          attributes: true,
          attributeFilter: ['class'],
          childList: true,
          subtree: true
        });
      });
    }

    function setPeriodesInfos(periodes) {
      let elmPeriodes = document.querySelectorAll(
        "ul[class *= 'tabs'] > li > [class *= 'nav-link']"
      );

      for (let i = 0; i < elmPeriodes.length; i++) {
        if (elmPeriodes[i].getAttribute('dateDebut')) continue;

        for (let j = 0; j < periodes.length; j++) {
          if (periodes[j].periode == elmPeriodes[i].textContent) {
            elmPeriodes[i].setAttribute(
              'dateDebut',
              periodes[j].dateDebut.kmlcConvertToTimestamp()
            );
            elmPeriodes[i].setAttribute(
              'dateFin',
              periodes[j].dateFin.kmlcConvertToTimestamp()
            );
            elmPeriodes[i].setAttribute('codePeriode', periodes[j].codePeriode);

            if (periodes[j].codePeriode.includes('R'))
              elmPeriodes[i].setAttribute('R', 'true');
            else elmPeriodes[i].setAttribute('R', 'false');

            break;
          }
        }
      }
    }
  }

  exports({main}).to('./features/notes.js');
})();
