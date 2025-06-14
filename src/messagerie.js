(() => {
  const EcoleDirecte = imports('EcoleDirecte').from('./vendor/ecoledirecte.js');
  const getAccountType = imports('getAccountType').from('./utils/utils.js');

  /**
   * Main function to set up the "Read All" button and handle message reading.
   * @param {string} id - The ID of the user.
   * @param {string} token - The authentication token.
   */
  function main(id, token) {
    if (debug) console.log('[DEBUG]', 'main', 'Setting up Read All button.', {id, token});

    // Wait for the refresh button to appear
    document
      .kmlcWaitForElement(
        '[class *= btn-group] > button[class *= btn-secondary]:not([class *= dropdown])'
      )
      .then((buttonReloadMessages) => {
        if (!document.querySelector('[kmlc-read-all]')) {
          buttonReloadMessages.setAttribute('reloadMessages', 'true');
          setupReadAllButton(buttonReloadMessages, id, token);
        }
      });
  }

  /**
   * Sets up the "Read All" button next to the existing refresh button.
   * @param {HTMLElement} buttonReloadMessages - The existing refresh button element.
   * @param {string} id - The ID of the user.
   * @param {string} token - The authentication token.
   */
  function setupReadAllButton(buttonReloadMessages, id, token) {
    if (debug)
      console.log(
        '[DEBUG]',
        'setupReadAllButton',
        'Creating Read All button.',
        buttonReloadMessages
      );

    // Clone the refresh button and modify it to a "Read All" button
    const buttonReadAll = buttonReloadMessages.cloneNode(true);
    buttonReadAll.title = 'Lire tous les messages';
    buttonReadAll.setAttribute('kmlc-read-all', 'true');

    buttonReloadMessages.kmlcInsertAfter(buttonReadAll);
    buttonReadAll.innerHTML = '<span style="font-weight: bold;">Tout lire</span>';

    // Set up the onclick event to read all messages
    buttonReadAll.onclick = function () {
      handleReadAllMessages(id, token, buttonReloadMessages);
    };

    if (debug)
      console.log(
        '[DEBUG]',
        'setupReadAllButton',
        'Read All button set up.',
        buttonReadAll
      );
  }

  /**
   * Handles the reading of all messages.
   * @param {string} id - The ID of the user.
   * @param {string} token - The authentication token.
   */
  function handleReadAllMessages(id, token, buttonReloadMessages) {
    if (debug)
      console.log('[DEBUG]', 'handleReadAllMessages', 'Reading all messages.', {
        id,
        token
      });

    const accountType = getAccountType(id);
    const account = new EcoleDirecte(id, token);
    const receivedMessages = account.getReceivedMessages(accountType);

    if (debug)
      console.log('[DEBUG]', 'handleReadAllMessages', 'Received messages fetched.', {
        receivedMessages,
        accountType,
        id
      });

    if (receivedMessages.length) {
      alert(
        `Un message non lu (${receivedMessages.length}) va être lu toutes les 100ms après avoir validé`
      );

      // Create an array of Promises
      const readMessagePromises = receivedMessages.map((message, index) => {
        return readMessageWithDelay(account, accountType, message.id, index * 100);
      });

      // Wait for all messages to be read
      Promise.all(readMessagePromises).then(() => {
        // All messages have been read
        setTimeout(() => {
          buttonReloadMessages.click();
          alert('Tous les messages ont été lus');
        }, 200);
      });
    } else {
      alert('Aucun message non lu a été trouvé dans la boîte principale');
    }
  }

  function readMessageWithDelay(account, accountType, messageId, delay) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const readedMessageDatas = account.readMessage(accountType, messageId);
        if (debug)
          console.log(
            '[DEBUG]',
            'handleReadAllMessages',
            'Message read.',
            readedMessageDatas
          );
        resolve(readedMessageDatas);
      }, delay);
    });
  }

  exports({main}).to('./src/messagerie.js');
})();
