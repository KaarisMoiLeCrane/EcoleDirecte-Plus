(() => {
  function fragmentFromString(strHTML) {
    return document.createRange().createContextualFragment(strHTML).childNodes[0];
  }

  function numToDate(month) {
    month = parseInt(month);

    switch (month) {
      case 1:
        return {
          norm: 'Janvier',
          abrv: 'Jan'
        };
      case 2:
        return {
          norm: 'Février',
          abrv: 'Fév'
        };
      case 3:
        return {
          norm: 'Mars',
          abrv: 'Mar'
        };
      case 4:
        return {
          norm: 'Avril',
          abrv: 'Avr'
        };
      case 5:
        return {
          norm: 'Mai',
          abrv: 'Mai'
        };
      case 6:
        return {
          norm: 'Juin',
          abrv: 'Juin'
        };
      case 7:
        return {
          norm: 'Juillet',
          abrv: 'Juil'
        };
      case 8:
        return {
          norm: 'Août',
          abrv: 'Aoû'
        };
      case 9:
        return {
          norm: 'Septembre',
          abrv: 'Sep'
        };
      case 10:
        return {
          norm: 'Octobre',
          abrv: 'Oct'
        };
      case 11:
        return {
          norm: 'Novembre',
          abrv: 'Nov'
        };
      case 12:
        return {
          norm: 'Décembre',
          abrv: 'Déc'
        };
      default:
        console.error(
          'Enter a number between 1 and 12',
          '\n',
          'The value entered was : ',
          month
        );
        return undefined;
    }
  }

  function watchAnyObject(
    object = {},
    methods = [],
    callbackBefore = function () {},
    callbackAfter = function () {}
  ) {
    // May get removed
    for (let method of methods) {
      const original = object[method].bind(object);
      const newMethod = function (...args) {
        callbackBefore(method, ...args);
        const result = original.apply(null, args);
        callbackAfter(method, ...args);
        return result;
      };
      object[method] = newMethod.bind(object);
    }
  }

  function initPopup(popupID, blurID) {
    let blur = document.createElement('DIV');
    blur.className = 'kmlc-blur';
    blur.id = blurID;

    let popup = document.createElement('DIV');
    popup.className = 'kmlc-popup';
    popup.id = popupID;

    document.body.appendChild(popup);
    document.body.appendChild(blur);

    popup = document.querySelector('#' + popupID);
    blur = document.querySelector('#' + blurID);

    return [popup, blur];
  }

  async function setData(key, value) {
    return new Promise((resolve, reject) => {
      const data = {};
      data[key] = value;
      browser.storage.sync.set(data, function () {
        if (browser.runtime.lastError) {
          reject(browser.runtime.lastError);
        } else {
          // console.log(key, value)
          resolve();
        }
      });
    });
  }

  async function getData(key) {
    return new Promise((resolve, reject) => {
      const data = {};
      data[key] = [];
      browser.storage.sync.get(data, function (items) {
        if (browser.runtime.lastError) {
          reject(browser.runtime.lastError);
        } else {
          // console.log(items[key])
          resolve(items[key]);
        }
      });
    });
  }

  function getNewYear() {
    let newYear = true;
    let todayMs = Date.now();

    let dateDebutArr = [];
    let dateFinArr = [];

    const dataPeriodes = imports('dataPeriodes').from('./features/notes.js');

    for (let i = 0; i < dataPeriodes.length; i++) {
      dateDebutArr.push(dataPeriodes[i].dateDebut.kmlcConvertToTimestamp());
      dateFinArr.push(dataPeriodes[i].dateFin.kmlcConvertToTimestamp());
    }

    dateDebutArr.sort(function (a, b) {
      return a - b;
    });
    dateFinArr.sort(function (a, b) {
      return b - a;
    });

    if (dateDebutArr[0] <= todayMs <= dateFinArr[0]) newYear = false;

    if (todayMs < dateDebutArr[0]) newYear = false;

    if (todayMs > dateFinArr[0]) newYear = true;

    return newYear;
  }

  async function initUserSimulationNote(id) {
    let simulationNote = await getData('simulationNote');
    let dummy = [...simulationNote];
    let newYear = getNewYear();

    const dataPeriodes = imports('dataPeriodes').from('./features/notes.js');

    // console.log(dummy)

    let userContent = simulationNote.find((item) => {
      if (item) if (item.id) return item.id == id;
    });

    if (userContent) {
      if (!userContent.periodes) userContent.periodes = [];

      if (!userContent.periodes.length) userContent.periodes = [];
    } else {
      if (dummy[0]) if (!dummy[0].id) dummy = [];

      dummy.push({id: id, periodes: []});
      userContent = dummy[dummy.length - 1];
    }

    // console.log(userContent)
    let index = dummy.indexOf(userContent);

    if (newYear) {
      userContent.periodes = [];

      for (let i = 0; i < dataPeriodes.length; i++) {
        let isR = dataPeriodes[i].codePeriode.includes('R') ? true : false;

        userContent.periodes.push({
          dateDebut: dataPeriodes[i].dateDebut.kmlcConvertToTimestamp(),
          dateFin: dataPeriodes[i].dateFin.kmlcConvertToTimestamp(),
          relevee: isR,
          notes: {
            ajouter: {
              /*
							"MATHEMATIQUES": {
								"titre": "Devoir 1",
								"note": 10,
								"coeff": 2,
								"quotient": 20.0,
								"id": Date.now()
							},
							"HISTOIRE-GEOGRAPHIE": {
								"titre": "Devoir 2",
								"note": 20,
								"coeff": 0.5,
								"quotient": 20.0,
								"id": Date.now()
							}
							*/
            },
            modifier: {
              /*
							"MATHEMATIQUES": {
								"titre": "Devoir 1",
								"note": 10,
								"coeff": 2,
								"quotient": 20.0,
								"id": notes.ajouter["MATHEMATIQUES"][i].id || Date.now(),
								"position": 0
							},
							"HISTOIRE-GEOGRAPHIE": {
								"titre": "Devoir 2",
								"note": 20,
								"coeff": 0.5,
								"quotient": 20.0,
								"id": notes.ajouter["HISTOIRE-GEOGRAPHIE"][i].id || Date.now(),
								"position": 5
							}
							*/
            }
          }
        });
      }
    } else {
      if (userContent.periodes.length > dataPeriodes.length) {
        userContent.periodes.splice(
          dataPeriodes.length,
          userContent.periodes.length - dataPeriodes.length
        );
      }

      if (userContent.periodes.length < dataPeriodes.length) {
        for (let i = userContent.periodes.length; i < dataPeriodes.length; i++) {
          let isR = dataPeriodes[i].codePeriode.includes('R') ? true : false;

          userContent.periodes.push({
            dateDebut: dataPeriodes[i].dateDebut.kmlcConvertToTimestamp(),
            dateFin: dataPeriodes[i].dateFin.kmlcConvertToTimestamp(),
            relevee: isR,
            notes: {
              ajouter: {
                /*
								"MATHEMATIQUES": {
									"titre": "Devoir 1",
									"note": 10,
									"coeff": 2,
									"quotient": 20.0,
									"id": Date.now()
								},
								"HISTOIRE-GEOGRAPHIE": {
									"titre": "Devoir 2",
									"note": 20,
									"coeff": 0.5,
									"quotient": 20.0,
									"id": Date.now()
								}
								*/
              },
              modifier: {
                /*
								"MATHEMATIQUES": {
									"titre": "Devoir 1",
									"note": 10,
									"coeff": 2,
									"quotient": 20.0,
									"id": notes.ajouter["MATHEMATIQUES"][i].id || Date.now(),
									"position": 0
								},
								"HISTOIRE-GEOGRAPHIE": {
									"titre": "Devoir 2",
									"note": 20,
									"coeff": 0.5,
									"quotient": 20.0,
									"id": notes.ajouter["HISTOIRE-GEOGRAPHIE"][i].id || Date.now(),
									"position": 5
								}
								*/
              }
            }
          });
        }
      }

      for (let i = 0; i < dataPeriodes.length; i++) {
        let isR = dataPeriodes[i].codePeriode.includes('R') ? true : false;

        userContent.periodes[i].dateDebut =
          dataPeriodes[i].dateDebut.kmlcConvertToTimestamp();
        userContent.periodes[i].dateFin =
          dataPeriodes[i].dateFin.kmlcConvertToTimestamp();
        userContent.periodes[i].relevee = isR;

        if (userContent.periodes[i].notes) {
          if (!userContent.periodes[i].notes.ajouter) {
            let dummyNotes = {...userContent.periodes[i].notes};

            userContent.periodes[i].notes = {};
            userContent.periodes[i].notes.ajouter = dummyNotes;
          }
        } else {
          userContent.periodes[i].notes = {
            ajouter: {
              /*
							"MATHEMATIQUES": {
								"titre": "Devoir 1",
								"note": 10,
								"coeff": 2,
								"quotient": 20.0,
								"id": Date.now()
							},
							"HISTOIRE-GEOGRAPHIE": {
								"titre": "Devoir 2",
								"note": 20,
								"coeff": 0.5,
								"quotient": 20.0,
								"id": Date.now()
							}
							*/
            },
            modifier: {
              /*
							"MATHEMATIQUES": {
								"titre": "Devoir 1",
								"note": 10,
								"coeff": 2,
								"quotient": 20.0,
								"id": notes.ajouter["MATHEMATIQUES"][i].id || Date.now(),
								"position": 0
							},
							"HISTOIRE-GEOGRAPHIE": {
								"titre": "Devoir 2",
								"note": 20,
								"coeff": 0.5,
								"quotient": 20.0,
								"id": notes.ajouter["HISTOIRE-GEOGRAPHIE"][i].id || Date.now(),
								"position": 5
							}
							*/
            }
          };
        }

        if (!userContent.periodes[i].notes.modifier)
          userContent.periodes[i].notes.modifier = {};
      }
    }

    simulationNote[index] = userContent;

    await setData('simulationNote', simulationNote);
  }

  async function initUserObjectif(id) {
    let objectifMoyenne = await getData('objectifMoyenne');
    let dummy = [...objectifMoyenne];
    let isOldObjectif = false;
    let newYear = getNewYear();

    const dataPeriodes = imports('dataPeriodes').from('./features/notes.js');

    // console.log(dummy)

    let userContent = objectifMoyenne.find((item) => {
      if (item) if (item.id) return item.id == id;
    });

    if (userContent) {
      if (!userContent.periodes) userContent.periodes = [];

      if (!userContent.periodes.length) userContent.periodes = [];
    } else {
      if (dummy[0])
        if (!dummy[0].id) {
          dummy = [];
          isOldObjectif = true;
        }

      dummy.push({id: id, periodes: []});
      userContent = dummy[dummy.length - 1];
    }

    // console.log(userContent)
    let index = dummy.indexOf(userContent);

    if (isOldObjectif) {
      for (let i = 0; i < dataPeriodes.length; i++) {
        // console.log(i)
        let isR = dataPeriodes[i].codePeriode.includes('R') ? true : false;
        let objectifData = {
          /*
					"MATHEMATIQUES": {
						"note": 10,
						"id": Date.now()
					},
					"HISTOIRE-GEOGRAPHIE": {
						"note": 20,
						"id": Date.now()
					}
					*/
        };

        for (let j = 0; j < objectifMoyenne[id].length; j++) {
          objectifData[objectifMoyenne[id][j][0]] = {};
          objectifData[objectifMoyenne[id][j][0]].note =
            objectifData[objectifMoyenne[id][j][1]];
          objectifData[objectifMoyenne[id][j][0]].id = Date.now();
        }

        userContent.periodes.push({
          dateDebut: dataPeriodes[i].dateDebut.kmlcConvertToTimestamp(),
          dateFin: dataPeriodes[i].dateFin.kmlcConvertToTimestamp(),
          relevee: isR,
          objectif: objectifData
        });
      }
    } else {
      if (userContent.periodes.length < dataPeriodes.length) {
        for (let i = userContent.periodes.length; i < dataPeriodes.length; i++) {
          let isR = dataPeriodes[i].codePeriode.includes('R') ? true : false;

          userContent.periodes.push({
            dateDebut: dataPeriodes[i].dateDebut.kmlcConvertToTimestamp(),
            dateFin: dataPeriodes[i].dateFin.kmlcConvertToTimestamp(),
            relevee: isR,
            objectif: {
              /*
							"MATHEMATIQUES": {
								"note": 10,
								"id": Date.now()
							},
							"HISTOIRE-GEOGRAPHIE": {
								"note": 20,
								"id": Date.now()
							}
							*/
            }
          });
        }
      }

      for (let i = 0; i < dataPeriodes.length; i++) {
        let isR = dataPeriodes[i].codePeriode.includes('R') ? true : false;

        userContent.periodes[i].dateDebut =
          dataPeriodes[i].dateDebut.kmlcConvertToTimestamp();
        userContent.periodes[i].dateFin =
          dataPeriodes[i].dateFin.kmlcConvertToTimestamp();
        userContent.periodes[i].relevee = isR;

        if (!userContent.periodes[i].objectif) {
          userContent.periodes[i].objectif = {
            /*
						"MATHEMATIQUES": {
							"note": 10,
							"id": Date.now()
						},
						"HISTOIRE-GEOGRAPHIE": {
							"note": 20,
							"id": Date.now()
						}
						*/
          };
        }
      }
    }

    objectifMoyenne[index] = userContent;

    await setData('objectifMoyenne', objectifMoyenne);
  }

  function getToken() {
    if (window.sessionStorage.credentials)
      return JSON.parse(window.sessionStorage.credentials).payload.authToken
        ? JSON.parse(window.sessionStorage.credentials).payload.authToken
        : NaN;

    return NaN;
  }

  function getAccountType() {
    if (window.sessionStorage.accounts)
      return JSON.parse(window.sessionStorage.accounts).payload.accounts[0].typeCompte ==
        "'E'"
        ? 'eleves'
        : 'familles';

    return NaN;
  }

  function getUserId() {
    return window.location.pathname.split('/')[2];
  }

  exports({
    fragmentFromString,
    numToDate,
    watchAnyObject,
    initPopup,
    setData,
    getData,
    getNewYear,
    initUserSimulationNote,
    initUserObjectif,
    getToken,
    getAccountType,
    getUserId
  }).to('./utils/utils.js');
})();
