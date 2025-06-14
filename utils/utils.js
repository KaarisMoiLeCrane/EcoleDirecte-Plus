(() => {
  /**
   * Create a document fragment from an HTML string.
   * @param {string} strHTML - The HTML string to convert.
   * @returns {Node} The first child node of the created fragment.
   */
  function fragmentFromString(strHTML) {
    const fragment = document.createRange().createContextualFragment(strHTML).childNodes[0];
    if (debug) console.log('[DEBUG]', 'fragmentFromString executed', {strHTML, fragment});
    return fragment;
  }

  /**
   * Convert a month number to its corresponding French name.
   * @param {number|string} month - The month number (1-12).
   * @returns {Object} An object containing the full and abbreviated month names.
   */
  function numToDate(month) {
    month = parseInt(month, 10);
    const months = {
      1: {norm: 'Janvier', abrv: 'Jan'},
      2: {norm: 'Février', abrv: 'Fév'},
      3: {norm: 'Mars', abrv: 'Mar'},
      4: {norm: 'Avril', abrv: 'Avr'},
      5: {norm: 'Mai', abrv: 'Mai'},
      6: {norm: 'Juin', abrv: 'Juin'},
      7: {norm: 'Juillet', abrv: 'Juil'},
      8: {norm: 'Août', abrv: 'Aoû'},
      9: {norm: 'Septembre', abrv: 'Sep'},
      10: {norm: 'Octobre', abrv: 'Oct'},
      11: {norm: 'Novembre', abrv: 'Nov'},
      12: {norm: 'Décembre', abrv: 'Déc'}
    };

    const result = months[month];
    if (!result) {
      // console.error('Invalid month number', {month});
      return undefined;
    }

    if (debug) console.log('[DEBUG]', 'numToDate executed', {month, result});
    return result;
  }

  /**
   * Initialize a popup with blur effect.
   * @param {string} popupID - The ID of the popup element.
   * @param {string} blurID - The ID of the blur element.
   * @returns {Array<HTMLElement>} An array containing the popup and blur elements.
   */
  function initPopup(popupID, blurID) {
    const blur = document.createElement('DIV');
    blur.className = 'kmlc-blur';
    blur.id = blurID;

    const popup = document.createElement('DIV');
    popup.className = 'kmlc-popup';
    popup.id = popupID;

    document.body.appendChild(popup);
    document.body.appendChild(blur);

    const popupElement = document.querySelector(`#${popupID}`);
    const blurElement = document.querySelector(`#${blurID}`);

    if (debug)
      console.log('[DEBUG]', 'initPopup executed', {
        popupID,
        blurID,
        popupElement,
        blurElement
      });
    return [popupElement, blurElement];
  }

  /**
   * Set data in browser storage.
   * @param {string} key - The storage key.
   * @param {*} value - The value to store.
   * @returns {Promise<void>} A promise that resolves when the data is set.
   */
  async function setData(key, value) {
    return new Promise((resolve, reject) => {
      const data = {[key]: value};
      browser.storage.sync.set(data, function () {
        if (browser.runtime.lastError) {
          reject(browser.runtime.lastError);
        } else {
          if (debug) console.log('[DEBUG]', 'setData executed', {key, value});
          resolve();
        }
      });
    });
  }

  /**
   * Get data from browser storage.
   * @param {string} key - The storage key.
   * @returns {Promise<*>} A promise that resolves with the retrieved data.
   */
  async function getData(key) {
    return new Promise((resolve, reject) => {
      const data = {};
      data[key] = [];
      browser.storage.sync.get(data, function (items) {
        if (browser.runtime.lastError) {
          reject(browser.runtime.lastError);
        } else {
          if (debug) console.log('[DEBUG]', 'getData executed', {key, data, items});
          resolve(items[key]);
        }
      });
    });
  }

  /**
   * Determine if it's a new year based on the current date and period data.
   * @returns {boolean} True if it's a new year, otherwise false.
   */
  function getNewYear() {
    const todayMs = Date.now();

    const dataPeriodes = imports('dataPeriodes').from('./src/notes.js');
    const dateDebutArr = dataPeriodes
      .map((p) => p.dateDebut.kmlcConvertToTimestamp())
      .sort((a, b) => a - b);
    const dateFinArr = dataPeriodes
      .map((p) => p.dateFin.kmlcConvertToTimestamp())
      .sort((a, b) => b - a);

    let newYear =
      todayMs > dateFinArr[0] ||
      todayMs < dateDebutArr[0] ||
      !(dateDebutArr[0] <= todayMs && todayMs <= dateFinArr[0]);

    if (debug)
      console.log('[DEBUG]', 'getNewYear executed', {
        todayMs,
        dateDebutArr,
        dateFinArr,
        newYear
      });
    return newYear;
  }

  /**
   * Initialize user simulation note data.
   * @param {string} id - The user ID.
   */
  async function initUserGradeSimulation(id) {
    let gradeSimulation = await getData('gradeSimulation');
    let dummy = [...gradeSimulation];
    const newYear = getNewYear();
    const dataPeriodes = imports('dataPeriodes').from('./src/notes.js');

    let userContent = dummy.find((item) => item?.id == id) || {id, periodes: []};

    if (!userContent.periodes.length || newYear) {
      userContent.periodes = dataPeriodes.map((p) => ({
        dateDebut: p.dateDebut.kmlcConvertToTimestamp(),
        dateFin: p.dateFin.kmlcConvertToTimestamp(),
        relevee: p.codePeriode.includes('R'),
        notes: {ajouter: {}, modifier: {}}
      }));
    } else {
      userContent.periodes = userContent.periodes.slice(0, dataPeriodes.length);
      dataPeriodes.forEach((p, i) => {
        const isR = p.codePeriode.includes('R');
        const period = userContent.periodes[i] || {notes: {ajouter: {}, modifier: {}}};
        period.dateDebut = p.dateDebut.kmlcConvertToTimestamp();
        period.dateFin = p.dateFin.kmlcConvertToTimestamp();
        period.relevee = isR;
        userContent.periodes[i] = period;
      });
    }

    const index = dummy.findIndex((item) => item?.id == id);
    if (index === -1) {
      dummy.push(userContent);
    } else {
      dummy[index] = userContent;
    }

    await setData('gradeSimulation', dummy);
    if (debug) console.log('[DEBUG]', 'initUserGradeSimulation executed', {id, userContent});
  }

  /**
   * Initialize user objective data.
   * @param {string} id - The user ID.
   */
  async function initUserObjectif(id) {
    let objectifMoyenne = await getData('objectifMoyenne');
    let dummy = [...objectifMoyenne];
    const newYear = getNewYear();
    const dataPeriodes = imports('dataPeriodes').from('./src/notes.js');

    let userContent = dummy.find((item) => item?.id == id) || {id, periodes: []};

    if (newYear) {
      userContent.periodes = dataPeriodes.map((p) => ({
        dateDebut: p.dateDebut.kmlcConvertToTimestamp(),
        dateFin: p.dateFin.kmlcConvertToTimestamp(),
        relevee: p.codePeriode.includes('R'),
        objectif: {}
      }));
    } else {
      userContent.periodes = userContent.periodes.slice(0, dataPeriodes.length);
      dataPeriodes.forEach((p, i) => {
        const isR = p.codePeriode.includes('R');
        const period = userContent.periodes[i] || {objectif: {}};
        period.dateDebut = p.dateDebut.kmlcConvertToTimestamp();
        period.dateFin = p.dateFin.kmlcConvertToTimestamp();
        period.relevee = isR;
        userContent.periodes[i] = period;
      });
    }

    const index = dummy.findIndex((item) => item?.id == id);
    if (index === -1) {
      dummy.push(userContent);
    } else {
      dummy[index] = userContent;
    }

    await setData('objectifMoyenne', dummy);
    if (debug) console.log('[DEBUG]', 'initUserObjectif executed', {id, userContent});
  }

  /**
   * Get the token of the account.
   * @returns {number|string} The token.
   */
  function getToken() {
    let json;
    if (window.sessionStorage.credentials) {
      try {
        json = JSON.parse(window.sessionStorage.credentials).payload.authToken;
      } catch (e) {
        json = NaN;
      }
    }

    return json ? json : NaN;
  }

  /**
   * Get the logged account type.
   * @param {number|string} id - The user ID.
   * @returns {number|string} The account type.
   */
  function getAccountType(id) {
    if (window.sessionStorage.accounts) {
      const accountSessionData = JSON.parse(window.sessionStorage.accounts).payload.accounts[0];

      if (accountSessionData.id != parseInt(id)) {
        return 'eleves';
      } else {
        return accountSessionData.typeCompte == "'E'" ? 'eleves' : 'familles';
      }
    }

    return NaN;
  }

  /**
   * Get the actual user ID.
   * @returns {string} The user ID.
   */
  function getUserId() {
    return window.location.pathname.split('/')[2];
  }

  exports({
    fragmentFromString,
    numToDate,
    initPopup,
    setData,
    getData,
    getNewYear,
    initUserGradeSimulation,
    initUserObjectif,
    getToken,
    getAccountType,
    getUserId
  }).to('./utils/utils.js');
})();
