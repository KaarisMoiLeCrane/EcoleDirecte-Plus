(() => {
  function calculerMoyennes(num,
    globalQuotient,
    displayCalculatedMeansValues = false,
    attributeGlobalMean = '',
    styleGlobalMean = '',
    attributeMean = '',
    styleMean = '',
    withOldGradeDatas = false,
    attributeOfSubjectsToCalculate = '',
    elementDisciplineSubjectToExclude = ''
  ) {
    console.log(num, withOldGradeDatas)
    // We get all the displayed grades
    const allGrades = document.querySelectorAll(
      'span.valeur' + attributeOfSubjectsToCalculate
    );
    // console.log(3, matNotes)
    const listSubjectRow = [];
    const brHTMLAttributes = attributeGlobalMean.includes('simu')
      ? 'kmlc-simu="true"'
      : '';

    // We init the overall average, the value of all the subjects average, the excessed coefficients (coefficients counted when there are no grades) and the total coefficients (that he will divide all the grades to get the overall average)
    let calculatedGlobalMean = 0.0;
    let allSubjectsMeans = 0.0;
    let extraSubjectsCoefficient = 0.0;
    let allSubjectsCoefficients = 0.0;

    // For each grades, get the row containing all the datas about the subject and then push each row element, if they are not in the list, to our lignes list
    for (let i = 0; i < allGrades.length; i++) {
      const subjectGradeRow = allGrades[i].parentElement.parentElement.parentElement;
      // console.log(4, parent, matNotes[i])

      if (elementDisciplineSubjectToExclude instanceof HTMLElement) {
        if (
          !listSubjectRow.includes(subjectGradeRow) &&
          subjectGradeRow.querySelector("[class *= 'discipline']") !=
            elementDisciplineSubjectToExclude
        ) {
          listSubjectRow.push(subjectGradeRow);
        }
      } else if (elementDisciplineSubjectToExclude instanceof Object) {
        for (let j = 0; j < elementDisciplineSubjectToExclude.length; j++) {
          if (
            !listSubjectRow.includes(subjectGradeRow) &&
            subjectGradeRow.querySelector("[class *= 'discipline']") !=
              elementDisciplineSubjectToExclude[j]
          ) {
            listSubjectRow.push(subjectGradeRow);
          }
        }
      } else {
        if (!listSubjectRow.includes(subjectGradeRow)) {
          listSubjectRow.push(subjectGradeRow);
        }
      }
    }

    // For each rows, get all the grades in the row (so all the grades of a specific subject), and calculate the average of the subject
    for (let i = 0; i < listSubjectRow.length; i++) {
      // Get all the grades in the row, init the overall average of the subject and init the vraiable to set the total coefficients of all the grades in the subject
      const subjectRow = listSubjectRow[i];
      const allSubjectGrades = subjectRow.querySelectorAll('span.valeur');
      // console.log(5, matiereNotes)
      let subjectMean = 0.0;
      let summedGrades = 0.0;
      let totalSubjectGradeCoefficients = 0.0;

      // For each grades of the suject, get his coefficient and his quotient and we calculate everything. We convert the grade to be /20 or something else (globalQuotient) and we multiply it with his coefficient. We add the coefficient to the coeffNoteTot
      for (let j = 0; j < allSubjectGrades.length; j++) {
        const subjectGrade = allSubjectGrades[j];

        let gradeCoefficient = 1.0;
        let gradeQuotient = globalQuotient;
        let gradeValue = 0.0;
        let significative = false;
        let skip = !false;

        // Get the coefficient of the grade

        // Regex to replace "," with "." and the spaces with nothing and / with nothing
        if (withOldGradeDatas) {
          if (subjectGrade.parentElement.getAttribute('kmlc-note-simu-modifier')) {
            const subjectGradeOldCoefficient = subjectGrade.getAttribute('anciencoeff');

            if (subjectGradeOldCoefficient) {
              gradeCoefficient = parseFloat(
                subjectGradeOldCoefficient.replace(/[()\/\s]/g, '').replace(',', '.')
              );
              skip = !true;
            } else {
              gradeCoefficient = parseFloat(1);
              skip = !true;
            }
          }
        }

        if (skip) {
          const subjectGradeCoefficient = subjectGrade.querySelector('sup');

          if (subjectGradeCoefficient) {
            gradeCoefficient = parseFloat(
              subjectGradeCoefficient.textContent
                .replace(/[()\/\s]/g, '')
                .replace(',', '.')
            );
          }
        }

        skip = !false;

        // Get the quotient of the grade
        // Regex to replace "," with "." and the spaces with nothing and / with nothing
        if (withOldGradeDatas) {
          if (subjectGrade.parentElement.getAttribute('kmlc-note-simu-modifier')) {
            const subjectGradeOldQuotient = subjectGrade.getAttribute('ancienquotient');

            if (subjectGradeOldQuotient) {
              gradeQuotient = parseFloat(
                subjectGradeOldQuotient.replace(/[()\/\s]/g, '').replace(',', '.')
              );
              skip = !true;
            } else {
              gradeQuotient = globalQuotient;
              skip = !true;
            }
          }
        }

        if (skip) {
          const subjectGradeQuotient = subjectGrade.querySelector('sub');

          if (subjectGradeQuotient) {
            gradeQuotient = parseFloat(
              subjectGradeQuotient.textContent.replace(/[()\/\s]/g, '').replace(',', '.')
            );
          }
        }

        skip = !false;

        // Get the grade and replace all the white spaces and letters with nothing and the "," with "."
        if (withOldGradeDatas) {
          if (subjectGrade.parentElement.getAttribute('kmlc-note-simu-modifier')) {
            let subjectGradeOldValue = subjectGrade.getAttribute('anciennenote');

            if (subjectGradeOldValue) {
              subjectGradeOldValue = subjectGradeOldValue.replace(/[^\d+\-.\s]/g, '');

              if (subjectGradeOldValue != '') {
                gradeValue = subjectGradeOldValue;
                significative = true
                skip = !true;
              } else {
                gradeValue = NaN;
                significative =
                  subjectGrade.parentElement.querySelectorAll(':scope > span').length > 1
                    ? false
                    : true;
                skip = !true;
              }
            }
          }
        }

        if (skip) {
          gradeValue = subjectGrade.childNodes[0].nodeValue;
          significative =
            subjectGrade.parentElement.querySelectorAll(':scope > span').length > 1
              ? false
              : true;
        }

        // A grade between two parentheses is not a grade
        // if (!matNote.includes("(") && !matNote.includes(")")) {
        if (significative) {
          gradeValue = gradeValue
            .replace(/[\/\s]/g, '')
            .replace(',', '.')
            .replace(/[^\d+\-.\s]/g, '');
        } else {
          gradeValue = NaN;
        }

        // console.log(6, matNote, matiereNotes[j].childNodes[0].nodeValue)

        // If there is a grade (0 is a grade but nothing and a grade between two parentheses is not a grade). matNote is a string so ``if ("0" && "0.0")`` is true
        // console.log(gradeValue, gradeQuotient, gradeCoefficient); ///////////////////////////////////////////////////////////////////////////////////////
        if (gradeValue) {
          // console.log(6.1, matNote)

          // Convert the grade to /20 or something else (globalQuotient)
          gradeValue = (parseFloat(gradeValue) * globalQuotient) / gradeQuotient;
          // console.log(6.2, matNote, coeff)

          // Multiply it with the coefficient of the grade, add it to the average value of the subject and add the coefficient with the total of coefficients of the subject
          summedGrades += parseFloat(gradeValue * gradeCoefficient);
          totalSubjectGradeCoefficients += gradeCoefficient;
          // console.log(matiereNotes[j], addNotes, coeffNoteTot, coeff)
        }
      }

      // Get the coefficient of the subject
      const subjectCoefficient = parseFloat(
        subjectRow
          .querySelector('td.coef')
          .innerText.replace(/[()\/\s]/g, '')
          .replace(',', '.')
          .replace(/[^\d+\-*/.\s]/g, '')
      );
      // console.log(7, coeffMat)

      // If the total of coefficients of the subject is 0 (so no grades to count)
      if (totalSubjectGradeCoefficients == 0.0) {
        extraSubjectsCoefficient += subjectCoefficient;
        // console.log(8, coeffMat, coeffNoteTot, addNotes, parseFloat(lignes[i].querySelector("td.coef:not([class *= 'text-center'])").innerText))
      } else {
        // We add the coefficient of the subject to the total of coefficient of the subjects
        allSubjectsCoefficients += subjectCoefficient;

        // We calculate the average of the subject
        subjectMean = summedGrades / totalSubjectGradeCoefficients;
        //console.log(moyenne);

        // Duplicate the average element of the subject to add in a new line the average calculated by EcoleDirecte Plus
        const averageElement = subjectRow
          .querySelector('td.relevemoyenne')
          .cloneNode(true);
        averageElement.textContent = subjectMean.toFixed(5);
        if (displayCalculatedMeansValues) {
          if (!subjectRow.querySelector('[' + attributeMean + ']')) {
            subjectRow.querySelector('td.relevemoyenne').innerHTML =
              subjectRow.querySelector('td.relevemoyenne').innerHTML +
              '<br ' +
              brHTMLAttributes +
              '><span ' +
              attributeMean +
              '="true" style="' +
              styleMean +
              '">' +
              averageElement.innerHTML +
              '</span>';
          } else {
            subjectRow.querySelector('[' + attributeMean + ']').textContent =
              subjectMean.toFixed(5);
          }
        }

        // We multiply the average of the subject with his coefficient and we add it to the overall average
        allSubjectsMeans += subjectMean * subjectCoefficient;
      }
    }

    // We calculate the overall average
    calculatedGlobalMean = allSubjectsMeans / allSubjectsCoefficients;
    const calculatedGlobalMeanRound5 = calculatedGlobalMean.toFixed(5);
    const calculatedGlobalMeanRound2 = calculatedGlobalMean.toFixed(2);

    // If there is the overall average row we add our overall average in a new line. If not, we create it and put it in a new line as well (the first line is blank)
    if (displayCalculatedMeansValues) {
      if (document.querySelector('tr > td.moyennegenerale-valeur')) {
        const overallAverageElement = document
          .querySelector('tr > td.moyennegenerale-valeur')
          .cloneNode(true);
        overallAverageElement.textContent =
          calculatedGlobalMeanRound5 + ' (' + calculatedGlobalMeanRound2 + ')';
        // console.log(9, document.querySelector("tr > td.moyennegenerale-valeur"))

        if (!document.querySelector('[' + attributeGlobalMean + ']')) {
          document.querySelector('tr > td.moyennegenerale-valeur').innerHTML =
            document.querySelector('tr > td.moyennegenerale-valeur').innerHTML +
            '<br ' +
            brHTMLAttributes +
            '><span ' +
            attributeGlobalMean +
            '="true" style="' +
            styleGlobalMean +
            '">' +
            overallAverageElement.innerHTML +
            '</span>';
        } else {
          document.querySelector('[' + attributeGlobalMean + ']').textContent =
            calculatedGlobalMeanRound5 + ' (' + calculatedGlobalMeanRound2 + ')';
        }
      } else {
        const overallAverageElement = document.createElement('tr');
        overallAverageElement.innerHTML =
          '<tr class="ng-star-inserted"><td colspan="2" class="text-right moyennegeneralelibelle">Moyenne générale</td><td colspan="2" class="moyennegenerale-valeur"><span ' +
          attributeGlobalMean +
          '="true" style="' +
          styleGlobalMean +
          '">' +
          calculatedGlobalMeanRound5 +
          ' (' +
          calculatedGlobalMeanRound2 +
          ')';
        +'</span></td></tr>';
        // console.log(10, overallAverageElement, document.querySelector("table.ed-table tbody"))

        if (!document.querySelector('[' + attributeGlobalMean + ']')) {
          document
            .querySelector('table.ed-table tbody')
            .appendChild(overallAverageElement);
        } else {
          document.querySelector('[' + attributeGlobalMean + ']').textContent =
            calculatedGlobalMeanRound5 + ' (' + calculatedGlobalMeanRound2 + ')';
        }
      }
    }

    return calculatedGlobalMeanRound5, calculatedGlobalMeanRound2;

    // console.log(moyenneG, matieresMoyenne, coeffMatTot)
  }

  exports({calculerMoyennes}).to('./features/Notes/functions/calculer-moyennes.js');
})();
