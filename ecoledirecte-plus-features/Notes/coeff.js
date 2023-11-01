globalThis.Notes.coeff = function (note) {
    let elementClass = "'relevemoyenne ng-star-inserted'"
    
    // If there is already an element with the class "Coef", it means that the category "Coef" exist. If not, we apply our changes
    if (!document.querySelector("th[class *= 'coef ng-star-inserted']")) {
        
        // We clone the "MOYENNES" element and append it to his parent (the top part of the table) and then modify the text to "COEF."
        let dupElm = document.querySelector("th[class *= " + elementClass + "]").cloneNode(true)
        dupElm.innerText = "COEF."
        dupElm.setAttribute("class", "coef ng-star-inserted")
        
        document.querySelector("th[class *= " + elementClass + "]").parentElement.insertBefore(dupElm, document.querySelector("th[class *= " + elementClass + "]").parentElement.querySelector("[class *= relevemoyenne]"))
        
        // console.log(1, document.querySelector("th[class *= 'coef ng-star-inserted']"))
        
        // Get the means of each subject (each row of the column "MOYENNES")
        let p = document.querySelectorAll("td[class *= " + elementClass + "]")
        
        // console.log(1.1, p)
        
        // For each means element, we duplicate it to place it visually under the new "COEF." column
        for (let i = 0; i < p.length; i++) {
            let elm = p[i].cloneNode(true)
            let periode = document.querySelector("ul.nav-tabs > li.active")
            let periodeNum = [...periode.parentElement.children].indexOf(periode)
            
            // console.log(2, periode)
            
            // We change the mean with the "Coef" value
            // elm.children[0].innerText = note.periodes[periodeNum].ensembleMatieres.disciplines[i].coef
            
			let rangCase = elm.children[0] ? elm.children[0] : elm
			
			rangCase.innerText = note.periodes[periodeNum].ensembleMatieres.disciplines[i].coef
            
            // For each element we add the class "text-center"
            elm.className = elm.className.replace("relevemoyenne", "coef") + " text-center"
            p[i].parentElement.insertBefore(elm, p[i].parentElement.querySelector("[class *= 'relevemoyenne']"))
        }
    }
}