(() => {
  const EcoleDirecte = imports('EcoleDirecte').from('./vendor/ecoledirecte.js');

  const homeworkStatus = imports('homeworkStatus').from(
    './features/CahierDeTexte/homework-status.js'
  );
  const homeworkRefresh = imports('homeworkRefresh').from(
    './features/CahierDeTexte/homework-refresh.js'
  );

  function main(id, token) {
    const account = new EcoleDirecte(id, token);

    // When we receive all the homeworks we save it and send it
    const homeworksData = account.getHomeworks();

    homeworkStatus(homeworksData);
    homeworkRefresh(homeworksData);

    // Wait for the button "À venir" in the bottom right
    document
      .kmlcWaitForElement(
        'ed-cdt-eleve-onglets > ul > li.secondary.onglet-secondary > button'
      )
      .then((buttonAVenir) => {
        if (buttonAVenir.getAttribute('kmlc-click-listener') != 'true') {
          buttonAVenir.setAttribute('kmlc-click-listener', 'true');
          buttonAVenir.onclick = function () {
            homeworkStatus(homeworksData);
          };
        }
      });
  }

  exports({main}).to('./features/cahierdetexte.js');
})();
