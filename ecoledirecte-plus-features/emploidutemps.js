globalThis.emploidutemps = function (id) {
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
                    document.waitForElement("div [class *= dhx_scale_holder]:nth-child(7)").then((elm) => {
                        // Get the date of each day displayed in the schedule
                        let devDateEDT = document.querySelectorAll("[class *= dhx_scale_bar]")

                        // For each day with homeworks we will check if each homework is done or not
                        for (let i = 0; i < dev[date].length; i++) {
                            let backgroundColor, symbol
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

        // Wait for the button to return to today in the schedule
        document.waitForElement("#export-pdf").then((elm) => {
            // Check if the button to get the homeworks exist
            
            if (!document.querySelector("#devoirs")) {
                // Creating the button to get the homeworks
                
                let devButton = document.createElement("div")
                devButton.setAttribute("id", "devoirs")
                devButton.setAttribute("class", "dhx_cal_today_button")
                devButton.setAttribute("style", "left: 125px")
                devButton.innerText = "Devoirs"
                devButton.onclick = function() {
                    globalThis.emploidutemps(id)
                }
                
                elm.parentElement.insertBefore(devButton, elm)
            }
        })

        // Wait for the previous button to appear and add a click listener
        document.waitForElement(".dhx_cal_prev_button").then((elm) => {
            if (!elm.getAttribute("kmlc")) {
                elm.setAttribute("kmlc", "kmlc")
                elm.addEventListener('click', function(e) {
                    e.stopPropagation()
                    e.preventDefault()
                    
                    let prom = new Promise((resolve) => {
                        new MutationObserver((mutations, observer) => {
                            for (let mutation of mutations) {
                                for (let removedNode of mutation.removedNodes) {
                                    try {
                                        // Wait until the schedule to change and then apply changes
                                        
                                        /*
                                         *
                                         * TO-DO : Create a wait for delete/remove function
                                         * PROBLEM : Crash, consum a lot and/or work only once
                                         * 
                                         */
                                         
                                        if (removedNode.getAttribute("aria-label").includes("Dim")) {
                                            observer.disconnect();
                                            resolve();
                                        }
                                    } catch(e) {}
                                }
                            }
                        })
                        .observe(document.body, {
                            subtree: true,
                            childList: true
                        });
                    });

                    prom.then(() => {
                        // Wait for the last day (day 7) to be displayed in the schedule
                        
                        document.waitForElement("div.dhx_scale_holder:nth-child(7)").then((elm) => {
                            globalThis.emploidutemps(id)
                        })
                    });
                }, false);
            }
        })

        // Wait for the next button to appear and add a click listener
        document.waitForElement(".dhx_cal_next_button").then((elm) => {
            if (!elm.getAttribute("kmlc")) {
                elm.setAttribute("kmlc", "kmlc")
                elm.addEventListener('click', function(e) {
                    e.stopPropagation()
                    e.preventDefault()
                    
                    let prom = new Promise((resolve) => {
                        new MutationObserver((mutations, observer) => {
                            for (let mutation of mutations) {
                                for (let removedNode of mutation.removedNodes) {
                                    try {
                                        // Wait until the schedule to change and then apply changes
                                        
                                        /*
                                         *
                                         * TO-DO : Create a wait for delete/remove function
                                         * PROBLEM : Crash, consum a lot and/or work only once
                                         *
                                         */
                                         
                                        if (removedNode.getAttribute("aria-label").includes("Dim")) {
                                            observer.disconnect();
                                            resolve();
                                        }
                                    } catch(e) {}
                                }
                            }
                        })
                        .observe(document.body, {
                            subtree: true,
                            childList: true
                        });
                    });

                    prom.then(() => {
                        // Wait for the last day (day 7) to be displayed in the schedule
                        
                        document.waitForElement("div.dhx_scale_holder:nth-child(7)").then((elm) => {
                            globalThis.emploidutemps(id)
                        })
                    });
                }, false);
            }
        })
        
        // Wait for the button to return to today in the schedule to appear and add a click listener
        document.waitForElement("#view-today").then((elm) => {
            if (!elm.getAttribute("kmlc")) {
                elm.setAttribute("kmlc", "kmlc")
                elm.addEventListener('click', function(e) {
                    e.stopPropagation()
                    e.preventDefault()
                    
                    let prom = new Promise((resolve) => {
                        new MutationObserver((mutations, observer) => {
                            for (let mutation of mutations) {
                                for (let removedNode of mutation.removedNodes) {
                                    try {
                                        // Wait until the schedule to change and then apply changes
                                        
                                        /*
                                         *
                                         * TO-DO : Create a wait for delete/remove function
                                         * PROBLEM : Crash, consum a lot and/or work only once
                                         *
                                         */
                                         
                                        if (removedNode.getAttribute("aria-label").includes("Dim")) {
                                            observer.disconnect();
                                            resolve();
                                        }
                                    } catch(e) {}
                                }
                            }
                        })
                        .observe(document.body, {
                            subtree: true,
                            childList: true
                        });
                    });

                    prom.then(() => {
                        // Wait for the last day (day 7) to be displayed in the schedule
                        
                        document.waitForElement("div.dhx_scale_holder:nth-child(7)").then((elm) => {
                            globalThis.emploidutemps(id)
                        })
                    });
                }, false);
            }
        })
    };

    xhr.send(data);
}