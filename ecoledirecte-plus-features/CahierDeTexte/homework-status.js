globalThis.CahierDeTexte.homeworkStatus = function (dev) {
	// For each day with homeworks
	for (let date in dev) {
		if (dev.hasOwnProperty(date)) {
			document.waitForElement("h3[class *= date]").then((elm) => {
				// Get the date of each homework displayed on the homework section
				let devDateCDT = document.querySelectorAll("h3[class *= date]")
				
				// For each day with homeworks we will check if each homework is done or not
				for (let i = 0; i < dev[date].length; i++) {
					let backgroundColor = dev[date][i].effectue == true ? "background-color: rgb(0, 255, 0, 0.5);" : dev[date][i].effectue == false ? "background-color: rgb(255, 127.5, 0, 0.5);" : ""
					let symbol = dev[date][i].effectue == true ? " /✓\\" : dev[date][i].effectue == false ? " /!\\" : " /ERROR\\"
					
					/*
					if (dev[date][i].effectue == true) {
						// Homework done
						
						// Green color with 0.5 opacity
						backgroundColor = "background-color: rgb(0, 255, 0, 0.5);"
						symbol = " /✓\\"
					} else if (dev[date][i].effectue == false) {
						// Homework not done
						
						// Red color with 0.5 opacity
						backgroundColor = "background-color: rgb(255, 127.5, 0, 0.5);"
						symbol = " /!\\"
					} else {
						// We never know
						
						backgroundColor = ""
						symbol = " /ERROR\\ "
					}
					*/
					
					// For each homeworks check until we find the correct date and then apply the changes
					for (let j = 0; j < devDateCDT.length; j++) {
						// console.log(123, (devDateCDT[j].textContent.split(" ")[1] + " " + devDateCDT[j].textContent.split(" ")[2]).toLowerCase(), (parseInt(date.split("-")[2]) + " " + numToDate(date.split("-")[1]).norm).toLowerCase())
						if ((devDateCDT[j].textContent.split(" ")[1] + " " + devDateCDT[j].textContent.split(" ")[2]).toLowerCase() == (parseInt(date.split("-")[2]) + " " + numToDate(date.split("-")[1]).norm).toLowerCase()) {
							
							// Change the background color of the card containing the specific date
							if (devDateCDT[j].parentElement.getAttribute("style")) {
								if (!devDateCDT[j].parentElement.getAttribute("style").includes("background-color: rgb(255, 127.5, 0, 0.0);")) {
									devDateCDT[j].parentElement.setAttribute("style", devDateCDT[j].parentElement.getAttribute("style").replace("background-color: rgb(0, 255, 0, 0.0);", "") + backgroundColor.replace("0.5", "0.0"))
									devDateCDT[j].parentElement.parentElement.setAttribute("style", devDateCDT[j].parentElement.getAttribute("style").replace("background-color: rgb(0, 255, 0, 0.5);", "") + backgroundColor)
								}
							} else {
								devDateCDT[j].parentElement.setAttribute("style", backgroundColor.replace("0.5", "0.0"))
								devDateCDT[j].parentElement.parentElement.setAttribute("style", backgroundColor)
							}
							
							// Search for the correct subject and then add the correct symbol for the subject
							let mat = devDateCDT[j].parentElement.parentElement.getElementsByContentText(" " + dev[date][i].matiere).startsWith
							if (mat[0]) {
								mat = mat[mat.length - 1]
								if (!mat.outerHTML.includes(symbol)) {
									// Change the background color of the card containing the homework of a specific date
									let matCard = mat.parentElement.parentElement
									matCard.outerHTML = matCard.outerHTML.replace(" " + dev[date][i].matiere.htmlEncode(), symbol + " " + dev[date][i].matiere.htmlEncode())
									
									/*
									if (matCard.getAttribute("style")) {
										if (matCard.getAttribute("style").includes("background-color: rgb(255, 127.5, 0, 0.5);")) {
											matCard.setAttribute("style", matCard.getAttribute("style").replace("background-color: rgb(255, 127.5, 0, 0.5);", "") + backgroundColor)
										} else {
											matCard.setAttribute("style", matCard.getAttribute("style").replace("background-color: rgb(0, 255, 0, 0.5);", "") + backgroundColor)
										}
									} else {
										matCard.setAttribute("style", backgroundColor)
									}
									*/
									
									// console.log(matCard, mat, dev[date][i])
								}
							}
						}
					}
				}
			})
		}
	}
}