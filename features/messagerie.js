(() => {
  const EcoleDirecte = imports('EcoleDirecte').from('./vendor/ecoledirecte.js');

  function main(id, token) {
    // Wait for the button "Actualiser" (refresh button) in the top
    document
      .kmlcWaitForElement(
        '[class *= btn-group] > button[class *= btn-secondary]:not([class *= dropdown])'
      )
      .then((buttonReloadMessages) => {
        if (!document.querySelector('[kmlc-read-all]')) {
          // We duplicate the button and change it to a read all button
          const buttonReadAll = buttonReloadMessages.cloneNode(true);
          buttonReadAll.title = 'Lire tous les messages';
          buttonReadAll.setAttribute('kmlc-read-all', 'true');

          buttonReloadMessages.kmlcInsertAfter(buttonReadAll);
          buttonReadAll.innerHTML = '<span style="font-weight: bold;">Tout lire</span>';

          buttonReadAll.onclick = function () {
            const account = new EcoleDirecte(id, token);
            const receivedMessages = account.getReceivedMessages();
            // When we receive all the messages we open all of them

            if (receivedMessages.length) {
              alert(
                `Un message non lu (${receivedMessages.length}) va être lu toutes les 100ms après avoir validé`
              );

              for (let i = 0; i < receivedMessages.length; i++) {
                setTimeout(() => {
                  const readedMessageDatas = account.readMessage(receivedMessages[i].id);
                }, 100);
              }

              alert('Tous les messages ont été lus');
            } else {
              alert('Aucun message non lu a été trouvé dans la boîte principale');
            }
          };
        }
      });
  }

  exports({main}).to('./features/messagerie.js');
})();
