(() => {
  function rang(note) {
    // If there is already an element with the class "Rang", it means that the category "Rang" exist. If not, we apply our changes
    if (!document.querySelector("th[class *= 'rang ng-star-inserted']")) {
      const meanColumnTitleClass = "'relevemoyenne ng-star-inserted'";
      const meanColumnTitleElement = document.querySelector(
        'th[class *= ' + meanColumnTitleClass + ']'
      );
      // We clone the "MOYENNES" element and append it to his parent (the top part of the table) and then modify the text to "RANG"
      const rankColumnTitleElement = meanColumnTitleElement.cloneNode(true);
      rankColumnTitleElement.innerText = 'Rang';
      rankColumnTitleElement.setAttribute('class', 'rang ng-star-inserted');

      meanColumnTitleElement.parentElement.insertBefore(
        rankColumnTitleElement,
        meanColumnTitleElement.parentElement.querySelector('[class = graph]')
      );

      // console.log(1, document.querySelector("th[class *= 'coef ng-star-inserted']"))

      // Get the means of each subject (each row of the column "MOYENNES")
      const subjectMeansColumn = document.querySelectorAll(
        'td[class *= ' + meanColumnTitleClass + ']'
      );

      // console.log(1.1, p)

      // For each means element, we duplicate it to place it visually under the new "RANG" column
      for (let i = 0; i < subjectMeansColumn.length; i++) {
        const subjectMeanElementToRank = subjectMeansColumn[i].cloneNode(true);
        const actualPeriode = document.querySelector('ul.nav-tabs > li.active');
        const actualPeriodeIndex = [...actualPeriode.parentElement.children].indexOf(
          actualPeriode
        );

        // console.log(2, periode)
        const rankCase = subjectMeanElementToRank.children[0]
          ? subjectMeanElementToRank.children[0]
          : subjectMeanElementToRank;

        const userSubjectsDatas =
          note.periodes[actualPeriodeIndex].ensembleMatieres.disciplines[i];
        const userRank = userSubjectsDatas.rang;
        const workForce = userSubjectsDatas.effectif;
        rankCase.innerText = userRank + '/' + workForce;

        // For each element we add the class "text-center"
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
    }
  }

  exports({rang}).to('./features/Notes/rang.js');
})();
