globalThis.Notes.modifierNote = function () {
    // If the table in the bottom was changed and then we add the text "Note modifiée"
    if (!document.querySelector("[kmlc-text-modifier-note]")) {
        let textSimu = document.querySelector("table caption").parentElement.getElementsByContentText("(note)").startsWith[0].cloneNode(true)
        textSimu.setAttribute("kmlc-text-modifier-note", "true")
        
        textSimu.children[0].textContent = ""
        textSimu.children[0].setAttribute("style", "")
        
        let spanElement = document.createElement("SPAN")
        spanElement.textContent = "note"
        spanElement.setAttribute("style", "border-bottom: 1px solid green;")
        
        textSimu.children[1].textContent = "Note modifiée"
        
        textSimu.setAttribute("kmlc-text-modifier-note", "true")
        
        document.querySelector("table caption").parentElement.getElementsByContentText("(note)").startsWith[0].insertAfter(textSimu)
        textSimu.children[0].appendChild(spanElement)
    }
    
    // Get all the grades that they don't have the right click listener
    let matNotes = document.querySelectorAll("span.valeur:not([kmlc-event-listener])")
    // console.log("No right click listener", matNotes)
    
    for (let i = 0; i < matNotes.length; i++) {
        // Add the attribute to know that the click listener has been added
        matNotes[i].setAttribute("kmlc-event-listener", "true")
        matNotes[i].addEventListener('contextmenu', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            let pass = 0;
			
			// Ask for the new grade, coefficient and quotient
            let nouvelleNote = prompt("Nouvelle note")
            let nouveauCoeff = prompt("Nouveau coefficient")
            let nouveauQuotient = prompt("Nouveau quotient")
            
			// If nothing return
            if ((!nouvelleNote && !nouveauCoeff && !nouveauQuotient)) return
            
			// If he put a new value but it's the same than the old one or he put an invalid value we add 1 to the pass variable
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
            
			// If pass == 3 it means that no changes have to be done
            if (pass == 3) return

			// Another check but I don't know if we really need it because of the other checks
            if (nouvelleNote != "" && nouveauCoeff != "" && nouveauQuotient != "") {
                // Add the attribute to know that the grade has been modified
				this.setAttribute("kmlc-note-modifier", "true")

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
                    supElement.setAttribute("kmlc-sup-modifier", "true")
                    
                    this.appendChild(supElement)
                    
                    this.querySelector("sup").outerHTML = '<sup class="coef ng-star-inserted"> (' + nouveauCoeff + ') <span class="margin-whitespace"></span></sup>'
                }

                // Change/Add the quotient
                if (this.querySelector("sub")) {
                    this.querySelector("sub").textContent = "/" + nouveauQuotient + " "
                } else {
                    let subElement = document.createElement("SUB")
                    subElement.setAttribute("kmlc-sub-modifier", "true")
                    
                    this.appendChild(subElement)
                    
                    this.querySelector("sub").outerHTML = '<sub class="coef ng-star-inserted"> /' + nouveauQuotient + ' <span class="margin-whitespace"></span></sub>'
                }
                
                // Add the one pixel green underline
                if (this.getAttribute("style")) {
                    this.setAttribute("style", this.getAttribute("style").replace("border-bottom: 1px solid green;", "") + " border-bottom: 1px solid green;")
                } else {
                    this.setAttribute("style", "border-bottom: 1px solid green;")
                }
                
                globalThis.Notes.calculerMoyennes("kmlc-simu-modifier-moyenne-g", "border-bottom: 1px solid green; color: green;", "kmlc-simu-modifier-moyenne", "border-bottom: 1px solid green; color: green;")
			}
        }, false);
    }
}