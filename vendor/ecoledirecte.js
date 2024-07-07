(() => {
  /**
   * EcoleDirecte Class
   * Provides methods to interact with the EcoleDirecte API.
   */
  class EcoleDirecte {
    /**
     * Constructor for EcoleDirecte class.
     * @param {string|number} idOrUser - User ID or username.
     * @param {string} tokenOrPassword - API token or password.
     * @param {boolean} isUserPasswordPair - Flag to determine if the credentials are user-password pair.
     * @param {number} idByDefaultIfUserPasswordPair - Default ID if using user-password pair.
     */
    constructor(
      idOrUser,
      tokenOrPassword,
      isUserPasswordPair = false,
      idByDefaultIfUserPasswordPair = NaN
    ) {
      this.extension = location.protocol.includes('-extension:');
      this.apiUrl = 'https://api.ecoledirecte.com/v3';

      if (typeof debug === 'undefined') {
        this.debug = true;
      } else {
        this.debug = debug;
      }

      if (!isUserPasswordPair) {
        this.id = idOrUser;
        this.token = tokenOrPassword;
      } else {
        if (idByDefaultIfUserPasswordPair) this.id = idByDefaultIfUserPasswordPair;

        this.user = idOrUser;
        this.password = tokenOrPassword;
      }
    }

    /**
     * Makes a request to the EcoleDirecte API.
     * @param {string} url - The API endpoint.
     * @param {string} data - The request payload.
     * @param {boolean} [async=false] - Flag to determine if the request should be asynchronous.
     * @param {boolean} [isLogin=false] - Flag to determine if the request is a login request.
     * @returns {Object|null} - The response data or null in case of error.
     */
    _makeRequest(url, data, async = false, isLogin = false) {
      if (debug)
        console.log('[DEBUG]', '_makeRequest', 'Making a request to the API', {
          url,
          data,
          async,
          isLogin
        });

      try {
        if (this.extension || async) {
          return this._makeFetchRequest(url, data, isLogin);
        } else {
          return this._makeXMLHttpRequest(url, data, isLogin);
        }
      } catch (error) {
        if (debug) console.error('[ERROR]', '_makeRequest', 'Request failed', {error});
        return null;
      }
    }

    /**
     * Makes a fetch request to the EcoleDirecte API.
     * @param {string} url - The API endpoint.
     * @param {string} data - The request payload.
     * @param {boolean} [isLogin=false] - Flag to determine if the request is a login request.
     * @returns {Promise<Object>} - The response data.
     */
    async _makeFetchRequest(url, data, isLogin = false) {
      if (debug)
        console.log('[DEBUG]', '_makeFetchRequest', 'Making a fetch request', {
          url,
          data,
          isLogin
        });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'X-Token': this.token
        },
        body: data
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch (${response.status}): ${response.statusText}`);
      }

      const result = await response.json();

      return isLogin ? result : result.data;
    }

    /**
     * Makes an XMLHttpRequest to the EcoleDirecte API.
     * @param {string} url - The API endpoint.
     * @param {string} data - The request payload.
     * @param {boolean} [isLogin=false] - Flag to determine if the request is a login request.
     * @returns {Object} - The response data.
     */
    _makeXMLHttpRequest(url, data, isLogin = false) {
      if (debug)
        console.log('[DEBUG]', '_makeXMLHttpRequest', 'Making an XMLHttpRequest', {
          url,
          data,
          isLogin
        });

      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, false); // Third parameter is set to false for synchronous request
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.setRequestHeader('X-Token', this.token);

      xhr.send(data);

      if (xhr.status !== 200) {
        throw new Error(`Failed to fetch (${xhr.status}): ${xhr.statusText}`);
      }

      const result = JSON.parse(xhr.responseText);

      return isLogin ? result : result.data;
    }

    /**
     * Logs in the user and retrieves the API token.
     * @param {boolean} [async=false] - Flag to determine if the request should be asynchronous.
     * @returns {Promise<string>|string} - The API token.
     */
    login(async = false) {
      const url = `${this.apiUrl}/login.awp`;
      const data = `data={"identifiant": "${this.user}", "motdepasse": "${this.password}", "isReLogin": false, "uuid": ""}`;

      if (debug)
        console.log('[DEBUG]', 'login', 'Logging in the user', {user: this.user});

      if (this.extension || async) {
        return this._makeRequest(url, data, true, true)
          .then((loginData) => {
            if (loginData.code === 200) {
              if (debug) console.log('[DEBUG]', 'login', 'Login successful', {loginData});

              if (!this.id) this.id = loginData.data.accounts[0].id;
              this.token = loginData.token;
              return loginData.token;
            } else {
              if (debug)
                console.error('[ERROR]', 'login', 'Login failed', {
                  message: loginData.message
                });
              return Promise.reject('Login failed');
            }
          })
          .catch((error) => {
            if (debug) console.error('[ERROR]', 'login', 'Error during login', {error});
            return Promise.reject('Error during login');
          });
      } else {
        const loginData = this._makeRequest(url, data, false, true);

        if (loginData.code === 200) {
          if (debug) console.log('[DEBUG]', 'login', 'Login successful', {loginData});

          if (!this.id) this.id = loginData.data.accounts[0].id;
          this.token = loginData.token;
          return loginData.token;
        } else {
          if (debug)
            console.error('[ERROR]', 'login', 'Login failed', {
              message: loginData.message
            });
          throw new Error('Login failed');
        }
      }
    }

    /**
     * Retrieves the homework for the user.
     * @param {boolean} [async=false] - Flag to determine if the request should be asynchronous.
     * @returns {Object} - The homework data.
     */
    getHomeworks(async = false) {
      const url = `${this.apiUrl}/Eleves/${this.id}/cahierdetexte.awp?verbe=get`;
      const data = 'data={}';

      if (debug)
        console.log('[DEBUG]', 'getHomeworks', 'Retrieving homework', {id: this.id});
      return this._makeRequest(url, data, async);
    }

    /**
     * Retrieves all messages for the user.
     * @param {string} accountType - The account type (e.g., "eleve", "parent").
     * @param {string} type - The message type (e.g., "received", "sent").
     * @param {string} [orderBy='date'] - The order by field.
     * @param {string} [onlyRead='0'] - Filter for read/unread messages.
     * @param {boolean} [async=false] - Flag to determine if the request should be asynchronous.
     * @returns {Object|null} - The messages or null in case of error.
     */
    getAllMessages(accountType, type, orderBy = 'date', onlyRead = '0', async = false) {
      const url = `${this.apiUrl}/${accountType}/${this.id}/messages.awp?verbe=get&force=true&typeRecuperation=${type}&orderBy=${orderBy}&order=desc&onlyRead=${onlyRead}&getAll=1`;
      const data = 'data={}';

      if (debug)
        console.log('[DEBUG]', 'getAllMessages', 'Retrieving messages', {
          accountType,
          type,
          orderBy,
          onlyRead
        });
      const messages = this._makeRequest(url, data, async);
      return messages ? messages.messages[type] : null;
    }

    /**
     * Retrieves archived messages for the user.
     * @param {string} accountType - The account type.
     * @param {string} [orderBy='date'] - The order by field.
     * @param {string} [onlyRead='0'] - Filter for read/unread messages.
     * @param {boolean} [async=false] - Flag to determine if the request should be asynchronous.
     * @returns {Object|null} - The archived messages or null in case of error.
     */
    getArchivedMessages(accountType, orderBy = 'date', onlyRead = '0', async = false) {
      if (debug)
        console.log('[DEBUG]', 'getArchivedMessages', 'Retrieving archived messages', {
          accountType,
          orderBy,
          onlyRead
        });
      return this.getAllMessages(accountType, 'archived', orderBy, onlyRead, async);
    }

    /**
     * Retrieves drafted messages for the user.
     * @param {string} accountType - The account type.
     * @param {string} [orderBy='date'] - The order by field.
     * @param {string} [onlyRead='0'] - Filter for read/unread messages.
     * @param {boolean} [async=false] - Flag to determine if the request should be asynchronous.
     * @returns {Object|null} - The drafted messages or null in case of error.
     */
    getDraftedMessages(accountType, orderBy = 'date', onlyRead = '0', async = false) {
      if (debug)
        console.log('[DEBUG]', 'getDraftedMessages', 'Retrieving drafted messages', {
          accountType,
          orderBy,
          onlyRead
        });
      return this.getAllMessages(accountType, 'draft', orderBy, onlyRead, async);
    }

    /**
     * Retrieves received messages for the user.
     * @param {string} accountType - The account type.
     * @param {string} [orderBy='date'] - The order by field.
     * @param {string} [onlyRead='0'] - Filter for read/unread messages.
     * @param {boolean} [async=false] - Flag to determine if the request should be asynchronous.
     * @returns {Object|null} - The received messages or null in case of error.
     */
    getReceivedMessages(accountType, orderBy = 'date', onlyRead = '0', async = false) {
      if (debug)
        console.log('[DEBUG]', 'getReceivedMessages', 'Retrieving received messages', {
          accountType,
          orderBy,
          onlyRead
        });
      return this.getAllMessages(accountType, 'received', orderBy, onlyRead, async);
    }

    /**
     * Reads a specific message for the user.
     * @param {string} accountType - The account type.
     * @param {string} messageId - The message ID.
     * @param {boolean} [async=false] - Flag to determine if the request should be asynchronous.
     * @returns {Object} - The message data.
     */
    readMessage(accountType, messageId, async = false) {
      const url = `${this.apiUrl}/${accountType}/${this.id}/messages/${messageId}.awp?verbe=get&mode=destinataire`;
      const data = 'data={}';

      if (debug)
        console.log('[DEBUG]', 'readMessage', 'Reading message', {
          accountType,
          messageId
        });
      return this._makeRequest(url, data, async);
    }

    /**
     * Retrieves all grades for the user.
     * @param {boolean} [async=false] - Flag to determine if the request should be asynchronous.
     * @returns {Object} - The grades data.
     */
    getAllGrades(async = false) {
      const url = `${this.apiUrl}/Eleves/${this.id}/notes.awp?verbe=get`;
      const data = 'data={}';

      if (debug)
        console.log('[DEBUG]', 'getAllGrades', 'Retrieving all grades', {id: this.id});
      return this._makeRequest(url, data, async);
    }
  }

  // Export the EcoleDirecte class
  exports({EcoleDirecte}).to('./vendor/ecoledirecte.js');
})();
