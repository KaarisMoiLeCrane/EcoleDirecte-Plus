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
        console.log(1111100404084084084, xhr.readyState, document.querySelector("td span[class = 'ng-star-inserted']"))
        if (xhr.readyState === 4) {
            console.log(4444444)
            
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
                        if (mutation.target.children[0].innerText == "Moyennes" || mutation.target.children[0].innerText == "Evaluations") {
                            mainNotes(note)
                        }
                    } catch(e){}
                });
            });
            
            executeNotesObserver(notesObserver);
            
            function executeNotesObserver(observer) {
                
                // Wait for the parent containing the table that isn't modified or removed when something in the table change
                document.waitForElement("[class *= 'tab-content']").then((elm) => {
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
        console.log(456)
        // If there is already two things with the class "coef" etc, it means that our new category "Rang". If not, we apply our changes
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
                let periode = document.querySelector("li.ng-star-inserted.active:not(.nav-item)")
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
    if (!document.querySelector("[class *= 'kmlc-text-note']")) {
        let textSimu = document.querySelector("table caption").parentElement.getElementsByContentText("(note)").startsWith[0].cloneNode(true)
        textSimu.className = "kmlc-text-note"
        
        textSimu.children[0].textContent = "note"
        textSimu.children[0].setAttribute("style", "color: green;")
        textSimu.children[1].textContent = "Note ajoutée pour simulation"
        textSimu.className = "kmlc-text-note"
        
        document.querySelector("table caption").parentElement.getElementsByContentText("(note)").startsWith[0].insertAfter(textSimu)
    }
    
    if (!document.querySelector("[class *= 'kmlc-bouton-note']")) {
        let ajoutNote = document.querySelector("ul > li.active.nav-item.ng-star-inserted").cloneNode(true)
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
            
            let promptMat = prompt("Matière (La même que affiché dans le tableau)");
            if (promptMat != "") {
                promptTitre = prompt("Titre (Pour contextualiser la note)")
                if (promptTitre == "") promptTitre = "Évaluation"
                
                promptNote = prompt("Note (Un nombre seulement)")
                if (promptNote != "") {
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
        
        document.querySelector("ul > li.active.nav-item.ng-star-inserted").parentElement.insertBefore(ajoutNote, document.querySelector("ul > li.active.nav-item.ng-star-inserted"))
    }
}


function ajouterNote(matiere, titre, note, coeff, quotient) {
    let noteElement = document.createElement("BUTTON")
    noteElement.className = "kmlc-note-simu"
    
    let listMatiere = document.querySelectorAll("[class *= nommatiere]")
    
    for (let i = 0; i < listMatiere.length; i++) {
        if (listMatiere[i].textContent == matiere) {
            listMatiere[i].parentElement.parentElement.querySelector("[class *= 'notes']").appendChild(noteElement)
            listMatiere[i].parentElement.parentElement.querySelector("[class = 'kmlc-note-simu']").outerHTML = '<button type="button" class="kmlc-note-simu note cliquable margin-whitespace btn-simple no-background no-padding ng-star-inserted" title=" '+ titre + '"><!----><span class="valeur ng-star-inserted" style="color: green;"> ' + note + ' <!----><sup class="coef ng-star-inserted"> ' + coeff + ' <span class="margin-whitespace"></span></sup><!----><sub class="coef ng-star-inserted"> /' + quotient + ' <span class="margin-whitespace"></span></sub></span><!----><!----><!----></button>'
        }
    }
    
    calculerMoyennes("kmlc-simu-moyenne-g", "color: green;", "kmlc-simu-moyenne", "color: green;")
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
                        matNote = parseFloat(matiereNotes[j].getAttribute("anciennenote").replace(/[()\/\s]/g, "").replace(",", "."));
                    } else {
                        matNote = parseFloat(20)
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

            // Duplicate the average element of the subject to add in a the second line the average calculated by EcoleDirecte Plus
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
    
    // If there is the overall average row we add our overall average in the second. If not, we create it and put it in the second line as well (the first line is blank)
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


function mainModifierNote () {
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
    
    let matNotes = document.querySelectorAll("span.valeur:not([kmlc-event-listener])")
    
    for (let i = 0; i < matNotes.length; i++) {
        matNotes[i].setAttribute("kmlc-event-listener", true)
        matNotes[i].addEventListener('contextmenu', function(e) {
            e.stopPropagation();
            e.preventDefault();

            let nouvelleNote = prompt("Nouvelle note").replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")

            let nouveauCoeff = prompt("Nouveau coefficient").replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")

            let nouveauQuotient = prompt("Nouveau quotient").replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")

            if (nouvelleNote != "" && nouveauCoeff != "" && nouveauQuotient != "") {
                if (this.getAttribute("class")) {
                    this.setAttribute("class", this.getAttribute("class").replace("kmlc-note-modifier", "") + " kmlc-note-modifier")
                } else {
                    this.setAttribute("class", "kmlc-note-modifier")
                }

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
                
                this.childNodes[0].nodeValue = " " + nouvelleNote + " "
                
                if (this.querySelector("sup")) {
                    this.querySelector("sup").textContent = " (" + nouveauCoeff + ") "
                } else {
                    let supElement = document.createElement("SUP")
                    supElement.className = "kmlc-sup-modifier"
                    
                    this.appendChild(supElement)
                    
                    this.querySelector("sup").outerHTML = '<sup class="coef ng-star-inserted"> (' + nouveauCoeff + ') <span class="margin-whitespace"></span></sup>'
                }

                if (this.querySelector("sub")) {
                    this.querySelector("sub").textContent = "/" + nouveauQuotient + " "
                } else {
                    let subElement = document.createElement("SUB")
                    subElement.className = "kmlc-sub-modifier"
                    
                    this.appendChild(subElement)
                    
                    this.querySelector("sub").outerHTML = '<sub class="coef ng-star-inserted"> /' + nouveauQuotient + ' <span class="margin-whitespace"></span></sub>'
                }

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
