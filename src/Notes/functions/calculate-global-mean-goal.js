(() => {
  // Importing necessary functions from other modules
  const addGradeGoal = imports('addGradeGoal').from(
<<<<<<< HEAD:src/Notes/functions/calculate-global-mean-goal.js
    './src/Notes/functions/add-grade-goal.js'
=======
    './features/Notes/functions/add-grade-goal.js'
>>>>>>> 9068a75d3cdd94f0379c58bb4585348227659c05:features/Notes/functions/calculate-global-mean-goal.js
  );

  /**
   * Calculates the global mean goal for a user.
   *
   * @param {string} userId - The unique identifier of the user.
   * @param {Array} goalsMeans - An array containing the goals and means data.
   */
  function calculateGlobalMeanGoal(userId, goalsMeans) {
    if (debug)
      console.log('[DEBUG]', 'calculateGlobalMeanGoal', 'Function called with:', {
        userId,
        goalsMeans
      });

    // Generating a unique id for the global mean goal
    const globalMeanGoalId = Date.now();

    // Getting all subject name elements
<<<<<<< HEAD:src/Notes/functions/calculate-global-mean-goal.js
    const subjectNamesElement = document.querySelectorAll(
      "[class *= 'nommatiere'] > [class *= text-bold]"
    );
=======
    const subjectNamesElement = document.querySelectorAll("[class *= 'nommatiere'] > b");
>>>>>>> 9068a75d3cdd94f0379c58bb4585348227659c05:features/Notes/functions/calculate-global-mean-goal.js

    // Getting the active period element
    const actualPeriodeElement = document.querySelector(
      "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
    );

    // Array to store subject goals and coefficients
    const subjectGoalsAndCoefficients = [];

    // Looping through each subject name element
    for (const subjectNameElement of subjectNamesElement) {
      const subjectName = subjectNameElement.textContent;

      // Normalizing subject name for serialization
      const serializedSubjectName = subjectName
        .replaceAll(/[^a-zA-Z0-9 ]/g, '')
        .replaceAll(' ', '_');

      // Finding user content for the given userId
      const userContent = goalsMeans.find((item) => item.id == userId);

      let addedSubjectGoalValue = '';

      // Checking if userContent has periods
      if (userContent && userContent.periodes) {
        for (const userContentPeriode of userContent.periodes) {
          const addedSubjectGrades = userContentPeriode.objectif[subjectName];

          // Checking if the addedSubjectGrades exist within the current period
          if (
            addedSubjectGrades &&
            Number(actualPeriodeElement.getAttribute('dateDebut')) <=
              userContentPeriode.dateDebut &&
            userContentPeriode.dateFin <=
              Number(actualPeriodeElement.getAttribute('dateFin'))
          ) {
            addedSubjectGoalValue = addedSubjectGrades.note;
            break;
          }
        }
      }

      // If no added subject goal value found, skip
      if (!addedSubjectGoalValue || addedSubjectGoalValue == '') continue;

      // Finding the parent element of the subject line
      let subjectLine = subjectNameElement.parentElement.parentElement;
      if (subjectLine.getAttribute('kmlc-variation')) {
        subjectLine = subjectLine.parentElement.parentElement;
      } else {
        subjectLine = subjectLine.parentElement;
      }

      // Getting the coefficient of the subject
      const addedGoalSubjectCoefficient = Number(
        subjectLine.querySelector("[class *= 'coef']").textContent
      );

      // Storing subject goal value and coefficient in the array
      subjectGoalsAndCoefficients.push([
        Number(addedSubjectGoalValue),
        addedGoalSubjectCoefficient
      ]);
    }

    // If no subject goals and coefficients found, return
    if (subjectGoalsAndCoefficients.length == 0) return;

    // Calculating sum of subject goal average and sum of subject goal coefficient
    let sumOfSubjectGoalAverage = 0;
    let sumOfSubjectGoalCoefficient = 0;

    for (const subjectGoalAndCoefficient of subjectGoalsAndCoefficients) {
      const subjectGoalValue = subjectGoalAndCoefficient[0];
      const subjectGoalCoefficient = subjectGoalAndCoefficient[1];

      sumOfSubjectGoalAverage += subjectGoalValue * subjectGoalCoefficient;
      sumOfSubjectGoalCoefficient += subjectGoalCoefficient;
    }

    // If either sum of subject goal average or sum of subject goal coefficient is zero, return
    if (!sumOfSubjectGoalAverage || !sumOfSubjectGoalCoefficient) return;

    // Calculating the global mean goal
    const calculatedSubjectGoalGlobalMean = (
      sumOfSubjectGoalAverage / sumOfSubjectGoalCoefficient
    ).toFixed(5);

    // Finding the global mean element
    const globalMeanElement = document.querySelector('[kmlc-moyenne-g]');

    // Adding the calculated subject goal global mean to the DOM
    addGradeGoal(
      globalMeanElement,
      calculatedSubjectGoalGlobalMean,
      globalMeanGoalId,
      'kmlc-global-mean-goal-set',
      'kmlc-global-mean-parent',
      'kmlc-global-mean-goal'
    );
  }

  exports({calculateGlobalMeanGoal}).to(
<<<<<<< HEAD:src/Notes/functions/calculate-global-mean-goal.js
    './src/Notes/functions/calculate-global-mean-goal.js'
=======
    './features/Notes/functions/calculate-global-mean-goal.js'
>>>>>>> 9068a75d3cdd94f0379c58bb4585348227659c05:features/Notes/functions/calculate-global-mean-goal.js
  );
})();
