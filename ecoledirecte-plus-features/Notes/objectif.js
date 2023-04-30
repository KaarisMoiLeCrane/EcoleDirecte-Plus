globalThis.Notes.objectifSetup = function () {
    // Selector to get the "Evaluations" button
    let buttonSelector = "ul.nav-pills > li.active"
    
    // If there is no button to see the goals then we add it
    if (!document.querySelector("[kmlc-bouton-objectif]")) {
        // We duplicate the "Evaluations" button, we add the attribute to know that he exist, and we add the click listener
        let objectifNoteButton = document.querySelector(buttonSelector).cloneNode(true)
        objectifNoteButton.setAttribute("kmlc-bouton-objectif", "true")
        
        objectifNoteButton.children[0].removeAttribute("href")
        objectifNoteButton.children[0].children[0].textContent = "Voir les objectifs"
        objectifNoteButton.addEventListener('click', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            // We get the goals and we add them to a multi-line string
            browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
                let objectifText = ``
                
                if (!items.objectifMoyenne[id]) {
                    items.objectifMoyenne[id] = [];
                }
                
                for (let i = 0; i < items.objectifMoyenne[id].length; i++) objectifText += items.objectifMoyenne[id][i][0] + " : " + items.objectifMoyenne[id][i][1] + `
`
                // console.log(789, items.objectifMoyenne)
                alert(objectifText)
            })
        })
        
        document.querySelector(buttonSelector).parentElement.insertBefore(objectifNoteButton, document.querySelector(buttonSelector))
        
        // We duplicate the "Evaluations" button, we add the attribute to know that he exist, and we add the click listener
        let objectifNoteClearButton = document.querySelector(buttonSelector).cloneNode(true)
        objectifNoteClearButton.setAttribute("kmlc-bouton-objectif", "true")
        
        objectifNoteClearButton.children[0].removeAttribute("href")
        objectifNoteClearButton.children[0].children[0].textContent = "Supprimer les objectifs"
        objectifNoteClearButton.addEventListener('click', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            alert("Les objectifs vont être supprimés")
            
            browser.storage.sync.set({"objectifMoyenne": []})
            let matiereAvecObjectif = document.querySelectorAll("[kmlc-objectif-moyenne-set]")
            for (let i = 0; i < matiereAvecObjectif.length; i++) matiereAvecObjectif[i].setAttribute("style", "")
        })
        
        document.querySelector(buttonSelector).parentElement.insertBefore(objectifNoteClearButton, document.querySelector(buttonSelector))
    }
    
    fixerObjectif()
    
    objectifValueListener()
}

function fixerObjectif() {
    // Get all the average without the average goal attribute (to know that the right click listener has been set)
    let matieres = document.querySelectorAll("td[class *= 'relevemoyenne']:not([kmlc-objectif-moyenne])")

    // For each average box set the right click listener (that let the user to set an average goal)
    for (let i = 0; i < matieres.length; i++) {
        matieres[i].setAttribute("kmlc-objectif-moyenne", "true")
        
        // Add a right click listener
        matieres[i].addEventListener('contextmenu', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            // Ask for the goal
            let objectifMoyenneVal = prompt("Quel objectif voulez vous ? (celui-ci sera le même pour toutes les années)")
            objectifMoyenneVal = " " + objectifMoyenneVal
            objectifMoyenneVal = objectifMoyenneVal.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
            
            // If exist add it
            if (objectifMoyenneVal != "" && objectifMoyenneVal != null) {
                let matiere = this.parentElement.querySelector("[class *= 'nommatiere']").textContent
            
                browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
                    let child = [];
                    
                    // Check if the user already add a goal for the student. If not we create the goal array under the student object.
                    let dummy = items.objectifMoyenne;
                    if (!dummy[id]) {
                        dummy[id] = [];
                    }
                    
                    let existe = false;

                    for (let j = 0; j < dummy[id].length; j++) {
                        // If the subject exist we add the goal
                        if (dummy[id][j][0] === matiere) {
                            dummy[id][j][1] = objectifMoyenneVal;
                            existe = true;
                            break;
                        }
                    }
                    
                    // If the subject not exist we add it and with the goal
                    if (!existe) {
                        dummy[id].push([matiere, objectifMoyenneVal]);
                    }

                    browser.storage.sync.set({"objectifMoyenne": dummy});
                });
                
                this.removeAttribute("kmlc-objectif-moyenne-set")
                
                objectifValueListener()
            }
        }, false);
    }
}

function objectifValueListener() {
    browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
        browser.storage.sync.onChanged.addListener(function(changes, namespace) {
            if ("objectifMoyenne" in changes) {
                items.objectifMoyenne = changes.objectifMoyenne.newValue;
                ajouterObjectifNote(items.objectifMoyenne)
            }
        });
        
        ajouterObjectifNote(items.objectifMoyenne)
    });
}

function ajouterObjectifNote(objectifMoyenne) {
    // Get all the averages boxes and all the subject name
    let moyennes = document.querySelectorAll("td[class *= 'relevemoyenne'][kmlc-objectif-moyenne]")
    let nomMatieres = document.querySelectorAll("[class *= 'nommatiere'] > b")
    
    // console.log("objectif 1", objectifMoyenne)
    
    // Create the goal section associated with the id of the student
    if (!objectifMoyenne[id]) {
        objectifMoyenne[id] = [];
    }
        
    // For each goal and each subject name
    for (let i = 0; i < objectifMoyenne[id].length; i++) {
        for (let j = 0; j < nomMatieres.length; j++) {
            try {
                // If the name of the subject and the name of the subject of the average are the same then we apply our changes
                if (nomMatieres[j].textContent == objectifMoyenne[id][i][0]) {
                    if (!moyennes[j].getAttribute("kmlc-objectif-moyenne-set")) {
                        let matiereNote = parseFloat(moyennes[j].children[0].textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
                        let noteObjectif = parseFloat(objectifMoyenne[id][i][1])
                        
                        if (matiereNote > noteObjectif) {
                            backgroundColor = " background-color: rgb(0, 255, 0, 0.5);"
                        } else if (matiereNote < noteObjectif) {
                            backgroundColor = " background-color: rgb(255, 0, 0, 0.5);"
                        } else {
                            backgroundColor = " background-color: rgb(255, 255, 255);"
                        }
                        
                        if (matiereNote.toString().split(".")[0] == noteObjectif.toString().split(".")[0]) {
                            backgroundColor = " background-color: rgb(255, 127.5, 0, 0.5);"
                        }
                        
                        // console.log("objectif 2", backgroundColor, noteObjectif, matiereNote)
                        
                        moyennes[j].setAttribute("style", backgroundColor)
                        
                        moyennes[j].setAttribute("kmlc-objectif-moyenne-set", "true")
                    }
                }
            } catch(e) {}
        }
    }
}