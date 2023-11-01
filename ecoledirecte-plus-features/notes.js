globalThis.notes = function () {
    // Make an http request to get the grades
    let xhr = new XMLHttpRequest();
    // console.log(window.location.pathname.split("/"))
    // console.log(window.location.pathname.split("/")[2])
    url = "https://api.ecoledirecte.com/v3/Eleves/" + globalThis.userId + "/notes.awp?verbe=get";
    data = `data={}`;

    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.setRequestHeader("X-Token", globalThis.token);
    xhr.onreadystatechange = function() {
        // console.log(1111, xhr.readyState, document.querySelector("td span[class = 'ng-star-inserted']"))
        if (xhr.readyState === 4) {
            // console.log(4444)
            
            // When we receive all the homeworks
            let note = JSON.parse(xhr.responseText).data
            globalThis.quotient = parseFloat(note.parametrage.moyenneSur)
			
			globalThis.Notes.dataPeriodes = note.periodes
            
            document.waitForElement("[class *= 'tab-content']").then((elm) => {
                let periode = document.querySelector("#onglets-periodes > ul > li.active.nav-item")
                periode = Array.from(periode.parentNode.children).indexOf(periode)
				
				setPeriodesInfos(globalThis.Notes.dataPeriodes)
                
                globalThis.Notes.coeff(note)
                globalThis.Notes.rang(note)
				
                globalThis.Notes.calculerMoyennes(true, "kmlc-moyenne-g", "", "kmlc-moyenne", "", true, ":not([class *= 'simu'])")
                
                globalThis.Notes.charts(note)
                
                globalThis.Notes.ajouterNoteSimulation()
                globalThis.Notes.modifierNoteSimulation()
                
                globalThis.Notes.objectifSetup()
                
                globalThis.Notes.variationMoyenne(periode, note)
            })
            // console.log(1)
            var notesObserver = new MutationObserver(function (mutations) {
                // console.log(2)
                mutations.forEach(function (mutation) {
                    try {
                        // console.log(mutation.target)
                        // if (mutation.target.children[0].innerText == "Moyennes" || mutation.target.children[0].innerText == "Evaluations") {
                        if (mutation.target.children[0].innerText == "Evaluations" && mutation.target.children[0].nodeName == "SPAN") {
							// console.log(mutation.target.children[0])
							
                            let periode = document.querySelector("#onglets-periodes > ul > li.active.nav-item")
                            periode = Array.from(periode.parentNode.children).indexOf(periode)
							
							setPeriodesInfos(globalThis.Notes.dataPeriodes)
                            
                            globalThis.Notes.coeff(note)
                            globalThis.Notes.rang(note)
							
                            globalThis.Notes.calculerMoyennes(true, "kmlc-moyenne-g", "", "kmlc-moyenne", "", true, ":not([class *= 'simu'])")
                            
                            globalThis.Notes.charts(note)
                            
                            globalThis.Notes.ajouterNoteSimulation()
                            globalThis.Notes.modifierNoteSimulation()
                            
                            globalThis.Notes.objectifSetup()
                            
                            globalThis.Notes.variationMoyenne(periode, note)
                        }
                    } catch(e){
                        // console.log(e)
                    }
                });
            });
            
            executeNotesObserver(notesObserver);
            
            function executeNotesObserver(observer) {
                
                // Wait for the parent containing the table that isn't modified or removed when something in the table change
                document.waitForElement(".eleve-note").then((elm) => {
                    // console.log(789)
                    observer.observe(elm, {
                        characterData: false,
                        attributes: true,
                        attributeFilter: ['class'],
                        childList: true,
                        subtree: true
                    });
                });
            }
			
			function setPeriodesInfos(periodes) {
				let elmPeriodes = document.querySelectorAll("ul[class *= 'tabs'] > li > [class *= 'nav-link']")
				
				for (let i = 0; i < periodes.length; i++) {
					if (elmPeriodes[i].getAttribute("dateDebut")) continue
					
					elmPeriodes[i].setAttribute("dateDebut", periodes[i].dateDebut.convertToTimestamp())
					elmPeriodes[i].setAttribute("dateFin", periodes[i].dateFin.convertToTimestamp())
					elmPeriodes[i].setAttribute("codePeriode", periodes[i].codePeriode)
					
					if (periodes[i].codePeriode.includes("R")) elmPeriodes[i].setAttribute("R", "true")
					else elmPeriodes[i].setAttribute("R", "false")
				}
			}
        }
    }

    xhr.send(data);
}