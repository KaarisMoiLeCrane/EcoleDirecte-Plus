let objectifFirstLaunch = 1;

globalThis.notes = function (id) {
    // Make an http request to get the grades
    let xhr = new XMLHttpRequest();
    console.log(window.location.pathname.split("/"))
    console.log(window.location.pathname.split("/")[2])
    url = `https://api.ecoledirecte.com/v3/Eleves/${id}/notes.awp?verbe=get`;
    data = `data={}`;

    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.setRequestHeader("X-Token", globalThis.token);
    xhr.onreadystatechange = function() {
        console.log(1111, xhr.readyState, document.querySelector("td span[class = 'ng-star-inserted']"))
        if (xhr.readyState === 4) {
            console.log(4444)
            
            // When we receive all the homeworks
            let note = JSON.parse(xhr.responseText).data
            document.waitForElement("[class *= 'tab-content']").then((elm) => {
                mainNotes(note)
            })
            console.log(1)
            var notesObserver = new MutationObserver(function (mutations) {
                console.log(2)
                mutations.forEach(function (mutation) {
                    try {
                        console.log(mutation.target)
                        if (mutation.target.children[0].innerText == "Moyennes" || mutation.target.children[0].innerText == "Evaluations") {
                            mainNotes(note)
                        }
                    } catch(e){}
                });
            });
            
            executeNotesObserver(notesObserver);
            
            function executeNotesObserver(observer) {
                
                // Wait for the parent containing the table that isn't modified or removed when something in the table change
                document.waitForElement(".eleve-note").then((elm) => {
                    console.log(789)
                    observer.observe(elm, {
                        characterData: false,
                        attributes: true,
                        attributeFilter: ['class'],
                        childList: true,
                        subtree: true
                    });
                });
            }
        }
    }

    xhr.send(data);
}


function mainNotes(note) {
    try {
        mainModifierNote()
        mainAjouterNote()
        mainObjectif()
        
        objectifFirstLaunch = 1
        
        console.log(456)
        // If there is already two things with the class "coef" etc, it means that our new category "Rang" exist. If not, we apply our changes
        if (!document.querySelectorAll("th[class *= 'coef ng-star-inserted']")[1]) {
            
            // We clone the "coef" element and append it to his parent (the top part of the table) and then modify the text to "Rang"
            document.querySelector("th[class *= 'coef ng-star-inserted']").parentElement.appendChild(document.querySelector("th[class *= 'coef ng-star-inserted']").cloneNode(true))
            document.querySelectorAll("th[class *= 'coef ng-star-inserted']")[1].innerText = "Rang"
            console.log(1, document.querySelector("th[class *= 'coef ng-star-inserted']"))
            
            // Get the coefficient of each subject
            let p = document.querySelectorAll("td[class *= 'coef ng-star-inserted']")
            console.log(1.1, p)
            
            // For each coefficient element, we duplicate it to place it visually under the new "Rang" column
            for (let i = 0; i < p.length; i++) {
                let elm = p[i].cloneNode(true)
                let periode = document.querySelector("ul.nav-tabs > li.active")
                let periodeNum = [...periode.parentElement.children].indexOf(periode)
                console.log(2, periode)
                
                // We change the coefficient with the "Rang" value
                elm.children[0].innerText = (note.periodes[periodeNum].ensembleMatieres.disciplines[i].effectif - note.periodes[periodeNum].ensembleMatieres.disciplines[i].rang) + "/" + note.periodes[periodeNum].ensembleMatieres.disciplines[i].effectif
                
                // For each element we add the class "text-center"
                elm.className = elm.className + " text-center"
                p[i].parentElement.appendChild(elm)
            }
            
            calculerMoyennes("kmlc-moyenne-g", "", "kmlc-moyenne", "", true, ":not([class *= 'simu'])")
        }
    } catch(e){}
}


function mainAjouterNote() {
    // Selector to get the "Evaluations" button
    let buttonSelector = "ul.nav-pills > li.active"
    
    // Check if the text in the bottom was changed and then add the text "Note ajoutée pour simulation" if it was not changed
    if (!document.querySelector("[class *= 'kmlc-text-note']")) {
        let textSimu = document.querySelector("table caption").parentElement.getElementsByContentText("(note)").startsWith[0].cloneNode(true)
        textSimu.className = "kmlc-text-note"
        
        textSimu.children[0].textContent = "note"
        textSimu.children[0].setAttribute("style", "color: green;")
        textSimu.children[1].textContent = "Note ajoutée pour simulation"
        textSimu.className = "kmlc-text-note"
        
        document.querySelector("table caption").parentElement.getElementsByContentText("(note)").startsWith[0].insertAfter(textSimu)
    }
    
    // If there is no button to add the grades then we add it
    if (!document.querySelector("[class *= 'kmlc-bouton-note']")) {
        let ajoutNote = document.querySelector(buttonSelector).cloneNode(true)
        ajoutNote.className = ajoutNote.className.replace("active", " kmlc-bouton-note ")
        
        ajoutNote.children[0].removeAttribute("href")
        ajoutNote.children[0].children[0].textContent = "Ajouter une note"
        ajoutNote.addEventListener('click', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            /*let backdrop = document.createElement("BS-MODAL-BACKDROP")
            backdrop.className = "modal-backdrop fade in"
            backdrop.addEventListener('click', function(e) {
                e.stopPropagation()
                e.preventDefault()
                
                this.className = this.className.replace("in", "out")
                
                setTimeout(() => {this.remove()}, 500);
            })
            document.body.appendChild(backdrop)*/
            
            let matieres = document.querySelectorAll("span.nommatiere")
            let promptMatiere = `Matière parmis les suivants :`
            
            for (let i = 0; i < matieres.length; i++) promptMatiere += `
- "` + matieres[i].textContent + "\""
            
            let promptMat = prompt(promptMatiere);
            if (promptMat != "" && promptMat != null) {
                console.log(promptMat, promptMat != "", promptMat != null)
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
                    
                    ajouterNote(promptMat, promptTitre, promptNote, promptCoeff, promptQuotient)
                }
            }
            // ajouterNote(prompt("Matière (La même que affiché dans le tableau)"), prompt("Titre (Pour contextualiser la note)"), prompt("Note (Un nombre seulement)"), prompt("Coefficient (Un nombre seulement)"), prompt("Quotient (Un nombre seulement)"))
        })
        
        document.querySelector(buttonSelector).parentElement.insertBefore(ajoutNote, document.querySelector(buttonSelector))
    }
}


function ajouterNote(matiere, titre, note, coeff, quotient) {
    // Create the element containing the grade
    let noteElement = document.createElement("BUTTON")
    noteElement.className = "kmlc-note-simu"
    
    let listMatiere = document.querySelectorAll("[class *= nommatiere]")
    
    /*
     * I can copy a grade and modify everything but for the moment I use the outerHTML. It's unreliable in the long term
     */
    for (let i = 0; i < listMatiere.length; i++) {
        if (listMatiere[i].textContent == matiere) {
            listMatiere[i].parentElement.parentElement.querySelector("[class *= 'notes']").appendChild(noteElement)
            listMatiere[i].parentElement.parentElement.querySelector("[class = 'kmlc-note-simu']").outerHTML = '<button type="button" class="kmlc-note-simu btn text-normal note margin-whitespace no-background no-padding ng-star-inserted" title=" '+ titre + '"><!----><span class="valeur ng-star-inserted" style="color: green;"> ' + note + ' <!----><sup class="coef ng-star-inserted"> ' + coeff + ' <span class="margin-whitespace"></span></sup><!----><sub class="coef ng-star-inserted"> /' + quotient + ' <span class="margin-whitespace"></span></sub></span><!----><!----><!----></button>'
        }
    }
    
    calculerMoyennes("kmlc-simu-moyenne-g", "color: green;", "kmlc-simu-moyenne", "color: green;", true)
    calculerMoyennes("kmlc-simu-modifier-moyenne-g", "border-bottom: 1px solid green; color: green;", "kmlc-simu-modifier-moyenne", "border-bottom: 1px solid green; color: green;")
    mainModifierNote()
}


function mainModifierNote () {
    // Check if the table in the bottom was changed and then add the text "Note modifiée" if it was not changed
    if (!document.querySelector("[class *= 'kmlc-text-modifier-note']")) {
        let textSimu = document.querySelector("table caption").parentElement.getElementsByContentText("(note)").startsWith[0].cloneNode(true)
        textSimu.className = "kmlc-text-modifier-note"
        
        textSimu.children[0].textContent = ""
        textSimu.children[0].setAttribute("style", "")
        
        let spanElement = document.createElement("SPAN")
        spanElement.textContent = "note"
        spanElement.setAttribute("style", "border-bottom: 1px solid green;")
        
        textSimu.children[1].textContent = "Note modifiée"
        
        textSimu.className = "kmlc-text-modifier-note"
        
        document.querySelector("table caption").parentElement.getElementsByContentText("(note)").startsWith[0].insertAfter(textSimu)
        textSimu.children[0].appendChild(spanElement)
    }
    
    // Get all the grades that they don't have the right click listener
    let matNotes = document.querySelectorAll("span.valeur:not([kmlc-event-listener])")
    console.log("No right click listener", matNotes)
    
    for (let i = 0; i < matNotes.length; i++) {
        
        // Add the class to know that the click listener has been added
        matNotes[i].setAttribute("kmlc-event-listener", true)
        matNotes[i].addEventListener('contextmenu', function(e) {
            e.stopPropagation();
            e.preventDefault();

            let nouvelleNote = prompt("Nouvelle note").replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")

            let nouveauCoeff = prompt("Nouveau coefficient").replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")

            let nouveauQuotient = prompt("Nouveau quotient").replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")

            if (nouvelleNote != "" && nouveauCoeff != "" && nouveauQuotient != "") {
                // Add the class to know that the grade has been modified
                if (this.getAttribute("class")) {
                    this.setAttribute("class", this.getAttribute("class").replace("kmlc-note-modifier", "") + " kmlc-note-modifier")
                } else {
                    this.setAttribute("class", "kmlc-note-modifier")
                }

                // Set the the first grade, first coefficient and first quotient to parameters in the element
                if (this.getAttribute("ancienneNote") == null)
                    this.setAttribute("ancienneNote", this.childNodes[0].nodeValue.replace(/[()\/\s]/g, "").replace(/[^\d+\-*/.\s]/g, ""))

                if (this.querySelector("sup")) {
                    if (this.getAttribute("ancienCoeff") == null)
                        this.setAttribute("ancienCoeff", " (" + this.querySelector("sup").textContent.replace(/[()\/\s]/g, "") + ") ")
                } else {
                    if (this.getAttribute("ancienCoeff") == null)
                        this.setAttribute("ancienCoeff", "")
                }

                if (this.querySelector("sub")) {
                    if (this.getAttribute("ancienQuotient") == null)
                        this.setAttribute("ancienQuotient", "/" + this.querySelector("sub").textContent.replace(/[()\/\s]/g, ""))
                } else {
                    if (this.getAttribute("ancienQuotient") == null)
                        this.setAttribute("ancienQuotient", "")
                }
                
                // Change the grade
                this.childNodes[0].nodeValue = " " + nouvelleNote + " "
                
                // Change/Add the coefficient
                if (this.querySelector("sup")) {
                    this.querySelector("sup").textContent = " (" + nouveauCoeff + ") "
                } else {
                    let supElement = document.createElement("SUP")
                    supElement.className = "kmlc-sup-modifier"
                    
                    this.appendChild(supElement)
                    
                    this.querySelector("sup").outerHTML = '<sup class="coef ng-star-inserted"> (' + nouveauCoeff + ') <span class="margin-whitespace"></span></sup>'
                }

                // Change/Add the quotient
                if (this.querySelector("sub")) {
                    this.querySelector("sub").textContent = "/" + nouveauQuotient + " "
                } else {
                    let subElement = document.createElement("SUB")
                    subElement.className = "kmlc-sub-modifier"
                    
                    this.appendChild(subElement)
                    
                    this.querySelector("sub").outerHTML = '<sub class="coef ng-star-inserted"> /' + nouveauQuotient + ' <span class="margin-whitespace"></span></sub>'
                }
                
                // Add the one pixel green underline
                if (this.getAttribute("style")) {
                    this.setAttribute("style", this.getAttribute("style").replace("border-bottom: 1px solid green;", "") + " border-bottom: 1px solid green;")
                } else {
                    this.setAttribute("style", "border-bottom: 1px solid green;")
                }
                
                calculerMoyennes("kmlc-simu-modifier-moyenne-g", "border-bottom: 1px solid green; color: green;", "kmlc-simu-modifier-moyenne", "border-bottom: 1px solid green; color: green;")
            }
        }, false);
    }
}

function calculerMoyennes(moyenneGClass, moyenneGStyle, moyenneClass, moyenneStyle, ancienneNote = false, querySelectorExclusion = "") {
    // We get all the displayed grades
    let matNotes = document.querySelectorAll("span.valeur" + querySelectorExclusion);
    console.log(3, matNotes)
    let lignes = [];
    
    // We init the overall average, the value of all the subjects average, the excessed coefficients (coefficients counted when there are no grades) and the total coefficients (that he will divide all the grades to get the overall average)
    let moyenneG = 0.0
    let matieresMoyenne = 0.0;
    let coeffEnTrop = 0.0;
    let coeffMatTot = 0.0;
    
    // For each grades, get the row containing all the datas about the subject and then push each row element, if they are not in the list, to our lignes list
    for (let i = 0; i < matNotes.length; i++) {
        let parent = matNotes[i].parentElement.parentElement.parentElement;
        console.log(4, parent, matNotes[i])
        if (!lignes.includes(parent)) {
            lignes.push(parent);
        }
    }

    // For each rows, get all the grades in the row (so all the grades of a specific subject), and calculate the average of the subject
    for (let i = 0; i < lignes.length; i++) {
        
        // Get all the grades in the row, init the overall average of the subject and init the vraiable to set the total coefficients of all the grades in the subject
        let matiereNotes = lignes[i].querySelectorAll("span.valeur")
        console.log(5, matiereNotes)
        let moyenne = 0.0;
        let addNotes = 0.0;
        let coeffNoteTot = 0.0;
        
        // For each grades of the suject, get his coefficient and his quotient and we calculate everything. We convert the grade to be /20 and we multiply it with his coefficient. We add the coefficient to the coeffNoteTot
        for (let j = 0; j < matiereNotes.length; j++) {
            let coeff = 1.0
            let quotient = 20.0
            let matNote = 0.0
            
            // Get the coefficient of the grade
            if (matiereNotes[j].querySelector("sup")) {
                // Regex to replace "," with "." and the spaces with nothing and / with nothing
                if (ancienneNote) {
                    if (matiereNotes[j].className.includes("kmlc-note-modifier")) {
                        if (matiereNotes[j].getAttribute("anciencoeff")) {
                            coeff = parseFloat(matiereNotes[j].getAttribute("anciencoeff").replace(/[()\/\s]/g, "").replace(",", "."));
                        } else {
                            coeff = parseFloat(1)
                        }
                        
                    } else {
                        coeff = parseFloat(matiereNotes[j].querySelector("sup").textContent.replace(/[()\/\s]/g, "").replace(",", "."));
                    }
                    
                } else {
                    coeff = parseFloat(matiereNotes[j].querySelector("sup").textContent.replace(/[()\/\s]/g, "").replace(",", "."));
                }
            }
            
            // Get the quotient of the grade
            if (matiereNotes[j].querySelector("sub")) {
                // Regex to replace "," with "." and the spaces with nothing and / with nothing
                if (ancienneNote) {
                    if (matiereNotes[j].className.includes("kmlc-note-modifier")) {
                        if (matiereNotes[j].getAttribute("ancienquotient")) {
                            quotient = parseFloat(matiereNotes[j].getAttribute("ancienquotient").replace(/[()\/\s]/g, "").replace(",", "."));
                        } else {
                            quotient = parseFloat(20)
                        }
                        
                    } else {
                        quotient = parseFloat(matiereNotes[j].querySelector("sub").textContent.replace(/[()\/\s]/g, "").replace(",", "."));
                    }
                    
                } else {
                    quotient = parseFloat(matiereNotes[j].querySelector("sub").textContent.replace(/[()\/\s]/g, "").replace(",", "."));
                }
            }

            // Get the grade and replace all the spaces and letters with nothing and the "," with "."
            if (ancienneNote) {
                if (matiereNotes[j].className.includes("kmlc-note-modifier")) {
                    if (matiereNotes[j].getAttribute("anciennenote")) {
                        matNote = matiereNotes[j].getAttribute("anciennenote").replace(/[()\/\s]/g, "").replace(",", ".");
                    } else {
                        matNote = "20"
                    }
                    
                } else {
                    matNote = matiereNotes[j].childNodes[0].nodeValue
                }
                
            } else {
                matNote = matiereNotes[j].childNodes[0].nodeValue
            }
            
            // A grade between two parentheses is not a grade
            if (!matNote.includes("(") && !matNote.includes(")")) {
                matNote = matNote.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
            } else {
                matNote = NaN
            }
            
            console.log(6, matNote, matiereNotes[j].childNodes[0].nodeValue)

            // If there is a grade (0 is a grade but nothing and a grade between two parentheses is not a grade). matNote is a string so ``if ("0" && "0.0") console.log(1)`` will log 1
            if (matNote) {
                console.log(6.1, matNote)
                
                // Convert the grade to /20
                matNote = parseFloat(matNote)*20.0/quotient
                console.log(6.2, matNote, coeff)
                
                // Multiply it with the coefficient of the grade, add it to the average value of the subject and add the coefficient with the total of coefficients of the subject
                addNotes += parseFloat(matNote*coeff);
                coeffNoteTot += coeff;
                console.log(matiereNotes[j], addNotes, coeffNoteTot, coeff)
            }
        }
        
        // Get the coefficient of the subject
        let coeffMat = parseFloat(lignes[i].querySelector("td.coef:not([class *= 'text-center'])").innerText.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""));
        console.log(7, coeffMat)
        
        // If the total of coefficients of the subject is 0 (so no grades to count)
        if (coeffNoteTot ==  0.0) {
            coeffEnTrop += coeffMat;
            console.log(8, coeffMat, coeffNoteTot, addNotes, parseFloat(lignes[i].querySelector("td.coef:not([class *= 'text-center'])").innerText))
        } else {
            
            // We add the coefficient of the subject to the total of coefficient of the subjects
            coeffMatTot += coeffMat;
            
            // We calculate the average of the subject
            moyenne = (addNotes/coeffNoteTot);
            console.log(moyenne);

            // Duplicate the average element of the subject to add in a new line the average calculated by EcoleDirecte Plus
            let averageElement = lignes[i].querySelector("td.relevemoyenne").cloneNode(true);
            averageElement.textContent = moyenne.toFixed(5)
            if (!lignes[i].querySelector("[class *= '" + moyenneClass + "']")) {
                lignes[i].querySelector("td.relevemoyenne").innerHTML = lignes[i].querySelector("td.relevemoyenne").innerHTML + '<br><span class="' + moyenneClass + '" style="' + moyenneStyle + '">' + averageElement.innerHTML + '</span>';
            } else {
                lignes[i].querySelector("[class *= '" + moyenneClass + "']").textContent = moyenne.toFixed(5)
            }
            
            // We multiply the average of the subject with his coefficient and we add it to the overall average
            matieresMoyenne += moyenne * coeffMat;
        }
    }
    
    // We calculate the overall average
    moyenneG = matieresMoyenne/coeffMatTot
    
    // If there is the overall average row we add our overall average in a new line. If not, we create it and put it in a new line as well (the first line is blank)
    if (document.querySelector("tr > td.moyennegenerale-valeur")) {
        let overallAverageElement = document.querySelector("tr > td.moyennegenerale-valeur").cloneNode(true)
        overallAverageElement.textContent = moyenneG.toFixed(5);
        console.log(9, document.querySelector("tr > td.moyennegenerale-valeur"))

        if (!document.querySelector("[class *= '" + moyenneGClass + "']")) {
            document.querySelector("tr > td.moyennegenerale-valeur").innerHTML = document.querySelector("tr > td.moyennegenerale-valeur").innerHTML + '<br><span class="' + moyenneGClass + '" style="' + moyenneGStyle + '">' + overallAverageElement.innerHTML + '</span>'
        } else {
            document.querySelector("[class *= '" + moyenneGClass + "']").textContent = moyenneG.toFixed(5)
        }
    } else {
        let overallAverageElement = document.createElement("tr")
        overallAverageElement.innerHTML = '<tr class="ng-star-inserted"><td colspan="2" class="text-right moyennegeneralelibelle">Moyenne générale</td><td colspan="2" class="moyennegenerale-valeur"><span class="' + moyenneGClass + '" style="' + moyenneGStyle + '">' + moyenneG.toFixed(5); + '</span></td></tr>'
        console.log(10, overallAverageElement, document.querySelector("table.ed-table tbody"))
        
        if (!document.querySelector("[class *= '" + moyenneGClass + "']")) {
            document.querySelector("table.ed-table tbody").appendChild(overallAverageElement)
        } else {
            document.querySelector("[class *= '" + moyenneGClass + "']").textContent = moyenneG.toFixed(5)
        }
    }

    console.log(moyenneG, matieresMoyenne, coeffMatTot)
}


function mainObjectif() {
    // Selector to get the "Evaluations" button
    let buttonSelector = "ul.nav-pills > li.active"
    
    // If there is no button to see the goals then we add it
    if (!document.querySelector("[class *= 'kmlc-bouton-objectif']")) {
        let objectifNoteButton = document.querySelector(buttonSelector).cloneNode(true)
        objectifNoteButton.className = objectifNoteButton.className.replace("active", " kmlc-bouton-objectif ")
        
        objectifNoteButton.children[0].removeAttribute("href")
        objectifNoteButton.children[0].children[0].textContent = "Voir les objectifs"
        objectifNoteButton.addEventListener('click', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
                let objectifText = ``
                
                if (!items.objectifMoyenne[id]) {
                    items.objectifMoyenne[id] = [];
                }
                
                for (let i = 0; i < items.objectifMoyenne[id].length; i++) objectifText += items.objectifMoyenne[id][i][0] + " : " + items.objectifMoyenne[id][i][1] + `
`
                console.log(789, items.objectifMoyenne)
                alert(objectifText)
            })
        })
        
        document.querySelector(buttonSelector).parentElement.insertBefore(objectifNoteButton, document.querySelector(buttonSelector))
        
        
        let objectifNoteClearButton = document.querySelector(buttonSelector).cloneNode(true)
        objectifNoteClearButton.className = objectifNoteClearButton.className.replace("active", " kmlc-bouton-objectif ")
        
        objectifNoteClearButton.children[0].removeAttribute("href")
        objectifNoteClearButton.children[0].children[0].textContent = "Supprimer les objectifs"
        objectifNoteClearButton.addEventListener('click', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            alert("Les objectifs vont être supprimés")
            
            browser.storage.sync.set({"objectifMoyenne": []})
            let matiereAvecObjectif = document.querySelectorAll("[class *= 'kmlc-objectif-moyenne-set']")
            for (let i = 0; i < matiereAvecObjectif.length; i++) matiereAvecObjectif[i].setAttribute("style", "")
        })
        
        document.querySelector(buttonSelector).parentElement.insertBefore(objectifNoteClearButton, document.querySelector(buttonSelector))
    }
    
    let matieres = document.querySelectorAll("td[class *= 'relevemoyenne']:not([class *= 'kmlc-objectif-moyenne'])")
    
    for (let i = 0; i < matieres.length; i++) {
        if (matieres[i].getAttribute("class")) {
            matieres[i].setAttribute("class", matieres[i].className + " kmlc-objectif-moyenne")
        } else {
            matieres[i].setAttribute("class", "kmlc-objectif-moyenne")
        }
        
        matieres[i].addEventListener('contextmenu', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            let objectifMoyenneVal = prompt("Quel objectif voulez vous ? (celui-ci sera le même pour toutes les années)")
            objectifMoyenneVal = " " + objectifMoyenneVal
            objectifMoyenneVal = objectifMoyenneVal.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
            
            if (objectifMoyenneVal != "" && objectifMoyenneVal != null) {
                let matiere = this.parentElement.querySelector("[class *= 'nommatiere']").textContent
            
                browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
                    let child = [];
                    
                    let dummy = items.objectifMoyenne;
                    if (!dummy[id]) {
                        dummy[id] = [];
                    }
                    
                    let existe = false;

                    for (let j = 0; j < dummy[id].length; j++) {
                        if (dummy[id][j][0] === matiere) {
                            dummy[id][j][1] = objectifMoyenneVal;
                            existe = true;
                            break;
                        }
                    }
                    
                    if (!existe) {
                        dummy[id].push([matiere, objectifMoyenneVal]);
                    }

                    browser.storage.sync.set({"objectifMoyenne": dummy});
                });
                
                this.className = this.className.replace("kmlc-objectif-moyenne-set", "")
                
                mainAjouterObjectifMoyenne()
            }
        }, false);
    }
    
    mainAjouterObjectifMoyenne()
}

function mainAjouterObjectifMoyenne() {
    browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
        browser.storage.sync.onChanged.addListener(function(changes, namespace) {
            if ("objectifMoyenne" in changes) {
                items.objectifMoyenne = changes.objectifMoyenne.newValue;
                console.log("AAJAIJIZOAJZAO", 1)
                ajouterObjectifNote(items.objectifMoyenne)
            }
        });
        
        if (objectifFirstLaunch) {
            ajouterObjectifNote(items.objectifMoyenne)
            objectifFirstLaunch = 0;
        }
    });
}

function ajouterObjectifNote(objectifMoyenne) {
    let moyennes = document.querySelectorAll("td[class *= 'relevemoyenne'][class *= 'kmlc-objectif-moyenne']")
    let nomMatieres = document.querySelectorAll("[class *= 'nommatiere'] > b")
    
    console.log("objectif 1", objectifMoyenne)
    
    if (!objectifMoyenne[id]) {
        objectifMoyenne[id] = [];
    }
    
    for (let i = 0; i < objectifMoyenne[id].length; i++) {
        for (let j = 0; j < nomMatieres.length; j++) {
            try {
                console.log(nomMatieres[j].textContent, objectifMoyenne[id][i][0])
                if (nomMatieres[j].textContent == objectifMoyenne[id][i][0]) {
                    if (!moyennes[j].className.includes("kmlc-objectif-moyenne-set")) {
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
                        
                        console.log("objectif 2", backgroundColor, noteObjectif, matiereNote)
                        
                        moyennes[j].setAttribute("style", backgroundColor)
                        
                        if (moyennes[j].getAttribute("class")) {
                            moyennes[j].setAttribute("class", moyennes[j].getAttribute("class") + " kmlc-objectif-moyenne-set")
                        } else {
                            moyennes[j].setAttribute("class", " kmlc-objectif-moyenne-set")
                        }
                    }
                }
            } catch(e) {}
        }
    }
}