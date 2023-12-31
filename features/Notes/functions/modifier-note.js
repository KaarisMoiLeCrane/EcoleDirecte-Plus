(() => {
  const calculerMoyennes = imports('calculerMoyennes').from(
    './features/Notes/functions/calculer-moyennes.js'
  );

  function modifierNote(num,
    subjectName,
    gradeTitle,
    gradeValue,
    gradeCoefficient,
    gradeQuotient,
    gradeModificationId,
    gradeElement = false,
    gradeId = false,
    saveGradeModification = false,
    calulateGlobalMean = true
  ) {
    let skip = !false;

    console.log(num, 1)
    if (!gradeElement || typeof gradeElement != 'object') {
      if (document.querySelector("[id = '" + gradeId + "']")) {
        gradeElement = document
          .querySelector("[id = '" + gradeId + "']")
          .querySelector('[class *= valeur]');
        skip = !false;
      } else {
        console.log('You are asking a very hard thing');

        skip = !true;

        /*
				IN THE CASE OF GRADES NOT ADDED USING GRADE SIMULATION (UNSAVED), THERE ARE NO RELIABLE SOLUTIONS
				
				The possibility of saving the exact location of the grade (its child number) using a grade
				sorting system (with "note" in notes.js line 18) but teachers can add grades between two 
				other grades because the grade was created in advance but no value was entered and sent to 
				EcoleDirecte. This will therefore create a gap with the grades which will cause a 
				modification of the wrong grade.
				
				The fact of setting an unique ID to each grade can have the same problem.
				Saving the element can be a solution but it doesn't work because the element, as far as I 
				know, isn't the same between two DOM (And it's a bad idea).
				
				The "gradeElement" variable will be maintained for the moment.
				
				FOR UNSAVED GRADES, WE CAN EDIT WITHOUT SAVING THEM'
				
				If each grade had an ID defined by EcoleDirecte and set by them, it would be perfect.

				Maybe a system that save the title, grade, coefficient, quotient, subject and periode and then
				by searching the grade, we can find it and edit it. If two grades have everything the same, it
				is not a big deal, it will edit one of them and have the intended effect.
				
				KMLC
			  */
      }
    }

    if (
      subjectName != '' &&
      gradeTitle != '' &&
      gradeCoefficient != '' &&
      gradeQuotient != '' &&
      skip
    ) {
      // Add the attribute to know that the grade has been modified
      gradeElement.parentElement.setAttribute('kmlc-note-simu-modifier', 'true');

      // Set the the initial grade, initial coefficient and initial quotient to parameters in the element
      gradeElement.parentElement.setAttribute(
        'ancienTitre',
        gradeElement.parentElement.getAttribute('title')
      );

      if (gradeElement.getAttribute('ancienneNote') == null)
        gradeElement.setAttribute(
          'ancienneNote',
          gradeElement.childNodes[0].nodeValue.replace(/[\/\s]/g, '').replace(',', '.')
        );

      const gradeElementCoefficient = gradeElement.querySelector('sup');
      if (gradeElementCoefficient) {
        if (gradeElement.getAttribute('ancienCoeff') == null)
          gradeElement.setAttribute(
            'ancienCoeff',
            ' (' +
              gradeElementCoefficient.textContent
                .replace(/[()\/\s]/g, '')
                .replace(',', '.')
                .replace(/[^\d+\-*/.\s]/g, '') +
              ') '
          );
      } else {
        if (gradeElement.getAttribute('ancienCoeff') == null)
          gradeElement.setAttribute('ancienCoeff', '');
      }

      const gradeElementQuotient = gradeElement.querySelector('sub');
      if (gradeElementQuotient) {
        if (gradeElement.getAttribute('ancienQuotient') == null)
          gradeElement.setAttribute(
            'ancienQuotient',
            '/' +
              gradeElementQuotient.textContent
                .replace(/[()\/\s]/g, '')
                .replace(',', '.')
                .replace(/[^\d+\-*/.\s]/g, '')
          );
      } else {
        if (gradeElement.getAttribute('ancienQuotient') == null)
          gradeElement.setAttribute('ancienQuotient', '');
      }

      // Change the grade
      gradeElement.childNodes[0].nodeValue = ' ' + gradeValue + ' ';

      // Change the title
      gradeElement.parentElement.setAttribute('title', gradeTitle);

      // Change/Add the coefficient
      if (gradeElementCoefficient) {
        gradeElementCoefficient.textContent = ' (' + gradeCoefficient + ') ';
      } else {
        const coefficientElement = document.createElement('SUP');
        coefficientElement.setAttribute('kmlc-sup-modifier', 'true');

        gradeElement.appendChild(coefficientElement);

        gradeElement.querySelector('sup').outerHTML =
          '<sup class="coef ng-star-inserted"> (' +
          gradeCoefficient +
          ') <span class="margin-whitespace"></span></sup>';
      }

      // Change/Add the quotient
      if (gradeElementQuotient) {
        gradeElementQuotient.textContent = '/' + gradeQuotient + ' ';
      } else {
        const quotientElement = document.createElement('SUB');
        quotientElement.setAttribute('kmlc-sub-modifier', 'true');

        gradeElement.appendChild(quotientElement);

        gradeElement.querySelector('sub').outerHTML =
          '<sub class="quotient ng-star-inserted"> /' +
          gradeQuotient +
          ' <span class="margin-whitespace"></span></sub>';
      }

      // Add the one pixel green underline
      const gradeElementStyle = gradeElement.getAttribute('style');
      if (gradeElementStyle) {
        gradeElement.setAttribute(
          'style',
          gradeElementStyle.replace('border-bottom: 1px solid green;', '') +
            ' border-bottom: 1px solid green;'
        );
      } else {
        gradeElement.setAttribute('style', 'border-bottom: 1px solid green;');
      }
    }

    // We calculate the averages
    if (calulateGlobalMean) {
      calculerMoyennes(8,
        true,
        'kmlc-simu-modifier-moyenne-g',
        'border-bottom: 1px solid green; color: green;',
        'kmlc-simu-modifier-moyenne',
        'border-bottom: 1px solid green; color: green;'
      );
    }

    // modifierNoteSimulation()

    return skip;
  }

  exports({modifierNote}).to('./features/Notes/functions/modifier-note.js');
})();
