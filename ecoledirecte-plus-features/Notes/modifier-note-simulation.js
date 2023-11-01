var count = 0

globalThis.Notes.modifierNoteSimulation = function () {
    // If the table in the bottom was changed and then we add the text "Note modifiée"
    if (!document.querySelector("[kmlc-text-modifier-note]") && document.querySelector("table caption")) {
        let textSimu = document.querySelector("table caption").parentElement.getElementsByContentText("(note)").startsWith[0].cloneNode(true)
        textSimu.setAttribute("kmlc-text-modifier-note", "true")
        
        textSimu.children[0].textContent = ""
        textSimu.children[0].setAttribute("style", "")
        
        let spanElement = document.createElement("SPAN")
        spanElement.textContent = "note"
        spanElement.setAttribute("style", "border-bottom: 1px solid green;")
        
        textSimu.children[1].textContent = "Note modifiée"
        
        textSimu.setAttribute("kmlc-text-modifier-note", "true")
        
        document.querySelector("table caption").parentElement.getElementsByContentText("(note)").startsWith[0].insertAfter(textSimu)
        textSimu.children[0].appendChild(spanElement)
    }
    
    // Get all the grades that they don't have the right click listener
    let matNotes = document.querySelectorAll("span.valeur:not([kmlc-event-listener])")
    // console.log("No right click listener", matNotes)
    
    for (let i = 0; i < matNotes.length; i++) {
		// console.log(matNotes[i])
        // Add the attribute to know that the click listener has been added
        matNotes[i].setAttribute("kmlc-event-listener", "true")
        matNotes[i].addEventListener('contextmenu', async function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            let pass = 0;
			let gradeModifId = Date.now()
			let gradeElement = this
			
			let popupID = "kmlc-modifierNote-popup"
			let blurID = "kmlc-modifierNote-blur"
			
			let popup = document.querySelector("#" + popupID)
			let blur = document.querySelector("#" + blurID)
			
			if (!popup) {
				let popupDatas = globalThis.Utils.initPopup(popupID, blurID)
				popup = popupDatas[0]
				blur = popupDatas[1]
			}
				
			let gradeSimulationId = gradeElement.parentElement.getAttribute("id")
			if (!gradeSimulationId) gradeSimulationId = false
			
			await changePopupInnerHTML(popup, blur, gradeSimulationId, gradeElement)

			// Fermer la popup
			function closePopup() {
				popup.classList.add('kmlc-popup-close');
				blur.classList.add('kmlc-blur-close')
			}

			// Événement pour fermer la popup en cliquant à l'extérieur
			blur.addEventListener('click', function(event) {
				if (event.target.classList.contains('kmlc-blur')) {
					closePopup();
				}
			});
			
			let gradeSimulationInputs = document.querySelectorAll('[id *= kmlc-grade-simulation-input]:not([id *= title])')

			gradeSimulationInputs.forEach(function(input) {
				input.addEventListener('keypress', function(event) {
					let charCode = event.which ? event.which : event.keyCode;
					
					// console.log(charCode)

					if (
						charCode !== 8 && // Touche de suppression (Backspace)
						charCode !== 44 && // Virgule (,)
						charCode !== 46 && // Point (.)
						charCode < 48 || // Chiffres (0-9)
						charCode > 57
					) {
						event.preventDefault();
					}
				});
			});

			// Réinitialiser la popup après l'animation de fermeture
			popup.addEventListener('animationend', function(event) {
				if (event.animationName === 'kmlc-popupCloseAnimation') {
					// Hide the elements
					popup.style.display = 'none';
					blur.style.display = 'none'
					
					// Reset the animation
					popup.classList.remove('kmlc-popup-close');
					blur.classList.remove('kmlc-blur-close')
				}
			});
			
			popup.setAttribute("style", "width: 80%; height: 80%;");
			blur.setAttribute("style", "");
            
			
            // Ask for the new grade, coefficient and quotient
            // let nouveauTitre = prompt("Nouveau Titre")
            // let nouvelleNote = prompt("Nouvelle note")
            // let nouveauCoeff = prompt("Nouveau coefficient")
            // let nouveauQuotient = prompt("Nouveau quotient")
			// let saveModif = prompt("Sauvegarder la modification")

            // Another check
            // if (nouveauTitre != "" && nouvelleNote != "" && nouveauCoeff != "" && nouveauQuotient != "") {
                // Add the attribute to know that the grade has been modified
                // this.parentElement.setAttribute("kmlc-note-simu-modifier", "true")

                // Set the the initial grade, initial coefficient and initial quotient to parameters in the element
                // this.parentElement.setAttribute("ancienTitre", this.parentElement.getAttribute("title"))
				
				// if (this.getAttribute("ancienneNote") == null)
                    // this.setAttribute("ancienneNote", this.childNodes[0].nodeValue.replace(/[\/\s]/g, "").replace(",", "."))

                // if (this.querySelector("sup")) {
                    // if (this.getAttribute("ancienCoeff") == null)
                        // this.setAttribute("ancienCoeff", " (" + this.querySelector("sup").textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "") + ") ")
                // } else {
                    // if (this.getAttribute("ancienCoeff") == null)
                        // this.setAttribute("ancienCoeff", "")
                // }

                // if (this.querySelector("sub")) {
                    // if (this.getAttribute("ancienQuotient") == null)
                        // this.setAttribute("ancienQuotient", "/" + this.querySelector("sub").textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
                // } else {
                    // if (this.getAttribute("ancienQuotient") == null)
                        // this.setAttribute("ancienQuotient", "")
                // }
                
                // Change the grade
                // this.childNodes[0].nodeValue = " " + nouvelleNote + " "
				
				// Change the title
				// this.parentElement.setAttribute("title", nouveauTitre)
                
                // Change/Add the coefficient
                // if (this.querySelector("sup")) {
                    // this.querySelector("sup").textContent = " (" + nouveauCoeff + ") "
                // } else {
                    // let supElement = document.createElement("SUP")
                    // supElement.setAttribute("kmlc-sup-modifier", "true")
                    
                    // this.appendChild(supElement)
                    
                    // this.querySelector("sup").outerHTML = '<sup class="coef ng-star-inserted"> (' + nouveauCoeff + ') <span class="margin-whitespace"></span></sup>'
                // }

                // Change/Add the quotient
                // if (this.querySelector("sub")) {
                    // this.querySelector("sub").textContent = "/" + nouveauQuotient + " "
                // } else {
                    // let subElement = document.createElement("SUB")
                    // subElement.setAttribute("kmlc-sub-modifier", "true")
                    
                    // this.appendChild(subElement)
                    
                    // this.querySelector("sub").outerHTML = '<sub class="coef ng-star-inserted"> /' + nouveauQuotient + ' <span class="margin-whitespace"></span></sub>'
                // }
                
                // Add the one pixel green underline
                // if (this.getAttribute("style")) {
                    // this.setAttribute("style", this.getAttribute("style").replace("border-bottom: 1px solid green;", "") + " border-bottom: 1px solid green;")
                // } else {
                    // this.setAttribute("style", "border-bottom: 1px solid green;")
                // }
                
                // globalThis.Notes.calculerMoyennes(true, "kmlc-simu-modifier-moyenne-g", "border-bottom: 1px solid green; color: green;", "kmlc-simu-modifier-moyenne", "border-bottom: 1px solid green; color: green;")
            // }
			
			// if (saveModif != "") {
				// if (this.parentElement.getAttribute("save")) {
					// await globalThis.Utils.initUserSimulationNote(globalThis.userId)
					// let simulationNote = await globalThis.Utils.getData("simulationNote")
					
					// console.log(simulationNote)
					
					// let userContent = simulationNote.find(item => {
						// if (item) if (item.id) return item.id == globalThis.userId
					// });
					
					// let index = simulationNote.indexOf(userContent)
					
					// console.log(userContent, index)
					
					// Check if the user already add a goal for the student. If not we create the goal array under the student object.
					// if (!userContent.periodes.length) {
						// console.log(2)
						// await globalThis.Utils.initUserSimulationNote(globalThis.userId)
						// console.log(6)
						
						// simulationNote = browser.storage.sync.get({"simulationNote": []})
						
						// simulationNote = await globalThis.Utils.getData("simulationNote")
					// }
					
					// let periodeElm = document.querySelector("ul[class *= 'tabs'] > li > [class *= 'nav-link active']")
					
					// let subjectGrade = this.parentElement.parentElement.parentElement.querySelector("[class *= nommatiere] > b").textContent

					// for (let j = 0; j < userContent.periodes.length; j++) {
						// if ((Number(periodeElm.getAttribute("dateDebut")) <= userContent.periodes[j].dateDebut) && (userContent.periodes[j].dateFin <= Number(periodeElm.getAttribute("dateFin")))) {
							// let existe = false;
							
							// if (userContent.periodes[j].notes.modifier[subjectGrade] == undefined) userContent.periodes[j].notes.modifier[subjectGrade] = []
							
							// for (let k = 0; k < userContent.periodes[j].notes.modifier[subjectGrade].length; k++) {
								// if (userContent.periodes[j].notes.modifier[subjectGrade][k].idAjouter == parseFloat(this.parentElement.getAttribute("id"))) {
									// userContent.periodes[j].notes.modifier[subjectGrade][k].titre = nouveauTitre
									// userContent.periodes[j].notes.modifier[subjectGrade][k].note = parseFloat(nouvelleNote)
									// userContent.periodes[j].notes.modifier[subjectGrade][k].coeff = parseFloat(nouveauCoeff)
									// userContent.periodes[j].notes.modifier[subjectGrade][k].quotient = parseFloat(nouveauQuotient)
									// userContent.periodes[j].notes.modifier[subjectGrade][k].id = idGrade
									// existe = true;
								// }
							// }
							
							// If the subject not exist we add it and with the goal
							// if (!existe) {
								// userContent.periodes[j].notes.modifier[subjectGrade] = []
								// console.log(userContent, userContent.periodes[j].notes, userContent.periodes[j].notes[subjectGrade])
								// userContent.periodes[j].notes.modifier[subjectGrade].push({
									// "titre": nouveauTitre,
									// "note": parseFloat(nouvelleNote),
									// "coeff": parseFloat(nouveauCoeff),
									// "quotient": parseFloat(nouveauQuotient),
									// "id": idGrade,
									// "idAjouter": parseFloat(this.parentElement.getAttribute("id"))
								// });
							// }
							
							// console.log(userContent, existe)
						// }
					// }
					
					// simulationNote[index] = userContent  
					// await globalThis.Utils.setData("simulationNote", simulationNote)
					
				// } else {
					// console.log("You are asking a very hard work")
				// }
			// }
        }, false)
	}
	
	async function changePopupInnerHTML(popup, blur, gradeSimulationId, gradeElement) {
		await globalThis.Utils.initUserSimulationNote(globalThis.userId)
		let simulationNote = await globalThis.Utils.getData("simulationNote")
		
		let userContent = simulationNote.find(item => {
			if (item) if (item.id) return item.id == globalThis.userId
		})
		
		let nomMatiere = gradeElement.parentElement.parentElement.parentElement.querySelector("[class *= nommatiere] > b").textContent
		let periodeElm = document.querySelector("ul[class *= 'tabs'] > li > [class *= 'nav-link active']")
		
		// let nomMatiereSerialized = nomMatiere.replaceAll(/[^a-zA-Z0-9 ]/g, '').replaceAll(" ", "_")
		
		// console.log(simulationNote)

		let popupHTML = `
<h2>Modifier la Note pour Simulation</h2>
<ul class="kmlc-list">
`
		
		popupHTML += `
  <ul class="kmlc-list">
    <li class="kmlc-item">
      <label class="kmlc-label">` + nomMatiere + `</label>
    </li>
    <li class="kmlc-item">
      <input type="text" class="kmlc-input" id="kmlc-modification-grade-simulation-input-title" placeholder="Entrez votre titre pour la note" value="` + gradeElement.parentElement.getAttribute("title").substring(1) + `">
      <input type="text" class="kmlc-input" id="kmlc-modification-grade-simulation-input-grade" placeholder="Entrez votre note" value="` + gradeElement.childNodes[0].textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "") + `">
    </li>
    <li class="kmlc-item">
      <input type="text" class="kmlc-input" id="kmlc-modification-grade-simulation-input-coeff" placeholder="Entrez votre coefficient pour la note" value="` + gradeElement.querySelector("sup").textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "") + `">
      <input type="text" class="kmlc-input" id="kmlc-modification-grade-simulation-input-quotient" placeholder="Entrez votre quotient de note" value="` + gradeElement.querySelector("sub").textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "") + `">
    </li>
	<input type="checkbox" class="kmlc-checkbox" id="kmlc-modification-grade-simulation-button-save">
	<label for="kmlc-modification-grade-simulation-button-save" class="kmlc-modification-checkbox-label">Sauvegarder</label>
	<li class="kmlc-button-container" style="text-align: center;">
      <button id="kmlc-modification-add-grade-simulation-button" class="kmlc-add-button" subject="` + nomMatiere + `">Modifier la note</button>
      <button id="kmlc-modification-clear-grade-simulation-button" class="kmlc-remove-button" subject="` + nomMatiere + `">Réinitialiser</button>
	</li>
  </ul>`

		popupHTML += `
</ul>
<div class="kmlc-button-container">
  <button id="kmlc-modification-push-grade-simulation-button" class="kmlc-add-button">Sauvegarder et Calculer</button>
  <button id="kmlc-modification-remove-grade-simulation-button" class="kmlc-remove-button">Supprimer les notes modifiées</button>
</div>
`

		popup.innerHTML = popupHTML
		
		
		let addGradeButtons = popup.querySelectorAll("[id = kmlc-modification-add-grade-simulation-button]")
		for (let i = 0; i < addGradeButtons.length; i++) {
			addGradeButtons[i].addEventListener('click', async function(e) {
				let subjectGrade = gradeElement.parentElement.parentElement.parentElement.querySelector("[class *= 'nommatiere'] > b").textContent
				let dateNow = Date.now();
				
				// console.log(gradeElement, subjectGrade)
				
				let nouveauTitre = this.parentElement.parentElement.querySelector("#kmlc-modification-grade-simulation-input-title").value
				let nouvelleNote = this.parentElement.parentElement.querySelector("#kmlc-modification-grade-simulation-input-grade").value.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
				let nouveauCoeff = this.parentElement.parentElement.querySelector("#kmlc-modification-grade-simulation-input-coeff").value.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
				let nouveauQuotient = this.parentElement.parentElement.querySelector("#kmlc-modification-grade-simulation-input-quotient").value.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
				let save = this.parentElement.parentElement.querySelector("#kmlc-modification-grade-simulation-button-save").checked
				
					// console.log(123)
					
					// If nothing return
					if (nouveauTitre != "" && nouvelleNote != "" && nouveauCoeff != "" && nouveauQuotient != "") return
					
					let pass = 0
					
					// If he put a new value but it's the same than the old one or he put an invalid value we add 1 to the pass variable
					if (nouveauTitre == "") {
						nouveauTitre = gradeElement.parentElement.getAttribute("title")
						pass += 1
					} else {
						if (nouveauTitre == gradeElement.parentElement.getAttribute("title")) {
							pass += 1
						} else {
							nouveauTitre = " " + nouveauTitre
						}
					}
					
					nouvelleNote = nouvelleNote.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
					if (nouvelleNote == "") {
						nouvelleNote = gradeElement.childNodes[0].nodeValue.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
						pass += 1
					} else {
						nouvelleNote = nouvelleNote.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
						
						if (nouvelleNote == gradeElement.childNodes[0].nodeValue.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
							pass += 1
					}
					
					nouveauCoeff = nouveauCoeff.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
					if (nouveauCoeff == "") {
						if (gradeElement.querySelector("sup"))
							nouveauCoeff = gradeElement.querySelector("sup").textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
						else
							nouveauCoeff = 1.0
						
						pass += 1
					} else {
						if (gradeElement.querySelector("sup"))
							if (nouveauCoeff == gradeElement.querySelector("sup").textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
								pass += 1
					}
					
					nouveauQuotient = nouveauQuotient.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
					if (nouveauQuotient == "") {
						if (gradeElement.querySelector("sub"))
							nouveauQuotient = gradeElement.querySelector("sub").textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
						else
							nouveauQuotient = globalThis.quotient
						
						pass += 1
					} else {
						if (gradeElement.querySelector("sub"))
							if (nouveauQuotient == gradeElement.querySelector("sub").textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
								pass += 1
							if (nouveauQuotient == globalThis.quotient)
								pass += 1
					}
					
					// If pass == 4 it means that no changes have to be done
					if (pass == 4) return
					
					await applyGradeSimulationGoal(subjectGrade, nouveauTitre, nouvelleNote, nouveauCoeff, nouveauQuotient, dateNow, gradeElement, gradeSimulationId, save)
					
					clearInputsAndButtons(this.parentElement.parentElement)
				
			})
		}
		
		
		let clearGradeButtons = popup.querySelectorAll("[id = kmlc-modification-clear-grade-simulation-button]")
		for (let i = 0; i < addGradeButtons.length; i++) {
			clearGradeButtons[i].addEventListener('click', async function(e) {
				clearInputsAndButtons(this.parentElement.parentElement)
			})
		}
		
		
		popup.querySelector("#kmlc-modification-remove-grade-simulation-button").addEventListener('click', async function(e) {
			e.stopPropagation()
			e.preventDefault()
			
			await globalThis.Utils.initUserSimulationNote(globalThis.userId)
			let simulationNote = await globalThis.Utils.getData("simulationNote")
			
			let userContent = simulationNote.find(item => {
				if (item) if (item.id) return item.id == globalThis.userId
			})
			
			let index = simulationNote.indexOf(userContent)
			
			
			clearInputsAndButtons(this.parentElement.parentElement)
			
			
			for (let i = 0; i < userContent.periodes.length; i++) {
				userContent.periodes[i].notes.modifier = {}
			}
			
			
			simulationNote[index] = userContent
			
			await globalThis.Utils.setData("simulationNote", simulationNote)
			await globalThis.Utils.initUserSimulationNote(globalThis.userId)
			
			
			let allSimuAverageElements = Array.from(document.querySelectorAll('*')).filter(element => {
				const attributes = Array.from(element.attributes)
				return attributes.some(attr => attr.name.includes('kmlc-simu-modifier'))
			})
			
			for (let i = 0; i < allSimuAverageElements.length; i++) {
				allSimuAverageElements[i].remove()
			}
			
			let allSimuGradesElements = Array.from(document.querySelectorAll('*')).filter(element => {
				const attributes = Array.from(element.attributes)
				return attributes.some(attr => attr.name.includes('kmlc-note-simu-modifier'))
			})
			
			for (let i = 0; i < allSimuGradesElements.length; i++) {
				let simuGradeElement = allSimuGradesElements[i].querySelector("[class *= valeur]")
				simuGradeElement.setAttribute("style", simuGradeElement.getAttribute("style").replace("border-bottom: 1px solid green;", ""))
				
				simuGradeElement.childNodes[0].textContent = " " + simuGradeElement.getAttribute("ancienneNote") +  " "
				simuGradeElement.removeAttribute("ancienneNote") 

				simuGradeElement.querySelector("sup").textContent = simuGradeElement.getAttribute("ancienCoeff")
				simuGradeElement.removeAttribute("ancienCoeff") 

				simuGradeElement.querySelector("sub").textContent = simuGradeElement.getAttribute("ancienQuotient")
				simuGradeElement.removeAttribute("ancienQuotient")
			}
			
			blur.click()
		})
		
		popup.querySelector("#kmlc-modification-push-grade-simulation-button").addEventListener('click', function(e) {
			e.stopPropagation()
			e.preventDefault()
			
			blur.click()
			globalThis.Notes.calculerMoyennes(true, "kmlc-simu-modifier-moyenne-g", "border-bottom: 1px solid green; color: green;", "kmlc-simu-modifier-moyenne", "border-bottom: 1px solid green; color: green;")
		})
	}
	
	
	function clearInputsAndButtons(popupOrChild) {
		// console.log("supp")
		let inputBoxes = popupOrChild.querySelectorAll('input[type="text"]:not([type="checkbox"])')
		for (let i = 0; i < inputBoxes.length; i++) {
			inputBoxes[i].value = ''
		}
		
		let saveButtons = popupOrChild.querySelectorAll('input[type="checkbox"]')
		for (let i = 0; i < saveButtons.length; i++) {
			saveButtons[i].checked = false
		}
	}
	
	
	async function applyGradeSimulationGoal(subjectGrade, titleGrade, gradeValue, coeffGrade, quotientGrade, gradeModifId, gradeElement, gradeSimulationId, save) {
		let pass = globalThis.Notes.modifierNote(subjectGrade, titleGrade, gradeValue, coeffGrade, quotientGrade, gradeModifId, gradeElement, gradeSimulationId, save)
		
		if (!save) return
		
		if (pass) {
			await globalThis.Utils.initUserSimulationNote(globalThis.userId)
			let simulationNote = await globalThis.Utils.getData("simulationNote")
			
			let userContent = simulationNote.find(item => {
				if (item) if (item.id) return item.id == globalThis.userId
			});
			
			let index = simulationNote.indexOf(userContent)
			
			
			let periodeElm = document.querySelector("ul[class *= 'tabs'] > li > [class *= 'nav-link active']")
			
			
			for (let i = 0; i < userContent.periodes.length; i++) {
				if ((Number(periodeElm.getAttribute("dateDebut")) <= userContent.periodes[i].dateDebut) && (userContent.periodes[i].dateFin <= Number(periodeElm.getAttribute("dateFin")))) {
					let existe = false;
					
					if (userContent.periodes[i].notes.modifier[subjectGrade] == undefined) userContent.periodes[i].notes.modifier[subjectGrade] = []
					
					for (let j = 0; j < userContent.periodes[i].notes.modifier[subjectGrade].length; j++) {
						if (userContent.periodes[i].notes.modifier[subjectGrade][j].gradeSimulationId == gradeSimulationId) {
							userContent.periodes[i].notes.modifier[subjectGrade][j].titre = titleGrade
							userContent.periodes[i].notes.modifier[subjectGrade][j].note = parseFloat(gradeValue)
							userContent.periodes[i].notes.modifier[subjectGrade][j].coeff = parseFloat(coeffGrade)
							userContent.periodes[i].notes.modifier[subjectGrade][j].quotient = parseFloat(quotientGrade)
							userContent.periodes[i].notes.modifier[subjectGrade][j].gradeModifId = gradeModifId
							existe = true;
						}
					}
					
					// If the subject not exist we add it and with the goal
					if (!existe) {
						userContent.periodes[i].notes.modifier[subjectGrade] = []
						// console.log(userContent, userContent.periodes[i].notes, userContent.periodes[i].notes[subjectGrade])
						userContent.periodes[i].notes.modifier[subjectGrade].push({
							"titre": titleGrade,
							"note": parseFloat(gradeValue),
							"coeff": parseFloat(coeffGrade),
							"quotient": parseFloat(quotientGrade),
							"gradeSimulationId": parseFloat(gradeSimulationId),
							"gradeModifId": gradeModifId
						});
					}
					
					// console.log(userContent, existe)
				}
			}
			
			simulationNote[index] = userContent  
			await globalThis.Utils.setData("simulationNote", simulationNote)
		} else {
			console.log("You are asking a very hard work")
		}
	}
	
	// console.log(++count)
	
	async function reloadNoteSimulation() {
		await globalThis.Utils.initUserSimulationNote(globalThis.userId)
		let simulationNote = await globalThis.Utils.getData("simulationNote")
		
		let userContent = simulationNote.find(item => {
			if (item) if (item.id) return item.id == globalThis.userId
		})
		
		let nomMatieres = document.querySelectorAll("[class *= 'nommatiere'] > b")
		let periodeElm = document.querySelector("ul[class *= 'tabs'] > li > [class *= 'nav-link active']")
		
		// console.log(userContent)

		for (let i = 0; i < nomMatieres.length; i++) {
			let pass = true
			let nomMatiere = nomMatieres[i].textContent
			
			if (userContent.periodes) {
				for (let j = 0; j < userContent.periodes.length; j++) {
					// console.log(periodeElm.getAttribute("dateDebut"), userContent.periodes[j].dateDebut, periodeElm.getAttribute("dateFin"), userContent.periodes[j].dateFin)
					if (Number(periodeElm.getAttribute("dateDebut")) <= userContent.periodes[j].dateDebut && userContent.periodes[j].dateFin <= Number(periodeElm.getAttribute("dateFin"))) {
						let notesMatiere = userContent.periodes[j].notes.modifier[nomMatieres[i].textContent]
						// console.log(notesMatiere, nomMatieres[i].textContent, userContent)
						if (!notesMatiere) continue
						
						for (let k = 0; k < notesMatiere.length; k++) {
							let subjectGrade = nomMatieres[i].textContent
							let titleGrade = notesMatiere[k].titre
							let gradeValue = notesMatiere[k].note
							let coeffGrade = notesMatiere[k].coeff
							let quotientGrade = notesMatiere[k].quotient
							let gradeSimulationId = notesMatiere[k].gradeSimulationId
							let gradeModifId = notesMatiere[k].gradeModifId
							let save = true
							
							console.log(subjectGrade, titleGrade, gradeValue, coeffGrade, quotientGrade, gradeModifId, false, gradeSimulationId, save)
							
							globalThis.Notes.modifierNote(subjectGrade, titleGrade, gradeValue, coeffGrade, quotientGrade, gradeModifId, false, gradeSimulationId, save)
						}
					}
				}
			}
		}
	}
	
	reloadNoteSimulation()
}