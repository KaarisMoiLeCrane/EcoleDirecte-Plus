globalThis.CahierDeTexte.homeworkRefresh = function (dev) {
    if (homeworkRefreshObserver) {
        homeworkRefreshObserver.disconnect()
    }
    
    var homeworkRefreshObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === "childList" && mutation.target.className.includes("ed-card") && !mutation.target.className.includes("devoiravenir")) {
                let devDateCDT = mutation.target.parentElement.parentElement
                let dates = Object.keys(dev)
                
                for (let i = 0; i < dates.length; i++) {
                    let date = dates[i]
                    
                    if ((devDateCDT.textContent.split(" ")[1] + " " + devDateCDT.textContent.split(" ")[2]).toLowerCase() == (parseInt(date.split("-")[2]) + " " + globalThis.Utils.numToDate(date.split("-")[1]).norm).toLowerCase()) {
                        for (let j = 0; j < dev[date].length; j++) {
                            let matiere = dev[date][j].matiere.replace(/ /g, '').toLowerCase()
                            let boxEffectuee = mutation.target.querySelector("#checkEffectue")
                            
                            if (matiere == boxEffectuee.parentElement.parentElement.parentElement.querySelector("h3").innerText.replace(/ /g, '').toLowerCase()) {
                                // console.log(dev[date][j])
                                
                                if (!boxEffectuee.getAttribute("kmlc-effectuee-listener")) {
                                    boxEffectuee.setAttribute("kmlc-effectuee-listener", "true")
                                    boxEffectuee.addEventListener("click", function() {
                                        dev[date][j].effectue = this.checked
                                    })
                                }
                            }
                        }
                    }
                }
            }
        })
    });
    
    executeHomeworkRefreshObserver(homeworkRefreshObserver)
}

function executeHomeworkRefreshObserver(observer) {
    document.waitForElement(".cahierdetexteimprimable").then((elm) => {
        observer.observe(elm, {
            attributes: true,
            childList: true,
            subtree: true
        });
    })
}