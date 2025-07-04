(() => {
  /**
   * Adds popup styling to the page if not already present.
   * @param {string} styleId - The ID for the style element.
   * @param {string} styleContent - The CSS content to be added.
   */
  function addPopupStyle(
    styleId = 'kmlc_css_popup',
    styleContent = `
/* Animation d'ouverture et de fermeture de la popup */
@keyframes kmlc-popupOpenAnimation {
  from {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

@keyframes kmlc-popupCloseAnimation {
  from {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
}

/* Style de la liste de matières */
.kmlc-list {
  list-style-type: none;
  padding: 0;
  margin: 30px 0 !important;
}

/* Style des éléments de la liste */
.kmlc-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Style du label de la matière */
.kmlc-label {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Style de l'input box */
.kmlc-input {
  flex: 2;
  width: 100%;
  padding: 10px;
  margin-left: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.kmlc-input:focus {
  backdrop-filter: blur(0px);
}

.kmlc-blur {
  backdrop-filter: blur(3px);
  z-index: 9998;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  animation: kmlc-popupOpenAnimation 0.3s ease-in-out;
}

.kmlc-popup {
  z-index: 9999;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: white;
  animation: kmlc-popupOpenAnimation 0.3s ease-in-out;
  overflow-y: auto;
}

.kmlc-popup-close {
  animation: kmlc-popupCloseAnimation 0.3s ease-in-out;
}

.kmlc-remove-button {
  background-color: #ff0000;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.kmlc-remove-button:hover {
  background-color: #cc0000;
}

.kmlc-add-button {
  background-color: var(--light-primary-color);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.kmlc-add-button:hover {
  background-color: var(--dark-primary-color);
}

.kmlc-button-container {
  text-align: right;
  margin-top: 10px;
}

.kmlc-checkbox {
  margin-left: 10px;
}

.kmlc-checkbox-label {
  margin-left: 5px;
}
`
  ) {
    // Check if the popup CSS is already loaded
    if (!document.getElementById(styleId)) {
      if (debug)
        console.log('[DEBUG] addPopupStyle', 'Popup CSS not found, proceeding to add', {
          styleId
        });

      // Create a new style element
      const styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.id = styleId;
      styleSheet.innerText = styleContent;

      // Append the style element to the head
      document.head.appendChild(styleSheet);
      if (debug)
        console.log('[DEBUG] addPopupStyle', 'Popup CSS added', {styleId, styleContent});
    } else {
      if (debug)
        console.log(
          '[DEBUG] addPopupStyle',
          'Popup CSS already exists, no action taken',
          {
            styleId
          }
        );
    }
  }

  // Export the addPopupStyle function as a module
  exports({addPopupStyle}).to('./src/Design/add-popup-style.js');
})();
