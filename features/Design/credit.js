(() => {
  function credit() {
    if (!document.querySelector('[kmlc_credit]')) {
      document.kmlcWaitForElement('#footer ul').then((footerButtons) => {
        const creditButton = document.createElement('LI');
        creditButton.setAttribute('kmlc_credit', 'true');

        footerButtons.appendChild(creditButton);
        document.querySelector('[kmlc_credit]').outerHTML =
          '<li kmlc_credit="true" class="list-inline-item" style="display: inline-block; margin: 15px 0; padding: 5px; background: #e2e7ed; border-radius: 3px; background-size: 10px;"><a href="https://github.com/KaarisMoiLeCrane/EcoleDirecte-Plus" target="_blank" rel="noopener noreferrer" style="color: #000">ED+ par KMLC</a></li>';
      });
    }
  }

  exports({credit}).to('./features/Design/credit.js');
})();
