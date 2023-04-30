globalThis.messagerie = function (id) {
    // Wait for the button "Actualiser" (refresh button) in the top
    document.waitForElement("[class *= btn-group] > button:not([class *= dropdown])").then((elm) => {
        if (!document.querySelector("[kmlc-read-all]")) {
            // We duplicate the button and change it to a read all button
            let button = elm.cloneNode(true)
            button.title = "Lire tous les messages"
            button.setAttribute("kmlc-read-all", "true")
            
            elm.insertAfter(button)
            button.innerHTML = '<span style="font-weight: bold;">Tout lire</span>'
            
            button.onclick = function() {
                let type = getAccountType()
                
                if (type) {
                    // Make an http request to get the messages
                    let xhr = new XMLHttpRequest();
                    // console.log(window.location.pathname.split("/"))
                    // console.log(window.location.pathname.split("/")[2])
                    url = "https://api.ecoledirecte.com/v3/" + type + "/" + id + "/messages.awp?force=true&typeRecuperation=received&orderBy=date&order=desc&onlyRead=0&getAll=1&verbe=get";
                    data = `data={}`;

                    xhr.open("POST", url, false);
                    xhr.setRequestHeader("Content-Type", "text/plain");
                    xhr.setRequestHeader("X-Token", globalThis.token);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            // When we receive all the messages we open all of them
                            let messages = JSON.parse(xhr.responseText).data.messages.received;
                            
                            if (messages.length) {
                                alert("Un message non lu va être lu toutes les 100ms (" + messages.length + ")")
                                
                                for (let i = 0; i < messages.length; i++) {
                                    setTimeout(() => {
                                        let xhr2 = new XMLHttpRequest();
                                        xhr2.open("POST", "https://api.ecoledirecte.com/v3/" + type + "/" + id + "/messages/" + messages[i].id + ".awp?verbe=get&mode=destinataire", false);
                                        xhr2.setRequestHeader("Content-Type", "text/plain");
                                        xhr2.setRequestHeader("X-Token", globalThis.token);
                                        
                                        xhr2.send(data);
                                    }, 100)
                                }
                                
                                // console.log(messages, type, id)
                                
                                alert("Tous les messages ont été lus")
                            } else {
                                alert("Aucun message non lu a été trouvé dans la boîte principale")
                            }
                        }
                    };

                    xhr.send(data);
                } else {
                    console.log(type, JSON.parse(window.sessionStorage.accounts).payload.accounts[0].typeCompte)
                }
            }
        }
    })
}

function getAccountType() {
    if (window.sessionStorage.accounts)
        return JSON.parse(window.sessionStorage.accounts).payload.accounts[0].typeCompte == "'E'" ? "eleves" : "familles"
    
    return NaN
}
