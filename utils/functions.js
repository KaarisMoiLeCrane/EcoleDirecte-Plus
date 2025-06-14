/**
 * Inserts a new node after the current node.
 * @param {Node} newNode - The new node to be inserted.
 */
Node.prototype.kmlcInsertAfter = function (newNode) {
  if (debug)
    console.log('[DEBUG]', 'kmlcInsertAfter', 'Attempting to insert node', {
      newNode,
      parentNode: this.parentNode
    });

  // Check if there is a next sibling node
  if (this.nextElementSibling) {
    // Insert the new node before the next sibling
    this.parentNode.insertBefore(newNode, this.nextElementSibling);
    if (debug)
      console.log('[DEBUG]', 'kmlcInsertAfter', 'Node inserted before next sibling', {
        newNode,
        siblingNode: this.nextElementSibling
      });
  } else {
    // Append the new node if no next sibling
    this.parentNode.appendChild(newNode);
<<<<<<< HEAD
    if (debug)
      console.log('[DEBUG]', 'kmlcInsertAfter', 'Node appended as last child', {newNode});
=======
    if (debug) console.log('[DEBUG]', 'kmlcInsertAfter', 'Node appended as last child', {newNode});
>>>>>>> features
  }
};

/**
 * Finds elements within the current node that include or start with the specified text.
 * @param {string} text - The text to search for.
 * @returns {Object} - An object containing arrays of elements that include or start with the text.
 */
Node.prototype.kmlcGetElementsByContentText = function (text) {
  if (debug)
    console.log(
      '[DEBUG]',
      'kmlcGetElementsByContentText',
      'Searching for elements by content text',
      {text}
    );

  text = text.toLowerCase();
  let DOMElements = [...this.getElementsByTagName('*')];
  let obj = {
    includes: [],
    startsWith: []
  };

  // Filter elements that include the text
  DOMElements.filter((a) => a.textContent.toLowerCase().includes(text)).forEach((a) =>
    obj.includes.push(a)
  );

  // Filter elements that start with the text
  DOMElements.filter((b) => b.textContent.toLowerCase().startsWith(text)).forEach((b) =>
    obj.startsWith.push(b)
  );

  if (debug)
<<<<<<< HEAD
    console.log(
      '[DEBUG]',
      'kmlcGetElementsByContentText',
      'Elements filtered by content text',
      {text, result: obj}
    );
=======
    console.log('[DEBUG]', 'kmlcGetElementsByContentText', 'Elements filtered by content text', {
      text,
      result: obj
    });
>>>>>>> features
  return obj;
};

/**
 * Waits for an element matching the selector to appear in the DOM.
 * @param {string} selector - The CSS selector of the element to wait for.
 * @returns {Promise} - A promise that resolves with the found element or rejects if aborted.
 */
Node.prototype.kmlcWaitForElement = function (selector) {
<<<<<<< HEAD
  if (debug)
    console.log('[DEBUG]', 'kmlcWaitForElement', 'Waiting for element', {selector});
=======
  if (debug) console.log('[DEBUG]', 'kmlcWaitForElement', 'Waiting for element', {selector});
>>>>>>> features

  let willCallback = null;
  let observer = null;
  let abortFunction = null;
  let willExecuted = false;

  const customPromise = new Promise((resolve, reject) => {
    if (this.querySelector(selector)) {
      resolve(this.querySelector(selector));
      return;
    }

    observer = new MutationObserver((mutations) => {
      if (this.querySelector(selector)) {
        resolve(this.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(this, {
      childList: true,
      subtree: true
    });

    // Define the abort function
    abortFunction = () => {
      if (observer) {
        observer.disconnect();
      }
      if (debug)
<<<<<<< HEAD
        console.log(
          '[DEBUG]',
          'kmlcWaitForElement-abortFunction',
          'Wait for element aborted',
          {selector}
        );
=======
        console.log('[DEBUG]', 'kmlcWaitForElement-abortFunction', 'Wait for element aborted', {
          selector
        });
>>>>>>> features
      reject();
    };

    // If the willCallback is already defined, execute it immediately
    if (willCallback && !willExecuted) {
      willCallback(abortFunction);
      willExecuted = true;
    }
  });

  customPromise.will = function (callback) {
    willCallback = callback;
    // Execute the will callback immediately if the promise has started
    if (!willExecuted && abortFunction) {
      willCallback(abortFunction);
      willExecuted = true;
    }
    return customPromise;
  };

  return customPromise;
};

/**
 * Encodes a string as HTML.
 * @returns {string} - The HTML encoded string.
 */
String.prototype.kmlcHtmlEncode = function () {
<<<<<<< HEAD
  if (debug)
    console.log('[DEBUG]', 'kmlcHtmlEncode', 'Encoding string to HTML', {original: this});
=======
  if (debug) console.log('[DEBUG]', 'kmlcHtmlEncode', 'Encoding string to HTML', {original: this});
>>>>>>> features

  let p = document.createElement('p');
  p.textContent = this;
  const encodedHtml = p.innerHTML;

  if (debug)
    console.log('[DEBUG]', 'kmlcHtmlEncode', 'HTML encoded string', {
      original: this,
      encoded: encodedHtml
    });
  return encodedHtml;
};

/**
 * Converts a string to a timestamp.
 * @returns {number} - The timestamp representing the date.
 */
String.prototype.kmlcConvertToTimestamp = function () {
  if (debug)
    console.log('[DEBUG]', 'kmlcConvertToTimestamp', 'Converting string to timestamp', {
      string: this
    });

  const date = new Date(this);
  const timestamp = date.getTime();

  if (debug)
    console.log('[DEBUG]', 'kmlcConvertToTimestamp', 'String converted to timestamp', {
      string: this,
      timestamp
    });
  return timestamp;
};

/**
 * Calculates the size of an object in bytes, kilobytes, and megabytes.
 * @returns {Object} - An object containing the size in various units and storage information.
 */
Object.prototype.kmlcSize = function () {
<<<<<<< HEAD
  if (debug)
    console.log('[DEBUG]', 'kmlcSize', 'Calculating object size', {object: this});
=======
  if (debug) console.log('[DEBUG]', 'kmlcSize', 'Calculating object size', {object: this});
>>>>>>> features

  const bytes = new TextEncoder().encode(JSON.stringify(this)).length;
  const kiloBytes = bytes / 1024;
  const megaBytes = kiloBytes / 1024;

  const sizeInfo = {
    bytes: bytes,
    kiloBytes: kiloBytes,
    megaBytes: megaBytes,
    storageInfo:
      'Local Storage = 10 MB (unlimitedStorage) \n Sync Storage 100 KB (8 KB per item) \n Session Storage = 10 MB'
  };

  if (debug)
    console.log('[DEBUG]', 'kmlcSize', 'Object size calculated', {
      object: this,
      sizeInfo
    });
  return sizeInfo;
<<<<<<< HEAD
=======
};

/**
 * Replaces an element node with a new element.
 * @param {string} newTag - The new tag name of the element (e.g., 'div', 'span').
 * @param {boolean} [preserveChildren=true] - Whether to keep the children of the old node in the new one.
 */
Object.prototype.kmlcReplaceElementNode = function (newTag, preserveChildren = true) {
  if (!(this instanceof HTMLElement)) {
    console.error('Provided node is not a valid HTMLElement.');
    return;
  }

  // Create the new element
  const newNode = document.createElement(newTag);

  // Copy attributes from oldNode to newNode
  [...this.attributes].forEach((attr) => {
    newNode.setAttribute(attr.name, attr.value);
  });

  // Optionally, move children to the new node
  if (preserveChildren) {
    while (this.firstChild) {
      newNode.appendChild(this.firstChild);
    }
  }

  // Replace the node with the new one in the DOM
  this.parentNode.replaceChild(newNode, this);

  if (debug)
    console.log(
      '[DEBUG]',
      'kmlcReplaceElementNode',
      `Replaced <${this.tagName.toLowerCase()}> with <${newTag}>.`,
      {
        element: this,
        newTag
      }
    );
  return newNode;
};

/**
 * Convert a timestamp to a formatted date string.
 * @returns {string} The formatted date string in French locale.
 */
Date.prototype.timestampToDate = function () {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  return this.toLocaleString('fr-FR', options);
};

/**
 * Capitalize the first letter of a string.
 * @returns {string} The capitalized string.
 */
String.prototype.capitalizeFirstLetter = function () {
  return this[0].toUpperCase() + this.slice(1);
>>>>>>> features
};

/**
 * Replaces an element node with a new element.
 * @param {string} newTag - The new tag name of the element (e.g., 'div', 'span').
 * @param {boolean} [preserveChildren=true] - Whether to keep the children of the old node in the new one.
 */
Object.prototype.kmlcReplaceElementNode = function (newTag, preserveChildren = true) {
  if (!(this instanceof HTMLElement)) {
    console.error('Provided node is not a valid HTMLElement.');
    return;
  }

  // Create the new element
  const newNode = document.createElement(newTag);

  // Copy attributes from oldNode to newNode
  [...this.attributes].forEach((attr) => {
    newNode.setAttribute(attr.name, attr.value);
  });

  // Optionally, move children to the new node
  if (preserveChildren) {
    while (this.firstChild) {
      newNode.appendChild(this.firstChild);
    }
  }

  // Replace the node with the new one in the DOM
  this.parentNode.replaceChild(newNode, this);

  if (debug)
    console.log(
      '[DEBUG]',
      'kmlcReplaceElementNode',
      `Replaced <${this.tagName.toLowerCase()}> with <${newTag}>.`,
      {
        element: this,
        newTag
      }
    );
  return newNode;
};
