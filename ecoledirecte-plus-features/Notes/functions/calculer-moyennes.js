globalThis.Notes.calculerMoyennes = function (moyenneGAttr, moyenneGStyle, moyenneAttr, moyenneStyle, ancienneNote = false, querySelectorExclusion = "") {
    // We get all the displayed grades
    let matNotes = document.querySelectorAll("span.valeur" + querySelectorExclusion);
    // console.log(3, matNotes)
    let lignes = [];
    
    // We init the overall average, the value of all the subjects average, the excessed coefficients (coefficients counted when there are no grades) and the total coefficients (that he will divide all the grades to get the overall average)
    let moyenneG = 0.0
    let matieresMoyenne = 0.0;
    let coeffEnTrop = 0.0;
    let coeffMatTot = 0.0;
    
    // For each grades, get the row containing all the datas about the subject and then push each row element, if they are not in the list, to our lignes list
    for (let i = 0; i < matNotes.length; i++) {
        let parent = matNotes[i].parentElement.parentElement.parentElement;
        // console.log(4, parent, matNotes[i])
        if (!lignes.includes(parent)) {
            lignes.push(parent);
        }
    }

    // For each rows, get all the grades in the row (so all the grades of a specific subject), and calculate the average of the subject
    for (let i = 0; i < lignes.length; i++) {
        
        // Get all the grades in the row, init the overall average of the subject and init the vraiable to set the total coefficients of all the grades in the subject
        let matiereNotes = lignes[i].querySelectorAll("span.valeur")
        // console.log(5, matiereNotes)
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
                    if (matiereNotes[j].getAttribute("kmlc-note-modifier")) {
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
                    if (matiereNotes[j].getAttribute("kmlc-note-modifier")) {
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
                if (matiereNotes[j].getAttribute("kmlc-note-modifier")) {
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
            
            // console.log(6, matNote, matiereNotes[j].childNodes[0].nodeValue)

            // If there is a grade (0 is a grade but nothing and a grade between two parentheses is not a grade). matNote is a string so ``if ("0" && "0.0") //console.log(1)`` will log 1
            if (matNote) {
                // console.log(6.1, matNote)
                
                // Convert the grade to /20
                matNote = parseFloat(matNote)*20.0/quotient
                // console.log(6.2, matNote, coeff)
                
                // Multiply it with the coefficient of the grade, add it to the average value of the subject and add the coefficient with the total of coefficients of the subject
                addNotes += parseFloat(matNote*coeff);
                coeffNoteTot += coeff;
                // console.log(matiereNotes[j], addNotes, coeffNoteTot, coeff)
            }
        }
        
        // Get the coefficient of the subject
        let coeffMat = parseFloat(lignes[i].querySelector("td.coef:not([class *= 'text-center'])").innerText.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""));
        // console.log(7, coeffMat)
        
        // If the total of coefficients of the subject is 0 (so no grades to count)
        if (coeffNoteTot ==  0.0) {
            coeffEnTrop += coeffMat;
            // console.log(8, coeffMat, coeffNoteTot, addNotes, parseFloat(lignes[i].querySelector("td.coef:not([class *= 'text-center'])").innerText))
        } else {
            
            // We add the coefficient of the subject to the total of coefficient of the subjects
            coeffMatTot += coeffMat;
            
            // We calculate the average of the subject
            moyenne = (addNotes/coeffNoteTot);
            //console.log(moyenne);

            // Duplicate the average element of the subject to add in a new line the average calculated by EcoleDirecte Plus
            let averageElement = lignes[i].querySelector("td.relevemoyenne").cloneNode(true);
            averageElement.textContent = moyenne.toFixed(5)
            if (!lignes[i].querySelector("[" + moyenneAttr + "]")) {
                lignes[i].querySelector("td.relevemoyenne").innerHTML = lignes[i].querySelector("td.relevemoyenne").innerHTML + '<br><span ' + moyenneAttr + '="true" style="' + moyenneStyle + '">' + averageElement.innerHTML + '</span>';
            } else {
                lignes[i].querySelector("[" + moyenneAttr + "]").textContent = moyenne.toFixed(5)
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
        // console.log(9, document.querySelector("tr > td.moyennegenerale-valeur"))

        if (!document.querySelector("[" + moyenneGAttr + "]")) {
            document.querySelector("tr > td.moyennegenerale-valeur").innerHTML = document.querySelector("tr > td.moyennegenerale-valeur").innerHTML + '<br><span ' + moyenneGAttr + '="true" style="' + moyenneGStyle + '">' + overallAverageElement.innerHTML + '</span>'
        } else {
            document.querySelector("[" + moyenneGAttr + "]").textContent = moyenneG.toFixed(5)
        }
    } else {
        let overallAverageElement = document.createElement("tr")
        overallAverageElement.innerHTML = '<tr class="ng-star-inserted"><td colspan="2" class="text-right moyennegeneralelibelle">Moyenne générale</td><td colspan="2" class="moyennegenerale-valeur"><span ' + moyenneGAttr + '="true" style="' + moyenneGStyle + '">' + moyenneG.toFixed(5); + '</span></td></tr>'
        // console.log(10, overallAverageElement, document.querySelector("table.ed-table tbody"))
        
        if (!document.querySelector("[" + moyenneGAttr + "]")) {
            document.querySelector("table.ed-table tbody").appendChild(overallAverageElement)
        } else {
            document.querySelector("[" + moyenneGAttr + "]").textContent = moyenneG.toFixed(5)
        }
    }

    // console.log(moyenneG, matieresMoyenne, coeffMatTot)
}