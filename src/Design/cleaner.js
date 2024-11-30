(() => {
  var cleanerObserver;

  function cleaner() {
    setupCleanerObserver();
    removeEdMenuClass();
    removeResizePageClass();
  }

  /**
   * Sets up the mutation observer to observe one repeated change in the design.
   */
  function setupCleanerObserver() {
    cleanerObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.target.style.visibility === 'hidden' ||
          mutation.target.style.marginLeft === '-9999px' ||
          mutation.target.style.position === 'absolute'
        ) {
          mutation.target.style = '';
          document.querySelector("#main").click()
          cleanerObserver.disconnect();
        }
      }
    });

    executeCleanerObserver(cleanerObserver);
  }

  /**
   * Executes the cleaner observer to monitor the style changes of the main part.
   * @param {MutationObserver} observer - The mutation observer instance.
   */
  function executeCleanerObserver(observer) {
    document.kmlcWaitForElement('#main').then((elm) => {
      observer.observe(elm, {
        attributes: true,
        attributeFilter: ['style']
      });
      if (debug)
        console.log('[DEBUG]', 'executeCleanerObserver', 'Observer set up on #main', elm);
    });
  }

  /**
   * Removes 'ed-menu' CSS class from all menu elements.
   */
  function removeEdMenuClass() {
    const menuElements = document.querySelectorAll('div.menu.ed-menu');
    menuElements.forEach((element) => element.classList.remove('ed-menu'));
  }

  /**
   * Removes 'resizePage' CSS class from all elements (header, main and footer).
   */
  function removeResizePageClass() {
    const menuElements = document
      .querySelector('#main-part')
      .querySelectorAll('.resizePage');
    menuElements.forEach((element) => element.classList.remove('resizePage'));
  }

  exports({cleaner}).to('./src/Design/cleaner.js');
})();
