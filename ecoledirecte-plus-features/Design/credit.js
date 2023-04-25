globalThis.Design.credit = function () {
	if (!document.querySelector("[kmlc_credit]")) {
		document.waitForElement("#footer ul").then((elm) => {
			let creditButton = document.createElement("LI")
			creditButton.setAttribute("kmlc_credit", "true")
			
			elm.appendChild(creditButton)
			document.querySelector("[kmlc_credit]").outerHTML = '<li kmlc_credit="true" class="list-inline-item" style="display: inline-block; margin: 15px 0; padding: 5px; background: #e2e7ed; border-radius: 3px; background-size: 10px;"><a href="https://github.com/KaarisMoiLeCrane/EcoleDirecte-Plus" target="_blank" rel="noopener noreferrer" style="color: #000">ED+ par KMLC</a></li>'
		})
	}
}