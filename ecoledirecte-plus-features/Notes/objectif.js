globalThis.Notes.objectifSetup = function () {
    // Selector to get the "Evaluations" button
    let buttonSelector = "ul.nav-pills > li.active"
    
    // If there is no button to see the goals then we add it
    if (!document.querySelector("#kmlc-bouton-objectif")) {
		
		// We duplicate the "Evaluations" button, we add the attribute to know that he exist, and we add the click listener
        let objectifButton = document.querySelector(buttonSelector).cloneNode(true)
        objectifButton.id = "kmlc-bouton-objectif"
        
        objectifButton.children[0].removeAttribute("href")
        objectifButton.children[0].children[0].textContent = "Objectifs"
        objectifButton.addEventListener('click', async function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            // We get the goals and we add them to a multi-line string
            // browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
			
			// browser.storage.sync.remove("objectifMoyenne")
			
			await globalThis.Utils.initUserObjectif(globalThis.userId)
			let objectifMoyenne = await globalThis.Utils.getData("objectifMoyenne")
			// console.log(objectifMoyenne)
				
			// console.log(dummy == customSerialize(dummy))
			
			// let passInit = true
			
			// if (!Array.isArray(objectifMoyenne)) {
				// objectifMoyenne = [{"id": globalThis.userId, "periodes": []}]
				
				// await globalThis.Utils.setData("objectifMoyenne", objectifMoyenne)
				
				// passInit = false
			// }
			
			// let userContent = objectifMoyenne.find(item => {
				// if (item) if (item.id) return item.id == globalThis.userId
			// });
			
			// console.log(userContent)
			
			// if (!userContent) {
				// userContent = {"id": globalThis.userId, "periodes": []}
				
				// console.log(userContent, userContent.periodes)
				
				// if (!userContent.periodes.length) {
					// console.log(3)
					// await globalThis.Utils.initUserObjectif(globalThis.userId);
					// console.log(4)
				// }
			// }
			
			// console.log(userContent)
			
			// if (!passInit) await globalThis.Utils.initUserObjectif(globalThis.userId)
			
			let popupID = "kmlc-objectif-popup"
			let blurID = "kmlc-objectif-blur"
			
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
				
				let goalInputs = document.querySelectorAll('[id *= kmlc-goal-input]');

				goalInputs.forEach(function(input) {
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
            // })
        })
        
        document.querySelector(buttonSelector).parentElement.insertBefore(objectifButton, document.querySelector(buttonSelector))
    }
    
	// browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
		// ajouterObjectifNote(items.objectifMoyenne)
	// })
	
	async function changePopupInnerHTML(popup, blur) {
		// browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
		// console.log(items.objectifMoyenne)
		let nomMatieres = document.querySelectorAll("[class *= 'nommatiere'] > b")
		let objectifMoyenne = await globalThis.Utils.getData("objectifMoyenne")
		let periodeElm = document.querySelector("ul[class *= 'tabs'] > li > [class *= 'nav-link active']")

		let popupHTML = `
<h2>Objectif de Note pour l'Année</h2>
<ul class="kmlc-list">
`

		for (let i = 0; i < nomMatieres.length; i++) {
			let pass = true
			let nomMatiere = nomMatieres[i].textContent
			let nomMatiereSerialized = nomMatiere.replaceAll(/[^a-zA-Z0-9 ]/g, '').replaceAll(" ", "_")
			
			let userContent = objectifMoyenne.find(item => {
				if (item) if (item.id) return item.id == globalThis.userId
			});
			
			// console.log(userContent)
			
			if (userContent.periodes) {
				// console.log(111111)
				for (let j = 0; j < userContent.periodes.length; j++) {
					// console.log(222222)
					let noteMatiere = userContent.periodes[j].objectif[nomMatieres[i].textContent]
					// console.log(notesMatiere)
					if (!noteMatiere) break
					
					// console.log(333333)
					// console.log(periodeElm.getAttribute("dateDebut") <= userContent.periodes[j].dateDebut, periodeElm.getAttribute("dateFin") >= userContent.periodes[j].dateFin)
					if (Number(periodeElm.getAttribute("dateDebut")) <= userContent.periodes[j].dateDebut && userContent.periodes[j].dateFin <= Number(periodeElm.getAttribute("dateFin"))) {
						popupHTML += `
  <li class="kmlc-item">
    <label class="kmlc-label">` + nomMatiere + `</label>
    <input type="text" class="kmlc-input" id="kmlc-goal-input-` + nomMatiereSerialized + `" subject="` + nomMatiere + `" placeholder="Entrez votre objectif de note pour ` + nomMatiere + `" value="` + noteMatiere.note + `">
	<div class="kmlc-label">
      <input type="checkbox" class="kmlc-checkbox" id="kmlc-goal-button-save-` + nomMatiereSerialized + `">
	  <label for="kmlc-goal-button-save-` + nomMatiereSerialized + `" class="kmlc-checkbox-label">Sauvegarder</label>
    </div>
  </li>`
						pass = false
						break
					}
				}
			}

			if (pass) {
				let nomMatiere = nomMatieres[i].textContent
				let nomMatiereSerialized = nomMatiere.replaceAll(/[^a-zA-Z0-9 ]/g, '').replaceAll(" ", "_")
				
				popupHTML += `
  <li class="kmlc-item">
    <label class="kmlc-label">` + nomMatiere + `</label>
    <input type="text" class="kmlc-input" id="kmlc-goal-input-` + nomMatiereSerialized + `" subject="` + nomMatiere + `" placeholder="Entrez votre objectif de note pour ` + nomMatiere + `">
	<div class="kmlc-label">
	  <input type="checkbox" class="kmlc-checkbox" id="kmlc-goal-button-save-` + nomMatiereSerialized + `">
	  <label for="kmlc-goal-button-save-` + nomMatiereSerialized + `" class="kmlc-checkbox-label">Sauvegarder</label>
	</div>
  </li>`
			}
		}

		popupHTML += `
</ul>
<div class="kmlc-button-container">
  <button id="kmlc-remove-objectif-button" class="kmlc-remove-button">Supprimer les objectifs</button>
  <button id="kmlc-add-objectif-button" class="kmlc-add-button">Valider les objectifs</button>
</div>
`

		popup.innerHTML = popupHTML
		
		popup.querySelector("#kmlc-remove-objectif-button").addEventListener('click', async function(e) {
			e.stopPropagation()
			e.preventDefault()
			
			let inputBox = document.querySelectorAll('li[class = "kmlc-subject-item"] > input[type="text"][id *= kmlc-goal-input]')
			for (let i = 0; i < inputBox.length; i++) {
				inputBox[i].value = ''
			}
			
			// let dummy = items.objectifMoyenne
			// dummy[id] = []
			
			await globalThis.Utils.initUserObjectif(globalThis.userId)
			let objectifMoyenne = await globalThis.Utils.getData("objectifMoyenne")
			
			// console.log(objectifMoyenne)
			
			let userContent = objectifMoyenne.find(item => {
				if (item) if (item.id) return item.id == globalThis.userId
			})
			
			let index = objectifMoyenne.indexOf(userContent)
			
			userContent = {"id": globalThis.userId, "periodes": []}
			
			if (!objectifMoyenne[index]) objectifMoyenne.push(userContent)
			else objectifMoyenne[index] = userContent
			
			// console.log(dummy, userContent, index)
			
			await globalThis.Utils.setData("objectifMoyenne", objectifMoyenne)
			
			// browser.storage.sync.set({["simulationNote"]: dummy}, function () {
				// if (browser.runtime.lastError) {
				  // console.error("Error setting data:", browser.runtime.lastError);
				// } else {
				  // console.log("Data set successfully.");
				// }
			  // });
			// console.log(1)
			
			await globalThis.Utils.initUserObjectif(globalThis.userId)
			// console.log(5)
			
			// applyGradeSimualtionGoal(popup)
			await changePopupInnerHTML(popup, blur)
			
			// browser.storage.sync.set({"objectifMoyenne": dummy})
			
			let tooltip = document.querySelectorAll("[kmlc-objectif][class *= kmlc-tooltip]")
			for (let i = 0; i < tooltip.length; i++) {
				tooltip[i].remove()
			}
			
			let moyenneSet = document.querySelectorAll("[kmlc-objectif-moyenne-set]")
			for (let i = 0; i < moyenneSet.length; i++) {
				moyenneSet[i].removeAttribute("kmlc-objectif-moyenne-set")
				moyenneSet[i].removeAttribute("style")
				moyenneSet[i].className = moyenneSet[i].className.replace(" kmlc-note-parent")
			}
		})
		
		popup.querySelector("#kmlc-add-objectif-button").addEventListener('click', async function(e) {
			e.stopPropagation()
			e.preventDefault()
			
			blur.click()
			
			let inputBox = document.querySelectorAll('[id *= kmlc-goal-input-]')
			
			for (let i = 0; i < inputBox.length; i++) {
				let inputBoxValue = inputBox[i].value.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
				// console.log(inputBoxValue)
				
				// if (inputBoxValue != '') {
					let subjectGrade = inputBox[i].getAttribute("subject")
					let subjectGradeSerialized = subjectGrade.replaceAll(/[^a-zA-Z0-9 ]/g, '').replaceAll(" ", "_")
					
					// console.log(this, subjectGrade, this.parentElement, this.parentElement.parentElement)
					
					let gradeValue = inputBox[i].value.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
					let save = this.parentElement.parentElement.querySelector("#" + "kmlc-goal-button-save-" + subjectGradeSerialized).checked
					
					// if (gradeValue != "" && gradeValue != null) {
						let dateNow = Date.now();
						
						await applyMeanGoal(subjectGrade, gradeValue, dateNow, save)
						
						// globalThis.Notes.calculerMoyennes(true, "kmlc-simu-moyenne-g", "color: green;", "kmlc-simu-moyenne", "color: green;", true)
						// globalThis.Notes.calculerMoyennes(true, "kmlc-simu-modifier-moyenne-g", "border-bottom: 1px solid green; color: green;", "kmlc-simu-modifier-moyenne", "border-bottom: 1px solid green; color: green;")
					// }
				// }
			}
		})
		// })
	}

	async function applyMeanGoal(subjectGrade, gradeValue, idGrade, save) {
		globalThis.Notes.ajouterObjectifNote(subjectGrade, gradeValue, idGrade)
		// console.log(1111)
		if (!save) return
		
		await globalThis.Utils.initUserObjectif(globalThis.userId)
		let objectifMoyenne = await globalThis.Utils.getData("objectifMoyenne")
		// let dataPeriodes = globalThis.Notes.dataPeriodes
		
		// Create the goal section associated with the id of the student
		let userContent = objectifMoyenne.find(item => {
			if (item) if (item.id) return item.id == globalThis.userId
		});
		
		let index = objectifMoyenne.indexOf(userContent)
		
		// Check if the user already add a goal for the student. If not we create the goal array under the student object.
		// if (!userContent.periodes) {
			// console.log(2)
			// await globalThis.Utils.initUserObjectif(globalThis.userId)
			// console.log(6)
			
			// objectifMoyenne = browser.storage.sync.get({"objectifMoyenne": []})
			
			// objectifMoyenne = await globalThis.Utils.getData("objectifMoyenne")
		// }
		
		let periodeElm = document.querySelector("ul[class *= 'tabs'] > li > [class *= 'nav-link active']")

		for (let j = 0; j < userContent.periodes.length; j++) {
			// If the subject exist we add the goal
			
			// console.log(periodeElm.getAttribute("dateDebut"), userContent.periodes[j].dateDebut, periodeElm.getAttribute("dateFin"), userContent.periodes[j].dateFin)
			// console.log((Number(periodeElm.getAttribute("dateDebut")) <= userContent.periodes[j].dateDebut), (userContent.periodes[j].dateFin <= Number(periodeElm.getAttribute("dateFin"))))
			
			if ((Number(periodeElm.getAttribute("dateDebut")) <= userContent.periodes[j].dateDebut) && (userContent.periodes[j].dateFin <= Number(periodeElm.getAttribute("dateFin")))) {
				userContent.periodes[j].objectif[subjectGrade] = {}
				// console.log(userContent, userContent.periodes[j].objectif, userContent.periodes[j].objectif[subjectGrade])				
				userContent.periodes[j].objectif[subjectGrade]["note"] = gradeValue
				userContent.periodes[j].objectif[subjectGrade]["id"] = idGrade
				
				if (gradeValue == "") delete userContent.periodes[j].objectif[subjectGrade]
			}
		}
		
		// browser.storage.sync.set({["objectifMoyenne"]: objectifMoyenne}, function () {
			// if (browser.runtime.lastError) {
			  // console.error("Error setting data:", browser.runtime.lastError);
			// } else {
			  // console.log("Data set successfully.");
			// }
		  // });
		  
		objectifMoyenne[index] = userContent
		
		// console.log(subjectGrade, objectifMoyenne)
		
		await globalThis.Utils.setData("objectifMoyenne", objectifMoyenne)
		
		// console.log(objectifMoyenne)
	}
	
	async function reloadObjectifNote() {
		// console.log(123456789) 
		
		await globalThis.Utils.initUserObjectif(globalThis.userId)
		let objectifMoyenne = await globalThis.Utils.getData("objectifMoyenne")
		// let passInit = true
		
		// if (!Array.isArray(objectifMoyenne)) {
			// objectifMoyenne = [{"id": globalThis.userId, "periodes": []}]
			
			// await globalThis.Utils.setData("objectifMoyenne", objectifMoyenne)
			
			// passInit = false
		// }
		
		let userContent = objectifMoyenne.find(item => {
			if (item) if (item.id) return item.id == globalThis.userId
		})
		
		// let index = objectifMoyenne.indexOf(userContent)
		
		// if (!userContent) {
			// userContent = {"id": globalThis.userId, "periodes": []}
			
			// console.log(userContent, userContent.periodes)
			
			// if (!userContent.periodes.length) {
				// console.log(3)
				// await globalThis.Utils.initUserObjectif(globalThis.userId);
				// console.log(4)
			// }
		// } else {
			// for (let j = 0; j < userContent.periodes.length; j++) {
				// if (userContent.periodes[j].objectif) {
					// for (let key in userContent.periodes[j].objectif) {
						// if (userContent.periodes[j].objectif.hasOwnProperty(key)) {
							// if (Array.isArray(userContent.periodes[j].objectif[key])) {
								// userContent.periodes[j].objectif[key] = {
									// "note": userContent.periodes[j].objectif[key][userContent.periodes[j].objectif[key].length - 1].note,
									// "id": Date.now()
								// }
							// }
						// }
					// }
				// }
			// }
			
			// console.log(userContent, index, objectifMoyenne)
			
			// objectifMoyenne[index] = userContent
			
			// await globalThis.Utils.setData("objectifMoyenne", objectifMoyenne)
		// }
		
		// if (!passInit) await globalThis.Utils.initUserObjectif(globalThis.userId)
		
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
						let noteMatiere = userContent.periodes[j].objectif[nomMatieres[i].textContent]
						if (!noteMatiere) break
						
						let subjectGrade = nomMatieres[i].textContent
						let gradeValue = noteMatiere.note
						let idGrade = noteMatiere.id
						
						globalThis.Notes.ajouterObjectifNote(subjectGrade, gradeValue, idGrade)
					}
				}
			}
		}
	}
	
	reloadObjectifNote()
}