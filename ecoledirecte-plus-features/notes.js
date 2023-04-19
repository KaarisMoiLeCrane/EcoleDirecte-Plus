globalThis.notes = function (id) {
    // Make an http request to get the grades
    let xhr = new XMLHttpRequest();
    // console.log(window.location.pathname.split("/"))
    // console.log(window.location.pathname.split("/")[2])
    url = "https://api.ecoledirecte.com/v3/Eleves/" + id + "/notes.awp?verbe=get";
    data = `data={}`;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.setRequestHeader("X-Token", globalThis.token);
    xhr.onreadystatechange = function() {
        // console.log(1111, xhr.readyState, document.querySelector("td span[class = 'ng-star-inserted']"))
        if (xhr.readyState === 4) {
            // console.log(4444)
            
            // When we receive all the homeworks
            let note = JSON.parse(xhr.responseText).data
            document.waitForElement("[class *= 'tab-content']").then((elm) => {
                globalThis.Notes.rang(note)
				globalThis.Notes.calculerMoyennes("kmlc-moyenne-g", "", "kmlc-moyenne", "", true, ":not([class *= 'simu'])")
				
				globalThis.Notes.charts(note)
				
				globalThis.Notes.ajouterNoteSimulation()
				globalThis.Notes.modifierNote()
				
				globalThis.Notes.objectifSetup()
            })
            // console.log(1)
            var notesObserver = new MutationObserver(function (mutations) {
                // console.log(2)
                mutations.forEach(function (mutation) {
                    try {
                        // console.log(mutation.target)
                        if (mutation.target.children[0].innerText == "Moyennes" || mutation.target.children[0].innerText == "Evaluations") {
                            globalThis.Notes.rang(note)
							globalThis.Notes.calculerMoyennes("kmlc-moyenne-g", "", "kmlc-moyenne", "", true, ":not([class *= 'simu'])")
							
							globalThis.Notes.charts(note)
							
							globalThis.Notes.ajouterNoteSimulation(note)
							globalThis.Notes.modifierNote()
							
							globalThis.Notes.objectifSetup()
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
        }
    }

    xhr.send(data);
}