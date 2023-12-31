(() => {
  function tooltip() {
    // If the css isn't loaded in the page we add it
    if (!document.getElementById('kmlc_css_tooltip')) {
      const styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.id = 'kmlc_css_tooltip';
      styleSheet.innerText = `
.kmlc-note-parent, .kmlc-global-mean-parent {
  position: relative;
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.kmlc-tooltip-green {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #ffffff;
  padding: 5px 8px;
  border-radius: 5px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  background: rgba(0, 255, 0, 1);
  white-space: nowrap;
  display: flex;
}

.kmlc-tooltip-green::before {
  position: absolute;
  content: "";
  height: 8px;
  width: 8px;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  background: rgba(0, 255, 0, 1);
}

.kmlc-note-parent:hover .kmlc-tooltip-green, .kmlc-global-mean-parent:hover .kmlc-tooltip-green {
  top: -30px;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.kmlc-tooltip-green,
.kmlc-tooltip-green::before {
  text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
}

.kmlc-tooltip-orange {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #ffffff;
  padding: 5px 8px;
  border-radius: 5px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  background: rgba(255, 127.5, 0, 1);
  white-space: nowrap;
  display: flex;
}

.kmlc-tooltip-orange::before {
  position: absolute;
  content: "";
  height: 8px;
  width: 8px;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  background: rgba(255, 127.5, 0, 1);
}

.kmlc-note-parent:hover .kmlc-tooltip-orange, .kmlc-global-mean-parent:hover .kmlc-tooltip-orange {
  top: -30px;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.kmlc-tooltip-orange,
.kmlc-tooltip-orange::before {
  text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
}

.kmlc-tooltip-red {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #ffffff;
  padding: 5px 8px;
  border-radius: 5px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  background: rgba(255, 0, 0, 1);
  white-space: nowrap;
  display: flex;
}

.kmlc-tooltip-red::before {
  position: absolute;
  content: "";
  height: 8px;
  width: 8px;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  background: rgba(255, 0, 0, 1);
}

.kmlc-note-parent:hover .kmlc-tooltip-red, .kmlc-global-mean-parent:hover .kmlc-tooltip-red {
  top: -30px;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.kmlc-tooltip-red,
.kmlc-tooltip-red::before {
  text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
}
`;

      document.head.appendChild(styleSheet);
      // The new css is loaded
    }
  }

  exports({tooltip}).to('./features/Design/tooltip.js');
})();
