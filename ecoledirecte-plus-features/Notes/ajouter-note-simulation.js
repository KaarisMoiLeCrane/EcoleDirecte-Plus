globalThis.Notes.ajouterNoteSimulation = function () {
    // Selector to get the "Evaluations" button
    let buttonSelector = "ul.nav-pills > li.active"
    
    // Check if the text in the bottom was changed and then add the text "Note ajoutée pour simulation" if it was not changed
    if (!document.querySelector("[kmlc-text-note]")) {
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
        ajoutNote.addEventListener('click', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            // We get all the subjects name
            let matieres = document.querySelectorAll("span.nommatiere")
            let promptMatiere = `Ajoute une note dans l'une des matières suivantes :`
            
            // We sum them in the same string so the user can know what to right exactly to select the exact subject
            for (let i = 0; i < matieres.length; i++) promptMatiere += `
- "` + matieres[i].textContent + "\""
            
            // We ask which subject and then the grade, the coefficient and the quotient
            let promptMat = prompt(promptMatiere);
            if (promptMat != "" && promptMat != null) {
                // console.log(promptMat, promptMat != "", promptMat != null)
                promptTitre = prompt("Titre (Pour contextualiser la note)")
                if (promptTitre == "") promptTitre = "Évaluation"
                
                promptNote = prompt("Note (Un nombre seulement)")
                if (promptNote != "" && promptNote != null) {
                    promptNote = promptNote.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
                    
                    promptCoeff = prompt("Coefficient (Un nombre seulement)")
                    promptCoeff = promptCoeff.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
                    if (promptCoeff == "") promptCoeff = 1
                    
                    promptQuotient = prompt("Quotient (Un nombre seulement)")
                    promptQuotient = promptQuotient.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
                    if (promptQuotient == "") promptQuotient = 20
                    
                    // We add the grade
                    globalThis.Notes.ajouterNote(promptMat, promptTitre, promptNote, promptCoeff, promptQuotient)
                }
            }
        })
        
        document.querySelector(buttonSelector).parentElement.insertBefore(ajoutNote, document.querySelector(buttonSelector))
    }
}
