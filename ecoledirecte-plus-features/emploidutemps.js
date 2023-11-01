let backdropScript = true

globalThis.emploidutemps = function () {
    // Make an http request to get the homeworks
    let xhr = new XMLHttpRequest();
    // console.log(window.location.pathname.split("/"))
    // console.log(window.location.pathname.split("/")[2])
    url = "https://api.ecoledirecte.com/v3/Eleves/" + globalThis.userId + "/cahierdetexte.awp?verbe=get";
    data = `data={}`;

    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.setRequestHeader("X-Token", globalThis.token);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            // When we receive all the homeworks we save it and send it
            let dev = JSON.parse(xhr.responseText).data
            
            emploidutempsMain(dev)
            
            if (backdropScript) waitForBackdropToDisappear(dev, emploidutempsMain)
            
            function emploidutempsMain(dev) {
                globalThis.EmploiDuTemps.homeworkStatus(dev)
                
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
                            let x = scrollX
                            let y = scrollY + document.querySelector("div.dhx_cal_header").getBoundingClientRect().y + 1
                            scrollTo(x, y)
                            
                            globalThis.EmploiDuTemps.homeworkStatus(dev)
                        }
                        
                        elm.parentElement.insertBefore(devButton, elm)
                    }
                })

                // Wait for the previous button to appear and add a click listener
                document.waitForElement(".dhx_cal_prev_button").then((elm) => {
                    if (!elm.getAttribute("kmlc-prev-button")) {
                        elm.setAttribute("kmlc-prev-button", "true")
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
                                                 * TO-DO   : Create a wait for delete/remove function
                                                 * PROBLEM : When the funciton was created first,
                                                 *     it crash, consum a lot and/or work only once
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
                                    globalThis.EmploiDuTemps.homeworkStatus(dev)
                                })
                            });
                        }, false);
                    }
                })

                // Wait for the next button to appear and add a click listener
                document.waitForElement(".dhx_cal_next_button").then((elm) => {
                    if (!elm.getAttribute("kmlc-next-button")) {
                        elm.setAttribute("kmlc-next-button", "true")
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
                                    globalThis.EmploiDuTemps.homeworkStatus(dev)
                                })
                            });
                        }, false);
                    }
                })
                
                // Wait for the button to return to today in the schedule to appear and add a click listener
                document.waitForElement("#view-today").then((elm) => {
                    if (!elm.getAttribute("kmlc-today-button")) {
                        elm.setAttribute("kmlc-today-button", "true")
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
                                    globalThis.EmploiDuTemps.homeworkStatus(dev)
                                })
                            });
                        }, false);
                    }
                })
                
                
                // document.waitForElement(".filtres-agenda > *:nth-child(2)").then((elm) => {
                    // elm = elm.parentElement
                    // for (let i = 0; i < elm.children.length; i++) {
                        // if (!elm.children[i].getAttribute("kmlc-filtre-button")) {
                            // elm.children[i].setAttribute("kmlc-filtre-button", "true")
                            // elm.children[i].addEventListener('click', function(e) {
                                // e.stopPropagation()
                                // e.preventDefault()
                                
                                // document.waitForElement("div.dhx_scale_holder:nth-child(7)").then((elm) => {
                                    // globalThis.EmploiDuTemps.homeworkStatus(dev)
                                // })
                            // }, false);
                        // }
                    // }
                // })
            }
        }
    };
    
    xhr.send(data);
}

function waitForBackdropToDisappear(dev, callback) {
    // If there is the loading page we wait for it to be deleted
    if (backdropScript) {
        backdropScript = false
        document.waitForElement("div[class *= 'ng-tns'][class *= 'ng-busy']:not([class *= 'backdrop'])").then((elm) => {
            let prom = new Promise((resolve) => {
                new MutationObserver((mutations, observer) => {
                    for (let mutation of mutations) {
                        for (let removedNode of mutation.removedNodes) {
                            try {
                                if (removedNode.getAttribute("class").includes("ng-tns") && removedNode.getAttribute("class").includes("ng-busy") && !removedNode.getAttribute("class").includes("backdrop")) {
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
                backdropScript = true
                callback(dev)
                waitForBackdropToDisappear(dev, callback)
            });
        })
    }
}