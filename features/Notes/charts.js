(() => {
  let chartBar;

  function charts(gradesData) {
    // Check if a chart exist (if there is one, the other one is here)
    if (!document.querySelector("[id = 'chart-curve']") && gradesData.notes.length) {
      // Add the canvas whee there will be each chart

      const chartCurveCanvas = document.createElement('CANVAS');
      chartCurveCanvas.id = 'chart-curve';

      const chartBarCanvas = document.createElement('CANVAS');
      chartBarCanvas.id = 'chart-bar';

      const globalMean = Number(document.querySelector('[kmlc-moyenne-g]').textContent);

      document.getElementById('encart-notes').appendChild(chartCurveCanvas);
      document.getElementById('encart-notes').appendChild(chartBarCanvas);

      // Get the actual selected periode and init all the variables
      // let periode = document.querySelector("ul[class *= 'tabs'] > li > [class *= 'nav-link active']").textContent
      const actualPeriodeElement = document.querySelector(
        "ul[class *= 'tabs'] > li > [class *= 'nav-link active']"
      );

      // let periode = document.querySelector("ul[class *= 'tabs'] > li > [class *= 'nav-link active']").textContent
      // let codePeriode, dateDebut, dateFin;

      const actualCodePeriode = actualPeriodeElement.getAttribute('codePeriode');
      const actualDateStart = Number(actualPeriodeElement.getAttribute('dateDebut'));
      const actualDateEnd = Number(actualPeriodeElement.getAttribute('dateFin'));
      const actualPeriodeIsR = Boolean(actualPeriodeElement.getAttribute('R'));

      // console.log(codePeriode, dateDebut, dateFin, isR)

      const gradesDataClean = [];
      const allGradesValueOnly = [];

      // We duplicate the response of the http request because we will modify it later
      const gradesDataDuplicate = JSON.parse(JSON.stringify(gradesData));

      // For each grade
      for (let i = 0; i < gradesDataDuplicate.notes.length; i++) {
        // console.log(dateDebut, varNote.notes[i].date.convertToTimestamp(), varNote.notes[i].dateSaisie.convertToTimestamp(), dateFin)

        // We check if the grade is significant or not (if the note has to be counted or not)
        if (gradesDataDuplicate.notes[i].nonSignificatif == false) {
          // Is significant
          let skip = !true;

          // console.log(codePeriode, codePeriode.includes("R"))

          // We check if each grade is between the date of start and end
          if (
            actualPeriodeIsR &&
            actualDateStart <= gradesDataDuplicate.notes[i].date.convertToTimestamp() &&
            gradesDataDuplicate.notes[i].date.convertToTimestamp() <= actualDateEnd
          )
            skip = !false;
          if (
            !actualPeriodeIsR &&
            actualDateStart <=
              gradesDataDuplicate.notes[i].dateSaisie.convertToTimestamp() &&
            gradesDataDuplicate.notes[i].dateSaisie.convertToTimestamp() <= actualDateEnd
          )
            skip = !false;

          // if ((codePeriode.includes(note.notes[i].codePeriode) && note.notes[i].nonSignificatif == false) && (dateDebut <= note.notes[i].dateSaisie.convertToTimestamp() && note.notes[i].dateSaisie.convertToTimestamp() <= dateFin) || (dateDebut <= note.notes[i].date.convertToTimestamp() && note.notes[i].date.convertToTimestamp() <= dateFin)) {
          if (skip) {
            // If it is he pass and we convert the values that we need to numbers
            let tempNote = Number(
              ('' + gradesDataDuplicate.notes[i].valeur)
                .replace(/[()\/\s]/g, '')
                .replace(',', '.')
                .replace(/[^\d+\-*/.\s]/g, '')
            );
            if (tempNote) {
              // note.notes[i].valeur = tempNote;
              // note.notes[i].noteSur = Number(note.notes[i].noteSur)
              // note.notes[i].coef = Number(note.notes[i].coef)
              // notes.push(note.notes[i])

              gradesDataDuplicate.notes[i].valeur = tempNote;
              gradesDataDuplicate.notes[i].noteSur = Number(
                gradesDataDuplicate.notes[i].noteSur
              );
              gradesDataDuplicate.notes[i].coef = Number(
                gradesDataDuplicate.notes[i].coef
              );
              gradesDataClean.push(gradesDataDuplicate.notes[i]);
            }
          }
        }
      }

      // console.log(notes)

      // If there is a grade
      if (gradesDataClean != []) {
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

        const gradesCoefficientAndQuotient = [];

        // For each grade
        for (let i = 0; i < gradesDataClean.length; i++) {
          const ascendingGradesValue = [];
          let gradesSum = 0;

          gradesCoefficientAndQuotient.push([
            Number(gradesDataClean[i].coef),
            Number(gradesDataClean[i].noteSur)
          ]);

          // We get all the grades before the actual grade and the actual grade and we push the whole array to notesTri
          // In notesOrdreCroissant, this is only the value of the grade that his pushed because it will be sorted later from the smallest to the highest value
          // And also the coefficient to calculate the quartiles and the median

          let tempGradesSortBySubject = {};
          for (let j = 0; j <= i; j++) {
            // We sort all the grades by subject in an object (and also by date)
            const gradeSubjectName = gradesDataClean[j].libelleMatiere;

            if (!tempGradesSortBySubject[gradeSubjectName]) {
              tempGradesSortBySubject[gradeSubjectName] = [];
            }

            tempGradesSortBySubject[gradeSubjectName].push(gradesDataClean[j]);

            ascendingGradesValue.push([
              (
                (gradesDataClean[j].valeur * globalThis.quotient) /
                gradesDataClean[j].noteSur
              ).toFixed(2),
              gradesDataClean[j].coef
            ]);
          }

          const sortedGrades = Object.values(tempGradesSortBySubject);

          // We save the total value of all the grades before the actual grade and the actual grade where each of them are multiplied with their coefficient
          // And then summed
          for (let j = 0; j < ascendingGradesValue.length; j++)
            gradesSum += ascendingGradesValue[j][0] * ascendingGradesValue[j][1];

          // We push it to an array containing all the total values
          gradesSumOfValuesEvolution.push(gradesSum);

          // We sort all the grades from the smallest to the highest value
          ascendingGradesValue.sort(function (a, b) {
            return a[0] - b[0];
          });

          // We calculate and save the range of the grades
          gradesRangeEvolution.push(
            ascendingGradesValue[ascendingGradesValue.length - 1][0] -
              ascendingGradesValue[0][0]
          );

          // We calculate the first quartile, the median, and the third quartile
          gradesFirstQuartileEvolution.push(
            ascendingGradesValue[Math.round((ascendingGradesValue.length + 3) / 4) - 1][0]
          );
          gradesMedianEvolution.push(
            ascendingGradesValue[
              Math.round((2 * ascendingGradesValue.length + 2) / 4) - 1
            ][0]
          );
          gradesThirdQuartileEvolution.push(
            ascendingGradesValue[
              Math.round((3 * ascendingGradesValue.length + 1) / 4) - 1
            ][0]
          );

          // We calculate the first and third quartile range (interquartile range)
          gradesInterquartileRangeEvolution.push(
            gradesThirdQuartileEvolution[i] - gradesFirstQuartileEvolution[i]
          );

          // console.log(notesTri)

          let sumOfSubjectMeansWithCoefficient = 0;
          let sumOfSubjectMeanCoefficients = 0;

          // Each grade has to be in it's subject
          if (subjectMeanAndCoefficientEvolution[i] != [])
            subjectMeanAndCoefficientEvolution[i] = [];

          // For each grade
          for (let j = 0; j < sortedGrades.length; j++) {
            let sumOfGradesWithCoefficient = 0;
            let sumOfCoefficientsOfAllSubjectGrades = 0;

            let subjectCoefficient = 0;

            // We sum all the grades multiplied by their coefficient and we save the result
            // We also save the sum of all the coefficient
            for (let k = 0; k < sortedGrades[j].length; k++) {
              // console.log(notesTri[j])
              sumOfGradesWithCoefficient +=
                ((sortedGrades[j][k].valeur * globalThis.quotient) /
                  sortedGrades[j][k].noteSur) *
                sortedGrades[j][k].coef;
              sumOfCoefficientsOfAllSubjectGrades += sortedGrades[j][k].coef;
            }

            // For each periode we get the coefficient of the subject
            for (let k = 0; k < gradesDataDuplicate.periodes.length; k++) {
              if (
                gradesDataDuplicate.periodes[k].codePeriode.includes(actualCodePeriode)
              ) {
                for (
                  let l = 0;
                  l < gradesDataDuplicate.periodes[k].ensembleMatieres.disciplines.length;
                  l++
                ) {
                  if (
                    gradesDataDuplicate.periodes[k].ensembleMatieres.disciplines[l]
                      .discipline == sortedGrades[j][0].libelleMatiere
                  ) {
                    subjectCoefficient =
                      gradesDataDuplicate.periodes[k].ensembleMatieres.disciplines[l]
                        .coef;
                  }
                }
              }
            }

            // We calculate the average of the subject, we multiply it with his coefficient and we save the total number of coefficient and we push the average value and his coefficient
            const subjectMean = (
              sumOfGradesWithCoefficient / sumOfCoefficientsOfAllSubjectGrades
            ).toFixed(5);
            sumOfSubjectMeansWithCoefficient += subjectMean * subjectCoefficient;
            sumOfSubjectMeanCoefficients += subjectCoefficient;
            subjectMeanAndCoefficientEvolution[i].push([subjectMean, subjectCoefficient]);
          }

          // We push the average of all the averages
          globalMeanEvolution.push(
            (sumOfSubjectMeansWithCoefficient / sumOfSubjectMeanCoefficients).toFixed(5)
          );
        }

        // We get the actual average
        const actualGlobalMeanForChart = new Array(gradesDataClean.length).fill(
          globalMean
        );

        // We get the number from 1 to the number of grades (from the x axis)
        const xAxisLabelValues = [];
        for (let i = 1; i <= gradesDataClean.length; i++) {
          xAxisLabelValues.push(i.toString());
        }

        // We push the value of each grade
        for (let i = 0; i < gradesDataClean.length; i++) {
          allGradesValueOnly.push(
            (
              (gradesDataClean[i].valeur * globalThis.quotient) /
              gradesDataClean[i].noteSur
            ).toFixed(2)
          );
        }

        // We calculate the sum of squared values
        for (let i = 0; i < subjectMeanAndCoefficientEvolution.length; i++) {
          let tempGradesSumOfSquaredValues = 0;

          // console.log(coeffMoyenne[i])
          for (let j = 0; j < subjectMeanAndCoefficientEvolution[i].length; j++) {
            tempGradesSumOfSquaredValues +=
              (subjectMeanAndCoefficientEvolution[i][j][1] *
                (subjectMeanAndCoefficientEvolution[i][j][0] - globalMeanEvolution[i])) **
              2;
          }

          gradesSumOfSquaredValuesEvolution.push(tempGradesSumOfSquaredValues);
        }

        // We calculate the variance
        for (let i = 0; i < subjectMeanAndCoefficientEvolution.length; i++) {
          let sumOfAllSubjectCoefficients = 0;

          // console.log(coeffMoyenne[i])
          for (let j = 0; j < subjectMeanAndCoefficientEvolution[i].length; j++) {
            sumOfAllSubjectCoefficients += subjectMeanAndCoefficientEvolution[i][j][1];
          }

          gradesVarianceEvolution.push(
            (gradesSumOfSquaredValuesEvolution[i] / sumOfAllSubjectCoefficients).toFixed(
              2
            )
          );
        }

        // We calculate the standard deviation
        for (let i = 0; i < gradesVarianceEvolution.length; i++) {
          gradesStandardDeviationEvolution.push(
            Math.sqrt(gradesVarianceEvolution[i]).toFixed(2)
          );
        }

        // console.log(123456, 5, moyenneGEvo, allGradesValueOnly)

        const radius = 4;
        const tension = 0.2;
        const pointHoverRadius = 5;

        // console.log(premierQuartile, mediane, troisiemeQuartile, sommeDesValeurs)

        // We create the chart
        let datasCurve = {
          type: 'line',
          data: {
            labels: xAxisLabelValues,
            datasets: [
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
                hidden: true
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
                hidden: true
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
            ]
          },
          options: {
            responsive: true,
            plugins: {
              tooltip: {
                callbacks: {
                  footer: function (tooltipItems) {
                    let gradeCoefficient = 1;
                    let gradeQuotient = globalThis.quotient;

                    for (let i = 0; i < tooltipItems.length; i++) {
                      if (tooltipItems[i].dataset.label == 'Notes') {
                        gradeCoefficient =
                          gradesCoefficientAndQuotient[tooltipItems[i].dataIndex][0];
                        gradeQuotient =
                          gradesCoefficientAndQuotient[tooltipItems[i].dataIndex][1];

                        if (gradeQuotient == globalThis.quotient) {
                          if (tooltipItems[i].dataIndex - 1 >= 0) {
                            return `Coefficient: ${gradeCoefficient}
Note sur: ${gradeQuotient}
Variation de la moyenne générale de: ${(
                              globalMeanEvolution[tooltipItems[i].dataIndex] -
                              globalMeanEvolution[tooltipItems[i].dataIndex - 1]
                            ).toFixed(3)}`;
                          } else {
                            return `Coefficient: ${gradeCoefficient}
Note sur: ${gradeQuotient}`;
                          }
                        } else {
                          if (tooltipItems[i].dataIndex - 1 >= 0) {
                            return `Coefficient: ${gradeCoefficient}
Note sur: ${gradeQuotient}
Revient à: ${(
                              (Number(tooltipItems[i].raw) * globalThis.quotient) /
                              gradeQuotient
                            ).toFixed(2)}/${globalThis.quotient}
Variation de la moyenne générale de: ${(
                              globalMeanEvolution[tooltipItems[i].dataIndex] -
                              globalMeanEvolution[tooltipItems[i].dataIndex - 1]
                            ).toFixed(3)}`;
                          } else {
                            return `Coefficient: ${gradeCoefficient}
Note sur: ${gradeQuotient}
Revient à: ${(
                              (Number(tooltipItems[i].raw) * globalThis.quotient) /
                              gradeQuotient
                            ).toFixed(2)}/${globalThis.quotient}`;
                          }
                        }
                      }
                    }
                  }
                }
              },
              title: {
                display: true,
                text: 'Evolution des notes'
              }
            },
            scales: {
              y: {
                suggestedMax: globalThis.quotient,
                suggestedMin: 0,
                ticks: {
                  suggestedMax: 1
                }
              }
            }
          }
        };

        const chartCurve = new Chart(
          document.getElementById('chart-curve').getContext('2d'),
          datasCurve
        );

        // For each grade we calculate the number of times a grade appear. It create an object with each different grade and in them there is all the same grades
        let tempRegroupSameGrades = [];
        for (let i = 0; i < allGradesValueOnly.length; i++) {
          let selectedGrade = allGradesValueOnly[i];

          if (!tempRegroupSameGrades[selectedGrade]) {
            tempRegroupSameGrades[selectedGrade] = [];
          }

          tempRegroupSameGrades[selectedGrade].push(allGradesValueOnly[i]);
        }

        // We sort it from the smallest to the biggest value
        let gradesList = Object.values(tempRegroupSameGrades).sort(function (a, b) {
          return a[0] - b[0];
        });

        // We get the number of same grade (for the x axis)
        const labelsBar = [];
        for (let i = 0; i < gradesList.length; i++) {
          labelsBar.push(gradesList[i][0].toString());
        }

        // We sort it from the smallest to the biggest value
        labelsBar.sort(function (a, b) {
          return a - b;
        });

        let indexOfMean = 0;
        for (let i = 0; i < labelsBar.length; i++) {
          if (labelsBar[i] > globalMean) {
            indexOfMean = i;
            labelsBar.splice(i, 0, globalMean);
            break;
          }
        }

        // console.log(labelsBar)

        // We save the number of same grades values
        const tempRegroupSameGradesLength = [];
        for (let i = 0; i < gradesList.length; i++) {
          tempRegroupSameGradesLength.push(gradesList[i].length);
        }

        const eachGradeNumber = [...tempRegroupSameGradesLength];

        eachGradeNumber.splice(indexOfMean, 0, 0);

        // let barThickness = Array(notesListe.length).fill(40)
        // barThickness[indexOfAverage] = 20

        // console.log(barThickness)

        let tempBarsColor = [];
        let tempBarColor;

        let percentageRed = 0;
        let percentageOrange = 0;
        let percentageGreen = 0;
        let effectifPercentage = labelsBar.length;

        // Set the color of each bar and add one to the color number (that I can divide by the total number to get the percentage)
        for (let i = 0; i < labelsBar.length; i++) {
          let tempGrade = labelsBar[i];

          if (tempGrade > globalMean) {
            tempBarColor = 'rgba(0, 255, 0, 1)';
            percentageGreen += 1;
          } else if (tempGrade < globalMean) {
            tempBarColor = 'rgba(255, 0, 0, 1)';
            percentageRed += 1;
          } else {
            tempBarColor = 'rgba(0, 0, 0, 1)';
          }

          if (tempGrade.toString().split('.')[0] == globalMean.toString().split('.')[0]) {
            tempBarColor = 'rgba(255, 127.5, 0, 1)';
            percentageOrange += 1;
          }

          tempBarsColor.push(tempBarColor);
        }

        const barsColor = Object.values(tempBarsColor);

        tempRegroupSameGradesLength.sort(function (a, b) {
          return a - b;
        });

        const globalMeanBarLength = tempRegroupSameGradesLength[
          tempRegroupSameGradesLength.length - 1
        ]
          ? tempRegroupSameGradesLength[tempRegroupSameGradesLength.length - 1]
          : 1;

        const globalMeanBar = Array(eachGradeNumber.length).fill(0);
        globalMeanBar[indexOfMean] = globalMeanBarLength;

        // console.log(dataGAverage, notesListe)

        const globalMeanBarColors = Array(eachGradeNumber.length).fill(
          'rgba(0, 0, 0, 0)'
        );
        globalMeanBarColors[indexOfMean] = 'rgba(0, 0, 255, 1)';

        // console.log(colorGAverage, barsColor)

        // We set the chart datas and options
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
          options: {
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
                  filter: (legendItem, chartData) => {
                    return legendItem.datasetIndex !== 1; // Hide the second dataset
                  },
                  generateLabels: (chart) => {
                    const maxLeftDistanceValue =
                      document.querySelector('#chart-bar').width / 2 - 31; // chart length/2 to get the middle and
                    // minus 31 is a number that I took somewhat arbitrarily to better position the gradient.
                    // If a person only sees red, the number should be increased, and if they only see green, the number should be decreased.
                    const maxWidthLegendBox = 41; // The length of the legend box color is 41

                    // The gradient as to be positioned manually in the exact same coordinate as the legend box color
                    // The measurement have been made with Photoshop and a screenshot with a 1920x1080px length

                    const datasets = chart.data.datasets;
                    let {
                      labels: {usePointStyle, pointStyle, textAlign, color}
                    } = chart.legend.options;

                    return chart._getSortedDatasetMetas().map((meta) => {
                      const style = meta.controller.getStyle(
                        usePointStyle ? 0 : undefined
                      );
                      const borderWidth = style.borderWidth;

                      // Here with convert the length from 1920x1080px based length to the resolution of the displayed web page
                      const gradient = chart.ctx.createLinearGradient(
                        (maxLeftDistanceValue *
                          document.querySelector('html').clientWidth) /
                          1920,
                        0,
                        ((maxLeftDistanceValue + maxWidthLegendBox) *
                          document.querySelector('html').clientWidth) /
                          1920,
                        0
                      );
                      // console.log(maxLeft*document.querySelector("html").clientWidth/1080, (maxLeft + maxWidth)*document.querySelector("html").clientWidth/1920, percentageRouge, percentageVert, percentageOrange, effectifPercentage)

                      let gradientColorsPercentage;

                      // The red color start from 0% to xRed% - 10%
                      gradient.addColorStop(0.0, 'rgba(255, 0, 0, 1)');

                      gradientColorsPercentage =
                        (percentageRed / effectifPercentage).toFixed(2) - 0.1;
                      if (gradientColorsPercentage < 0) gradientColorsPercentage = 0;

                      // console.log(perc, percentageRouge, effectifPercentage)

                      gradient.addColorStop(
                        gradientColorsPercentage,
                        'rgba(255, 0, 0, 1)'
                      );

                      // The orange color start from xRed% to xRed% + xOrange%
                      gradientColorsPercentage =
                        Number((percentageRed / effectifPercentage).toFixed(2)) +
                        Number((percentageOrange / effectifPercentage).toFixed(2));
                      if (gradientColorsPercentage < 0) gradientColorsPercentage = 0;

                      gradient.addColorStop(
                        gradientColorsPercentage,
                        'rgba(255, 127.5, 0, 1)'
                      );

                      // The green color start from xRed% + xOrange% to 100%
                      gradient.addColorStop(1.0, 'rgba(0, 255, 0, 1)');

                      // console.log(meta.visible)
                      return {
                        text: datasets[meta.index].label,
                        fillStyle: gradient, // style.backgroundColor,
                        fontColor: color || style.fontColor,
                        hidden: !meta.visible,
                        lineCap: style.borderCapStyle,
                        lineDash: style.borderDash,
                        lineDashOffset: style.borderDashOffset,
                        lineJoin: style.borderJoinStyle,
                        lineWidth: (borderWidth.width + borderWidth.height) / 4,
                        strokeStyle: style.borderColor,
                        pointStyle: pointStyle || style.pointStyle,
                        rotation: style.rotation,
                        textAlign: textAlign || style.textAlign,
                        borderRadius: 0,
                        datasetIndex: meta.index
                      };
                    }, this);
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
                stacked: true // Stacked bars
              },
              x2: {
                display: false,
                stacked: true,
                type: 'category',
                offset: true
              }
            },
            maxBarThickness: 55
          }
        };

        chartBar = new Chart(
          document.getElementById('chart-bar').getContext('2d'),
          datasBar
        );
      }

      chartBar.update();
    }
  };

  exports({charts}).to('./features/Notes/charts.js');
})();
