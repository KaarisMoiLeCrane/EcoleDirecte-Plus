// CSS (only) stolen from https://github.com/Bastian-Noel/CustomDirecte (with a little bit of changes)
(() => {
  const sidebar = imports('sidebar').from('./features/Design/sidebar.js');
  const credit = imports('credit').from('./features/Design/credit.js');
  const popup = imports('popup').from('./features/Design/popup.js');
  const tooltip = imports('tooltip').from('./features/Design/tooltip.js');

  function main() {
    sidebar();
    credit();
    popup();
    tooltip();
  }

  exports({main}).to('./features/design.js');
})();
