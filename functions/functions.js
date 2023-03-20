globalThis.numToDate = function (month) {
    month = parseInt(month)

    switch (month) {
        case 1:
            return {
                norm: "Janvier",
                    abrv: "Jan"
            }
        case 2:
            return {
                norm: "Février",
                    abrv: "Fév"
            }
        case 3:
            return {
                norm: "Mars",
                    abrv: "Mar"
            }
        case 4:
            return {
                norm: "Avril",
                    abrv: "Avr"
            }
        case 5:
            return {
                norm: "Mais",
                    abrv: "Mai"
            }
        case 6:
            return {
                norm: "Juin",
                    abrv: "Juin"
            }
        case 7:
            return {
                norm: "Juillet",
                    abrv: "Juil"
            }
        case 8:
            return {
                norm: "Août",
                    abrv: "Aoû"
            }
        case 9:
            return {
                norm: "Septembre",
                    abrv: "Sep"
            }
        case 10:
            return {
                norm: "Octobre",
                    abrv: "Oct"
            }
        case 11:
            return {
                norm: "Novembre",
                    abrv: "Nov"
            }
        case 12:
            return {
                norm: "Décembre",
                    abrv: "Déc"
            }
        default:
            console.error("Enter a number between 1 and 12", '\n', "The value entered is : ", month);
            return undefined
    }
}

/*globalThis.waitForElm = function (selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}*/

globalThis.watchAnyObject = function (
    object = {},
    methods = [],
    callbackBefore = function() {},
    callbackAfter = function() {},
) {
    for (let method of methods) {
        const original = object[method].bind(object);
        const newMethod = function(...args) {
            callbackBefore(method, ...args);
            const result = original.apply(null, args);
            callbackAfter(method, ...args);
            return result;
        };
        object[method] = newMethod.bind(object);
    }
}

Node.prototype.insertAfter = function (newNode) {
    if (this.nextElementSibling) this.parentNode.insertBefore(newNode, this.nextElementSibling)
    else this.parentNode.appendChild(newNode)
}

Node.prototype.getElementsByContentText = function (text) {
    text = text.toLowerCase()
    let DOMElements = [...this.getElementsByTagName("*")]
    let obj = {
        includes: [],
        startsWith: []
    };

    DOMElements
        .filter(a => a.textContent.toLowerCase().includes(text))
        .forEach(a => obj.includes.push(a));
    
    DOMElements
        .filter(b => b.textContent.toLowerCase().startsWith(text))
        .forEach(b => obj.startsWith.push(b));

    return obj
}

Node.prototype.waitForElement = function (selector) {
    return new Promise(resolve => {
        if (this.querySelector(selector)) {
            return resolve(this.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (this.querySelector(selector)) {
                resolve(this.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(this.body, {
            childList: true,
            subtree: true
        });
    });
}

globalThis.fragmentFromString = function (strHTML) {
	return document.createRange().createContextualFragment(strHTML).childNodes[0];
}

String.prototype.htmlEncode = function(){
    let p = document.createElement("p");
    p.textContent = this;
    return p.innerHTML
}