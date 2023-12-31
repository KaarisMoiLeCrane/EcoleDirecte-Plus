(() => {
  class EcoleDirecte {
    constructor(id, token) {
      this.id = id;
      this.token = token;
    }

    _makeRequest(url, data) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, false); // Third parameter is set to false for synchronous request
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.setRequestHeader('X-Token', this.token);

        xhr.send(data);

        if (xhr.status !== 200) {
          throw new Error(`Failed to fetch (${xhr.status}): ${xhr.statusText}`);
        }

        const result = JSON.parse(xhr.responseText);
        return result.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    getHomeworks() {
      const url = `https://api.ecoledirecte.com/v3/Eleves/${this.id}/cahierdetexte.awp?verbe=get`;
      const data = 'data={}';
      return this._makeRequest(url, data);
    }

    getAllMessages(type, orderBy = 'date', onlyRead = '0') {
      const url = `https://api.ecoledirecte.com/v3/${globalThis.accountType}/${this.id}/messages.awp?verbe=get&force=true&typeRecuperation=${type}&orderBy=${orderBy}&order=desc&onlyRead=${onlyRead}&getAll=1`;
      const data = 'data={}';

      const messages = this._makeRequest(url, data);
      return messages ? messages.messages[type] : null;
    }

    getArchivedMessages(orderBy = 'date', onlyRead = '0') {
      return this.getAllMessages('archived', orderBy, onlyRead);
    }

    getDraftedMessages(orderBy = 'date', onlyRead = '0') {
      return this.getAllMessages('draft', orderBy, onlyRead);
    }

    getReceivedMessages(orderBy = 'date', onlyRead = '0') {
      return this.getAllMessages('received', orderBy, onlyRead);
    }

    readMessage(messageId) {
      const url = `https://api.ecoledirecte.com/v3/${globalThis.accountType}/${this.id}/messages/${messageId}.awp?verbe=get&mode=destinataire`;
      const data = 'data={}';
      return this._makeRequest(url, data);
    }

    getAllGrades() {
      const url = `https://api.ecoledirecte.com/v3/Eleves/${this.id}/notes.awp?verbe=get`;
      const data = 'data={}';

      return this._makeRequest(url, data);
    }
  }

  exports({EcoleDirecte}).to('./vendor/ecoledirecte.js');
})();
