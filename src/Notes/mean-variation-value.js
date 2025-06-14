(() => {
  const calculateMeanValueImpact = imports('calculateMeanValueImpact').from(
<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/mean-variation-value.js
    './features/Notes/functions/calculate-mean-value-impact.js'
=======
    './src/Notes/functions/calculate-mean-value-impact.js'
>>>>>>> features:src/Notes/mean-variation-value.js
=======
    './src/Notes/functions/calculate-mean-value-impact.js'
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
  );

  /**
   * Applies variation in mean values based on the provided data.
   * @param {Object} periodeData - Data related to the period.
   * @param {Object} gradeData - Data related to grades.
   */
  function meanVariationValue(periodeData, gradeData) {
    // Get all elements with attribute 'kmlc-moyenne'
    const subjectNames = document.querySelectorAll('[kmlc-moyenne]');

    // Iterate over each element with 'kmlc-moyenne' attribute
    for (const subjectName of subjectNames) {
      // Calculate mean value impact for the current subject
      calculateMeanValueImpact(
        subjectName.parentElement.parentElement.querySelector("[class *= 'discipline']"),
        true,
        periodeData,
        gradeData
      );

      if (debug)
        console.log(
          '[DEBUG]',
          'variationMoyenne',
          'Applied variation in mean values for subject:',
          subjectName
        );
    }
  }

<<<<<<< HEAD
<<<<<<< HEAD:features/Notes/mean-variation-value.js
  exports({meanVariationValue}).to('./features/Notes/mean-variation-value.js');
=======
  exports({meanVariationValue}).to('./src/Notes/mean-variation-value.js');
>>>>>>> features:src/Notes/mean-variation-value.js
=======
  exports({meanVariationValue}).to('./src/Notes/mean-variation-value.js');
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
})();
