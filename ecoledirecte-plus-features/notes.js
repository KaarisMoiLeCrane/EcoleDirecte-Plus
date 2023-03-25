globalThis.notes = function (id) {
	// Make an http request to get the grades
    let xhr = new XMLHttpRequest();
	console.log(window.location.pathname.split("/"))
	console.log(window.location.pathname.split("/")[2])
    url = `https://api.ecoledirecte.com/v3/Eleves/${id}/notes.awp?verbe=get`;
    data = `data={}`;

    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.setRequestHeader("X-Token", globalThis.token);
    xhr.onreadystatechange = function() {
		console.log(1111100404084084084, xhr.readyState, document.querySelector("td span[class = 'ng-star-inserted']"))
        if (xhr.readyState === 4) {
			
			// When we receive all the homeworks
            let note = JSON.parse(xhr.responseText).data
			var notesObserver = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					try {
						
						// If, in the element, there is something that have been added with an innerText "Moyennes" or "Evaluations" (both in the table), we can continue
						if (mutation.target.children[0].innerText == "Moyennes" || mutation.target.children[0].innerText == "Evaluations") {
							
							// If there is already two things with the class "coef" etc, it means that our new category "Rang. If not, we apply our changes
							if (!document.querySelectorAll("th[class *= 'coef ng-star-inserted']")[1]) {
								
								// We clone the "coef" element and append it to his parent (the top part of the table) and then modify the text to "Rang"
								document.querySelector("th[class *= 'coef ng-star-inserted']").parentElement.appendChild(document.querySelector("th[class *= 'coef ng-star-inserted']").cloneNode(true))
								document.querySelectorAll("th[class *= 'coef ng-star-inserted']")[1].innerText = "Rang"
								console.log(1, document.querySelector("th[class *= 'coef ng-star-inserted']"))
								
								// Get the coefficient of each subject
								let p = document.querySelectorAll("td[class *= 'coef ng-star-inserted']")
								console.log(1.1, p)
								
								// For each coefficient element, we duplicate it to place it visually under the new "Rang" column
								for (let i = 0; i < p.length; i++) {
									let elm = p[i].cloneNode(true)
									let periode = document.querySelector("li.ng-star-inserted.active:not(.nav-item)")
									let periodeNum = [...periode.parentElement.children].indexOf(periode)
									console.log(2, periode)
									
									elm.children[0].innerText = (note.periodes[periodeNum].ensembleMatieres.disciplines[i].effectif - note.periodes[periodeNum].ensembleMatieres.disciplines[i].rang) + "/" + note.periodes[periodeNum].ensembleMatieres.disciplines[i].effectif
									
									// For each element we add the class "text-center"
									elm.className = elm.className + " text-center"
									p[i].parentElement.appendChild(elm)
								}
								
								// We get all the displayed grades
								let matNotes = document.querySelectorAll("span.valeur");
								console.log(3, matNotes)
								let lignes = [];
								
								// We init the overall average, the value of all the subjects average, the excessed coefficients (coefficients counted when there are no grades) and the total coefficients (that he will divide all the grades to get the overall average)
								let moyenneG = 0.0
								let matieresMoyenne = 0.0;
								let coeffEnTrop = 0.0;
								let coeffMatTot = 0.0;
								
								// For each grades, get the row containing all the datas about the subject and then push each row element, if they are not in the list, to our lignes list
								for (let i = 0; i < matNotes.length; i++) {
									let parent = matNotes[i].parentElement.parentElement.parentElement;
									console.log(4, parent, matNotes[i])
									if (!lignes.includes(parent)) {
										lignes.push(parent);
									}
								}

								// For each rows, get all the grades in the row (so all the grades of a specific subject), and calculate the average of the subject
								for (let i = 0; i < lignes.length; i++) {
									
									// Get all the grades in the row, init the overall average of the subject and init the vraiable to set the total coefficients of all the grades in the subject
									let matiereNotes = lignes[i].querySelectorAll("span.valeur")
									console.log(5, matiereNotes)
									let moyenne = 0.0;
									let coeffNoteTot = 0.0;
									
									// For each grades of the suject, get his coefficient and his quotient and we calculate everything. We convert the grade to be /20 and we multiply it with his coefficient. We add the coefficient to the coeffNoteTot
									for (let j = 0; j < matiereNotes.length; j++) {
										let coeff = 1.0
										let quotient = 20.0
										
										// Get the coefficient of the grade
										if (matiereNotes[j].querySelector("sup")) {
											// Regex to replace "," with "." and the spaces with nothing
											coeff = parseFloat(matiereNotes[j].querySelector("sup").textContent.replace(/[()\/\s]/g, "").replace(",", "."));
										}
										
										// Get the quotient of the grade
										if (matiereNotes[j].querySelector("sub")) {
											// Regex to replace "," with "." and the spaces with nothing
											quotient = parseFloat(matiereNotes[j].querySelector("sub").textContent.replace(/[()\/\s]/g, "").replace(",", "."));
										}

										// Get the grade and replace all the spaces and letters with nothing and the "," with "."
										let matNote = matiereNotes[j].childNodes[0].nodeValue.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
										console.log(6, matNote, matiereNotes[j].childNodes[0].nodeValue)

										// If there is a grade (0 is a grade but nothing is not a grade)
										/*
										 *
										 * TO-DO: Check if it work with a grade value equal to 0
										 *
										 */
										if (matNote) {
											console.log(6.1, matNote)
											
											// Convert the grade to /20
											matNote = parseFloat(matNote)*20.0/quotient
											console.log(6.2, matNote, coeff)
											
											// Multiply it with the coefficient of the grade, add it to the average value of the subject and add the coefficient with the total of coefficients of the subject
											moyenne += parseFloat(matNote*coeff);
											coeffNoteTot += coeff;
											console.log(matiereNotes[j], moyenne, coeffNoteTot, coeff)
										}
									}
									
									// Get the coefficient of the subject
									let coeffMat = parseFloat(lignes[i].querySelector("td.coef:not([class *= 'text-center'])").innerText.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""));
									console.log(7, coeffMat)
									
									// If the total of coefficients of the subject is 0 (so no grades to count) and the average of the subject is 0 (here to avoid errors but after tests we don't need it but I keep in case we need it)
									if (coeffNoteTot ==  0.0 && moyenne == 0.0) {
										coeffEnTrop += coeffMat;
										console.log(8, coeffMat, coeffNoteTot, moyenne, parseFloat(lignes[i].querySelector("td.coef:not([class *= 'text-center'])").innerText))
									} else {
										
										// We add the coefficient of the subject to the total of coefficient of the subjects
										coeffMatTot += coeffMat;
										
										// We calculate the average of the subject
										moyenne = ((moyenne * coeffMat)/coeffNoteTot);
										console.log(moyenne);

										// Duplicate the average element of the subject to add in a the second line the average calculated by EcoleDirecte Plus
										let averageElement = lignes[i].querySelector("td.relevemoyenne").cloneNode(true);
										averageElement.textContent = moyenne.toFixed(5)
										lignes[i].querySelector("td.relevemoyenne").innerHTML = lignes[i].querySelector("td.relevemoyenne").innerHTML + "<br>" + averageElement.innerHTML;
										
										// We add the calculated subject average to the overall average
										matieresMoyenne += moyenne;
									}
								}
								
								// We calculate the averall average
								moyenneG = matieresMoyenne/coeffMatTot
								
								// If there is the overall average row we add our overall average in the second. If not, we create it and put it in the second line as well (the first line is blank)
								if (document.querySelector("tr > td.moyennegenerale-valeur")) {
									let overallAverageElement = document.querySelector("tr > td.moyennegenerale-valeur").cloneNode(true)
									overallAverageElement.textContent = moyenneG.toFixed(5);
									console.log(9, document.querySelector("tr > td.moyennegenerale-valeur"))

									document.querySelector("tr > td.moyennegenerale-valeur").innerHTML = document.querySelector("tr > td.moyennegenerale-valeur").innerHTML + "<br>" + overallAverageElement.innerHTML;
								} else {
									let overallAverageElement = document.createElement("tr")
									overallAverageElement.innerHTML = '<tr class="ng-star-inserted"><td colspan="2" class="text-right moyennegeneralelibelle">Moyenne générale</td><td colspan="2" class="moyennegenerale-valeur">' + moyenneG.toFixed(5); + '</td></tr>'
									console.log(10, overallAverageElement, document.querySelector("table.ed-table tbody"))
									
									document.querySelector("table.ed-table tbody").appendChild(overallAverageElement)
								}

								console.log(moyenneG, matieresMoyenne, coeffMatTot)
							}
						}
					} catch(e){}
				});
			});
			
			executeNotesObserver(notesObserver);
			
			function executeNotesObserver(observer) {
				
				// Wait for the parent containing the table that isn't modified or removed when something in the table change
				document.waitForElement("[class *= 'tab-content']").then((elm) => {
					observer.observe(elm, {
						characterData: false,
						attributes: true,
						attributeFilter: ['class'],
						childList: true,
						subtree: true
					});
				});
			}
        }
	}

    xhr.send(data);
}