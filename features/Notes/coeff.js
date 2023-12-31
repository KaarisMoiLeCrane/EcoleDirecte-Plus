(() => {
  function coeff(gradesData) {
    // If there is already an element with the class "Coef", it means that the category "Coef" exist. If not, we apply our changes
    if (!document.querySelector("th[class *= 'coef ng-star-inserted']")) {
      const meanColumnTitleClass = "'relevemoyenne ng-star-inserted'";
      const meanColumnTitleElement = document.querySelector(
        'th[class *= ' + meanColumnTitleClass + ']'
      );
      // We clone the "MOYENNES" element and append it to his parent (the top part of the table) and then modify the text to "COEF."
      const coefficientColumnTitleElement = meanColumnTitleElement.cloneNode(true);
      coefficientColumnTitleElement.innerText = 'COEF.';
      coefficientColumnTitleElement.setAttribute('class', 'coef ng-star-inserted');

      meanColumnTitleElement.parentElement.insertBefore(
        coefficientColumnTitleElement,
        meanColumnTitleElement.parentElement.querySelector('[class *= relevemoyenne]')
      );

      // console.log(1, document.querySelector("th[class *= 'coef ng-star-inserted']"))

      // Get the means of each subject (each row of the column "MOYENNES")
      const subjectMeansColumn = document.querySelectorAll(
        'td[class *= ' + meanColumnTitleClass + ']'
      );

      // console.log(1.1, p)

      // For each means element, we duplicate it to place it visually under the new "COEF." column
      for (let i = 0; i < subjectMeansColumn.length; i++) {
        const subjectMeanElementToCoefficient = subjectMeansColumn[i].cloneNode(true);
        const actualPeriode = document.querySelector('ul.nav-tabs > li.active');
        const actualPeriodeIndex = [...actualPeriode.parentElement.children].indexOf(
          actualPeriode
        );

        // console.log(2, periode)

        // We change the mean with the "Coef" value
        const coefficientCase = subjectMeanElementToCoefficient.children[0]
          ? subjectMeanElementToCoefficient.children[0]
          : subjectMeanElementToCoefficient;

        coefficientCase.innerText =
          gradesData.periodes[actualPeriodeIndex].ensembleMatieres.disciplines[i].coef;

        // For each element we add the class "text-center"
        subjectMeanElementToCoefficient.className =
          subjectMeanElementToCoefficient.className.replace('relevemoyenne', 'coef') +
          ' text-center';
        subjectMeansColumn[i].parentElement.insertBefore(
          subjectMeanElementToCoefficient,
          subjectMeansColumn[i].parentElement.querySelector("[class *= 'relevemoyenne']")
        );
      }
    }
  }

  exports({coeff}).to('./features/Notes/coeff.js');
})();
