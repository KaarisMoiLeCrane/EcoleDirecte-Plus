let chartCurve, chartBar

globalThis.Notes.charts = function (note) {
    // Check if a chart exist (if there is one, the other one is here)
    if (!document.querySelector("[id = 'chart-curve']") && note.notes.length) {
        // Add the canvas whee there will be each chart
        // document.getElementById("encart-notes").innerHTML += "<canvas id='chart-curve'></canvas><canvas id='chart-bar'></canvas>";
        /* 
         * NEVER use innerHTML. It break some functionnalities.
         */
        
        let chartCurveCanvas = document.createElement("CANVAS")
        chartCurveCanvas.id = "chart-curve"

        let chartBarCanvas = document.createElement("CANVAS")
        chartBarCanvas.id = "chart-bar"

        document.getElementById("encart-notes").appendChild(chartCurveCanvas)
        document.getElementById("encart-notes").appendChild(chartBarCanvas)
        
        // Get the actual selected periode and init all the variables
        // let periode = document.querySelector("ul[class *= 'tabs'] > li > [class *= 'nav-link active']").textContent
		let periodeElm = document.querySelector("ul[class *= 'tabs'] > li > [class *= 'nav-link active']")
		
		// let periode = document.querySelector("ul[class *= 'tabs'] > li > [class *= 'nav-link active']").textContent
        // let codePeriode, dateDebut, dateFin;
		
        let codePeriode = periodeElm.getAttribute("codePeriode")
		let dateDebut = Number(periodeElm.getAttribute("dateDebut"))
		let dateFin = Number(periodeElm.getAttribute("dateFin"))
		let isR = Boolean(periodeElm.getAttribute("R"))
		
		// console.log(codePeriode, dateDebut, dateFin, isR)
		
        let notes = [];
        let notesTot = [];
        
        // We duplicate the response of the http request because we will modify it later
        let varNote = JSON.parse(JSON.stringify(note))
		
        // For each periode we check if the periode and the selected periode are the same. If yes then we save the date of start and end and the code of the periode
        // for (let i = 0; i < varNote.periodes.length; i++) {
            // if (varNote.periodes[i].periode === periode) {
                // console.log(varNote.periodes[i])
                // codePeriode = varNote.periodes[i].codePeriode;
                // dateDebut = varNote.periodes[i].dateDebut.convertToTimestamp()
                // dateFin = varNote.periodes[i].dateFin.convertToTimestamp()
				// let isR = codePeriode.includes("R")
                // break;
            // }
        // }
        
        // If the periode exist
        // if (Boolean(codePeriode)) {
		
		// For each grade
		for (let i = 0; i < varNote.notes.length; i++) {
			// console.log(dateDebut, varNote.notes[i].date.convertToTimestamp(), varNote.notes[i].dateSaisie.convertToTimestamp(), dateFin)
			
			// We check if the grade is significant or not (if the note has to be counted or not)
			if (varNote.notes[i].nonSignificatif == false) {
				// Is significant
				let pass = false;
				
				// console.log(codePeriode, codePeriode.includes("R"))
				
				// We check if each grade is between the date of start and end
				if (isR && dateDebut <= varNote.notes[i].date.convertToTimestamp() && varNote.notes[i].date.convertToTimestamp() <= dateFin) pass = true
				if (!isR && dateDebut <= varNote.notes[i].dateSaisie.convertToTimestamp() && varNote.notes[i].dateSaisie.convertToTimestamp() <= dateFin) pass = true
				
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
					notesOrdreCroissant.push([((notes[j].valeur) * globalThis.quotient/notes[j].noteSur).toFixed(2), notes[j].coef])
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
						addNotes += ((notesTri[j][k].valeur * globalThis.quotient)/notesTri[j][k].noteSur) * notesTri[j][k].coef
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
					
					// We calculate the average of the subject, we multiply it with his coefficient and we save the total number of coefficient and we push the average value and his coefficient
					matMoyenne = (addNotes/addCoeff).toFixed(5)
					moyenneNotes += matMoyenne * matCoeff
					coeffMoyenneNotes += matCoeff
					coeffMoyenne[i].push([matMoyenne, matCoeff])
				}
				
				// We push the average of all the averages
				moyenneGEvo.push((moyenneNotes/coeffMoyenneNotes).toFixed(5))
			}
			
			// We get the actual average
			let moyenneG = new Array(notes.length).fill(Number(document.querySelector("[kmlc-moyenne-g]").textContent));
			
			// We get the number from 1 to the number of grades (from the x axis)
			let labelsCurve = []
			for (let i = 1; i <= notes.length; i++) {
				labelsCurve.push(i.toString());
			}
			
			// We push the value of each grade
			for (let i = 0; i < notes.length; i++) {
				notesTot.push(((notes[i].valeur * globalThis.quotient)/notes[i].noteSur).toFixed(2))
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
									let notesur = globalThis.quotient;

									for (let i = 0; i < tooltipItems.length; i++) {
										if (tooltipItems[i].dataset.label == "Notes") {
											coeff = datasNotes[tooltipItems[i].dataIndex][0]
											notesur = datasNotes[tooltipItems[i].dataIndex][1]

											if (notesur == globalThis.quotient) {
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
Revient à: ${(Number(tooltipItems[i].raw) * globalThis.quotient/notesur).toFixed(2)}/${globalThis.quotient}
Variation de la moyenne générale de: ${(moyenneGEvo[tooltipItems[i].dataIndex] - moyenneGEvo[tooltipItems[i].dataIndex - 1]).toFixed(3)}`
												} else {
													return `Coefficient: ${coeff}
Note sur: ${notesur}
Revient à: ${(Number(tooltipItems[i].raw) * globalThis.quotient/notesur).toFixed(2)}/${globalThis.quotient}`
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
							suggestedMax: globalThis.quotient,
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
				notesListe.push(((notes[i].valeur * globalThis.quotient)/notes[i].noteSur).toFixed(2))
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
			
			let tempMoyennG = Number(document.querySelector("[kmlc-moyenne-g]").textContent)
			let indexOfAverage = 0
			for (let i = 0; i < labelsBar.length; i++) {
				if (labelsBar[i] > tempMoyennG) {
					indexOfAverage = i
					labelsBar.splice(i, 0, tempMoyennG)
					break
				}
			}
			
			// console.log(labelsBar)
			
			// We save the number of same grades values
			tempNotesTri = [];
			for (let i = 0; i < notesListe.length; i++) {
				tempNotesTri.push(notesListe[i].length)
			}
			
			notesListe = [...tempNotesTri]
			
			tempNotesTri.sort(function(a, b) {
				return a - b
			})
			
			notesListe.splice(indexOfAverage, 0, 0)
			
			// let barThickness = Array(notesListe.length).fill(40)
			// barThickness[indexOfAverage] = 20
			
			// console.log(barThickness)
			
			let barsColor = [];
			let tempBarColor;
			
			let percentageRouge = 0;
			let percentageOrange = 0;
			let percentageVert = 0;
			let effectifPercentage = labelsBar.length;
			
			// Set the color of each bar and add one to the color number (that I can divide by the total number to get the percentage)
			for (let i = 0; i < labelsBar.length; i++) {
				let tempNote = labelsBar[i]
				
				if (tempNote > tempMoyennG) {
					tempBarColor = "rgba(0, 255, 0, 1)"
					percentageVert += 1
				} else if (tempNote < tempMoyennG) {
					tempBarColor = "rgba(255, 0, 0, 1)"
					percentageRouge += 1
				} else {
					tempBarColor = "rgba(0, 0, 0, 1)"
				}
				
				if (tempNote.toString().split(".")[0] == tempMoyennG.toString().split(".")[0]) {
					tempBarColor = "rgba(255, 127.5, 0, 1)"
					percentageOrange += 1
				}
				
				// if (tempNote == tempMoyennG) {
					// tempBarColor = "rgba(0, 0, 255, 1)"
				// }
				
				barsColor.push(tempBarColor)
			}
			
			barsColor = Object.values(barsColor)
			
			let dataGAverage = Array(notesListe.length).fill(0)
			dataGAverage[indexOfAverage] = 1
			
			// console.log(dataGAverage, notesListe)
			
			let colorGAverage = Array(notesListe.length).fill("rgba(0, 0, 0, 0)")
			colorGAverage[indexOfAverage] = "rgba(0, 0, 255, 1)"
			
			// console.log(colorGAverage, barsColor)
			
			// We set the chart datas and options
			let datasBar = {
				data: {
					labels: labelsBar,
					datasets: [{
						type: "bar",
						label: 'Notes',
						data: notesListe,
						backgroundColor: barsColor
					},{
						type: "bar",
						label: "Moyenne générale",
						data: dataGAverage,
						barThickness: 5,
						backgroundColor: colorGAverage
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
								filter: (legendItem, chartData) => {
									return legendItem.datasetIndex !== 1; // Hide the second dataset
								},
								generateLabels: (chart) => {
									let maxLeft = (document.querySelector("#chart-bar").width/2)-31; // chart length/2 to get the middle and
									// minus 31 is a number that I took somewhat arbitrarily to better position the gradient. 
									// If a person only sees red, the number should be increased, and if they only see green, the number should be decreased.
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
										
										// console.log(perc, percentageRouge, effectifPercentage)
										
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
						},
						x: {
							stacked: true, // Stacked bars
						},
						x2: {
							display: false,
							stacked: true,
							type: 'category',
							offset: true
						}
					},
					maxBarThickness: 55
				}
			}
			 
			chartBar = new Chart(document.getElementById("chart-bar").getContext('2d'), datasBar);
		}
		
		chartBar.update()
        // }
    }
}