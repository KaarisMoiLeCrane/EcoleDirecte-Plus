(() => {
  /**
   * Adds a "RANG" column to the gradebook if it doesn't already exist.
   * @param {Object} note - Grade data containing information about subjects.
   */
  function rank(note) {
    // If there is no "Rang" column, proceed to add it
    if (!document.querySelector("th[class *= 'rang ng-star-inserted']")) {
      const meanColumnTitleClass = "'relevemoyenne ng-star-inserted'";
      const meanColumnTitleElement = document.querySelector(
        'th[class *= ' + meanColumnTitleClass + ']'
      );

      // Clone the "MOYENNES" element and modify it to "RANG"
      const rankColumnTitleElement = meanColumnTitleElement.cloneNode(true);
      rankColumnTitleElement.innerText = 'Rang';
      rankColumnTitleElement.setAttribute('class', 'rang ng-star-inserted');

      meanColumnTitleElement.parentElement.insertBefore(
        rankColumnTitleElement,
        meanColumnTitleElement.parentElement.querySelector('[class = graph]')
      );

      if (debug) console.log('[DEBUG]', 'rank', 'Added "Rang" column to the gradebook.');

      // Get the means of each subject (each row of the column "MOYENNES")
      const subjectMeansColumn = document.querySelectorAll(
        'td[class *= ' + meanColumnTitleClass + ']'
      );

      // Iterate over each mean element to add ranking information
      for (let i = 0; i < subjectMeansColumn.length; i++) {
        const subjectMeanElementToRank = subjectMeansColumn[i].cloneNode(true);
        const actualPeriode = document.querySelector('ul.nav-tabs > li.active');
        const actualPeriodeIndex = [...actualPeriode.parentElement.children].indexOf(
          actualPeriode
        );

        const rankCase = subjectMeanElementToRank.children[0]
          ? subjectMeanElementToRank.children[0]
          : subjectMeanElementToRank;

        const userSubjectsDatas =
          note.periodes[actualPeriodeIndex].ensembleMatieres.disciplines[i];
        const userRank = userSubjectsDatas.rang;
        const workForce = userSubjectsDatas.effectif;
        rankCase.innerText = userRank + '/' + workForce;

        // Add the class "text-center" to each ranking element
        subjectMeanElementToRank.className =
          subjectMeanElementToRank.className.replace('relevemoyenne', 'rang') +
          ' text-center';
        subjectMeansColumn[i].parentElement.insertBefore(
          subjectMeanElementToRank,
          subjectMeansColumn[i].parentElement.querySelector(
            "[class *= 'graph text-center']"
          )
        );
      }

      if (debug)
        console.log('[DEBUG]', 'rank', 'Added ranking information to each subject.');
    } else {
      if (debug) console.log('[DEBUG]', 'rank', '"RANG" column already exists.');
    }
  }

  exports({rank}).to('./features/Notes/rank.js');
})();
