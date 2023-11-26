Node.prototype.insertAfter = function (newNode) {
	if (this.nextElementSibling)
		this.parentNode.insertBefore(newNode, this.nextElementSibling);
	else this.parentNode.appendChild(newNode);
};

Node.prototype.getElementsByContentText = function (text) {
	text = text.toLowerCase();
	let DOMElements = [...this.getElementsByTagName('*')];
	let obj = {
		includes: [],
		startsWith: [],
	};

	DOMElements.filter(a => a.textContent.toLowerCase().includes(text)).forEach(
		a => obj.includes.push(a),
	);

	DOMElements.filter(b => b.textContent.toLowerCase().startsWith(text)).forEach(
		b => obj.startsWith.push(b),
	);

	return obj;
};

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
			subtree: true,
		});
	});
};

String.prototype.htmlEncode = function () {
	let p = document.createElement('p');
	p.textContent = this;
	return p.innerHTML;
};

String.prototype.convertToTimestamp = function () {
	const date = new Date(this);
	return date.getTime();
};

Object.prototype.kmlcSize = function () {
	const bytes = new TextEncoder().encode(JSON.stringify(this)).length;
	const kiloBytes = bytes / 1024;
	const megaBytes = kiloBytes / 1024;

	return {
		bytes: bytes,
		kiloBytes: kiloBytes,
		megaBytes: megaBytes,
		storageInfo:
			'Local Storage = 10 MB (unlimitedStorage) \n Sync Storage 100 KB (8 KB per item) \n Session Storage = 10 MB',
	};
};
