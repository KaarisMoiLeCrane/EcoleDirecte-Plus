globalThis.Notes.rang = function (note) {
    // If there is already two things with the class "coef" etc, it means that our new category "Rang" exist. If not, we apply our changes
    if (!document.querySelectorAll("th[class *= 'coef ng-star-inserted']")[1]) {
        
        // We clone the "coef" element and append it to his parent (the top part of the table) and then modify the text to "Rang"
        document.querySelector("th[class *= 'coef ng-star-inserted']").parentElement.appendChild(document.querySelector("th[class *= 'coef ng-star-inserted']").cloneNode(true))
        document.querySelectorAll("th[class *= 'coef ng-star-inserted']")[1].innerText = "Rang"
        
        // console.log(1, document.querySelector("th[class *= 'coef ng-star-inserted']"))
        
        // Get the coefficient of each subject
        let p = document.querySelectorAll("td[class *= 'coef ng-star-inserted']")
        
        // console.log(1.1, p)
        
        // For each coefficient element, we duplicate it to place it visually under the new "Rang" column
        for (let i = 0; i < p.length; i++) {
            let elm = p[i].cloneNode(true)
            let periode = document.querySelector("ul.nav-tabs > li.active")
            let periodeNum = [...periode.parentElement.children].indexOf(periode)
            
            // console.log(2, periode)
            
            // We change the coefficient with the "Rang" value
            // elm.children[0].innerText = (note.periodes[periodeNum].ensembleMatieres.disciplines[i].effectif - note.periodes[periodeNum].ensembleMatieres.disciplines[i].rang) + "/" + note.periodes[periodeNum].ensembleMatieres.disciplines[i].effectif
            elm.children[0].innerText = note.periodes[periodeNum].ensembleMatieres.disciplines[i].rang + "/" + note.periodes[periodeNum].ensembleMatieres.disciplines[i].effectif
            
            // For each element we add the class "text-center"
            elm.className = elm.className + " text-center"
            p[i].parentElement.appendChild(elm)
        }
    }
}