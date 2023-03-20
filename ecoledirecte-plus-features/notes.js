globalThis.notes = function (id) {
    let xhr = new XMLHttpRequest();
    url = `https://api.ecoledirecte.com/v3/Eleves/${window.location.pathname.split("/")[2]}/notes.awp?verbe=get`;
    data = `data={}`;

    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.setRequestHeader("X-Token", globalThis.token);
    xhr.onreadystatechange = function() {
		console.log(1111100404084084084, xhr.readyState, document.querySelector("td span[class = 'ng-star-inserted']"))
        if (xhr.readyState === 4) {
            let note = JSON.parse(xhr.responseText).data
			var notesObserver = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					try {
						if (mutation.target.children[0].innerText == "Moyennes" || mutation.target.children[0].innerText == "Evaluations") {
							if (!document.querySelectorAll("th[class *= 'coef ng-star-inserted']")[1]) {
								document.querySelector("th[class *= 'coef ng-star-inserted']").parentElement.appendChild(document.querySelector("th[class *= 'coef ng-star-inserted']").cloneNode(true))
								document.querySelectorAll("th[class *= 'coef ng-star-inserted']")[1].innerText = "Rang"
								console.log(1, document.querySelector("th[class *= 'coef ng-star-inserted']"))
								
								let p = document.querySelectorAll("td[class *= 'coef ng-star-inserted']")
								console.log(1.1, p)
								for (let i = 0; i < p.length; i++) {
									let elm = p[i].cloneNode(true)
									let periode = document.querySelector("li.ng-star-inserted.active:not(.nav-item)")
									let periodeNum = [...periode.parentElement.children].indexOf(periode)
									console.log(2, periode)
									
									elm.children[0].innerText = (note.periodes[periodeNum].ensembleMatieres.disciplines[i].effectif - note.periodes[periodeNum].ensembleMatieres.disciplines[i].rang) + "/" + note.periodes[periodeNum].ensembleMatieres.disciplines[i].effectif
									elm.className = elm.className + " text-center"
									p[i].parentElement.appendChild(elm)
								}
								
								let matNotes = document.querySelectorAll("tbody > tr > td.notes > button > .valeur");
								console.log(3, matNotes)
								let parents = [];
								let moyenneG = 0.0;
								let coeffEnTrop = 0.0;
								let coeffTot = 0.0;
								
								for (let i = 0; i < matNotes.length; i++) {
									let parent = matNotes[i].parentElement.parentElement.parentElement;
									console.log(4, parent, matNotes[i])
									if (!parents.includes(parent)) {
										parents.push(parent);
									}
								}

								for (let i = 0; i < parents.length; i++) {
									let matiereNotes = parents[i].querySelectorAll("td.notes > button > .valeur")
									console.log(5, matiereNotes)
									let moyenne = 0.0;
									let coeffMatTot = 0.0;
									
									for (let j = 0; j < matiereNotes.length; j++) {
										let coeff = 1.0
										let quotient = 20.0
										
										if (matiereNotes[j].querySelector("sup")) {
											coeff = parseFloat(matiereNotes[j].querySelector("sup").textContent.replace(/[()\/\s]/g, "").replace(",", "."));
										}
										if (matiereNotes[j].querySelector("sub")) {
											quotient = parseFloat(matiereNotes[j].querySelector("sub").textContent.replace(/[()\/\s]/g, "").replace(",", "."));
										}

										let matNote = matiereNotes[j].childNodes[0].nodeValue.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, "")
										console.log(6, matNote, matiereNotes[j].childNodes[0].nodeValue)

										if (matNote) {
											console.log("avant, ")
											console.log(matNote)
											matNote = parseFloat(matNote)*20.0/quotient
											console.log("après, ")
											console.log(matNote)
											
											console.log(matNote, coeff)
											moyenne += parseFloat(matNote*coeff);
											coeffMatTot += coeff;
											console.log(matiereNotes[j], moyenne, coeffMatTot, coeff)
										}
									}

									let coeffMat = parseFloat(parents[i].querySelector("td.coef:not([class *= 'text-center'])").innerText.replace(/[()\/\s]/g, "").replace(",", ".").replace(/[^\d+\-*/.\s]/g, ""));
									console.log(7, coeffMat)
									
									if (coeffMatTot ==  0.0 && moyenne == 0.0) {
										coeffEnTrop += coeffMat;
										console.log(8, coeffMat, coeffMatTot, moyenne, parseFloat(parents[i].querySelector("td.coef:not([class *= 'text-center'])").innerText))
									} else {
										coeffTot += coeffMat;
										moyenne = (moyenne/coeffMatTot);
										console.log(moyenne);

										let dummy = parents[i].querySelector("td.relevemoyenne").cloneNode(true);
										dummy.textContent = moyenne.toFixed(5)
										parents[i].querySelector("td.relevemoyenne").innerHTML = parents[i].querySelector("td.relevemoyenne").innerHTML + "<br>" + dummy.innerHTML;
										moyenne = moyenne * coeffMat;
										moyenneG += moyenne;
									}
								}
								
								if (document.querySelector("tr > td.moyennegenerale-valeur")) {
									let dummy = document.querySelector("tr > td.moyennegenerale-valeur").cloneNode(true)
									dummy.textContent = (moyenneG/(coeffTot)).toFixed(5);
									console.log(9, document.querySelector("tr > td.moyennegenerale-valeur"))

									document.querySelector("tr > td.moyennegenerale-valeur").innerHTML = document.querySelector("tr > td.moyennegenerale-valeur").innerHTML + "<br>" + dummy.innerHTML;
								} else {
									let dummy = document.createElement("tr")
									dummy.innerHTML = '<tr class="ng-star-inserted"><td colspan="2" class="text-right moyennegeneralelibelle">Moyenne générale</td><td colspan="2" class="moyennegenerale-valeur">' + (moyenneG/(coeffTot)).toFixed(5); + '</td></tr>'
									console.log(10, dummy, document.querySelector("table.ed-table tbody"))
									document.querySelector("table.ed-table tbody").appendChild(dummy)
								}

								console.log(moyenneG/(coeffTot), moyenneG, coeffTot)
							}
						}
					} catch(e){}
				});
			});
			
			executeNotesObserver(notesObserver);
			
			function executeNotesObserver(observer) {
				document.waitForElement("[class *= 'tab-content main-container double-padding container-bg ng-star-inserted']").then((elm) => {
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