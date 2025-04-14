(() => {
  const calculateMeanValueImpact = imports('calculateMeanValueImpact').from(
<<<<<<< HEAD:src/Notes/mean-variation-value.js
    './src/Notes/functions/calculate-mean-value-impact.js'
=======
    './features/Notes/functions/calculate-mean-value-impact.js'
>>>>>>> 9068a75d3cdd94f0379c58bb4585348227659c05:features/Notes/mean-variation-value.js
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

<<<<<<< HEAD:src/Notes/mean-variation-value.js
  exports({meanVariationValue}).to('./src/Notes/mean-variation-value.js');
=======
  exports({meanVariationValue}).to('./features/Notes/mean-variation-value.js');
>>>>>>> 9068a75d3cdd94f0379c58bb4585348227659c05:features/Notes/mean-variation-value.js
})();
