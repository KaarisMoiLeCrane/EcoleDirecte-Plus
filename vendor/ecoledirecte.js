(() => {
  class EcoleDirecte {
    constructor(
      idOrUser,
      tokenOrPassword,
      isUserPasswordPair = false,
      idByDefaultIfUserPasswordPair = NaN
    ) {
      this.extension = location.protocol.includes('-extension:');

      if (!isUserPasswordPair) {
        this.id = idOrUser;
        this.token = tokenOrPassword;
      } else {
        if (idByDefaultIfUserPasswordPair) this.id = idByDefaultIfUserPasswordPair;

        this.user = idOrUser;
        this.password = tokenOrPassword;
      }
    }

    _makeRequest(url, data, async = false, isLogin = false) {
      try {
        if (this.extension || async) {
          return this._makeFetchRequest(url, data, isLogin);
        } else {
          return this._makeXMLHttpRequest(url, data, isLogin);
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    async _makeFetchRequest(url, data, isLogin = false) {
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

      if (isLogin) return result;
      return result.data;
    }

    _makeXMLHttpRequest(url, data, isLogin = false) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, false); // Third parameter is set to false for synchronous request
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.setRequestHeader('X-Token', this.token);

      xhr.send(data);

      if (xhr.status !== 200) {
        throw new Error(`Failed to fetch (${xhr.status}): ${xhr.statusText}`);
      }

      const result = JSON.parse(xhr.responseText);

      if (isLogin) return result;
      return result.data;
    }

    login(async = false) {
      const url = `https://api.ecoledirecte.com/v3/login.awp`;
      const data = `data={"identifiant": "${this.user}", "motdepasse": "${this.password}", "isReLogin": false, "uuid": ""}`;

      if (this.extension || async) {
        return this._makeRequest(url, data, true, true).then((loginData) => {
          console.log(loginData);

          try {
            if (loginData.code === 200) {
              if (!this.id) this.id = loginData.data.accounts[0].id;
              this.token = loginData.token;
              return loginData.token;
            } else {
              console.error('Login failed:', loginData.message);
              return Promise.reject('Login failed');
            }
          } catch (error) {
            console.error('Error during login:', error);
            return Promise.reject('Error during login');
          }
        });
      } else {
        const loginData = this._makeRequest(url, data, false, true);
        console.log(loginData);

        try {
          if (loginData.code === 200) {
            if (!this.id) this.id = loginData.data.accounts[0].id;
            this.token = loginData.token;
            return loginData.token;
          } else {
            console.error('Login failed:', loginData.message);
            throw new Error('Login failed');
          }
        } catch (error) {
          console.error('Error during login:', error);
          throw new Error('Error during login');
        }
      }
    }

    getHomeworks(async = false) {
      const url = `https://api.ecoledirecte.com/v3/Eleves/${this.id}/cahierdetexte.awp?verbe=get`;
      const data = 'data={}';
      return this._makeRequest(url, data, async);
    }

    getAllMessages(type, orderBy = 'date', onlyRead = '0', async = false) {
      const url = `https://api.ecoledirecte.com/v3/${globalThis.accountType}/${this.id}/messages.awp?verbe=get&force=true&typeRecuperation=${type}&orderBy=${orderBy}&order=desc&onlyRead=${onlyRead}&getAll=1`;
      const data = 'data={}';

      const messages = this._makeRequest(url, data, async);
      return messages ? messages.messages[type] : null;
    }

    getArchivedMessages(orderBy = 'date', onlyRead = '0', async = false) {
      return this.getAllMessages('archived', orderBy, onlyRead, async);
    }

    getDraftedMessages(orderBy = 'date', onlyRead = '0', async = false) {
      return this.getAllMessages('draft', orderBy, onlyRead, async);
    }

    getReceivedMessages(orderBy = 'date', onlyRead = '0', async = false) {
      return this.getAllMessages('received', orderBy, onlyRead, async);
    }

    readMessage(messageId, async = false) {
      const url = `https://api.ecoledirecte.com/v3/${globalThis.accountType}/${this.id}/messages/${messageId}.awp?verbe=get&mode=destinataire`;
      const data = 'data={}';
      return this._makeRequest(url, data, async);
    }

    getAllGrades(async = false) {
      const url = `https://api.ecoledirecte.com/v3/Eleves/${this.id}/notes.awp?verbe=get`;
      const data = 'data={}';

      return this._makeRequest(url, data, async);
    }
  }

  exports({EcoleDirecte}).to('./vendor/ecoledirecte.js');
})();
