globalThis.Notes.ajouterNote = function (matiere, titre, note, coeff, quotient) {
    // Create the element containing the grade
    let noteElement = document.createElement("BUTTON")
    noteElement.setAttribute("kmlc-note-simu-temp", "true")
    
    let listMatiere = document.querySelectorAll("[class *= nommatiere]")
    
    /*
     * I can copy a grade and modify everything but for the moment I use the outerHTML. It's unreliable in the long term
     */
    for (let i = 0; i < listMatiere.length; i++) {
        if (listMatiere[i].textContent == matiere) {
            let noteCol = listMatiere[i].parentElement.parentElement
            
            if (noteCol.className.includes("kmlc-note-parent")) noteCol = noteCol.parentElement
            
            noteCol.querySelector("[class *= 'notes']").appendChild(noteElement)
            
            let buttonClass = document.querySelector("button.note") != null ? document.querySelector("button.note").className : "btn text-normal note margin-whitespace no-background no-padding ng-star-inserted"
            
            noteCol.querySelector("[kmlc-note-simu-temp]").outerHTML = '<button type="button" kmlc-note-simu="true" class="' + buttonClass + '" title=" ' + titre + '"><span class="valeur ng-star-inserted" style="color: green;"> ' + note + ' <sup class="coef ng-star-inserted"> ' + coeff + ' <span class="margin-whitespace"></span></sup><sub class="coef ng-star-inserted"> /' + quotient + ' <span class="margin-whitespace"></span></sub></span></button>'
        }
    }
    
    // We calculate the averages
    globalThis.Notes.calculerMoyennes(true, "kmlc-simu-moyenne-g", "color: green;", "kmlc-simu-moyenne", "color: green;", true)
    globalThis.Notes.calculerMoyennes(true, "kmlc-simu-modifier-moyenne-g", "border-bottom: 1px solid green; color: green;", "kmlc-simu-modifier-moyenne", "border-bottom: 1px solid green; color: green;")
    
    globalThis.Notes.modifierNote()
}