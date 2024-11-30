(() => {
  /**
   * Adds tooltip styling to the page if not already present.
   * @param {string} styleId - The ID for the style element.
   * @param {string} styleContent - The CSS content to be added.
   */
  function addTooltipStyle(
    styleId = 'kmlc_css_tooltip',
    styleContent = `
:root {
  --tooltip-green: rgba(0, 255, 0, 1);
  --tooltip-orange: rgba(255, 127.5, 0, 1);
  --tooltip-red: rgba(255, 0, 0, 1);
  --tooltip-blue: rgba(13, 110, 253, 1);
  --transition-timing: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --tooltip-padding: 5px 8px;
  --tooltip-font-size: 14px;
  --tooltip-color: #ffffff;
  --tooltip-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  --tooltip-radius: 5px;
  --tooltip-text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
}

.kmlc-tooltip-parent, .kmlc-global-mean-parent {
  position: relative;
  transition: all 0.2s var(--transition-timing);
}

.kmlc-tooltip {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--tooltip-font-size);
  color: var(--tooltip-color);
  padding: var(--tooltip-padding);
  border-radius: var(--tooltip-radius);
  box-shadow: var(--tooltip-shadow);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s var(--transition-timing);
  white-space: nowrap;
  display: flex;
  text-shadow: var(--tooltip-text-shadow);
}

.kmlc-tooltip::before {
  position: absolute;
  content: "";
  height: 8px;
  width: 8px;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  transition: all 0.3s var(--transition-timing);
}

.kmlc-tooltip-parent:hover .kmlc-tooltip, .kmlc-global-mean-parent:hover .kmlc-tooltip {
  top: -30px;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.kmlc-tooltip-green {
  background: var(--tooltip-green);
}

.kmlc-tooltip-green::before {
  background: var(--tooltip-green);
}

.kmlc-tooltip-orange {
  background: var(--tooltip-orange);
}

.kmlc-tooltip-orange::before {
  background: var(--tooltip-orange);
}

.kmlc-tooltip-red {
  background: var(--tooltip-red);
}

.kmlc-tooltip-red::before {
  background: var(--tooltip-red);
}

.kmlc-tooltip-blue {
  background: var(--tooltip-blue);
}

.kmlc-tooltip-blue::before {
  background: var(--tooltip-blue);
}
`
  ) {
    // Check if the tooltip CSS is already loaded
    if (!document.getElementById(styleId)) {
      if (debug)
        console.log(
          '[DEBUG] addTooltipStyle',
          'Tooltip CSS not found, proceeding to add',
          {
            styleId
          }
        );

      // Create a new style element
      const styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.id = styleId;
      styleSheet.innerText = styleContent;

      // Append the style element to the head
      document.head.appendChild(styleSheet);
      if (debug)
        console.log('[DEBUG] addTooltipStyle', 'Tooltip CSS added', {
          styleId,
          styleContent
        });
    } else {
      if (debug)
        console.log(
          '[DEBUG] addTooltipStyle',
          'Tooltip CSS already exists, no action taken',
          {styleId}
        );
    }
  }

  // Export the addTooltipStyle function as a module
  exports({addTooltipStyle}).to('./src/Design/add-tooltip-style.js');
})();
