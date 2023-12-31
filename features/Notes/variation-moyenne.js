(() => {
  const calculerVariationMoyenne = imports('calculerVariationMoyenne').from(
    './features/Notes/functions/calculer-variation-moyenne.js'
  );

  function variationMoyenne(periodeData, gradeData) {
    const subjectNames = document.querySelectorAll('[kmlc-moyenne]');

    for (let i = 0; i < subjectNames.length; i++) {
      calculerVariationMoyenne(
        subjectNames[i].parentElement.parentElement.querySelector(
          "[class *= 'discipline']"
        ),
        true,
        periodeData,
        gradeData
      );
    }
  }

  exports({variationMoyenne}).to('./features/Notes/variation-moyenne.js');
})();
