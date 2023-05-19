globalThis.Notes.variationMoyenne = function (periode, note) {
    let matieres = document.querySelectorAll("[kmlc-moyenne]");
    
    for (let i = 0; i < matieres.length; i++) {
        globalThis.Notes.calculerVariationMoyenne(matieres[i].parentElement.parentElement.querySelector("[class *= 'discipline']"), true, periode, note)
    }
}