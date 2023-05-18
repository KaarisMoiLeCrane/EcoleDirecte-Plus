globalThis.Notes.calculerVariationMoyenne = function (disciplineElmExclusion, ajouterVariation = false) {
    let moyenneMat = 0
    let moyennes = document.querySelectorAll("[kmlc-moyenne]")
    let moyenneG = parseFloat(document.querySelector("[kmlc-moyenne-g]").innerText.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
    
    let coeff = document.querySelectorAll("[kmlc-moyenne]")
    let coeffTot = 0
    let coeffMat = 0
    
    for (let i = 0; i < coeff.length; i++) {
        coeffTot += parseFloat(coeff[i].parentElement.parentElement.querySelector("[class *= coef]").innerText.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
    }
    
    if (disciplineElmExclusion instanceof HTMLElement) {
        for (let i = 0; i < moyennes.length; i++) {
            if (moyennes[i].parentElement.parentElement.querySelector("[class *= discipline]") == disciplineElmExclusion) {
                moyenneMat += parseFloat(moyennes[i].innerText.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
                coeffMat += parseFloat(moyennes[i].parentElement.parentElement.querySelector("[class *= coef]").innerText.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
                
                break
            }
        }
    } else if (disciplineElmExclusion instanceof Object) {
        for (let i = 0; i < disciplineElmExclusion.length; i++) {
            for (let j = 0; j < moyennes.length; j++) {
                if (moyennes[j].parentElement.parentElement.querySelector("[class *= discipline]") == disciplineElmExclusion[i]) {
                    moyenneMat += parseFloat(moyennes[j].innerText.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
                    coeffMat += parseFloat(moyennes[j].parentElement.parentElement.querySelector("[class *= coef]").innerText.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
                    
                    break
                }
            }
        }
    }
    
    let variation = (moyenneG - (moyenneG*coeffTot - moyenneMat*coeffMat)/(coeffTot - coeffMat)).toFixed(5)
    
    let style = "background-color: rgb(255, 255, 255, 0.250); border-radius: 3px;"
    let signe = "neutre"
    let tooltipClass = ""
    
    if (variation > 0.2) {
        style = "background-color: rgb(0, 255, 0, 0.250); border-radius: 3px;"
        signe = "très positive"
        tooltipClass = " tooltipp-green"
    } else if (variation <= 0.2 && variation > 0) {
        style = "background-color: rgb(255, 127.5, 0, 0.250); border-radius: 3px;"
        signe = "positive"
        tooltipClass = " tooltipp-orange"
    } else {
        style = "background-color: rgb(255, 0, 0, 0.250); border-radius: 3px;"
        signe = "négative"
        tooltipClass = " tooltipp-red"
    }
    
    if (ajouterVariation) {
        let span;
        
        span = document.createElement("SPAN")
        span.style = style
        span.setAttribute("kmlc-variation", "true")

        if (disciplineElmExclusion instanceof HTMLElement) {
            for (let i = 0; i < disciplineElmExclusion.children.length; i++) {
                if (!disciplineElmExclusion.querySelector("[kmlc-variation]"))
                    disciplineElmExclusion.appendChild(span)
                
                if (disciplineElmExclusion.children[i] != disciplineElmExclusion.querySelector("[kmlc-variation]"))
                    disciplineElmExclusion.querySelector("[kmlc-variation]").appendChild(disciplineElmExclusion.children[i])
            }
            
            if (!disciplineElmExclusion.className.includes("note-parent")) {
                let dummy = document.createElement("SPAN")
                dummy.textContent = "Variation " + signe + " de " + variation
                dummy.className = tooltipClass
                
                disciplineElmExclusion.className += " note-parent"
                disciplineElmExclusion.appendChild(dummy)
            }
            
            // disciplineElmExclusion.setAttribute("title", "Variation " + signe + " de " + variation)
            
        } else if (disciplineElmExclusion instanceof Object) {
            for (let i = 0; i < disciplineElmExclusion.length; i++) {
                for (let j = 0; j < disciplineElmExclusion[i].children.length; j++) {
                    if (!disciplineElmExclusion[i].querySelector("[kmlc-variation]"))
                        disciplineElmExclusion[i].appendChild(span)
                    
                    if (disciplineElmExclusion[i].children[j] != disciplineElmExclusion[i].querySelector("[kmlc-variation]"))
                        disciplineElmExclusion[i].querySelector("[kmlc-variation]").appendChild(disciplineElmExclusion[i].children[j])
                }
                
                if (!disciplineElmExclusion[i].className.includes("note-parent")) {
                    let dummy = document.createElement("SPAN")
                    dummy.textContent = "Variation " + signe + " de " + variation
                    dummy.className = tooltipClass
                    
                    disciplineElmExclusion[i].className += " note-parent"
                    disciplineElmExclusion[i].appendChild(dummy)
                }

                // disciplineElmExclusion[i].setAttribute("title", "Variation " + signe + " commune de " + variation)
            }
        }
    }
    
    return variation
}