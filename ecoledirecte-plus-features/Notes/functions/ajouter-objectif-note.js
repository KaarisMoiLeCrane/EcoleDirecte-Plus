globalThis.Notes.ajouterObjectifNote = function (subjectGrade, gradeValue, idGrade) {
	// console.log(123)
	let matieres = document.querySelectorAll("[class *= 'nommatiere']")
	
	// browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
	// console.log(items.objectifMoyenne)
	// let dummy = items.objectifMoyenne;
	
	for (let i = 0; i < matieres.length; i++) {
		let matiere = matieres[i]
		
		// console.log(matiere, matiere.textContent, subjectGrade, subjectGrade == matiere.textContent)
		if (matiere.textContent == subjectGrade) {
			let subjectLine = matiere.parentElement
			
			if (subjectLine.getAttribute("kmlc-variation")) subjectLine = subjectLine.parentElement.parentElement
			else subjectLine = subjectLine.parentElement
			
			let moyenne = subjectLine.querySelector("[kmlc-moyenne]")
			
			// console.log(matiere, subjectLine, subjectLine.getAttribute("kmlc-variation"), moyenne, gradeValue, gradeValue == "")
			
			if (!moyenne) return
			
			if (gradeValue == "") {
				if (moyenne.parentElement.getAttribute("kmlc-objectif-moyenne-set")) {
					moyenne.parentElement.querySelector("span[class *= 'kmlc-tooltip']").remove()
					moyenne.parentElement.removeAttribute("style")
				}
			} else {
				// console.log(!(!moyenne), matiere, matiere.textContent, subjectGrade, subjectGrade == matiere.textContent)
			
				let matiereNote = parseFloat(moyenne.textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")) // Complete cleaning
				let tooltipClass = " kmlc-tooltip-red"
				
				// console.log(matiereNote)
				
				if (matiereNote > gradeValue) {
					backgroundColor = " background-color: rgb(0, 255, 0, 0.5);"
					tooltipClass = " kmlc-tooltip-green"
				} else if (matiereNote < gradeValue) {
					backgroundColor = " background-color: rgb(255, 0, 0, 0.5);"
					tooltipClass = " kmlc-tooltip-red"
				} else {
					backgroundColor = " background-color: rgb(255, 255, 255);"
					tooltipClass = ""
				}
				
				if (matiereNote.toString().split(".")[0] == gradeValue.toString().split(".")[0]) {
					backgroundColor = " background-color: rgb(255, 127.5, 0, 0.5);"
					tooltipClass = " kmlc-tooltip-orange"
				}
				
				if (!moyenne.parentElement.getAttribute("kmlc-objectif-moyenne-set")) {
					// console.log("objectif 2", backgroundColor, gradeValue, matiereNote)
					
					moyenne.parentElement.className += " kmlc-note-parent"
					
					let dummy = moyenne.cloneNode(true)
					dummy.className += tooltipClass
					dummy.textContent = "Objectif de " + gradeValue
					dummy.setAttribute("kmlc-objectif", "true")
					dummy.removeAttribute("kmlc-moyenne")
					
					moyenne.parentElement.appendChild(dummy)
					
					moyenne.parentElement.setAttribute("style", backgroundColor)
					
					moyenne.parentElement.setAttribute("kmlc-objectif-moyenne-set", "true")
				} else {
					// console.log("objectif 2", backgroundColor, gradeValue, matiereNote)
					
					let dummy = moyenne.parentElement.querySelector("span[class *= 'kmlc-tooltip']")
					dummy.className = tooltipClass
					dummy.textContent = "Objectif de " + gradeValue
					dummy.setAttribute("kmlc-objectif", "true")
					
					moyenne.parentElement.setAttribute("style", backgroundColor)
				}
			}
		}
	}
}