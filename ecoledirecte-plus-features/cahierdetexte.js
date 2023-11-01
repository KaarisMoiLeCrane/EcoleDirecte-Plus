globalThis.cahierdetexte = function () {
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
            globalThis.CahierDeTexte.homeworkStatus(dev)
            globalThis.CahierDeTexte.homeworkRefresh(dev)
            
            // Wait for the button "À venir" in the bottom right
            document.waitForElement("ed-cdt-eleve-onglets > ul > li.secondary.onglet-secondary > button").then((elm) => {
                if (elm.getAttribute("kmlc-click-listener") != "true") {
                    elm.setAttribute("kmlc-click-listener", "true")
                    elm.onclick = function() {
                        globalThis.CahierDeTexte.homeworkStatus(dev)
                    }
                }
            })
        }
    };

    xhr.send(data);
}