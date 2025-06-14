(() => {
  let chartBar;

  /**
   * Initializes and renders the charts based on the provided grades data and global quotient.
   * @param {Object} gradesData - The data containing the grades information.
   * @param {number} globalQuotient - The global quotient value.
   */
  function charts(gradesData, globalQuotient) {
    // Check if a chart already exists
    if (!document.querySelector("[id='chart-curve']") && gradesData.notes.length) {
      if (debug)
        console.log('[DEBUG]', 'charts', 'Initializing charts', {
          gradesData,
          globalQuotient
        });

      createChartCanvasElements();

      const globalMean = getGlobalMean();
      const actualPeriod = getActualPeriodData();

      const gradesDataClean = cleanGradesData(gradesData, actualPeriod, globalQuotient);

      if (gradesDataClean.length) {
        const chartData = prepareChartData(gradesDataClean, globalQuotient, globalMean);
        renderCharts(chartData, globalMean, globalQuotient);
      }
    }
  }

  /**
   * Creates the canvas elements for the charts and appends them to the DOM.
   */
  function createChartCanvasElements() {
    const chartCurveCanvas = document.createElement('CANVAS');
    chartCurveCanvas.id = 'chart-curve';

    const chartBarCanvas = document.createElement('CANVAS');
    chartBarCanvas.id = 'chart-bar';

    document.getElementById('encart-notes').appendChild(chartCurveCanvas);
    document.getElementById('encart-notes').appendChild(chartBarCanvas);
  }

  /**
   * Retrieves the global mean value from the DOM.
   * @returns {number} The global mean value.
   */
  function getGlobalMean() {
    return Number(document.querySelector('[kmlc-moyenne-g]').textContent.split(' ')[0]);
  }

  /**
   * Retrieves and processes the actual period data from the DOM.
   * @returns {Object} The actual period data.
   */
  function getActualPeriodData() {
    const actualPeriodeElement = document.querySelector(
<<<<<<< HEAD
      "ul[class*='tabs'] > li > [class*='nav-link'][class*='active']"
=======
      "ul[class*='tabs'] > li > [class*='nav-link active']"
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
    );

    return {
      isLast: actualPeriodeElement.getAttribute('islast') === 'true',
      actualCodePeriode: actualPeriodeElement.getAttribute('codePeriode'),
      actualDateStart: Number(actualPeriodeElement.getAttribute('dateDebut')),
      actualDateEnd: Number(actualPeriodeElement.getAttribute('dateFin')),
      actualPeriodeIsR: JSON.parse(actualPeriodeElement.getAttribute('R')),
      actualPeriodeIsX: JSON.parse(actualPeriodeElement.getAttribute('X')),
      actualPeriodeIsZ: JSON.parse(actualPeriodeElement.getAttribute('Z'))
    };
  }

  /**
   * Cleans the grades data based on the actual period data.
   * @param {Object} gradesData - The original grades data.
   * @param {Object} actualPeriod - The actual period data.
   * @param {number} globalQuotient - The global quotient value.
   * @returns {Array} The cleaned grades data.
   */
  function cleanGradesData(gradesData, actualPeriod, globalQuotient) {
    const gradesDataClean = [];
    const gradesDataDuplicate = JSON.parse(JSON.stringify(gradesData));

    gradesDataDuplicate.notes.forEach((grade, i) => {
      if (!grade.nonSignificatif) {
        const dateSaisie = grade.dateSaisie.kmlcConvertToTimestamp();
        const date = grade.date.kmlcConvertToTimestamp();
        let skip = false;

        if (
          (actualPeriod.actualPeriodeIsR &&
            !actualPeriod.actualPeriodeIsX &&
            !actualPeriod.actualPeriodeIsZ &&
            actualPeriod.actualDateStart <= date &&
            date <= actualPeriod.actualDateEnd) ||
          (!actualPeriod.actualPeriodeIsR &&
            !actualPeriod.actualPeriodeIsX &&
            !actualPeriod.actualPeriodeIsZ &&
            actualPeriod.actualDateStart <= dateSaisie &&
            dateSaisie <= actualPeriod.actualDateEnd) ||
          (!actualPeriod.actualPeriodeIsR &&
            actualPeriod.actualPeriodeIsX &&
            !actualPeriod.actualPeriodeIsZ &&
            actualPeriod.actualDateStart <= dateSaisie &&
            dateSaisie <= actualPeriod.actualDateEnd &&
            grade.codePeriode.includes(actualPeriod.actualCodePeriode)) ||
          (!actualPeriod.actualPeriodeIsR &&
            !actualPeriod.actualPeriodeIsX &&
            actualPeriod.actualPeriodeIsZ &&
            actualPeriod.actualDateStart <= dateSaisie &&
            dateSaisie <= actualPeriod.actualDateEnd)
        ) {
          skip = true;
        }

        if (skip) {
          let tempNote = parseFloat(
            grade.valeur
              .replace(/[()\/\s]/g, '')
              .replace(',', '.')
              .replace(/[^\d+\-*/.\s]/g, '')
              .trim()
          );
<<<<<<< HEAD

          if (!isNaN(tempNote)) {
=======
          if (tempNote) {
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
            grade.valeur = tempNote;
            grade.noteSur = Number(grade.noteSur);
            grade.coef = Number(grade.coef);

            for (let j = 0; j < gradesDataDuplicate.periodes.length; j++) {
              if (
<<<<<<< HEAD
                gradesDataDuplicate.periodes[j].codePeriode.includes(actualPeriod.actualCodePeriode)
=======
                gradesDataDuplicate.periodes[j].codePeriode.includes(
                  actualPeriod.actualCodePeriode
                )
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
              ) {
                for (
                  let k = 0;
                  k < gradesDataDuplicate.periodes[j].ensembleMatieres.disciplines.length;
                  k++
                ) {
                  if (
<<<<<<< HEAD
                    gradesDataDuplicate.periodes[j].ensembleMatieres.disciplines[k].discipline ==
                    grade.libelleMatiere
                  ) {
                    grade.subjectCoef =
                      gradesDataDuplicate.periodes[j].ensembleMatieres.disciplines[k].coef;
=======
                    gradesDataDuplicate.periodes[j].ensembleMatieres.disciplines[k]
                      .discipline == grade.libelleMatiere
                  ) {
                    grade.subjectCoef =
                      gradesDataDuplicate.periodes[j].ensembleMatieres.disciplines[
                        k
                      ].coef;
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
                  }
                }
                break;
              }
            }

            gradesDataClean.push(grade);
          }
        }
      }
    });

<<<<<<< HEAD
    if (debug) console.log('[DEBUG]', 'cleanGradesData', 'Cleaned grades data', {gradesDataClean});
=======
    if (debug)
      console.log('[DEBUG]', 'cleanGradesData', 'Cleaned grades data', {gradesDataClean});
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
    return gradesDataClean;
  }

  /**
   * Prepares the data required for rendering the charts.
   * @param {Array} gradesDataClean - The cleaned grades data.
   * @param {number} globalQuotient - The global quotient value.
   * @param {number} globalMean - The global mean value.
   * @returns {Object} The prepared chart data.
   */
  function prepareChartData(gradesDataClean, globalQuotient, globalMean) {
    const subjectMeanAndCoefficientEvolution = [];
    const gradesSumOfValuesEvolution = [];
    const gradesSumOfSquaredValuesEvolution = [];
    const gradesRangeEvolution = [];
    const gradesFirstQuartileEvolution = [];
    const gradesMedianEvolution = [];
    const gradesThirdQuartileEvolution = [];
    const gradesInterquartileRangeEvolution = [];
    const globalMeanEvolution = [];
    const gradesVarianceEvolution = [];
    const gradesStandardDeviationEvolution = [];
    const gradesCoefficientQuotientAndSubject = [];
    const allGradesValueOnly = [];

    gradesDataClean.forEach((grade, i) => {
      const ascendingGradesValue = [];
      let gradesSum = 0;

      gradesCoefficientQuotientAndSubject.push([
        grade.coef,
        grade.noteSur,
        grade.libelleMatiere,
        grade.devoir
      ]);

      const tempGradesSortBySubject = {};
      for (let j = 0; j <= i; j++) {
        const gradeSubjectName = gradesDataClean[j].libelleMatiere;

        if (!tempGradesSortBySubject[gradeSubjectName]) {
          tempGradesSortBySubject[gradeSubjectName] = [];
        }

        tempGradesSortBySubject[gradeSubjectName].push(gradesDataClean[j]);
        ascendingGradesValue.push([
<<<<<<< HEAD
          ((gradesDataClean[j].valeur * globalQuotient) / gradesDataClean[j].noteSur).toFixed(2),
=======
          (
            (gradesDataClean[j].valeur * globalQuotient) /
            gradesDataClean[j].noteSur
          ).toFixed(2),
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
          gradesDataClean[j].coef
        ]);
      }

      const sortedGrades = Object.values(tempGradesSortBySubject);

      ascendingGradesValue.sort((a, b) => a[0] - b[0]);

      gradesRangeEvolution.push(
<<<<<<< HEAD
        ascendingGradesValue[ascendingGradesValue.length - 1][0] - ascendingGradesValue[0][0]
=======
        ascendingGradesValue[ascendingGradesValue.length - 1][0] -
          ascendingGradesValue[0][0]
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
      );
      gradesFirstQuartileEvolution.push(
        ascendingGradesValue[Math.round((ascendingGradesValue.length + 3) / 4) - 1][0]
      );
      gradesMedianEvolution.push(
        ascendingGradesValue[Math.round((2 * ascendingGradesValue.length + 2) / 4) - 1][0]
      );
      gradesThirdQuartileEvolution.push(
        ascendingGradesValue[Math.round((3 * ascendingGradesValue.length + 1) / 4) - 1][0]
      );
      gradesInterquartileRangeEvolution.push(
        gradesThirdQuartileEvolution[i] - gradesFirstQuartileEvolution[i]
      );

      let sumOfSubjectMeansWithCoefficient = 0;
      let sumOfSubjectMeanCoefficients = 0;

      // if (subjectMeanAndCoefficientEvolution[i] !== [])
      subjectMeanAndCoefficientEvolution[i] = [];

      sortedGrades.forEach((subjectGrades) => {
        let sumOfGradesWithCoefficient = 0;
        let sumOfCoefficientsOfAllSubjectGrades = 0;
        let subjectCoefficient = 0;

        subjectGrades.forEach((grade) => {
          sumOfGradesWithCoefficient +=
            ((grade.valeur * globalQuotient) / grade.noteSur) * grade.coef;
          sumOfCoefficientsOfAllSubjectGrades += grade.coef;
          subjectCoefficient = grade.subjectCoef;
        });

        const subjectMean = (
          sumOfGradesWithCoefficient / sumOfCoefficientsOfAllSubjectGrades
        ).toFixed(5);
        sumOfSubjectMeansWithCoefficient += subjectMean * subjectCoefficient;
        sumOfSubjectMeanCoefficients += subjectCoefficient;
        subjectMeanAndCoefficientEvolution[i].push([subjectMean, subjectCoefficient]);
      });

      globalMeanEvolution.push(
        (sumOfSubjectMeansWithCoefficient / sumOfSubjectMeanCoefficients).toFixed(5)
      );

      for (let j = 0; j < ascendingGradesValue.length; j++)
        gradesSum += ascendingGradesValue[j][0] * ascendingGradesValue[j][1];

      gradesSumOfValuesEvolution.push(gradesSum);
    });

    for (let i = 0; i < subjectMeanAndCoefficientEvolution.length; i++) {
      let tempGradesSumOfSquaredValues = 0;
      let sumOfAllSubjectCoefficients = 0;

      for (let j = 0; j < subjectMeanAndCoefficientEvolution[i].length; j++) {
        tempGradesSumOfSquaredValues +=
          (subjectMeanAndCoefficientEvolution[i][j][1] *
            (subjectMeanAndCoefficientEvolution[i][j][0] - globalMeanEvolution[i])) **
          2;
        sumOfAllSubjectCoefficients += subjectMeanAndCoefficientEvolution[i][j][1];
      }
      gradesSumOfSquaredValuesEvolution.push(tempGradesSumOfSquaredValues);
      gradesVarianceEvolution.push(
        (gradesSumOfSquaredValuesEvolution[i] / sumOfAllSubjectCoefficients).toFixed(2)
      );
<<<<<<< HEAD
      gradesStandardDeviationEvolution.push(Math.sqrt(gradesVarianceEvolution[i]).toFixed(2));
    }

    gradesDataClean.forEach((grade) => {
      allGradesValueOnly.push(((grade.valeur * globalQuotient) / grade.noteSur).toFixed(2));
=======
      gradesStandardDeviationEvolution.push(
        Math.sqrt(gradesVarianceEvolution[i]).toFixed(2)
      );
    }

    gradesDataClean.forEach((grade) => {
      allGradesValueOnly.push(
        ((grade.valeur * globalQuotient) / grade.noteSur).toFixed(2)
      );
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
    });

    if (debug)
      console.log('[DEBUG]', 'prepareChartData', 'Prepared chart data', {
        allGradesValueOnly,
        gradesRangeEvolution,
        gradesFirstQuartileEvolution,
        gradesMedianEvolution,
        gradesThirdQuartileEvolution,
        gradesInterquartileRangeEvolution,
        globalMeanEvolution,
        gradesSumOfValuesEvolution,
        gradesSumOfSquaredValuesEvolution,
        gradesVarianceEvolution,
        gradesStandardDeviationEvolution,
        gradesCoefficientQuotientAndSubject
      });

    return {
      allGradesValueOnly,
      gradesRangeEvolution,
      gradesFirstQuartileEvolution,
      gradesMedianEvolution,
      gradesThirdQuartileEvolution,
      gradesInterquartileRangeEvolution,
      globalMeanEvolution,
      gradesSumOfValuesEvolution,
      gradesSumOfSquaredValuesEvolution,
      gradesVarianceEvolution,
      gradesStandardDeviationEvolution,
      gradesCoefficientQuotientAndSubject
    };
  }

  /**
   * Renders the charts using the prepared data.
   * @param {Object} chartData - The prepared chart data.
   * @param {number} globalMean - The global mean value.
   * @param {number} globalQuotient - The global quotient value.
   */
  function renderCharts(chartData, globalMean, globalQuotient) {
    const {
      allGradesValueOnly,
      gradesRangeEvolution,
      gradesFirstQuartileEvolution,
      gradesMedianEvolution,
      gradesThirdQuartileEvolution,
      gradesInterquartileRangeEvolution,
      globalMeanEvolution,
      gradesSumOfValuesEvolution,
      gradesSumOfSquaredValuesEvolution,
      gradesVarianceEvolution,
      gradesStandardDeviationEvolution,
      gradesCoefficientQuotientAndSubject
    } = chartData;

    const xAxisLabelValues = [];
    for (let i = 1; i <= allGradesValueOnly.length; i++) {
      xAxisLabelValues.push(i.toString());
    }

<<<<<<< HEAD
    const actualGlobalMeanForChart = new Array(allGradesValueOnly.length).fill(globalMean);
=======
    const actualGlobalMeanForChart = new Array(allGradesValueOnly.length).fill(
      globalMean
    );
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604

    const curveDatasets = createCurveDatasets({
      allGradesValueOnly,
      globalMeanEvolution,
      actualGlobalMeanForChart,
      gradesRangeEvolution,
      gradesVarianceEvolution,
      gradesStandardDeviationEvolution,
      gradesSumOfSquaredValuesEvolution,
      gradesSumOfValuesEvolution,
      gradesFirstQuartileEvolution,
      gradesMedianEvolution,
      gradesThirdQuartileEvolution,
      gradesInterquartileRangeEvolution
    });

    const datasCurve = {
      type: 'line',
      data: {
        labels: xAxisLabelValues,
        datasets: curveDatasets
      },
      options: createCurveOptions(globalQuotient, gradesCoefficientQuotientAndSubject)
    };

    const chartCurve = new Chart(
      document.getElementById('chart-curve').getContext('2d'),
      datasCurve
    );

    renderBarChart(allGradesValueOnly, globalMean);
  }

  /**
   * Creates the datasets for the curve chart.
   * @param {Object} data - The data for the curve datasets.
   * @returns {Array} The curve datasets.
   */
  function createCurveDatasets(data) {
    const {
      allGradesValueOnly,
      globalMeanEvolution,
      actualGlobalMeanForChart,
      gradesRangeEvolution,
      gradesVarianceEvolution,
      gradesStandardDeviationEvolution,
      gradesSumOfSquaredValuesEvolution,
      gradesSumOfValuesEvolution,
      gradesFirstQuartileEvolution,
      gradesMedianEvolution,
      gradesThirdQuartileEvolution,
      gradesInterquartileRangeEvolution
    } = data;

    const radius = 4;
    const tension = 0.2;
    const pointHoverRadius = 5;

    return [
      {
        label: 'Notes',
        data: allGradesValueOnly,
        borderColor: 'rgb(0, 0, 0)',
        tension: tension,
        pointRadius: radius,
        pointHoverRadius: pointHoverRadius
      },
      {
        label: 'Evolution de la moyenne générale en fonction des notes',
        data: globalMeanEvolution,
        borderColor: 'rgb(255, 0, 0)',
        tension: tension,
        pointRadius: radius,
        pointHoverRadius: pointHoverRadius
      },
      {
        label: 'Moyenne générale',
        data: actualGlobalMeanForChart,
        borderColor: 'rgb(0, 0, 255)',
        tension: tension,
        pointRadius: radius,
        pointHoverRadius: pointHoverRadius,
        pointBorderColor: 'rgba(0, 0, 255)'
      },
      {
        label: 'Étendue',
        data: gradesRangeEvolution,
        borderColor: 'rgb(0, 255, 0)',
        tension: tension,
        pointRadius: radius,
        pointHoverRadius: pointHoverRadius,
        hidden: true
      },
      {
        label: 'Variance',
        data: gradesVarianceEvolution,
        borderColor: 'rgb(255, 255, 0)',
        tension: tension,
        pointRadius: radius,
        pointHoverRadius: pointHoverRadius,
        hidden: true
      },
      {
        label: 'Écart type',
        data: gradesStandardDeviationEvolution,
        borderColor: 'rgb(128, 0, 128)',
        tension: tension,
        pointRadius: radius,
        pointHoverRadius: pointHoverRadius
      },
      {
        label: 'Somme des carrées',
        data: gradesSumOfSquaredValuesEvolution,
        borderColor: 'rgb(255, 127.5, 0)',
        tension: tension,
        pointRadius: radius,
        pointHoverRadius: pointHoverRadius,
        hidden: true
      },
      {
        label: 'Somme des valeurs',
        data: gradesSumOfValuesEvolution,
        borderColor: 'rgb(255, 200, 0)',
        tension: tension,
        pointRadius: radius,
        pointHoverRadius: pointHoverRadius,
        hidden: true
      },
      {
        label: 'Premier quartile',
        data: gradesFirstQuartileEvolution,
        borderColor: 'rgb(255, 140, 0)',
        tension: tension,
        pointRadius: radius,
        pointHoverRadius: pointHoverRadius,
        hidden: true,
        fill: {
          target: 'origin',
          above: 'rgba(255, 140, 0, 0.5)'
        }
      },
      {
        label: 'Médiane',
        data: gradesMedianEvolution,
        borderColor: 'rgb(148, 0, 211)',
        tension: tension,
        pointRadius: radius,
        pointHoverRadius: pointHoverRadius,
        hidden: true
      },
      {
        label: 'Troisième quartile',
        data: gradesThirdQuartileEvolution,
        borderColor: 'rgb(184, 134, 11)',
        tension: tension,
        pointRadius: radius,
        pointHoverRadius: pointHoverRadius,
        hidden: true,
        fill: {
          target: '-2',
          above: 'rgba(184, 134, 11, 0.5)'
        }
      },
      {
        label: 'Différence interquartile',
        data: gradesInterquartileRangeEvolution,
        borderColor: 'rgb(153, 102, 204)',
        tension: tension,
        pointRadius: radius,
        pointHoverRadius: pointHoverRadius,
        hidden: true
      }
    ];
  }

  /**
   * Creates the options for the curve chart.
   * @param {number} globalQuotient - The global quotient value.
   * @param {Array} gradesCoefficientQuotientAndSubject - Array of grades coefficient, quotient, and subject data.
   * @returns {Object} The curve chart options.
   */
  function createCurveOptions(globalQuotient, gradesCoefficientQuotientAndSubject) {
    return {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            footer: function (tooltipItems) {
              if (debug)
                console.log(
                  '[DEBUG]',
                  'createCurveOptions',
                  'Logging the tooltipItems footer parameter.',
                  tooltipItems
                );

              for (let i = 0; i < tooltipItems.length; i++) {
                const tooltipItem = tooltipItems[i];
                if (tooltipItem.dataset.label == 'Moyenne générale') continue;

<<<<<<< HEAD
                const gradeData = gradesCoefficientQuotientAndSubject[tooltipItem.dataIndex];
=======
                const gradeData =
                  gradesCoefficientQuotientAndSubject[tooltipItem.dataIndex];
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
                const gradeCoefficient = gradeData[0];
                const gradeQuotient = gradeData[1];
                const gradeSubject = gradeData[2];
                const gradeTitle = gradeData[3];

                if (gradeQuotient == globalQuotient) {
                  return `Matière: ${gradeSubject}\nTitre: ${gradeTitle}\nCoefficient: ${gradeCoefficient}\nNote sur: ${gradeQuotient}`;
                } else {
                  return `Matière: ${gradeSubject}\nTitre: ${gradeTitle}\nCoefficient: ${gradeCoefficient}\nNote sur: ${gradeQuotient}\nRevient à: ${(
                    (Number(tooltipItem.raw) * globalQuotient) /
                    gradeQuotient
                  ).toFixed(2)}/${globalQuotient}`;
                }
              }
            }
          }
        },
        title: {
          display: true,
          text: 'Evolution des notes'
        },
        filler: {
          propagate: false
        }
      },
      scales: {
        y: {
          suggestedMax: globalQuotient,
          suggestedMin: 0,
          ticks: {
            suggestedMax: 1
          }
        }
      }
    };
  }

  /**
   * Renders the bar chart.
   * @param {Array} allGradesValueOnly - Array of all grades values.
   * @param {number} globalMean - The global mean value.
   */
  function renderBarChart(allGradesValueOnly, globalMean) {
    let tempRegroupSameGrades = [];
    allGradesValueOnly.forEach((grade) => {
      if (!tempRegroupSameGrades[grade]) {
        tempRegroupSameGrades[grade] = [];
      }
      tempRegroupSameGrades[grade].push(grade);
    });

    let gradesList = Object.values(tempRegroupSameGrades).sort((a, b) => a[0] - b[0]);
    const labelsBar = gradesList.map((grade) => grade[0].toString());

    labelsBar.sort((a, b) => a - b);

    let indexOfMean = labelsBar.findIndex((label) => label > globalMean);
    labelsBar.splice(indexOfMean, 0, globalMean.toString());

    const tempRegroupSameGradesLength = gradesList.map((grade) => grade.length);

    const eachGradeNumber = [...tempRegroupSameGradesLength];
    eachGradeNumber.splice(indexOfMean, 0, 0);

    let tempBarsColor = [];
    let percentageRed = 0;
    let percentageOrange = 0;
    let percentageGreen = 0;
    const effectifPercentage = labelsBar.length;

    labelsBar.forEach((label, i) => {
      let tempBarColor;
      if (label > globalMean) {
        tempBarColor = 'rgba(0, 255, 0, 1)';
        percentageGreen++;
      } else if (label < globalMean) {
        tempBarColor = 'rgba(255, 0, 0, 1)';
        percentageRed++;
      } else {
        tempBarColor = 'rgba(0, 0, 0, 1)';
      }

      if (label.split('.')[0] === globalMean.toString().split('.')[0]) {
        tempBarColor = 'rgba(255, 127.5, 0, 1)';
        percentageOrange++;
      }

      tempBarsColor.push(tempBarColor);
    });

    const barsColor = Object.values(tempBarsColor);
    tempRegroupSameGradesLength.sort((a, b) => a - b);

    const globalMeanBarLength =
      tempRegroupSameGradesLength[tempRegroupSameGradesLength.length - 1] || 1;
    const globalMeanBar = Array(eachGradeNumber.length).fill(0);
    globalMeanBar[indexOfMean] = globalMeanBarLength;

    const globalMeanBarColors = Array(eachGradeNumber.length).fill('rgba(0, 0, 0, 0)');
    globalMeanBarColors[indexOfMean] = 'rgba(0, 0, 255, 1)';

    const datasBar = {
      data: {
        labels: labelsBar,
        datasets: [
          {
            type: 'bar',
            label: 'Notes',
            data: eachGradeNumber,
            backgroundColor: barsColor
          },
          {
            type: 'bar',
            label: 'Moyenne générale',
            data: globalMeanBar,
            barThickness: 5,
            backgroundColor: globalMeanBarColors
          }
        ]
      },
      options: createBarChartOptions(effectifPercentage, percentageRed, percentageOrange)
    };

    chartBar = new Chart(document.getElementById('chart-bar').getContext('2d'), datasBar);
    chartBar.update();
  }

  /**
   * Creates the options for the bar chart.
   * @param {number} effectifPercentage - The total number of labels.
   * @param {number} percentageRed - The percentage of red bars.
   * @param {number} percentageOrange - The percentage of orange bars.
   * @returns {Object} The bar chart options.
   */
  function createBarChartOptions(effectifPercentage, percentageRed, percentageOrange) {
    return {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Nombre de notes'
        },
        legend: {
          display: true,
          position: 'top',
          align: 'center',
          fontFamily: 'Arial',
          labels: {
            filter: (legendItem, chartData) => legendItem.datasetIndex !== 1,
            generateLabels: (chart) => {
<<<<<<< HEAD
              const maxLeftDistanceValue = document.querySelector('#chart-bar').width / 2 - 41;
              const maxWidthLegendBox = 41;
              const gradient = chart.ctx.createLinearGradient(
                (maxLeftDistanceValue * document.querySelector('html').clientWidth) / 1920,
=======
              const maxLeftDistanceValue =
                document.querySelector('#chart-bar').width / 2 - 31;
              const maxWidthLegendBox = 41;
              const gradient = chart.ctx.createLinearGradient(
                (maxLeftDistanceValue * document.querySelector('html').clientWidth) /
                  1920,
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
                0,
                ((maxLeftDistanceValue + maxWidthLegendBox) *
                  document.querySelector('html').clientWidth) /
                  1920,
                0
              );

<<<<<<< HEAD
              let gradientColorsPercentage = (percentageRed / effectifPercentage).toFixed(2) - 0.1;
=======
              let gradientColorsPercentage =
                (percentageRed / effectifPercentage).toFixed(2) - 0.1;
>>>>>>> f39ec6928663b192c6c472b9958008db1a3d5604
              if (gradientColorsPercentage < 0) gradientColorsPercentage = 0;
              gradient.addColorStop(0.0, 'rgba(255, 0, 0, 1)');
              gradient.addColorStop(gradientColorsPercentage, 'rgba(255, 0, 0, 1)');

              gradientColorsPercentage =
                Number((percentageRed / effectifPercentage).toFixed(2)) +
                Number((percentageOrange / effectifPercentage).toFixed(2));
              if (gradientColorsPercentage < 0) gradientColorsPercentage = 0;
              gradient.addColorStop(gradientColorsPercentage, 'rgba(255, 127.5, 0, 1)');
              gradient.addColorStop(1.0, 'rgba(0, 255, 0, 1)');

              return chart._getSortedDatasetMetas().map((meta) => {
                const style = meta.controller.getStyle();
                const borderWidth = style.borderWidth;
                return {
                  text: chart.data.datasets[meta.index].label,
                  fillStyle: gradient,
                  fontColor: style.fontColor,
                  hidden: !meta.visible,
                  lineCap: style.borderCapStyle,
                  lineDash: style.borderDash,
                  lineDashOffset: style.borderDashOffset,
                  lineJoin: style.borderJoinStyle,
                  lineWidth: (borderWidth.width + borderWidth.height) / 4,
                  strokeStyle: style.borderColor,
                  pointStyle: style.pointStyle,
                  rotation: style.rotation,
                  textAlign: style.textAlign,
                  borderRadius: 0,
                  datasetIndex: meta.index
                };
              });
            }
          }
        }
      },
      scales: {
        y: {
          suggestedMin: 0,
          ticks: {
            stepSize: 1
          }
        },
        x: {
          stacked: true
        },
        x2: {
          display: false,
          stacked: true,
          type: 'category',
          offset: true
        }
      },
      maxBarThickness: 55
    };
  }

  exports({charts}).to('./src/Notes/charts.js');
})();
