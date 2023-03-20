let data, url;
globalThis.token = window.sessionStorage.token ? window.sessionStorage.token.split("\"")[1] : "nada"
let id = window.location.pathname.split("/")[2]
let b = 1

var lastUrl = location.href;
new MutationObserver(() => {
    var url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
		globalThis.token = window.sessionStorage.token ? window.sessionStorage.token.split("\"")[1] : "nada"
		
		loop()

        if (globalThis.token != "nada" && window.location.href.includes("EmploiDuTemps") || window.location.href.includes("CahierDeTexte")) {
            id = window.location.pathname.split("/")[2]
			if (id != undefined) {
				document.waitForElement(".all-devoirs").then((elm) => {
					console.log("mhm1")
					globalThis.cdt(id)
				})
				document.waitForElement(".dhx_cal_data > div:nth-child(7)").then((elm) => {
					console.log("mhm2")
					globalThis.cdt(id)
				})
			}
        }
		
		if (globalThis.token != "nada" && window.location.href.includes("Notes")) {
            id = window.location.pathname.split("/")[2]
			if (id != undefined) {
				document.waitForElement("td.discipline").then((elm) => {
					console.log("NOTES 1")
					globalThis.notes(id)
				})
			}
        }
		
		if (document.querySelectorAll("div.menu.ed-menu"))
			for (let i = 0; i < document.querySelectorAll("div.menu.ed-menu").length; i++)
				document.querySelectorAll("div.menu.ed-menu")[i].classList.remove("ed-menu")
    }
}).observe(document, {
    subtree: true,
    childList: true
});

loop()
loop2()

function loop() {
	globalThis.watchAnyObject(
		window.sessionStorage,
		['setItem', 'getItem', 'removeItem'],
		(method, key, ...args) => {
			if (method == "setItem" && key == "accounts") {
				globalThis.token = window.sessionStorage.token
				let prom = new Promise((resolve) => {
					new MutationObserver((mutations, observer) => {
							for (let mutation of mutations) {
								for (let removedNode of mutation.removedNodes) {
									if (removedNode.tagName === 'MODAL-CONTAINER') {
										observer.disconnect();
										resolve();
									}
								}
							}
						})
						.observe(document.body, {
							childList: true,
							subtree: true
						});
				});

				prom.then(() => {
					document.waitForElement("ed-modal-reconnexion").then((elm) => {
						window.sessionStorage.removeItem("token")
						window.sessionStorage.setItem("a", "0")
						window.location.reload()
					})
					document.waitForElement(".all-devoirs").then((elm) => {
						console.log("mhm3")
						globalThis.token = window.sessionStorage.token ? window.sessionStorage.token.split("\"")[1] : "nada"
						globalThis.cdt(id)
					})

					document.waitForElement(".dhx_cal_data > div:nth-child(7)").then((elm) => {
						console.log("mhm4")
						globalThis.token = window.sessionStorage.token ? window.sessionStorage.token.split("\"")[1] : "nada"
						globalThis.cdt(id)
					})
					
					document.waitForElement("td.discipline").then((elm) => {
						console.log("NOTES 2")
						globalThis.token = window.sessionStorage.token ? window.sessionStorage.token.split("\"")[1] : "nada"
						globalThis.notes(id)
					})
					loop()
				});
			}
		},
	);
}

function loop2() {
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
			if (globalThis.token != "nada" && window.location.href.includes("EmploiDuTemps") || window.location.href.includes("CahierDeTexte")) {
				id = window.location.pathname.split("/")[2]
				if (id != undefined) {
					document.waitForElement(".all-devoirs").then((elm) => {
						globalThis.cdt(id)
					})
				}
			}
			if (globalThis.token != "nada" && window.location.href.includes("Notes")) {
				id = window.location.pathname.split("/")[2]
				if (id != undefined) {
					document.waitForElement("td.discipline").then((elm) => {
						console.log("NOTES 3")
						globalThis.notes(id)
					})
				}
			}
			loop2()
		});
	})
}

if (window.sessionStorage.a != "0") {
	document.waitForElement("ed-modal-reconnexion").then((elm) => {
		window.sessionStorage.removeItem("token")
		window.sessionStorage.setItem("a", "0")
		window.location.href = "https://" + window.location.host + "/login"
	})
} else {
	window.sessionStorage.removeItem("a")
	loop()
}

if (globalThis.token != "nada" && window.location.href.includes("EmploiDuTemps") || window.location.href.includes("CahierDeTexte")) {
	id = window.location.pathname.split("/")[2]
	document.waitForElement(".all-devoirs").then((elm) => {
		console.log("mhm5")
		globalThis.token = window.sessionStorage.token ? window.sessionStorage.token.split("\"")[1] : "nada"
		globalThis.cdt(id)
	})
	document.waitForElement(".dhx_cal_data > div:nth-child(7)").then((elm) => {
		console.log("mhm6")
		globalThis.token = window.sessionStorage.token ? window.sessionStorage.token.split("\"")[1] : "nada"
		globalThis.cdt(id)
	})
}

if (globalThis.token != "nada" && window.location.href.includes("Notes")) {
	id = window.location.pathname.split("/")[2]
	if (id != undefined) {
		document.waitForElement("td.discipline").then((elm) => {
			console.log("NOTES 4")
			globalThis.notes(id)
		})
	}
}

var edMenuObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if (mutation.attributeName == "class" && mutation.target.className.includes("ed-menu")) {
			mutation.target.classList.remove("ed-menu")
		}
	});
});

executeEdMenuObserver(edMenuObserver)


function executeEdMenuObserver(observer) {
	document.waitForElement(".menu-bar").then((elm) => {
		observer.observe(elm, {
			characterData: false,
			attributes: true,
			attributeFilter: ['class'],
			childList: true,
			subtree: true
		});
	});
}