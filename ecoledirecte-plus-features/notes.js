let objectifFirstLaunch = 1;

globalThis.notes = function (id) {
    // Make an http request to get the grades
    let xhr = new XMLHttpRequest();
    ////console.log(window.location.pathname.split("/"))
    ////console.log(window.location.pathname.split("/")[2])
    url = `https://api.ecoledirecte.com/v3/Eleves/${id}/notes.awp?verbe=get`;
    data = `data={}`;

    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.setRequestHeader("X-Token", globalThis.token);
    xhr.onreadystatechange = function() {
        //console.log(1111, xhr.readyState, document.querySelector("td span[class = 'ng-star-inserted']"))
        if (xhr.readyState === 4) {
            //console.log(4444)
            
            // When we receive all the homeworks
            let note = JSON.parse(xhr.responseText).data
            document.waitForElement("[class *= 'tab-content']").then((elm) => {
                mainNotes(note)
            })
            //console.log(1)
            var notesObserver = new MutationObserver(function (mutations) {
                //console.log(2)
                mutations.forEach(function (mutation) {
                    try {
                        //console.log(mutation.target)
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
                    //console.log(789)
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
        //console.log(456)
        // If there is already two things with the class "coef" etc, it means that our new category "Rang" exist. If not, we apply our changes
        if (!document.querySelectorAll("th[class *= 'coef ng-star-inserted']")[1]) {
            
            // We clone the "coef" element and append it to his parent (the top part of the table) and then modify the text to "Rang"
            document.querySelector("th[class *= 'coef ng-star-inserted']").parentElement.appendChild(document.querySelector("th[class *= 'coef ng-star-inserted']").cloneNode(true))
            document.querySelectorAll("th[class *= 'coef ng-star-inserted']")[1].innerText = "Rang"
            //console.log(1, document.querySelector("th[class *= 'coef ng-star-inserted']"))
            
            // Get the coefficient of each subject
            let p = document.querySelectorAll("td[class *= 'coef ng-star-inserted']")
            //console.log(1.1, p)
            
            // For each coefficient element, we duplicate it to place it visually under the new "Rang" column
            for (let i = 0; i < p.length; i++) {
                let elm = p[i].cloneNode(true)
                let periode = document.querySelector("ul.nav-tabs > li.active")
                let periodeNum = [...periode.parentElement.children].indexOf(periode)
                //console.log(2, periode)
                
                // We change the coefficient with the "Rang" value
                elm.children[0].innerText = (note.periodes[periodeNum].ensembleMatieres.disciplines[i].effectif - note.periodes[periodeNum].ensembleMatieres.disciplines[i].rang) + "/" + note.periodes[periodeNum].ensembleMatieres.disciplines[i].effectif
                
                // For each element we add the class "text-center"
                elm.className = elm.className + " text-center"
                p[i].parentElement.appendChild(elm)
            }
            
            calculerMoyennes("kmlc-moyenne-g", "", "kmlc-moyenne", "", true, ":not([class *= 'simu'])")
        }
        mainChart(note)
        
        mainModifierNote()
        mainAjouterNote()
        mainObjectif()
        
        objectifFirstLaunch = 1
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
            
            /*
            let backdrop = document.createElement("BS-MODAL-BACKDROP")
            backdrop.className = "modal-backdrop fade in"
            backdrop.addEventListener('click', function(e) {
                e.stopPropagation()
                e.preventDefault()
                
                this.className = this.className.replace("in", "out")
                
                setTimeout(() => {this.remove()}, 500);
            })
            document.body.appendChild(backdrop)
            */
            
            let matieres = document.querySelectorAll("span.nommatiere")
            let promptMatiere = `Matière parmis les suivants :`
            
            for (let i = 0; i < matieres.length; i++) promptMatiere += `
- "` + matieres[i].textContent + "\""
            
            let promptMat = prompt(promptMatiere);
            if (promptMat != "" && promptMat != null) {
                //console.log(promptMat, promptMat != "", promptMat != null)
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
    //console.log("No right click listener", matNotes)
    
    for (let i = 0; i < matNotes.length; i++) {
        // Add the class to know that the click listener has been added
        matNotes[i].setAttribute("kmlc-event-listener", true)
        matNotes[i].addEventListener('contextmenu', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            let pass = 0;

            let nouvelleNote = prompt("Nouvelle note")
            let nouveauCoeff = prompt("Nouveau coefficient")
            let nouveauQuotient = prompt("Nouveau quotient")
            
            if ((!nouvelleNote && !nouveauCoeff && !nouveauQuotient)) return
            
            if (nouvelleNote) {
                nouvelleNote = nouvelleNote.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
                
                if (nouvelleNote == this.childNodes[0].nodeValue.replace(/[()\/\s]/g, "").replace(/[^\d+\-*/.\s]/g, "")) pass += 1
            } else {
                nouvelleNote = this.childNodes[0].nodeValue.replace(/[()\/\s]/g, "").replace(/[^\d+\-*/.\s]/g, "")
                pass += 1
            }
            
            if (nouveauCoeff) {
                nouveauCoeff = nouveauCoeff.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
                
                if (this.querySelector("sup")) {
                    if (nouveauCoeff == this.querySelector("sup").textContent.replace(/[()\/\s]/g, "")) pass += 1
                } else {
                    if (nouveauCoeff == 1) pass += 1
                }
            } else {
                if (this.querySelector("sup")) {
                    nouveauCoeff = this.querySelector("sup").textContent.replace(/[()\/\s]/g, "")
                } else {
                    nouveauCoeff = 1.0
                    pass += 1
                }
            }

            if (nouveauQuotient) {
                nouveauQuotient = nouveauQuotient.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
                
                if (this.querySelector("sub")) {
                    if (nouveauQuotient == this.querySelector("sub").textContent.replace(/[()\/\s]/g, "")) pass += 1
                } else {
                    if (nouveauQuotient == 20) pass += 1
                }
            } else {
                if (this.querySelector("sub")) {
                    nouveauQuotient = this.querySelector("sub").textContent.replace(/[()\/\s]/g, "")
                } else {
                    nouveauQuotient = 20.0
                    pass += 1
                }
            }
            
            if (pass == 3) return

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
    //console.log(3, matNotes)
    let lignes = [];
    
    // We init the overall average, the value of all the subjects average, the excessed coefficients (coefficients counted when there are no grades) and the total coefficients (that he will divide all the grades to get the overall average)
    let moyenneG = 0.0
    let matieresMoyenne = 0.0;
    let coeffEnTrop = 0.0;
    let coeffMatTot = 0.0;
    
    // For each grades, get the row containing all the datas about the subject and then push each row element, if they are not in the list, to our lignes list
    for (let i = 0; i < matNotes.length; i++) {
        let parent = matNotes[i].parentElement.parentElement.parentElement;
        //console.log(4, parent, matNotes[i])
        if (!lignes.includes(parent)) {
            lignes.push(parent);
        }
    }

    // For each rows, get all the grades in the row (so all the grades of a specific subject), and calculate the average of the subject
    for (let i = 0; i < lignes.length; i++) {
        
        // Get all the grades in the row, init the overall average of the subject and init the vraiable to set the total coefficients of all the grades in the subject
        let matiereNotes = lignes[i].querySelectorAll("span.valeur")
        //console.log(5, matiereNotes)
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
            
            //console.log(6, matNote, matiereNotes[j].childNodes[0].nodeValue)

            // If there is a grade (0 is a grade but nothing and a grade between two parentheses is not a grade). matNote is a string so ``if ("0" && "0.0") //console.log(1)`` will log 1
            if (matNote) {
                //console.log(6.1, matNote)
                
                // Convert the grade to /20
                matNote = parseFloat(matNote)*20.0/quotient
                //console.log(6.2, matNote, coeff)
                
                // Multiply it with the coefficient of the grade, add it to the average value of the subject and add the coefficient with the total of coefficients of the subject
                addNotes += parseFloat(matNote*coeff);
                coeffNoteTot += coeff;
                //console.log(matiereNotes[j], addNotes, coeffNoteTot, coeff)
            }
        }
        
        // Get the coefficient of the subject
        let coeffMat = parseFloat(lignes[i].querySelector("td.coef:not([class *= 'text-center'])").innerText.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""));
        //console.log(7, coeffMat)
        
        // If the total of coefficients of the subject is 0 (so no grades to count)
        if (coeffNoteTot ==  0.0) {
            coeffEnTrop += coeffMat;
            //console.log(8, coeffMat, coeffNoteTot, addNotes, parseFloat(lignes[i].querySelector("td.coef:not([class *= 'text-center'])").innerText))
        } else {
            
            // We add the coefficient of the subject to the total of coefficient of the subjects
            coeffMatTot += coeffMat;
            
            // We calculate the average of the subject
            moyenne = (addNotes/coeffNoteTot);
            //console.log(moyenne);

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
        //console.log(9, document.querySelector("tr > td.moyennegenerale-valeur"))

        if (!document.querySelector("[class *= '" + moyenneGClass + "']")) {
            document.querySelector("tr > td.moyennegenerale-valeur").innerHTML = document.querySelector("tr > td.moyennegenerale-valeur").innerHTML + '<br><span class="' + moyenneGClass + '" style="' + moyenneGStyle + '">' + overallAverageElement.innerHTML + '</span>'
        } else {
            document.querySelector("[class *= '" + moyenneGClass + "']").textContent = moyenneG.toFixed(5)
        }
    } else {
        let overallAverageElement = document.createElement("tr")
        overallAverageElement.innerHTML = '<tr class="ng-star-inserted"><td colspan="2" class="text-right moyennegeneralelibelle">Moyenne générale</td><td colspan="2" class="moyennegenerale-valeur"><span class="' + moyenneGClass + '" style="' + moyenneGStyle + '">' + moyenneG.toFixed(5); + '</span></td></tr>'
        //console.log(10, overallAverageElement, document.querySelector("table.ed-table tbody"))
        
        if (!document.querySelector("[class *= '" + moyenneGClass + "']")) {
            document.querySelector("table.ed-table tbody").appendChild(overallAverageElement)
        } else {
            document.querySelector("[class *= '" + moyenneGClass + "']").textContent = moyenneG.toFixed(5)
        }
    }

    //console.log(moyenneG, matieresMoyenne, coeffMatTot)
}


function mainObjectif() {
    // Selector to get the "Evaluations" button
    let buttonSelector = "ul.nav-pills > li.active"
    
    // If there is no button to see the goals then we add it
    if (!document.querySelector("[class *= 'kmlc-bouton-objectif']")) {
        // We duplicate the "Evaluations" button, we add the class to know that he exist, and we add the click listener
        let objectifNoteButton = document.querySelector(buttonSelector).cloneNode(true)
        objectifNoteButton.className = objectifNoteButton.className.replace("active", " kmlc-bouton-objectif ")
        
        objectifNoteButton.children[0].removeAttribute("href")
        objectifNoteButton.children[0].children[0].textContent = "Voir les objectifs"
        objectifNoteButton.addEventListener('click', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            // We get the goals and we add them to a multi-line text
            browser.storage.sync.get({"objectifMoyenne": []}, function(items) {
                let objectifText = ``
                
                if (!items.objectifMoyenne[id]) {
                    items.objectifMoyenne[id] = [];
                }
                
                for (let i = 0; i < items.objectifMoyenne[id].length; i++) objectifText += items.objectifMoyenne[id][i][0] + " : " + items.objectifMoyenne[id][i][1] + `
`
                //console.log(789, items.objectifMoyenne)
                alert(objectifText)
            })
        })
        
        document.querySelector(buttonSelector).parentElement.insertBefore(objectifNoteButton, document.querySelector(buttonSelector))
        
        // Same here
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
    
    // Get all the average without the average goal class (to know that the right click listener has been set)
    let matieres = document.querySelectorAll("td[class *= 'relevemoyenne']:not([class *= 'kmlc-objectif-moyenne'])")
    
    // For each average box set the right click listener (that let the user to set an average goal)
    for (let i = 0; i < matieres.length; i++) {
        if (matieres[i].getAttribute("class")) {
            matieres[i].setAttribute("class", matieres[i].className + " kmlc-objectif-moyenne")
        } else {
            matieres[i].setAttribute("class", "kmlc-objectif-moyenne")
        }
        
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
                ajouterObjectifNote(items.objectifMoyenne)
            }
        });
        
        // We have to launch it once before the user use it
        if (objectifFirstLaunch) {
            ajouterObjectifNote(items.objectifMoyenne)
            objectifFirstLaunch = 0;
        }
    });
}

function ajouterObjectifNote(objectifMoyenne) {
    // Get all the averages boxes and all the subject name
    let moyennes = document.querySelectorAll("td[class *= 'relevemoyenne'][class *= 'kmlc-objectif-moyenne']")
    let nomMatieres = document.querySelectorAll("[class *= 'nommatiere'] > b")
    
    //console.log("objectif 1", objectifMoyenne)
    
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
                    if (!moyennes[j].className.includes("kmlc-objectif-moyenne-set")) {
                        let matiereNote = parseFloat(moyennes[j].children[0].textContent.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
                        let noteObjectif = parseFloat(objectifMoyenne[id][i][1])
                        
                        if (matiereNote > noteObjectif) {
                            backgroundColor = " background-color: rgb(0, 255, 0, 0.5);"
                        } else if (matiereNote < noteObjectif) {
                            backgroundColor = " background-color: rgb(255, 0, 0, 0.5);"
                        } else if (matiereNote.toString().split(".")[0] == noteObjectif.toString().split(".")[0]) {
                            backgroundColor = " background-color: rgb(255, 127.5, 0, 0.5);"
                        } else {
                            backgroundColor = " background-color: rgb(255, 255, 255);"
                        }
                        
                        //console.log("objectif 2", backgroundColor, noteObjectif, matiereNote)
                        
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

function mainChart(note) {
    // Check if a chart exist (if there is one, the other one is here)
    if (!document.querySelector("[class *= 'kmlc-chart']")) {
        // Add the canvas whee there will be each chart
        document.getElementById("encart-notes").innerHTML += "<canvas id='chart-curve' class='kmlc-chart-curve'></canvas><canvas id='chart-bar' class='kmlc-chart-bar'></canvas>";
        
        // Get the actual selected periode and init all the variables
        let periode = document.querySelector("ul[class *= 'tabs'] > li > [class *= 'nav-link active']").textContent
        let codePeriode, dateDebut, dateFin;
        let notes = [];
        let notesTot = [];
        
        // We duplicate the response of the http request because we will modify it later
        let varNote = JSON.parse(JSON.stringify(note))
        // console.log(varNote, note)
        
        // For each periode we check if the periode and the selected periode are the same. If yes then we save the date of start and end and the code of the periode
        for (let i = 0; i < varNote.periodes.length; i++) {
            if (varNote.periodes[i].periode === periode) {
                // console.log(varNote.periodes[i])
                codePeriode = varNote.periodes[i].codePeriode;
                dateDebut = varNote.periodes[i].dateDebut.convertToTimestamp()
                dateFin = varNote.periodes[i].dateFin.convertToTimestamp()
                break;
            }
        }
        
        // If the periode exist
        if (Boolean(codePeriode)) {
            
            // For each grade
            for (let i = 0; i < varNote.notes.length; i++) {
                // console.log(dateDebut, varNote.notes[i].date.convertToTimestamp(), varNote.notes[i].dateSaisie.convertToTimestamp(), dateFin)
                
                // We check if the grade is significant or not (if the note has to be counted or not)
                if (varNote.notes[i].nonSignificatif == false) {
                    // Is significant
                    let pass = false;
                    
                    // console.log(codePeriode, codePeriode.includes("R"))
                    
                    // We check if each grade is between the date of start and end
                    if (codePeriode.includes("R") && dateDebut <= varNote.notes[i].date.convertToTimestamp() && varNote.notes[i].date.convertToTimestamp() <= dateFin) pass = true
                    if (!codePeriode.includes("R") && dateDebut <= varNote.notes[i].dateSaisie.convertToTimestamp() && varNote.notes[i].dateSaisie.convertToTimestamp() <= dateFin) pass = true
                    
                // if ((codePeriode.includes(note.notes[i].codePeriode) && note.notes[i].nonSignificatif == false) && (dateDebut <= note.notes[i].dateSaisie.convertToTimestamp() && note.notes[i].dateSaisie.convertToTimestamp() <= dateFin) || (dateDebut <= note.notes[i].date.convertToTimestamp() && note.notes[i].date.convertToTimestamp() <= dateFin)) {
                    if (pass) {
                        
                        // If it is he pass and we convert the values that we need to numbers
                        let tempNote = Number(("" + varNote.notes[i].valeur).replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""))
                        if (tempNote) {
                            // note.notes[i].valeur = tempNote;
                            // note.notes[i].noteSur = Number(note.notes[i].noteSur)
                            // note.notes[i].coef = Number(note.notes[i].coef)
                            // notes.push(note.notes[i])
                            
                            varNote.notes[i].valeur = tempNote;
                            varNote.notes[i].noteSur = Number(varNote.notes[i].noteSur)
                            varNote.notes[i].coef = Number(varNote.notes[i].coef)
                            notes.push(varNote.notes[i])
                        }
                    }
                }
            }
            
            // console.log(notes)
            
            // If there is a grade
            if (notes) {
                let moyenneGEvo = [];
                
                let etendue = [];
                
                let coeffMoyenne = [];
                let sommeDesCarrees = [];
                let variance = [];
                let ecartType = [];
                
                let premierQuartile = [];
                let mediane = [];
                let troisiemeQuartile = [];
                
                let diffInterQuartile = [];
                
                let sommeDesValeurs = [];
                
                let datasNotes = [];
                
                // For each grade
                for (let i = 0; i < notes.length; i++) {
                    let notesTri = [];
                    let notesOrdreCroissant = [];
                    let sommeNotes = 0;
                    
                    datasNotes.push([Number(notes[i].coef), Number(notes[i].noteSur)])
                    
                    // We get all the grades before the actual grade and the actual grade and we push the whole array to notesTri
                    // In notesOrdreCroissant, this is only the value of the grade that his pushed because it will be sorted later from the smallest to the highest value
                    // And also the coefficient to calculate the quartiles and the median
                    for (let j = 0; j <= i; j++) {
                        notesTri.push(notes[j])
                        notesOrdreCroissant.push([((notes[j].valeur) * 20/notes[j].noteSur).toFixed(2), notes[j].coef])
                    }
                    
                    // We save the total value of all the grades before the actual grade and the actual grade where each of them are multiplied with their coefficient
                    // And then summed
                    for (let j = 0; j < notesOrdreCroissant.length; j++)
                        sommeNotes += notesOrdreCroissant[j][0] * notesOrdreCroissant[j][1]
                    
                    // We push it to an array containing all the total values
                    sommeDesValeurs.push(sommeNotes)
                    
                    // We sort all the grades from the smallest to the highest value 
                    notesOrdreCroissant.sort(function(a, b) {
                        return a[0] - b[0];
                    });
                    
                    // We calculate and save the range of the grades
                    etendue.push(notesOrdreCroissant[notesOrdreCroissant.length - 1][0] - notesOrdreCroissant[0][0])
                    
                    // We calculate the first quartile, the median, and the third quartile
                    premierQuartile.push(notesOrdreCroissant[Math.round((notesOrdreCroissant.length + 3)/4) - 1][0])
                    mediane.push(notesOrdreCroissant[Math.round((2 * notesOrdreCroissant.length + 2)/4) - 1][0])
                    troisiemeQuartile.push(notesOrdreCroissant[Math.round((3 * notesOrdreCroissant.length + 1)/4) - 1][0])
                    
                    // We calculate the first and third quartile range (interquartile range)
                    diffInterQuartile.push(troisiemeQuartile[i] - premierQuartile[i])
                    
                    // We sort all the grades by subject in an object (and also by date)
                    let tempNotesTri = {};
                    for (let j = 0; j < notesTri.length; j++) {
                        let matiere = notesTri[j].libelleMatiere;
                        
                        if (!tempNotesTri[matiere]) {
                            tempNotesTri[matiere] = [];
                        }
                        
                        tempNotesTri[matiere].push(notesTri[j]);
                    };
                    
                    // We save it
                    notesTri = Object.values(tempNotesTri);
                    // console.log(notesTri)
                    
                    let moyenneNotes = 0;
                    let coeffMoyenneNotes = 0;
                    
                    // Each grade has to be in it's subject
                    if (coeffMoyenne[i] != []) coeffMoyenne[i] = []
                    
                    // For each grade
                    for (let j = 0; j < notesTri.length; j++) {
                        let addNotes = 0;
                        let addCoeff = 0;
                        
                        let matCoeff = 0;
                        let matMoyenne = 0;
                        
                        // We sum all the grades multiplied by their coefficient and we save the result
                        // We also save the sum of all the coefficient
                        for (let k = 0; k < notesTri[j].length; k++) {
                            // console.log(notesTri[j])
                            addNotes += ((notesTri[j][k].valeur * 20)/notesTri[j][k].noteSur) * notesTri[j][k].coef
                            addCoeff += notesTri[j][k].coef
                        }
                        
                        // For each periode we get the coefficient of the subject
                        for (let k = 0; k < varNote.periodes.length; k++) {
                            if (varNote.periodes[k].codePeriode.includes(codePeriode)) {
                                for (let l = 0; l < varNote.periodes[k].ensembleMatieres.disciplines.length; l++) {
                                    if (varNote.periodes[k].ensembleMatieres.disciplines[l].discipline == notesTri[j][0].libelleMatiere) {
                                        matCoeff = varNote.periodes[k].ensembleMatieres.disciplines[l].coef
                                    }
                                }
                            }
                        }
                        
                        // We calculate the mean of the subject, we multiply it with his coefficient and we save the total number of coefficient and we push the mean value and his coefficient
                        matMoyenne = (addNotes/addCoeff).toFixed(5)
                        moyenneNotes += matMoyenne * matCoeff
                        coeffMoyenneNotes += matCoeff
                        coeffMoyenne[i].push([matMoyenne, matCoeff])
                    }
                    
                    // We push the mean of all the means
                    moyenneGEvo.push((moyenneNotes/coeffMoyenneNotes).toFixed(5))
                }
                
                // We get the actual mean
                let moyenneG = new Array(notes.length).fill(Number(document.querySelector(".kmlc-moyenne-g").textContent));
                
                // We get the number from 1 to the number of grades (from the x axis)
                let labelsCurve = []
                for (let i = 1; i <= notes.length; i++) {
                    labelsCurve.push(i.toString());
                }
                
                // We push the value of each grade
                for (let i = 0; i < notes.length; i++) {
                    notesTot.push(((notes[i].valeur * 20)/notes[i].noteSur).toFixed(2))
                }
                
                // We calculate the sum of squared values
                for (let i = 0; i < coeffMoyenne.length; i++) {
                    let tmpSommeDesCarres = 0;
                    
                    // console.log(coeffMoyenne[i])
                    for (let j = 0; j < coeffMoyenne[i].length; j++) {
                        tmpSommeDesCarres += (coeffMoyenne[i][j][1] * (coeffMoyenne[i][j][0] - moyenneGEvo[i]))**2
                    }
                    
                    sommeDesCarrees.push(tmpSommeDesCarres)
                }
                
                // We calculate the variance
                for (let i = 0; i < coeffMoyenne.length; i++) {
                    let tmpCoeff = 0;
                    
                    // console.log(coeffMoyenne[i])
                    for (let j = 0; j < coeffMoyenne[i].length; j++) {
                        tmpCoeff += coeffMoyenne[i][j][1]
                    }
                    
                    variance.push((sommeDesCarrees[i]/tmpCoeff).toFixed(2))
                }
                
                // We calculate the standard deviation
                for (let i = 0; i < variance.length; i++) {
                    ecartType.push(Math.sqrt(variance[i]).toFixed(2))
                }
                
                // console.log(123456, 5, moyenneGEvo, notesTot)
                
                let radius = 4;
                let tension = 0.2;
                let pointHoverRadius = 5;
                
                // console.log(premierQuartile, mediane, troisiemeQuartile, sommeDesValeurs)
                
                // We create the chart
                let datasCurve = {
                    type: 'line',
                    data: {
                        labels: labelsCurve,
                        datasets: [{
                            label: 'Notes',
                            data: notesTot,
                            borderColor: "rgb(0, 0, 0)",
                            tension: tension,
                            pointRadius: radius,
                            pointHoverRadius: pointHoverRadius
                        },{
                            label: 'Evolution de la moyenne générale en fonction des notes',
                            data: moyenneGEvo,
                            borderColor: "rgb(255, 0, 0)",
                            tension: tension,
                            pointRadius: radius,
                            pointHoverRadius: pointHoverRadius
                        },{
                            label: 'Moyenne générale',
                            data: moyenneG,
                            borderColor: "rgb(0, 0, 255)",
                            tension: tension,
                            pointRadius: radius,
                            pointHoverRadius: pointHoverRadius,
                            pointBorderColor: "rgba(0, 0, 255)"
                        },{
                            label: 'Étendue',
                            data: etendue,
                            borderColor: "rgb(0, 255, 0)",
                            tension: tension,
                            pointRadius: radius,
                            pointHoverRadius: pointHoverRadius,
                            hidden: true
                        },{
                            label: 'Variance',
                            data: variance,
                            borderColor: "rgb(255, 255, 0)",
                            tension: tension,
                            pointRadius: radius,
                            pointHoverRadius: pointHoverRadius,
                            hidden: true
                        },{
                            label: 'Écart type',
                            data: ecartType,
                            borderColor: "rgb(128, 0, 128)",
                            tension: tension,
                            pointRadius: radius,
                            pointHoverRadius: pointHoverRadius
                        },{
                            label: 'Somme des carrées',
                            data: sommeDesCarrees,
                            borderColor: "rgb(255, 127.5, 0)",
                            tension: tension,
                            pointRadius: radius,
                            pointHoverRadius: pointHoverRadius,
                            hidden: true
                        },{
                            label: 'Somme des valeurs',
                            data: sommeDesValeurs,
                            borderColor: "rgb(255, 200, 0)",
                            tension: tension,
                            pointRadius: radius,
                            pointHoverRadius: pointHoverRadius,
                            hidden: true
                        },{
                            label: 'Premier quartile',
                            data: premierQuartile,
                            borderColor: "rgb(255, 140, 0)",
                            tension: tension,
                            pointRadius: radius,
                            pointHoverRadius: pointHoverRadius,
                            hidden: true
                        },{
                            label: 'Médiane',
                            data: mediane,
                            borderColor: "rgb(148, 0, 211)",
                            tension: tension,
                            pointRadius: radius,
                            pointHoverRadius: pointHoverRadius,
                            hidden: true
                        },{
                            label: 'Troisième quartile',
                            data: troisiemeQuartile,
                            borderColor: "rgb(184, 134, 11)",
                            tension: tension,
                            pointRadius: radius,
                            pointHoverRadius: pointHoverRadius,
                            hidden: true
                        },{
                            label: 'Différence interquartile',
                            data: diffInterQuartile,
                            borderColor: "rgb(153, 102, 204)",
                            tension: tension,
                            pointRadius: radius,
                            pointHoverRadius: pointHoverRadius,
                            hidden: true
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    footer: function (tooltipItems) {
                                        let coeff = 1;
                                        let notesur = 20;

                                        for (let i = 0; i < tooltipItems.length; i++) {
                                            if (tooltipItems[i].dataset.label == "Notes") {
                                                coeff = datasNotes[tooltipItems[i].dataIndex][0]
                                                notesur = datasNotes[tooltipItems[i].dataIndex][1]

                                                if (notesur == 20) {
                                                    if (tooltipItems[i].dataIndex - 1 >= 0) {
                                                        return `Coefficient: ${coeff}
Note sur: ${notesur}
Variation de la moyenne générale de: ${(moyenneGEvo[tooltipItems[i].dataIndex] - moyenneGEvo[tooltipItems[i].dataIndex - 1]).toFixed(3)}`
                                                    } else {
                                                        return `Coefficient: ${coeff}
Note sur: ${notesur}`
                                                    }
                                                } else {
                                                    if (tooltipItems[i].dataIndex - 1 >= 0) {
                                                        return `Coefficient: ${coeff}
Note sur: ${notesur}
Revient à: ${(Number(tooltipItems[i].raw) * 20/notesur).toFixed(2)/20}
Variation de la moyenne générale de: ${(moyenneGEvo[tooltipItems[i].dataIndex] - moyenneGEvo[tooltipItems[i].dataIndex - 1]).toFixed(3)}`
                                                    } else {
                                                        return `Coefficient: ${coeff}
Note sur: ${notesur}
Revient à: ${(Number(tooltipItems[i].raw) * 20/notesur).toFixed(2)}/20`
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                          title: {
                                display: true,
                                text: 'Evolution des notes'
                            }
                        },
                        scales: {
                            y: {
                                suggestedMax: 20,
                                suggestedMin: 0,
                                ticks: {
                                    suggestedMax: 1
                                }
                            }
                        }
                    },
                }
                
                let chartCurve = new Chart(document.getElementById("chart-curve").getContext('2d'), datasCurve);
                
                // We create an array with the value of each grade
                let notesListe = [];
                for (let i = 0; i < notes.length; i++) {
                    notesListe.push(((notes[i].valeur * 20)/notes[i].noteSur).toFixed(2))
                };
                
                // For each grade we calculate the number of times a grade appear. It create an object with each different grade and in them there is all the same grades
                let tempNotesTri = [];
                for (let i = 0; i < notesListe.length; i++) {
                    let tempNote = notesListe[i];
                    
                    if (!tempNotesTri[tempNote]) {
                        tempNotesTri[tempNote] = [];
                    }
                    
                    tempNotesTri[tempNote].push(notesListe[i]);
                };
                
                // console.log(tempNotesTri)
                
                // We sort it from the smallest to the biggest value
                notesListe = Object.values(tempNotesTri).sort(function(a, b) {
                    return a[0] - b[0];
                });
                
                // We get the number of same grade (for the x axis)
                let labelsBar = []
                for (let i = 0; i < notesListe.length; i++) {
                    labelsBar.push(notesListe[i][0].toString());
                };
                
                // We sort it from the smallest to the biggest value
                labelsBar.sort(function(a, b) {
                    return a - b;
                })
                
                // We save the number of same grades values
                tempNotesTri = [];
                for (let i = 0; i < notesListe.length; i++) {
                    tempNotesTri.push(notesListe[i].length)
                }
                
                notesListe = tempNotesTri
                
                // console.log(notesListe, labelsBar)
                
                let barsColor = [];
                let tempBarColor;
                
                let percentageRouge = 0;
                let percentageOrange = 0;
                let percentageVert = 0;
                let effectifPercentage = labelsBar.length;
                
                // Set the color of each bar and add one to the color number (that I can divide by the total number to get the percentage)
                for (let i = 0; i < labelsBar.length; i++) {
                    if (labelsBar[i].toString().split(".")[0] == Number(document.querySelector(".kmlc-moyenne-g").textContent.toString().split(".")[0])) {
                        tempBarColor = "rgba(255, 127.5, 0, 1)"
                        percentageOrange += 1
                    } else if (labelsBar[i] > Number(document.querySelector(".kmlc-moyenne-g").textContent)) {
                        tempBarColor = "rgba(0, 255, 0, 1)"
                        percentageVert += 1
                    } else if (labelsBar[i] < Number(document.querySelector(".kmlc-moyenne-g").textContent)) {
                        tempBarColor = "rgba(255, 0, 0, 1)"
                        percentageRouge += 1
                    } else {
                        tempBarColor = "rgba(0, 0, 0, 1)"
                    }
                    
                    barsColor.push(tempBarColor)
                }
                
                barsColor = Object.values(barsColor)
                
                // We set the chart datas and options
                let datasBar = {
                    type: "bar",
                    data: {
                        labels: labelsBar,
                        datasets: [{
                            label: 'Notes',
                            data: notesListe,
                            backgroundColor: barsColor
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Nombre de notes'
                            },
                            legend: {
                                display: true,
                                position: "top",
                                align: "center",
                                fontFamily: "Arial",
                                labels: {
                                    generateLabels: (chart) => {
                                        let maxLeft = (document.querySelector("#chart-bar").width/2)-20; // chart length/2 to get the middle and minus 20 because the length of the legend box color is 41 and 41/2 is around 20
                                        let maxWidth = 41; // The length of the legend box color is 41
                                        
                                        // The gradient as to be positioned manually in the exact same coordinate as the legend box color
                                        // The measurement have been made with Photoshop and a screenshot with a 1920x1080px length
                                        
                                        let datasets = chart.data.datasets;
                                        let {labels: {usePointStyle, pointStyle, textAlign, color}} = chart.legend.options;
                                        
                                        return chart._getSortedDatasetMetas().map((meta) => {
                                            let style = meta.controller.getStyle(usePointStyle ? 0 : undefined);
                                            let borderWidth = style.borderWidth;
                                            
                                            // if (box?.left > maxLeft) {
                                                // maxLeft = box.left;
                                            // }
                                            // if (box?.width > maxWidth) {
                                                // maxWidth = box.width;
                                            // }
                                            
                                            // Here with convert the length from 1920x1080px based length to the resolution of the displayed web page
                                            let gradient = chart.ctx.createLinearGradient(maxLeft*document.querySelector("html").clientWidth/1920, 0, (maxLeft + maxWidth)*document.querySelector("html").clientWidth/1920, 0);
                                            // console.log(maxLeft*document.querySelector("html").clientWidth/1080, (maxLeft + maxWidth)*document.querySelector("html").clientWidth/1920, percentageRouge, percentageVert, percentageOrange, effectifPercentage)
                                            
                                            let perc;
                                            
                                            // The red color start from 0% to xRed% - 10%
                                            gradient.addColorStop(0.00, 'rgba(255, 0, 0, 1)');
                                            
                                            perc = (percentageRouge/effectifPercentage).toFixed(2) - 0.10
                                            if (perc < 0) perc = 0;
                                            
                                            gradient.addColorStop(perc, 'rgba(255, 0, 0, 1)');
                                            
                                            // The orange color start from xRed% to xRed% + xOrange%
                                            perc = Number((percentageRouge/effectifPercentage).toFixed(2)) + Number((percentageOrange/effectifPercentage).toFixed(2))
                                            if (perc < 0) perc = 0;
                                            
                                            gradient.addColorStop(perc, 'rgba(255, 127.5, 0, 1)');
                                            
                                            // The green color start from xRed% + xOrange% to 100%
                                            gradient.addColorStop(1.00, 'rgba(0, 255, 0, 1)');
                                            
                                            
                                            // gradient.addColorStop(0.00, 'rgba(255, 0, 0, 1)'); // 70% rouge
                                            // gradient.addColorStop(0.60, 'rgba(255, 0, 0, 1)'); // 70% rouge
                                            
                                            // gradient.addColorStop(0.70, 'rgba(255, 127.5, 0, 1)'); // 10% orange
                                            
                                            // gradient.addColorStop(0.80, 'rgba(0, 255, 0, 1)'); // 20% vert
                                            // gradient.addColorStop(1.00, 'rgba(0, 255, 0, 1)'); // 20% vert
                                            
                                            // console.log(meta.visible)
                                            return {
                                                text: datasets[meta.index].label,
                                                fillStyle: gradient, // style.backgroundColor,
                                                fontColor: color || style.fontColor,
                                                hidden: !meta.visible,
                                                lineCap: style.borderCapStyle,
                                                lineDash: style.borderDash,
                                                lineDashOffset: style.borderDashOffset,
                                                lineJoin: style.borderJoinStyle,
                                                lineWidth: (borderWidth.width + borderWidth.height) / 4,
                                                strokeStyle: style.borderColor,
                                                pointStyle: pointStyle || style.pointStyle,
                                                rotation: style.rotation,
                                                textAlign: textAlign || style.textAlign,
                                                borderRadius: 0,
                                                datasetIndex: meta.index
                                            };
                                        }, this);
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                suggestedMin: 0,
                                ticks: {
                                    stepSize: 1
                                }
                            }
                        },
                        maxBarThickness: 55
                    }
                }
                 
                // We create the chart with the "generateLabels" function modified so we can change the legend box color
                window.chartBar = new Chart(document.getElementById("chart-bar").getContext('2d'), datasBar);
            }
            
            window.chartBar.update()
        }
    }
}