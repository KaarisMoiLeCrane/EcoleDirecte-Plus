globalThis.EmploiDuTemps.homeworkStatus = function (dev) {
	// For each day with homeworks
	for (let date in dev) {
		if (dev.hasOwnProperty(date)) {
			document.waitForElement("div [class *= dhx_scale_holder]:nth-child(7)").then((elm) => {
				// Get the date of each day displayed in the schedule
				let devDateEDT = document.querySelectorAll("[class *= dhx_scale_bar]")

				// For each day with homeworks we will check if each homework is done or not
				for (let i = 0; i < dev[date].length; i++) {
					let backgroundColor = dev[date][i].effectue == true ? "background-color: rgb(0, 255, 0, 0.5);" : dev[date][i].effectue == false ? "background-color: rgb(255, 127.5, 0, 0.5);" : ""
					let symbol = dev[date][i].effectue == true ? " /✓\\" : dev[date][i].effectue == false ? " /!\\" : " /ERROR\\"
					
					/*
					if (dev[date][i].effectue == true) {
						// Homework done
							
						// Green color with 0.5 opacity
						backgroundColor = " background-color: rgb(0, 255, 0, 0.5);"
						symbol = "/✓\\ "
					} else if (dev[date][i].effectue == false) {
						// Homework not done
						
						// Red color with 0.5 opacity
						backgroundColor = " background-color: rgb(255, 127.5, 0, 0.5);"
						symbol = "/!\\ "
					} else {
						// We never know
						
						backgroundColor = ""
						symbol = "/ERROR\\ "
					}
					*/
					
					// For each homeworks check until we find the correct date and then apply the changes
					for (let j = 0; j < devDateEDT.length; j++) {
						if ((devDateEDT[j].textContent.split(" ")[1] + " " + devDateEDT[j].textContent.split(" ")[2]).toLowerCase() == (parseInt(date.split("-")[2]) + " " + numToDate(date.split("-")[1]).abrv).toLowerCase()) {
							
							// Change the background color of the date of the homework
							if (devDateEDT[j].getAttribute("style")) {
								if (!devDateEDT[j].getAttribute("style").includes(" background-color: rgb(255, 127.5, 0, 0.5);"))
									devDateEDT[j].setAttribute("style", devDateEDT[j].getAttribute("style").replace(" background-color: rgb(0, 255, 0, 0.5);", "") + backgroundColor)
							} else {
								devDateEDT[j].setAttribute("style", backgroundColor)
							}
							
							// Search for the correct subject and then add the correct symbol for the subject
							let mat = document.querySelectorAll("div [class *= dhx_scale_holder]")[j].getElementsByContentText(dev[date][i].matiere).startsWith
							if (mat) {
								try {
									if (mat.length > 1) {
										for (let k = 0; k < mat.length; k++) if (!mat[k].outerHTML.includes(symbol)) mat[k].outerHTML = mat[k].outerHTML.replace(dev[date][i].matiere.htmlEncode(), symbol + "<br>" + dev[date][i].matiere.htmlEncode())
									} else {
										if (!mat[0].outerHTML.includes(symbol)) mat[0].outerHTML = mat[0].outerHTML.replace(dev[date][i].matiere.htmlEncode(), symbol + "<br>" + dev[date][i].matiere.htmlEncode())
									}
								} catch (e) {}
							}
						}
					}
				}
			})
		}
	}
}