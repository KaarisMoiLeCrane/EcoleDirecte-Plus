(() => {
  function loginStyle() {
    if (!document.querySelector('[kmlc_login]')) {
      let infoContainer = document.querySelector("[class *= 'info-container']");
      let header = document.querySelector('header');
      let loginContainer = document.querySelector("[class *= 'login-container']");

      infoContainer.remove();
      header.remove();

      loginContainer.style.margin = 'auto';
      loginContainer.setAttribute('kmlc_login', 'true');
    }
  }

  exports({loginStyle}).to('./features/Design/login.js');
})();
