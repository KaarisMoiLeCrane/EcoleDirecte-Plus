globalThis.Notes.modifierNote = function (matiere, titre, note, coeff, quotient, gradeModifId, gradeElement = false, gradeSimulationId = false, save = false, calc = true) {
	let pass = true
	
	if (!gradeSimulationId) pass = false
	
	if (!gradeElement || typeof gradeElement != "object") {
		if (document.querySelector("[id = '" + gradeSimulationId + "']")) {
			gradeElement = document.querySelector("[id = '" + gradeSimulationId + "']").querySelector("[class *= valeur]")
			pass = true
		} else {
			console.log("You are asking a very hard thing")
			
			pass = false
			
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
				
				FOR UNSAVED GRADES, WE CAN EDIT WITHOUT SAVING THEM :'
				
				If each grade had an ID defined by EcoleDirecte and set by them, it would be perfect.
				
				KMLC
			*/
		}
	}
	
	if (matiere != "" && titre != "" && coeff != "" && quotient != "" && pass) {
		// Add the attribute to know that the grade has been modified
		gradeElement.parentElement.setAttribute("kmlc-note-simu-modifier", "true")

		// Set the the initial grade, initial coefficient and initial quotient to parameters in the element
		gradeElement.parentElement.setAttribute("ancienTitre", gradeElement.parentElement.getAttribute("title"))
		
		if (gradeElement.getAttribute("ancienneNote") == null)
			gradeElement.setAttribute("ancienneNote", gradeElement.childNodes[0].nodeValue.replace(/[\/\s]/g, "").replace(",", "."))

		if (gradeElement.querySelector("sup")) {
			if (gradeElement.getAttribute("ancienCoeff") == null)
				gradeElement.setAttribute("ancienCoeff", " (" + gradeElement.querySelector("sup").textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "") + ") ")
		} else {
			if (gradeElement.getAttribute("ancienCoeff") == null)
				gradeElement.setAttribute("ancienCoeff", "")
		}

		if (gradeElement.querySelector("sub")) {
			if (gradeElement.getAttribute("ancienQuotient") == null)
				gradeElement.setAttribute("ancienQuotient", "/" + gradeElement.querySelector("sub").textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
		} else {
			if (gradeElement.getAttribute("ancienQuotient") == null)
				gradeElement.setAttribute("ancienQuotient", "")
		}
		
		
		// Change the grade
		gradeElement.childNodes[0].nodeValue = " " + note + " "
		
		// Change the title
		gradeElement.parentElement.setAttribute("title", titre)
		
		// Change/Add the coefficient
		if (gradeElement.querySelector("sup")) {
			gradeElement.querySelector("sup").textContent = " (" + coeff + ") "
		} else {
			let supElement = document.createElement("SUP")
			supElement.setAttribute("kmlc-sup-modifier", "true")
			
			gradeElement.appendChild(supElement)
			
			gradeElement.querySelector("sup").outerHTML = '<sup class="coef ng-star-inserted"> (' + coeff + ') <span class="margin-whitespace"></span></sup>'
		}

		// Change/Add the quotient
		if (gradeElement.querySelector("sub")) {
			gradeElement.querySelector("sub").textContent = "/" + quotient + " "
		} else {
			let subElement = document.createElement("SUB")
			subElement.setAttribute("kmlc-sub-modifier", "true")
			
			gradeElement.appendChild(subElement)
			
			gradeElement.querySelector("sub").outerHTML = '<sub class="coef ng-star-inserted"> /' + quotient + ' <span class="margin-whitespace"></span></sub>'
		}
		
		
		// Add the one pixel green underline
		if (gradeElement.getAttribute("style")) {
			gradeElement.setAttribute("style", gradeElement.getAttribute("style").replace("border-bottom: 1px solid green;", "") + " border-bottom: 1px solid green;")
		} else {
			gradeElement.setAttribute("style", "border-bottom: 1px solid green;")
		}	
	}
    
    // We calculate the averages
	if (calc) {
		globalThis.Notes.calculerMoyennes(true, "kmlc-simu-modifier-moyenne-g", "border-bottom: 1px solid green; color: green;", "kmlc-simu-modifier-moyenne", "border-bottom: 1px solid green; color: green;")
    }
	
    // globalThis.Notes.modifierNoteSimulation()
	
	return pass
}