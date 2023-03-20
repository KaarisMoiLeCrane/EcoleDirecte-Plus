globalThis.cdt = function (id) {
    let xhr = new XMLHttpRequest();
	console.log(window.location.pathname.split("/"))
	console.log(window.location.pathname.split("/")[2])
    url = `https://api.ecoledirecte.com/v3/Eleves/${window.location.pathname.split("/")[2]}/cahierdetexte.awp?verbe=get`;
    data = `data={}`;

    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.setRequestHeader("X-Token", globalThis.token);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            let dev = JSON.parse(xhr.responseText).data
            for (let date in dev) {
                if (dev.hasOwnProperty(date)) {
                    let devCDT, devEDT

                    if (window.location.href.includes("CahierDeTexte")) {
                        devCDT = document.querySelectorAll("h3[class *= date]")
                    }

                    if (window.location.href.includes("EmploiDuTemps")) {
                        devEDT = document.querySelectorAll("[class *= dhx_scale_bar]")
                    }

                    for (let i = 0; i < dev[date].length; i++) {
                        if (dev[date][i].effectue == true) {
                            if (window.location.href.includes("CahierDeTexte")) {
                                document.waitForElement("h3[class *= date]").then((elm) => {
                                    for (let j = 0; j < devCDT.length; j++) {
                                        if ((devCDT[j].textContent.split(" ")[1] + " " + devCDT[j].textContent.split(" ")[2]).toLowerCase() == (parseInt(date.split("-")[2]) + " " + numToDate(date.split("-")[1]).norm).toLowerCase()) {
                                            if (devCDT[j].parentElement.getAttribute("style")) {
                                                devCDT[j].parentElement.setAttribute("style", devCDT[j].parentElement.getAttribute("style") + "background-color: rgb(0, 255, 0, 0.5);")
                                            } else if (!devCDT[j].parentElement.getAttribute("style")) {
                                                devCDT[j].parentElement.setAttribute("style", "background-color: rgb(0, 255, 0, 0.5);")
                                            }
											
											let mat = document.querySelectorAll("h3[class *= date]")[j].parentElement.getElementsByContentText(" " + dev[date][i].matiere).startsWith
											if (mat) {
												if (!mat[0].outerHTML.includes(" /✓\\")) mat[0].outerHTML = mat[0].outerHTML.replace(" " + dev[date][i].matiere.htmlEncode(), " /✓\\ " + dev[date][i].matiere.htmlEncode())
											}
                                        }
                                    }
                                })
                            }

                            if (window.location.href.includes("EmploiDuTemps")) {
                                document.waitForElement("div [class *= dhx_scale_holder]:nth-child(7)").then((elm) => {
                                    for (let j = 0; j < devEDT.length; j++) {
                                        if ((devEDT[j].textContent.split(" ")[1] + " " + devEDT[j].textContent.split(" ")[2]).toLowerCase() == (parseInt(date.split("-")[2]) + " " + numToDate(date.split("-")[1]).abrv).toLowerCase()) {
                                            if (devEDT[j].getAttribute("style")) {
                                                devEDT[j].setAttribute("style", devEDT[j].getAttribute("style") + "background-color: rgb(0, 255, 0, 0.5);")
                                            } else if (!devEDT[j].getAttribute("style")) {
                                                devEDT[j].setAttribute("style", "background-color: rgb(0, 255, 0, 0.5);")
                                            }
											
											document.waitForElement('div [class *= dhx_scale_holder]:nth-child(' + (j+1) + ') [aria-label *= "' + dev[date][i].matiere + '"] > .dhx_body > .edt-cours-text').then((elm) => {
												let mat = document.querySelectorAll("div [class *= dhx_scale_holder]")[j].getElementsByContentText(dev[date][i].matiere).startsWith
												if (mat) {
													if (!mat[0].outerHTML.includes("/✓\\ ")) mat[0].outerHTML = mat[0].outerHTML.replace(dev[date][i].matiere.htmlEncode(), "/✓\\ <br>" + dev[date][i].matiere.htmlEncode())
												}
											})
                                        }
                                    }
                                })
                            }
                        }
                    }

                    for (let i = 0; i < dev[date].length; i++) {
                        if (dev[date][i].effectue == false) {
                            if (window.location.href.includes("CahierDeTexte")) {
                                document.waitForElement("h3[class *= date]").then((elm) => {
                                    for (let j = 0; j < devCDT.length; j++) {
                                        if ((devCDT[j].textContent.split(" ")[1] + " " + devCDT[j].textContent.split(" ")[2]).toLowerCase() == (parseInt(date.split("-")[2]) + " " + numToDate(date.split("-")[1]).norm).toLowerCase()) {
                                            if (devCDT[j].parentElement.getAttribute("style")) {
                                                devCDT[j].parentElement.setAttribute("style", devCDT[j].parentElement.getAttribute("style").replace("background-color: rgb(0, 255, 0, 0.5);", "") + "background-color: rgb(255, 127.5, 0, 0.5);")
                                            } else if (!devCDT[j].parentElement.getAttribute("style")) {
                                                devCDT[j].parentElement.setAttribute("style", "background-color: rgb(255, 127.5, 0, 0.5);")
                                            }
											
											let mat = document.querySelectorAll("h3[class *= date]")[j].parentElement.getElementsByContentText(" " + dev[date][i].matiere).startsWith
											if (mat) {
												if (!mat[0].outerHTML.includes(" /!\\")) mat[0].outerHTML = mat[0].outerHTML.replace(" " + dev[date][i].matiere.htmlEncode(), " /!\\ " + dev[date][i].matiere.htmlEncode())
											}
                                        }
                                    }
                                })
                            }

                            if (window.location.href.includes("EmploiDuTemps")) {
                                document.waitForElement("div [class *= dhx_scale_holder]:nth-child(7)").then((elm) => {
                                    for (let j = 0; j < devEDT.length; j++) {
                                        if ((devEDT[j].textContent.split(" ")[1] + " " + devEDT[j].textContent.split(" ")[2]).toLowerCase() == (parseInt(date.split("-")[2]) + " " + numToDate(date.split("-")[1]).abrv).toLowerCase()) {
                                            if (devEDT[j].getAttribute("style")) {
                                                devEDT[j].setAttribute("style", devEDT[j].getAttribute("style").replace("background-color: rgb(0, 255, 0, 0.5);", "") + "background-color: rgb(255, 127.5, 0, 0.5);")
                                            } else if (!devEDT[j].getAttribute("style")) {
                                                devEDT[j].setAttribute("style", "")
                                            }
											
											document.waitForElement('div [class *= dhx_scale_holder]:nth-child(' + (j+1) + ') [aria-label *= "' + dev[date][i].matiere + '"] > .dhx_body > .edt-cours-text').then((elm) => {
												let mat = document.querySelectorAll("div [class *= dhx_scale_holder]")[j].getElementsByContentText(dev[date][i].matiere).startsWith
												if (mat) {
													if (!mat[0].outerHTML.includes("/!\\ ")) mat[0].outerHTML = mat[0].outerHTML.replace(dev[date][i].matiere.htmlEncode(), "/!\\ <br>" + dev[date][i].matiere.htmlEncode())
												}
											})
                                        }
                                    }
                                })
                            }
                        }
                    }
                }
            }
        }
		
		document.waitForElement("ed-cdt-eleve-onglets > ul > li.secondary.onglet-secondary > a").then((elm) => {
			elm.onclick = function() {
				globalThis.cdt()
			}
		})

		if (window.location.href.includes("EmploiDuTemps")) {
			document.waitForElement("#export-pdf").then((elm) => {
				if (document.querySelector("#export-pdf") && !document.querySelector("#devoirs")) {
					let devButton = document.createElement("div")
					devButton.setAttribute("id", "devoirs")
					devButton.setAttribute("class", "dhx_cal_today_button")
					devButton.setAttribute("style", "left: 125px")
					devButton.innerText = "Devoirs"
					devButton.onclick = function() {
						globalThis.cdt()
					}
					document.querySelector("#export-pdf").parentElement.insertBefore(devButton, document.querySelector("#export-pdf"))
				}
			})
		}

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
						document.waitForElement("div.dhx_scale_holder:nth-child(7)").then((elm) => {
							globalThis.cdt()
						})
					});
					
					if (b) {
						b = 0
						document.waitForElement("div.dhx_scale_holder:nth-child(7)").then((elm) => {
							globalThis.cdt()
						})
					}
				}, false);
			}
		})

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
						document.waitForElement("div.dhx_scale_holder:nth-child(7)").then((elm) => {
							globalThis.cdt()
						})
					});
					
					if (b) {
						b = 0
						document.waitForElement("div.dhx_scale_holder:nth-child(7)").then((elm) => {
							globalThis.cdt()
						})
					}
				}, false);
			}
		})
		
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
						document.waitForElement("div.dhx_scale_holder:nth-child(7)").then((elm) => {
							globalThis.cdt()
						})
					});
					
					if (b) {
						b = 0
						document.waitForElement("div.dhx_scale_holder:nth-child(7)").then((elm) => {
							globalThis.cdt()
						})
					}
				}, false);
			}
		})
    };

    xhr.send(data);
}