globalThis.cahierdetexte = function (id) {
    // Make an http request to get the homeworks
    let xhr = new XMLHttpRequest();
    console.log(window.location.pathname.split("/"))
    console.log(window.location.pathname.split("/")[2])
    url = `https://api.ecoledirecte.com/v3/Eleves/${id}/cahierdetexte.awp?verbe=get`;
    data = `data={}`;

    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.setRequestHeader("X-Token", globalThis.token);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            // When we receive all the homeworks
            let dev = JSON.parse(xhr.responseText).data
            for (let date in dev) {
                if (dev.hasOwnProperty(date)) {
                    document.waitForElement("h3[class *= date]").then((elm) => {
                        // Get the date of each homework displayed on the homework section
                        let devDateCDT = document.querySelectorAll("h3[class *= date]")
                        
                        // For each day with homeworks we will check if each homework is done or not
                        for (let i = 0; i < dev[date].length; i++) {
                            let backgroundColor, symbol
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
                            
                            // For each homeworks check until we find the correct date and then apply the changes
                            for (let j = 0; j < devDateCDT.length; j++) {
                                if ((devDateCDT[j].textContent.split(" ")[1] + " " + devDateCDT[j].textContent.split(" ")[2]).toLowerCase() == (parseInt(date.split("-")[2]) + " " + numToDate(date.split("-")[1]).norm).toLowerCase()) {
                                    
                                    // Change the background color of the card containing the homeworks for the specific date
                                    if (devDateCDT[j].parentElement.getAttribute("style")) {
                                        devDateCDT[j].parentElement.setAttribute("style", devDateCDT[j].parentElement.getAttribute("style").replace("background-color: rgb(0, 255, 0, 0.5);", "") + backgroundColor)
                                    } else if (!devDateCDT[j].parentElement.getAttribute("style")) {
                                        devDateCDT[j].parentElement.setAttribute("style", backgroundColor)
                                    }
                                    
                                    // Search for the correct subject and then add the correct symbol for the subject
                                    let mat = devDateCDT[j].parentElement.getElementsByContentText(" " + dev[date][i].matiere).startsWith
                                    if (mat) {
                                        console.log(mat)
                                        try {
                                            if (!mat[0].outerHTML.includes(symbol)) mat[0].outerHTML = mat[0].outerHTML.replace(" " + dev[date][i].matiere.htmlEncode(), symbol + " " + dev[date][i].matiere.htmlEncode())
                                        } catch (e) {}
                                    }
                                }
                            }
                        }
                    })
                }
            }
        }
        
        // Wait for the button "À venir" in the bottom right
        document.waitForElement("ed-cdt-eleve-onglets > ul > li.secondary.onglet-secondary > a").then((elm) => {
            elm.onclick = function() {
                globalThis.cahierdetexte(id)
            }
        })
    };

    xhr.send(data);
}