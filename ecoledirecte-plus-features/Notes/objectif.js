globalThis.Notes.objectifSetup = function () {
    // Selector to get the "Evaluations" button
    let buttonSelector = "ul.nav-pills > li.active"
    
    // If there is no button to see the goals then we add it
    if (!document.querySelector("[kmlc-bouton-objectif]")) {
        /*
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
        */
        
        // We duplicate the "Evaluations" button, we add the attribute to know that he exist, and we add the click listener
        let objectifButton = document.querySelector(buttonSelector).cloneNode(true)
        objectifButton.setAttribute("kmlc-bouton-objectif", "true")
        
        objectifButton.children[0].removeAttribute("href")
        objectifButton.children[0].children[0].textContent = "Objectifs"
        objectifButton.addEventListener('click', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            // We get the goals and we add them to a multi-line string
            browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
                let objectifText = ``
                
                if (!items.objectifMoyenne[id]) {
                    items.objectifMoyenne[id] = [];
                }
                
                let popup = document.querySelector("[kmlc-popup]")
                let blur = document.querySelector("[kmlc-blur]")
                
                if (!popup) {
                    // console.log(789, items.objectifMoyenne)
                    blur = document.createElement("DIV")
                    blur.className = "kmlc-blur"
                    blur.setAttribute("kmlc-blur", "true")
                    
                    popup = document.createElement("DIV")
                    popup.className = "kmlc-popup"
                    popup.setAttribute("kmlc-popup", "true")
                    
                    document.body.appendChild(popup)
                    document.body.appendChild(blur)
                    
                    popup = document.querySelector("[kmlc-popup]")
                    blur = document.querySelector("[kmlc-blur]")
                    
                    changePopupInnerHTML(popup, items)
                    
                    // Ouvrir la popup
                    function openPopup() {
                        popup.style.display = 'block';
                        blur.style.display = 'block';
                    }

                    // Fermer la popup
                    function closePopup() {
                        popup.classList.add('kmlc-popup-close');
                        blur.style.display = 'none';
                    }

                    // Événement pour ouvrir la popup
                    document.addEventListener('click', function(event) {
                        if (event.target.classList.contains('kmlc-open-popup')) {
                            openPopup();
                        }
                    });

                    // Événement pour fermer la popup en cliquant à l'extérieur
                    blur.addEventListener('click', function(event) {
                        if (event.target.classList.contains('kmlc-blur')) {
                            closePopup();
                        }
                    });
                    
                    let goalInputs = document.querySelectorAll('.kmlc-goal-input');

                    goalInputs.forEach(function(input) {
                        input.addEventListener('keypress', function(event) {
                            let charCode = event.which ? event.which : event.keyCode;

                            if (
                                charCode !== 8 && // Touche de suppression (Backspace)
                                charCode !== 44 && // Virgule (,)
                                charCode !== 46 && // Point (.)
                                charCode < 48 || // Chiffres (0-9)
                                charCode > 57
                            ) {
                                event.preventDefault();
                            }
                        });
                    });

                    // Réinitialiser la popup après l'animation de fermeture
                    popup.addEventListener('animationend', function(event) {
                        if (event.animationName === 'kmlc-popupCloseAnimation') {
                            popup.style.display = 'none';
                            popup.classList.remove('kmlc-popup-close');
                            
                            let inputBox = document.querySelectorAll('li[class = "kmlc-subject-item"] > input[type="text"][class = "kmlc-goal-input"]')
                            let matieres = document.querySelectorAll("[class *= 'nommatiere']")
                            
                            browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
                                let dummy = items.objectifMoyenne;
                                
                                for (let i = 0; i < inputBox.length; i++) {
                                    let inputBoxValue = inputBox[i].value.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
                                    
                                    if (inputBoxValue != '') {
                                        // If exist add it
                                        
                                        let matiere = matieres[i]
                                        let child = [];
                                        
                                        // Check if the user already add a goal for the student. If not we create the goal array under the student object.
                                        if (!dummy[id]) {
                                            dummy[id] = [];
                                        }
                                        
                                        let existe = false;

                                        for (let j = 0; j < dummy[id].length; j++) {
                                            // If the subject exist we add the goal
                                            if (dummy[id][j][0] === matiere.textContent) {
                                                dummy[id][j][1] = inputBoxValue;
                                                existe = true;
                                                break;
                                            }
                                        }
                                        
                                        // If the subject not exist we add it and with the goal
                                        if (!existe) {
                                            dummy[id].push([matiere.textContent, inputBoxValue]);
                                        }
                                    }
                                }
                                
                                browser.storage.sync.set({"objectifMoyenne": dummy});
                                
                                changePopupInnerHTML(popup, items)
                                
                                objectifValueListener()
                            });
                        }
                    });
                }
                
                if (popup) {
                    popup.setAttribute("style", "");
                    blur.setAttribute("style", "");
                };
            })
        })
        
        document.querySelector(buttonSelector).parentElement.insertBefore(objectifButton, document.querySelector(buttonSelector))
    }
    
    fixerObjectif()
    
    objectifValueListener()
}

function changePopupInnerHTML(popup, items) {
    let nomMatieres = document.querySelectorAll("[class *= 'nommatiere'] > b")

    let popupHTML = `
<h2>Objectif de note</h2>
<ul class="kmlc-subject-list">
`

    for (let i = 0; i < nomMatieres.length; i++) {
        let pass = true
            
        if (items.objectifMoyenne[id]) {
            for (let j = 0; j < items.objectifMoyenne[id].length; j++) {
                if (nomMatieres[i].textContent == items.objectifMoyenne[id][j][0]) {
                    popupHTML += `
  <li class="kmlc-subject-item">
    <label class="kmlc-subject-label">` + items.objectifMoyenne[id][j][0] + `</label>
    <input type="text" class="kmlc-goal-input" placeholder="Entrez votre objectif de note pour ` + items.objectifMoyenne[id][j][0] + `" value="` + items.objectifMoyenne[id][j][1] + `">
  </li>`
                    pass = false
                    break
                }
            }
        }
    
        if (pass) {
            popupHTML += `
  <li class="kmlc-subject-item">
    <label class="kmlc-subject-label">` + nomMatieres[i].textContent + `</label>
    <input type="text" class="kmlc-goal-input" placeholder="Entrez votre objectif de note pour ` + nomMatieres[i].textContent + `">
  </li>`
        }
    }

    popupHTML += `
</ul>
<div class="kmlc-delete-button-container">
  <button kmlc-bouton-supprimer-objectif="true" class="kmlc-delete-button">Supprimer les objectifs</button>
</div>
`

    popup.innerHTML = popupHTML
    
    popup.querySelector("[kmlc-bouton-supprimer-objectif]").addEventListener('click', function(e) {
        e.stopPropagation()
        e.preventDefault()
        
        let inputBox = document.querySelectorAll('li[class = "kmlc-subject-item"] > input[type="text"][class = "kmlc-goal-input"]')
        for (let i = 0; i < inputBox.length; i++) {
            inputBox[i].value = ''
        }
        
        browser.storage.sync.set({"objectifMoyenne": []})
        
        let tooltip = document.querySelectorAll("[class *= kmlc-tooltip]")
        for (let i = 0; i < tooltip.length; i++) {
            tooltip[i].remove()
        }
        
        let moyenneSet = document.querySelectorAll("[kmlc-objectif-moyenne-set]")
        for (let i = 0; i < moyenneSet.length; i++) {
            moyenneSet[i].removeAttribute("kmlc-objectif-moyenne-set")
            moyenneSet[i].removeAttribute("style")
            moyenneSet[i].className = moyenneSet[i].className.replace(" kmlc-note-parent")
        }
    })
}

function fixerObjectif() {
    // Get all the average without the average goal attribute (to know that the right click listener has been set)
    let matieres = document.querySelectorAll("td[class *= 'relevemoyenne']:not([kmlc-objectif-moyenne])")

    // For each average box set the right click listener (that let the user to set an average goal)
    for (let i = 0; i < matieres.length; i++) {
        matieres[i].setAttribute("kmlc-objectif-moyenne", "true")
    }
}

function fixerObjectif2() {
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
                    let matiereNote = parseFloat(moyennes[j].querySelector("[kmlc-moyenne]").textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
                    let noteObjectif = parseFloat(objectifMoyenne[id][i][1])
                    let tooltipClass = " kmlc-tooltip-red"
                    
                    if (matiereNote > noteObjectif) {
                        backgroundColor = " background-color: rgb(0, 255, 0, 0.5);"
                        tooltipClass = " kmlc-tooltip-green"
                    } else if (matiereNote < noteObjectif) {
                        backgroundColor = " background-color: rgb(255, 0, 0, 0.5);"
                        tooltipClass = " kmlc-tooltip-red"
                    } else {
                        backgroundColor = " background-color: rgb(255, 255, 255);"
                        tooltipClass = ""
                    }
                    
                    if (matiereNote.toString().split(".")[0] == noteObjectif.toString().split(".")[0]) {
                        backgroundColor = " background-color: rgb(255, 127.5, 0, 0.5);"
                        tooltipClass = " kmlc-tooltip-orange"
                    }
                    
                    if (!moyennes[j].getAttribute("kmlc-objectif-moyenne-set")) {
                        // console.log("objectif 2", backgroundColor, noteObjectif, matiereNote)
                        
                        moyennes[j].className += " kmlc-note-parent"
                        
                        let dummy = moyennes[j].querySelector("span").cloneNode(true)
                        dummy.className += tooltipClass
                        dummy.textContent = "Objectif de " + noteObjectif
                        dummy.removeAttribute("kmlc-moyenne")
                        
                        moyennes[j].appendChild(dummy)
                        
                        moyennes[j].setAttribute("style", backgroundColor)
                        
                        moyennes[j].setAttribute("kmlc-objectif-moyenne-set", "true")
                    } else {
                        // console.log("objectif 2", backgroundColor, noteObjectif, matiereNote)
                        
                        let dummy = moyennes[j].querySelector("span:[class *= 'kmlc-tooltip']")
                        dummy.className = tooltipClass
                        dummy.textContent = "Objectif de " + noteObjectif
                        
                        moyennes[j].setAttribute("style", backgroundColor)
                    }
                }
            } catch(e) {}
        }
    }
}