globalThis.Notes.ajouterNoteSimulation = function () {
    // Selector to get the "Evaluations" button
    let buttonSelector = "ul.nav-pills > li.active"
    
    // Check if the text in the bottom was changed and then add the text "Note ajoutée pour simulation" if it was not changed
    if (!document.querySelector("[kmlc-text-note]") && document.querySelector("table caption")) {
        let textSimu = document.querySelector("table caption").parentElement.getElementsByContentText("(note)").startsWith[0].cloneNode(true)
        textSimu.setAttribute("kmlc-text-note", "true")
        
        textSimu.children[0].textContent = "note"
        textSimu.children[0].setAttribute("style", "color: green;")
        textSimu.children[1].textContent = "Note ajoutée pour simulation"
        
        document.querySelector("table caption").parentElement.getElementsByContentText("(note)").startsWith[0].insertAfter(textSimu)
    }
    
    // If there is no button to add the grades then we add it
    if (!document.querySelector("[kmlc-bouton-note]")) {
        let ajoutNote = document.querySelector(buttonSelector).cloneNode(true)
        ajoutNote.className = ajoutNote.className.replace("active", "")
        ajoutNote.setAttribute("kmlc-bouton-note", "true")
        
        ajoutNote.children[0].removeAttribute("href")
        ajoutNote.children[0].children[0].textContent = "Ajouter une note"
        ajoutNote.addEventListener('click', async function(e) {
            e.stopPropagation()
            e.preventDefault()
			
			// We get the goals and we add them to a multi-line string
			// browser.storage.sync.remove("simulationNote")
			// console.log(simulationNote)
				
			// console.log(dummy == customSerialize(dummy))
			
			// let passInit = true
			
			// if (!Array.isArray(simulationNote)) {
				// simulationNote = [{"id": globalThis.userId, "periodes": []}]
				
				// await globalThis.Utils.setData("simulationNote", simulationNote)
				
				// passInit = false
			// }
			
			// let userContent = simulationNote.find(item => {
				// if (item) if (item.id) return item.id == globalThis.userId
			// });
			
			// console.log(userContent)
			
			// if (!userContent) {
				// userContent = {"id": globalThis.userId, "periodes": []}
				
				// console.log(userContent, userContent.periodes)
			// }
			
			// if (!userContent.periodes.length) {
				// console.log(3)
				// await globalThis.Utils.initUserSimulationNote(globalThis.userId);
				// console.log(4)
				// passInit = true
			// }
			
			// if (!passInit) await globalThis.Utils.initUserSimulationNote(globalThis.userId)
			
			// await console.log(globalThis.Utils.getData("simulationNote"))
				
			let popupID = "kmlc-simulationNote-popup"
			let blurID = "kmlc-simulationNote-blur"
			
			let popup = document.querySelector("#" + popupID)
			let blur = document.querySelector("#" + blurID)
			
			if (!popup) {
				// console.log(789, items.objectifMoyenne)
				let popupDatas = globalThis.Utils.initPopup(popupID, blurID)
				popup = popupDatas[0]
				blur = popupDatas[1]
				
				await changePopupInnerHTML(popup, blur)

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
			}
			
			popup.setAttribute("style", "width: 80%; height: 80%;");
			blur.setAttribute("style", "");
        })
        
        document.querySelector(buttonSelector).parentElement.insertBefore(ajoutNote, document.querySelector(buttonSelector))
    }

	async function changePopupInnerHTML(popup, blur) {
		await globalThis.Utils.initUserSimulationNote(globalThis.userId)
		let simulationNote = await globalThis.Utils.getData("simulationNote")
		
		let nomMatieres = document.querySelectorAll("[class *= 'nommatiere'] > b")
		let periodeElm = document.querySelector("ul[class *= 'tabs'] > li > [class *= 'nav-link active']")
		
		// console.log(simulationNote)

		let popupHTML = `
<h2>Ajouter des Notes pour Simulation</h2>
<ul class="kmlc-list">
`

		for (let i = 0; i < nomMatieres.length; i++) {
			let pass = true
			let nomMatiere = nomMatieres[i].textContent
			let nomMatiereSerialized = nomMatiere.replaceAll(/[^a-zA-Z0-9 ]/g, '').replaceAll(" ", "_")
			
			let userContent = simulationNote.find(item => {
				if (item) if (item.id) return item.id == globalThis.userId
			});
			
			// console.log(userContent)
			
			if (userContent.periodes) {
				// console.log(111111)
				for (let j = 0; j < userContent.periodes.length; j++) {
					// console.log(222222)
					let notesMatiere = userContent.periodes[j].notes.ajouter[nomMatiere]
					// console.log(notesMatiere)
					if (!notesMatiere) break
					
					// console.log(333333)
					// console.log(periodeElm.getAttribute("dateDebut") <= userContent.periodes[j].dateDebut, periodeElm.getAttribute("dateFin") >= userContent.periodes[j].dateFin)
					if (Number(periodeElm.getAttribute("dateDebut")) <= userContent.periodes[j].dateDebut && userContent.periodes[j].dateFin <= Number(periodeElm.getAttribute("dateFin"))) {
						popupHTML += `
  <ul class="kmlc-list">
    <li class="kmlc-item">
      <label class="kmlc-label">` + nomMatiere + `</label>
    </li>
    <li class="kmlc-item">
      <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-title-` + nomMatiereSerialized + `" placeholder="Entrez votre titre pour la note de ` + nomMatiereSerialized + `" value="` + notesMatiere[notesMatiere.length - 1].titre + `">
      <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-grade-` + nomMatiereSerialized + `" placeholder="Entrez votre note de ` + nomMatiereSerialized + `" value="` + notesMatiere[notesMatiere.length - 1].note + `">
    </li>
    <li class="kmlc-item">
      <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-coeff-` + nomMatiereSerialized + `" placeholder="Entrez votre coefficient pour la note de ` + nomMatiereSerialized + `" value="` + notesMatiere[notesMatiere.length - 1].coeff + `">
      <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-quotient-` + nomMatiereSerialized + `" placeholder="Entrez votre quotient de note de ` + nomMatiereSerialized + `" value="` + notesMatiere[notesMatiere.length - 1].quotient + `">
    </li>
	<input type="checkbox" class="kmlc-checkbox" id="kmlc-grade-simulation-button-save-` + nomMatiereSerialized + `">
	<label for="kmlc-grade-simulation-button-save-` + nomMatiereSerialized + `" class="kmlc-checkbox-label">Sauvegarder</label>
    <li class="kmlc-item">
      <button id="kmlc-add-grade-simulation-button-` + nomMatiereSerialized + `" class="kmlc-add-button" subject="` + nomMatiere + `">Ajouter la note</button>
    </li>
  </ul>`
						pass = false
						break
					}
				}
			}

			if (pass) {
				let nomMatiere = nomMatieres[i].textContent
				let nomMatiereSerialized = nomMatiere.replaceAll(/[^a-zA-Z0-9 ]/g, '').replaceAll(" ", "_")
				
				popupHTML += `
  <ul class="kmlc-list">
    <li class="kmlc-item">
      <label class="kmlc-label">` + nomMatiere + `</label>
    </li>
    <li class="kmlc-item">
      <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-title-` + nomMatiereSerialized + `" placeholder="Entrez votre titre pour la note de ` + nomMatiere + `">
      <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-grade-` + nomMatiereSerialized + `" placeholder="Entrez votre note de ` + nomMatiere + `">
    </li>
    <li class="kmlc-item">
      <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-coeff-` + nomMatiereSerialized + `" placeholder="Entrez votre coefficient pour la note de ` + nomMatiere + `">
      <input type="text" class="kmlc-input" id="kmlc-grade-simulation-input-quotient-` + nomMatiereSerialized + `" placeholder="Entrez votre quotient de note de ` + nomMatiere + `">
    </li>
	<input type="checkbox" class="kmlc-checkbox" id="kmlc-grade-simulation-button-save-` + nomMatiereSerialized + `">
	<label for="kmlc-grade-simulation-button-save-` + nomMatiereSerialized + `" class="kmlc-checkbox-label">Sauvegarder</label>
    <li class="kmlc-item">
      <button id="kmlc-add-grade-simulation-button-` + nomMatiereSerialized + `" class="kmlc-add-button" subject="` + nomMatiere + `">Ajouter la note</button>
    </li>
  </ul>`
			}
		}

		popupHTML += `
</ul>
<div class="kmlc-button-container">
  <button id="kmlc-remove-grade-simulation-button" class="kmlc-remove-button">Supprimer les notes ajoutées</button>
  <button id="kmlc-add-grade-simulation-button" class="kmlc-add-button">Valider les notes ajoutées</button>
</div>
`

		popup.innerHTML = popupHTML
		
		popup.querySelector("#kmlc-remove-grade-simulation-button").addEventListener('click', async function(e) {
			e.stopPropagation()
			e.preventDefault()
			
			// browser.storage.sync.remove("simulationNote")
			
			let inputBox = document.querySelectorAll('li[class = "kmlc-subject-item"] > input[type="text"][id *= kmlc-grade-simulation-input]')
			for (let i = 0; i < inputBox.length; i++) {
				inputBox[i].value = ''
			}
			
			await globalThis.Utils.initUserSimulationNote(globalThis.userId)
			let simulationNote = await globalThis.Utils.getData("simulationNote")
			
			// console.log(simulationNote)
			
			let userContent = simulationNote.find(item => {
				if (item) if (item.id) return item.id == globalThis.userId
			})
			
			let index = simulationNote.indexOf(userContent)
			
			userContent = {"id": globalThis.userId, "periodes": []}
			
			if (!simulationNote[index]) simulationNote.push(userContent)
			else simulationNote[index] = userContent
			
			// console.log(dummy, userContent, index, simulationNote)
			
			await globalThis.Utils.setData("simulationNote", simulationNote)
			
			// browser.storage.sync.set({["simulationNote"]: dummy}, function () {
				// if (browser.runtime.lastError) {
				  // console.error("Error setting data:", browser.runtime.lastError);
				// } else {
				  // console.log("Data set successfully.");
				// }
			  // });
			// console.log(1)
			
			await globalThis.Utils.initUserSimulationNote(globalThis.userId)
			// console.log(5)
			
			// applyGradeSimualtionGoal(popup)
			await changePopupInnerHTML(popup)
			
			let allSimuElements = Array.from(document.querySelectorAll('*')).filter(element => {
				const attributes = Array.from(element.attributes)
				return attributes.some(attr => attr.name.includes('kmlc-simu'))
			})
			
			for (let i = 0; i < allSimuElements.length; i++) {
				allSimuElements[i].remove()
			}
			
			allSimuElements = Array.from(document.querySelectorAll('*')).filter(element => {
				const attributes = Array.from(element.attributes)
				return attributes.some(attr => attr.name.includes('kmlc-note-simu'))
			})
			
			for (let i = 0; i < allSimuElements.length; i++) {
				allSimuElements[i].remove()
			}
		})
		
		popup.querySelector("#kmlc-add-grade-simulation-button").addEventListener('click', function(e) {
			e.stopPropagation()
			e.preventDefault()
			
			blur.click()
			globalThis.Notes.calculerMoyennes(true, "kmlc-simu-moyenne-g", "color: green;", "kmlc-simu-moyenne", "color: green;", true)
			globalThis.Notes.calculerMoyennes(true, "kmlc-simu-modifier-moyenne-g", "border-bottom: 1px solid green; color: green;", "kmlc-simu-modifier-moyenne", "border-bottom: 1px solid green; color: green;")
		})
		
		let addGradeButtons = popup.querySelectorAll("[id *= kmlc-add-grade-simulation-button-]")
		for (let i = 0; i < addGradeButtons.length; i++) {
			addGradeButtons[i].addEventListener('click', async function(e) {
				let subjectGrade = this.getAttribute("subject")
				let subjectGradeSerialized = subjectGrade.replaceAll(/[^a-zA-Z0-9 ]/g, '').replaceAll(" ", "_")
				
				// console.log(this, subjectGrade, this.parentElement.parentElement, this.parentElement.parentElement.querySelector("#" + "kmlc-grade-simulation-input-title-" + subjectGrade))
				
				let titleGrade = this.parentElement.parentElement.querySelector("#" + "kmlc-grade-simulation-input-title-" + subjectGradeSerialized).value
				let gradeValue = this.parentElement.parentElement.querySelector("#" + "kmlc-grade-simulation-input-grade-" + subjectGradeSerialized).value.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
				let coeffGrade = this.parentElement.parentElement.querySelector("#" + "kmlc-grade-simulation-input-coeff-" + subjectGradeSerialized).value.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
				let quotientGrade = this.parentElement.parentElement.querySelector("#" + "kmlc-grade-simulation-input-quotient-" + subjectGradeSerialized).value.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
				let save = this.parentElement.parentElement.querySelector("#" + "kmlc-grade-simulation-button-save-" + subjectGradeSerialized).checked
				// console.log(save, this.parentElement.parentElement)
				
				if (gradeValue != "" && gradeValue != null) {
					if (titleGrade == "" || titleGrade == null) titleGrade = "Évaluation"
					
					if (coeffGrade == "" || coeffGrade == null) coeffGrade = "1"
					
					if (quotientGrade == "" || quotientGrade == null || quotientGrade) quotientGrade = globalThis.quotient
					
					let dateNow = Date.now();
					
					await applyGradeSimulationGoal(subjectGrade, titleGrade, gradeValue, coeffGrade, quotientGrade, dateNow, save)
					
					let inputBoxes = this.parentElement.parentElement.querySelectorAll("input")
					for (let j = 0; j < inputBoxes.length; j++) {
						inputBoxes[j].value = ''
					}
					
					// globalThis.Notes.calculerMoyennes(true, "kmlc-simu-moyenne-g", "color: green;", "kmlc-simu-moyenne", "color: green;", true)
					// globalThis.Notes.calculerMoyennes(true, "kmlc-simu-modifier-moyenne-g", "border-bottom: 1px solid green; color: green;", "kmlc-simu-modifier-moyenne", "border-bottom: 1px solid green; color: green;")
				}
			})
		}
	}
	
	async function applyGradeSimulationGoal(subjectGrade, titleGrade, gradeValue, coeffGrade, quotientGrade, idGrade, save) {
		globalThis.Notes.ajouterNote(subjectGrade, titleGrade, gradeValue, coeffGrade, quotientGrade, idGrade, save)
		
		if (!save) return
		
		await globalThis.Utils.initUserSimulationNote(globalThis.userId)
		let simulationNote = await globalThis.Utils.getData("simulationNote")
		// let dataPeriodes = globalThis.Notes.dataPeriodes
		
		// console.log(simulationNote)
		
		let userContent = simulationNote.find(item => {
			if (item) if (item.id) return item.id == globalThis.userId
		});
		
		let index = simulationNote.indexOf(userContent)
		
		// console.log(userContent, index)
		
		// Check if the user already add a goal for the student. If not we create the goal array under the student object.
		// if (!userContent.periodes.length) {
			// console.log(2)
			// await globalThis.Utils.initUserSimulationNote(globalThis.userId)
			// console.log(6)
			
			// simulationNote = browser.storage.sync.get({"simulationNote": []})
			
			// simulationNote = await globalThis.Utils.getData("simulationNote")
		// }
		
		// console.log(simulationNote)
		
		let existe = false;
		let periodeElm = document.querySelector("ul[class *= 'tabs'] > li > [class *= 'nav-link active']")

		for (let j = 0; j < userContent.periodes.length; j++) {
			// If the subject exist we add the goal
			
			// console.log(periodeElm.getAttribute("dateDebut"), userContent.periodes[j].dateDebut, periodeElm.getAttribute("dateFin"), userContent.periodes[j].dateFin)
			// console.log((Number(periodeElm.getAttribute("dateDebut")) <= userContent.periodes[j].dateDebut), (userContent.periodes[j].dateFin <= Number(periodeElm.getAttribute("dateFin"))))
			
			if ((Number(periodeElm.getAttribute("dateDebut")) <= userContent.periodes[j].dateDebut) && (userContent.periodes[j].dateFin <= Number(periodeElm.getAttribute("dateFin")))) {
				if (userContent.periodes[j].notes.ajouter[subjectGrade]) {
					userContent.periodes[j].notes[subjectGrade].ajouter.push({
						"titre": titleGrade,
						"note": gradeValue,
						"coeff": coeffGrade,
						"quotient": quotientGrade,
						"id": idGrade
					})
					existe = true;
				}
				
				// If the subject not exist we add it and with the goal
				if (!existe) {
					userContent.periodes[j].notes.ajouter[subjectGrade] = []
					// console.log(userContent, userContent.periodes[j].notes, userContent.periodes[j].notes[subjectGrade])
					userContent.periodes[j].notes.ajouter[subjectGrade].push({
						"titre": titleGrade,
						"note": gradeValue,
						"coeff": coeffGrade,
						"quotient": quotientGrade,
						"id": idGrade
					});
				}
			}
		}
		
		// browser.storage.sync.set({["simulationNote"]: simulationNote}, function () {
			// if (browser.runtime.lastError) {
			  // console.error("Error setting data:", browser.runtime.lastError);
			// } else {
			  // console.log("Data set successfully.");
			// }
		  // });
		  
		simulationNote[index] = userContent
		
		// console.log(userContent)
		  
		await globalThis.Utils.setData("simulationNote", simulationNote)
		
		// console.log(simulationNote)
		
		// objectifValueListener()
	}
	
	async function reloadNoteSimulation() {
		// console.log(123456789) 
		
		await globalThis.Utils.initUserSimulationNote(globalThis.userId)
		let simulationNote = await globalThis.Utils.getData("simulationNote")
		// let passInit = true
		
		// if (!Array.isArray(simulationNote)) {
			// simulationNote = [{"id": globalThis.userId, "periodes": []}]
			
			// console.log(simulationNote)
			
			// await globalThis.Utils.setData("simulationNote", simulationNote)
			
			// passInit = false
		// }
		
		let userContent = simulationNote.find(item => {
			if (item) if (item.id) return item.id == globalThis.userId
		})
		
		// if (!userContent) {
			// userContent = {"id": globalThis.userId, "periodes": []}
			
			// console.log(userContent, userContent.periodes)
			
			// if (!userContent.periodes.length) {
				// console.log(3)
				// await globalThis.Utils.initUserSimulationNote(globalThis.userId);
				// console.log(4)
			// }
		// }
		
		// if (!passInit) await globalThis.Utils.initUserSimulationNote(globalThis.userId)
		
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
						let notesMatiere = userContent.periodes[j].notes.ajouter[nomMatieres[i].textContent]
						if (!notesMatiere) break
						
						for (let k = 0; k < notesMatiere.length; k++) {
							let subjectGrade = nomMatieres[i].textContent
							let titleGrade = notesMatiere[k].titre
							let gradeValue = notesMatiere[k].note
							let coeffGrade = notesMatiere[k].coeff
							let quotientGrade = notesMatiere[k].quotient
							let idGrade = notesMatiere[k].id
							let save = true
							
							globalThis.Notes.ajouterNote(subjectGrade, titleGrade, gradeValue, coeffGrade, quotientGrade, idGrade, save)
						}
					}
				}
			}
		}
	}
	
	reloadNoteSimulation()
}

// function customSerialize(object) {
	// if (Array.isArray(object)) {
		// return object.map(item => customSerialize(item))
	// } else if (typeof object === 'object' && object !== null) {
		// const serializableobject = {}

		// for (const key in object) {
			// if (object.hasOwnProperty(key)) {
				// serializableobject[key] = customSerialize(object[key])
			// }
		// }

		// return serializableobject
	// } else {
		// return object
	// }
// }