globalThis.Notes.variationMoyenne = function (periode, note) {
    const calculerVariationMoyenne = imports("calculerVariationMoyenne").from("./features/Notes/functions/calculer-variation-moyenne.js")
    let matieres = document.querySelectorAll("[kmlc-moyenne]");
    
    for (let i = 0; i < matieres.length; i++) {
        calculerVariationMoyenne(matieres[i].parentElement.parentElement.querySelector("[class *= 'discipline']"), true, periode, note)
    }
}