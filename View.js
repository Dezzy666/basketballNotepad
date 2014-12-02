﻿//-----------------------------------------------------------------------
// <copyright file="View.js" company="Perfect Long Bow s.r.o." autor="Jan Herzan">
//     Copyright Perfect Long Bow s.r.o.
// </copyright>
//-----------------------------------------------------------------------

/**
* View object constructor
*
* @method View
* @author Jan Herzan
*/
function View(element, prefix) {
    this.parentElement = element;
    this.prefix = prefix;
    this.workPlace = undefined;
    this.mainMenu = undefined;
    this.siteMenu = undefined;

    this.actualShowedPlayer = undefined;
    this.svnBoardWidth = 500;
    this.svnBoardHeight = 470;

    this._insertMainMenu();
    this._insertSiteMenu();

    this.viewEvents = new EventSlots();
    this.playgroundEvents = undefined;

    this.turnOfTheBoard = 0;

    $(window).on('beforeunload', function () {
        return 'Opravdu chcete opustit stránku? Veškerá data budou ztracena.';
    });

    this._insertButtonIntoMainMenu("Střídání", "changingStarts",
        "changingButtonPressed",
        "mainMenuButtonChanging");

    this._hideButton("changingStarts");

    this._insertButtonIntoMainMenu("Konec utkání", "endOfGame",
        "endgameButtonPressed",
        "mainMenuButtonNormal");

    this._hideButton("endOfGame");

    this._insertWorkPlace();

    this.insertDialog();

    this.createInitialLoadDataScreen();
}

/**
* Creates ending screen
*
* @method createEndingScreen
* @author Jan Herzan
*/
View.prototype.createEndingScreen = function () {
    this.createEndSendDataOnWebWindow();
    this.createEndSaveDataInFielWindow();
};

/**
* Creates ending dialog for save data on web
*
* @method createEndSendDataOnWebWindow
* @author Jan Herzan
*/
View.prototype.createEndSendDataOnWebWindow = function () {
    this.workPlace.append('<div class="loadScreenLoadData loadScreenLoadDataDimension loadScreanFromWeb" id="' + this.prefix + 'loadDataFromWeb' + '"></div>');
    var div = $('#' + this.prefix + 'loadDataFromWeb');

    if (navigator.onLine) {
        div.append('<br>Přihlásit se ke svému účtu na webu.' +
            '<form><input type="text"placeholder="Login"><input type="password" placeholder="Heslo"></form>' +
            '<div class="loadScreenButton loadScreenButtonDimension">Přihlásit</div>');
    } else {
        div.append('Aktuálně nejste online<BR> Nelze nahrát data.');
    }
};

/**
* Creates ending dialog for save data in file
*
* @method createEndSaveDataInFileWindow
* @author Jan Herzan
*/
View.prototype.createEndSaveDataInFielWindow = function () {
    this.workPlace.append('<div class="loadScreenLoadData loadScreenLoadDataDimension saveDataInFile" id="' + this.prefix + 'loadDataFromWeb' + '">' +
        'Stáhnout výsledek utkání v souboru.' +
        '<div class="loadScreenButton loadScreenButtonDimension" id="' + this.prefix + 'SaveDataInFileButton">Stáhnout soubor</div>' +
        '</div>');

    $('#' + this.prefix + 'SaveDataInFileButton').on('click', (function (e) {
        this.viewEvents.fireEvent("exportDataDemand", {});
    }).bind(this));
};

/**
* Creates initial loading data screen
*
* @method createInitialLoadDataScreen
* @author Jan Herzan
*/
View.prototype.createInitialLoadDataScreen = function () {
    this.clearWorkPlace();
    this.loadDataFromWebWindow();
    this.loadDataFromFileWindow();
    this.noLoadDataWindow();
};

/**
* Creates window for loading data from web
*
* @method loadDataFromWebWindow
* @author Jan Herzan
*/
View.prototype.loadDataFromWebWindow = function () {
    this.workPlace.append('<div class="loadScreenLoadData loadScreenLoadDataDimension loadScreanFromWeb" id="' + this.prefix + 'loadDataFromWeb' + '"></div>');
    var div = $('#' + this.prefix + 'loadDataFromWeb');


    if (navigator.onLine) {
        div.append('<br>Přihlásit se ke svému účtu na webu.' +
            '<form><input type="text"placeholder="Login"><input type="password" placeholder="Heslo"></form>' +
            '<div class="loadScreenButton loadScreenButtonDimension">Přihlásit</div>');
    } else {
        div.append('Aktuálně nejste online<BR> Nelze stáhnout data');
    }
};

/**
* Creates window for loading data from file
*
* @method View
* @author Jan Herzan
*/
View.prototype.loadDataFromFileWindow = function () {
    this.workPlace.append('<div class="loadScreenLoadData loadScreenLoadDataDimension loadScreanFromFile" id="' + this.prefix + 'loadDataFromFile' + '"><br>Nahrát data hráčů ze souboru na lokálním disku.<BR>' +
        '<form id="' + this.prefix + 'loadFromFile"><input type="file" id="' + this.prefix + 'loadFromFilePath"></form>' +
        '<div class="loadScreenButton loadScreenButtonDimension" id="' + this.prefix + 'LoadDataFromFileButton">Nahrát soubor</div></div>');

    $('#' + this.prefix + 'loadFromFilePath').on('change', (function (e) {
        var reader = new FileReader();
        reader.onloadend = (function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
                $('#' + this.prefix + 'LoadDataFromFileButton').css({ backgroundColor: "#660066" });
                this.tempData = evt.target.result;
            }
        }).bind(this);

        reader.onerror = (function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
                $('#' + this.prefix + 'LoadDataFromFileButton').css({ backgroundColor: "red" });
                $('#' + this.prefix + 'LoadDataFromFileButton').html("Soubor nelze nahrát");
            }
        }).bind(this);

        reader.readAsText(e.target.files[0]);

    }).bind(this));

    $('#' + this.prefix + 'LoadDataFromFileButton').on('click', (function (e) {
        if (this.tempData !== undefined) {
            if (this.viewEvents.fireEvent("loadDataFromJSON", { fileData: this.tempData })) {
                alert("Data se nepodařilo načíst");
                return;
            }
            this.viewEvents.fireEvent("loadMainProgram", {});
        }
    }).bind(this));
};

/**
* Creates window for no data loading.
*
* @method View
* @author Jan Herzan
*/
View.prototype.noLoadDataWindow = function () {
    this.workPlace.append('<div class="loadScreenLoadData loadScreenLoadDataDimension loadScreanNoData" id="' + this.prefix + 'noLoadData' + '">Nemám data týmu.<br> Přeji si zaznamenávat hru pouze s čísly hráčů a jména přiřadím až zpětně.' +
        '<div class="loadScreenButton loadScreenButtonDimension" id="' + this.prefix + 'noDataLoad">Hrát pouze s čísly</div></div>');

    $('#' + this.prefix + 'noDataLoad').on('click', (function (e) {
        this.viewEvents.fireEvent("loadEmptyNumbers", {});
    }).bind(this));
};

/**
* Initialize application after data was loaded.
*
* @method initializeAfterDataLoaded
* @author Jan Herzan
*/
View.prototype.initializeAfterDataLoaded = function (playersList) {
    this.showPlayersList(playersList);
    this._showButton("endOfGame");
    this._showButton("changingStarts");
};

/**
* Clears the main work place
*
* @method clearWorkPlace
* @author Jan Herzán
*/
View.prototype.clearWorkPlace = function () {
    this.workPlace.empty();

    this.actualShowedPlayer = undefined;

    this.workPlace.removeClass('isDropable');
    this.workPlace.removeClass('dropableUnlimited');
    this.workPlace.attr("draggable", "false");

    this.siteMenu.removeClass('isDropable');
    this.siteMenu.attr("draggable", "false");

    this.workPlace.off();
    this.siteMenu.off();
};

/**
* Show players list
*
* @method sthowPlayersList
* @author Jan Herzan
*/
View.prototype.showPlayersList = function (playerList) {
    this.clearWorkPlace();

    this.workPlace.addClass('isDropable');
    this.workPlace.addClass('dropableUnlimited');
    this.workPlace.attr("draggable", "true");

    this.siteMenu.addClass('isDropable');
    this.siteMenu.attr("draggable", "true");

    document.querySelector("#" + this.workPlace.attr("id")).addEventListener('drop', this._dropHandlerWorkPlace.bind(this));
    document.querySelector("#" + this.workPlace.attr("id")).addEventListener('dragover', this._dragOverHandlerWorkPlace.bind(this));
    document.querySelector("#" + this.siteMenu.attr("id")).addEventListener('drop', this._dropHandlerSiteMenu.bind(this));
    document.querySelector("#" + this.siteMenu.attr("id")).addEventListener('dragover', this._dragOverHandlerSiteMenu.bind(this));


    for (var i = 0; i < playerList.length; i++) {
        if ($('#' + this.prefix + 'player' + playerList[i].playerNumber).length !== 0) {
            continue;
        }

        this.workPlace.append('<div id="' + this.prefix + 'player' + playerList[i].playerNumber + '" class="playerButton playerButtonDimension playerListButton siteMenuButtonUnselected" draggable="true">' +
            '<div class="playerNick">' + playerList[i].nick + '</div>' +
            playerList[i].playerNumber +
            '</div>');
        var actualNumber = $('#' + this.prefix + 'player' + playerList[i].playerNumber);
        actualNumber.data('prefix', this.prefix);
        actualNumber.data('playerNumber', playerList[i].playerNumber);

        document.querySelector("#" + actualNumber.attr("id")).addEventListener('dragstart', this.dragStartFunction.bind(this), false);

        actualNumber.on('contextmenu', this.contextMenuFunction.bind(this));

        document.querySelector("#" + actualNumber.attr("id")).addEventListener('dragend', this.dragEndFunction.bind(this), false);

        actualNumber.on('click', (function (s) {
            var playerNumber = $('#' + s.currentTarget.id).data('playerNumber');
            this.viewEvents.fireEvent("numberClicked", { playerNumber: playerNumber });
        }).bind(this));
    }
};

/**
* Drag start function
*
* @method dragStartFunction
* @author Jan Herzan
* @param {Object} dragStart function param
*/
View.prototype.dragStartFunction = function (e) {
    e.dataTransfer.setData('text', e.target.id);
};

/**
* Context menu function
*
* @method contextMenuFunction
* @author Jan Herzan
* @param {Object} Context menu function param
*/
View.prototype.contextMenuFunction = function (e) {
    var currentElement = $('#' + e.currentTarget.id);
    e.preventDefault();

    if ($('#' + e.currentTarget.id).parent()[0].id === this.prefix + 'workPlace') {
        if ($('#' + this.prefix + 'siteMenu').children().size() < 5) {
            $('#' + this.prefix + 'siteMenu').append(currentElement);
            this.changeButtonClassesAsShadeFromDeck(currentElement);
            this.changeButtonClassesToNormalButton();
        }
    } else if ($('#' + e.currentTarget.id).parent()[0].id === this.prefix + 'siteMenu') {
        if (this.workPlace.hasClass('isDropable')) {
            $('#' + this.prefix + 'workPlace').append(currentElement);
            this.changeButtonClassesAsShadeFromBoard(currentElement);
            this.changeButtonClassesToNormalButton();
        }
    }
};

/**
* Drag end function
*
* @method dragEndFunction
* @author Jan Herzan
* @param {Object} DragEnd params
*/
View.prototype.dragEndFunction = function (e) {
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    var child = $('#' + data);
    this.changeButtonClassesToNormalButton();
};

/**
* This method changes styles for button from shadow to normal. This progress is after timeout
*
* @method changeButtonClassesToNormalButton
* @author Jan Herzan
* @param {Object} Button
*/
View.prototype.changeButtonClassesToNormalButton = function () {
    setTimeout((function () {
        var i, but;

        for (i = 0; i <= 26; i++) {
            but = $('#' + this.prefix + 'player' + i);
            if (but !== undefined) {
                but.removeClass("siteMenuButtonBlank");
                but.addClass("siteMenuButtonUnselected");
            }
        }
    }).bind(this), 0);
};

/**
* This method changes stelys for button from normal to shadow when it is moved from deck
*
* @method changeButtonClassesAsShadeFromDeck
* @author Jan Herzan
* @param {Object} Button
*/
View.prototype.changeButtonClassesAsShadeFromDeck = function (button) {
    button.removeClass("playerListButton");
    button.addClass("siteMenuButton");
    button.addClass("siteMenuButtonBlank");
};

/**
* This method changes styles for button from normal to shadow when it is moved from board
*
* @method changeButtonClassesAsShadeFromBoard
* @author Jan Herzan
* @param {Object} Button
*/
View.prototype.changeButtonClassesAsShadeFromBoard = function (button) {
    button.removeClass("siteMenuButton");
    button.addClass("playerListButton");
    button.addClass("siteMenuButtonBlank");
};

/**
* Hides button
*
* @method _hideButton
* @author Jan Herzan
* @param {String} Id of the button
*/
View.prototype._hideButton = function (idOfTheButton) {
    $('#' + this.prefix + idOfTheButton).css({ "display": "none" });
};

/**
* Shows button
*
* @method _showButton
* @author Jan Herzan
* @param {String} Id of the button
*/
View.prototype._showButton = function (idOfTheButton) {
    $('#' + this.prefix + idOfTheButton).css({ "display": "block" });
};

/**
* Insert div of workplace
*
* @method _insertWorkPlace
* @author Jan Herzán
*/
View.prototype._insertWorkPlace = function () {
    this.parentElement.append('<div id="' + this.prefix + 'workPlace" class="workPlace workPlaceDimension"></div>');
    this.workPlace = $('#' + this.prefix + 'workPlace');
};

/**
* Shows data for player
*
* @method showDataForPlayer
* @author Jan Herzán
* @param {Integer} player number
*/
View.prototype.showDataForPlayer = function (actualShowedPlayer) {
    this.clearWorkPlace();
    this.actualShowedPlayer = actualShowedPlayer;
    var playerNumber = this.actualShowedPlayer.playerNumber;

    this.workPlace.append('<div id="' + this.prefix + 'basicIncrementalButtons' + '" class="basicIncrementalButtons"></div>');
    var placeForIncrementalButtons = $('#' + this.prefix + 'basicIncrementalButtons');

    placeForIncrementalButtons.append('<div class="faulPlus dataPlayerHeadline">Faul +</div>');
    placeForIncrementalButtons.append('<div class="faulMinus dataPlayerHeadline">Faul -</div>');

    this.createIncrementalButton('faulPlusIB', playerNumber, placeForIncrementalButtons, "faulPlus");
    this.createIncrementalFaulButton('faulMinusIB', playerNumber, placeForIncrementalButtons, "faulMinus");

    placeForIncrementalButtons.append('<div class="reboundD dataPlayerHeadline">Doskok obranný</div>');
    placeForIncrementalButtons.append('<div class="reboundO dataPlayerHeadline">Doskok útočný</div>');

    this.createIncrementalButton('reboundDIB', playerNumber, placeForIncrementalButtons, "reboundD");
    this.createIncrementalButton('reboundOIB', playerNumber, placeForIncrementalButtons, "reboundO");

    placeForIncrementalButtons.append('<div class="gain dataPlayerHeadline">Zisk</div>');
    placeForIncrementalButtons.append('<div class="loss dataPlayerHeadline">Ztráta</div>');

    this.createIncrementalButton('gainIB', playerNumber, placeForIncrementalButtons, "gain");
    this.createIncrementalButton('lossIB', playerNumber, placeForIncrementalButtons, "loss");

    placeForIncrementalButtons.append('<div class="penaltyShots dataPlayerHeadline">Trestné<br>střílení</div>');
    placeForIncrementalButtons.append('<div class="penaltyShotsSucc dataPlayerHeadline">Trestné střílení úspěšné</div>');

    this.createNonIncrementalButton('penaltyShotsIB', playerNumber, placeForIncrementalButtons, this.createPenaltyShotDialog, "penaltsGetted");
    this.createNonIncrementalButton('penaltyShotsSuccIB', playerNumber, placeForIncrementalButtons, this.createPenaltyShotDialog, "penaltsScored");

    this.workPlace.append('<div class="name" id="' + this.prefix + 'nameOfPlayer">' + this.actualShowedPlayer.playerNumber + ' |  ' + this.actualShowedPlayer.name + '</div>');
    this.setPlayerNameBoxClass();

    this.workPlace.append('<div id="' + this.prefix + 'playground' + playerNumber + '" class="playground"></div>');

    this.insertPlayground($('#' + this.prefix + 'playground' + playerNumber));

    this.workPlace.append('<div id="' + this.prefix + 'shotsIncrementalButtons' + playerNumber + '" class="shotsIncrementalButtons"></div>');

    var placeForShotsIncrementalButtons = $('#' + this.prefix + 'shotsIncrementalButtons' + playerNumber);

    placeForShotsIncrementalButtons.append('<div class="shotNear dataPlayerHeadline">Střela z podkoše</div>');
    this.createNonIncrementalButton('shotNearIB', playerNumber, placeForShotsIncrementalButtons, this.createUnderDeskShotDialog, "shotsUnderBasket");
    placeForShotsIncrementalButtons.append('<div class="shotNearSucc dataPlayerHeadline">Střela z podkoše úspěšná</div>');
    this.createNonIncrementalButton('shotNearSuccIB', playerNumber, placeForShotsIncrementalButtons, this.createUnderDeskShotDialog, "shotsUnderBasketScored");

    this.createFunctionalButtons();

};

/**
* Recounts the position of the shot
*
* @method recountPositionOfTheShot
* @author Jan Herzan
* @param {Integer} Position of X
* @param {Integer} Position of Y
* @return {Object} Object of recounted position
*/
View.prototype.recountPositionOfTheShot = function (positionX, positionY) {
    switch (this.turnOfTheBoard) {
        case 0:
            return { positionX: positionX, positionY: positionY };
        case 1:
            return { positionX: positionY, positionY: this.svnBoardWidth - positionX - 30 };
        case 2:
            return { positionX: this.svnBoardWidth - positionX, positionY: this.svnBoardHeight - positionY };
        case 3:
            return { positionX: this.svnBoardHeight - positionY + 30, positionY: positionX };
    }
    return null;
};

/**
* Creates the buttons for turning the board
*
* @method createFunctionalButtons
* @author Jan Herzan
*/
View.prototype.createFunctionalButtons = function () {
    this.workPlace.append('<div class="arrowButton arrowButtonDimension arrowButtonDimensionLeft" id="' + this.prefix + 'arrowLeft">y</div>');

    $('#' + this.prefix + 'arrowLeft').on('click', (function (e) {
        this.turnBoardLeft();
    }).bind(this));

    this.workPlace.append('<div class="arrowButton arrowButtonDimension arrowButtonDimensionRight" id="' + this.prefix + 'arrowRight">z</div>');

    $('#' + this.prefix + 'arrowRight').on('click', (function (e) {
        this.turnBoardRight();
    }).bind(this));
};

/**
* Set classes for name box
*
* @method setPlayerNameBoxClass
* @author Jan Herzan
*/
View.prototype.setPlayerNameBoxClass = function () {
    if (this.turnOfTheBoard % 2 === 0) {
        $('#' + this.prefix + 'nameOfPlayer').removeClass("name-leftRight");
        $('#' + this.prefix + 'nameOfPlayer').addClass("name-normal");
    } else {
        $('#' + this.prefix + 'nameOfPlayer').addClass("name-leftRight");
        $('#' + this.prefix + 'nameOfPlayer').removeClass("name-normal");
    }
};

/**
* Connects two incremental buttons - the value of uppoer bound button cannot be lower than slave button value
*
* @method 
* @author Jan Herzán
* @param {Object} Upper bound button
* @param {Object} Slave button
*/
View.prototype.connectIncrementalButtons = function (upperBoundButton, slaveButton) {
    upperBoundButton.incrementalButton("valueChanged", function (value, element) {
        slaveButton.incrementalButton("option", "maxBound", value);
        if (slaveButton.incrementalButton("option", "value") > value) {
            slaveButton.incrementalButton("option", "value", value);
        }
    });
};

/**
* Creates standard incremental button
*
* @method createIncrementalButton
* @author Jan Herzán
* @param {String} id of the button
* @param {Integer} id of the player (player number)
* @param {Object} Main work place div
* @param {String} Variable name
*/
View.prototype.createIncrementalButton = function (idOfTheButton, idOfPlayer, workPlace, variableName) {
    workPlace.append('<div class="' + idOfTheButton + '" id="' + this.prefix + idOfTheButton + idOfPlayer + '"></div>');
    $('#' + this.prefix + idOfTheButton + idOfPlayer).incrementalButton({
        value: this.actualShowedPlayer[variableName], maxBound: -1,
        valueChanged: (function (value, element) {
            this.viewEvents.fireEvent("addDataNodeForPlayer", {
                playerNumber: this.actualShowedPlayer.playerNumber,
                valueChanged: variableName,
                value: value
                });
        }).bind(this)
    });
};

/**
* Creates non incremental button (button shows dialog after click)
*
* @method createNonIncrementalButton
* @author Jan Herzán
* @param {String} id of the button
* @param {Integer} id of the player (player number)
* @param {Object} Main work playce dive
* @param {Function} On click callback function
* @param {String} Variable name
*/
View.prototype.createNonIncrementalButton = function (idOfTheButton, idOfPlayer, workPlace, onClickFunction, variableName) {
    workPlace.append('<div class="' + idOfTheButton + '" id="' + this.prefix + idOfTheButton + idOfPlayer + '"></div>');
    $('#' + this.prefix + idOfTheButton + idOfPlayer).incrementalButton({
        value: this.actualShowedPlayer[variableName],
        incrementalByTap: false, maxBound: -1, onClickEvent: onClickFunction.bind(this)
    });
};

/**
* Creates incremental button with background color changing
*
* @method createIncrementalFaulButton
* @author Jan Herzán
* @param {String} id of the button
* @param {Integer} id of the player (player number)
* @param {Object} Main work place div
* @param {String} Variable name
*/
View.prototype.createIncrementalFaulButton = function (idOfTheButton, idOfPlayer, workPlace, variableName) {
    workPlace.append('<div class="' + idOfTheButton + '" id="' + this.prefix + idOfTheButton + idOfPlayer + '"></div>');
    $('#' + this.prefix + idOfTheButton + idOfPlayer).incrementalButton({
        value: this.actualShowedPlayer[variableName],
        valueChanged: (function (value, element) {
            if (value == 4) {
                element.css({ "background-color": "orange" });
            } else if (value == 5) {
                element.css({ "background-color": "red" });
            } else {
                element.css({ "background-color": "green" });
            }

            this.viewEvents.fireEvent("playerValueStateChanged", {
                playerNumber: this.actualShowedPlayer.playerNumber,
                valueChanged: variableName,
                value: value
            });
        }).bind(this)
    });

    if (this.actualShowedPlayer[variableName] == 4) {
        $('#' + this.prefix + idOfTheButton + idOfPlayer).css({ "background-color": "orange" });
    } else if (this.actualShowedPlayer[variableName] == 5) {
        $('#' + this.prefix + idOfTheButton + idOfPlayer).css({ "background-color": "red" });
    } else {
        $('#' + this.prefix + idOfTheButton + idOfPlayer).css({ "background-color": "green" });
    }
};

/**
* Inserts main menu
*
* @method _insertMainMenu
* @author Jan Herzan
*/
View.prototype._insertMainMenu = function () {
    this.parentElement.append('<div id="' + this.prefix + 'mainMenu" class="mainMenu mainMenuDimension"></div>');
    this.mainMenu = $('#' + this.prefix + 'mainMenu');
};

/**
* Inserts site menu
*
* @method _insertSiteMenu
* @author Jan Herzan
*/
View.prototype._insertSiteMenu = function () {
    this.parentElement.append('<div id="' + this.prefix + 'siteMenu" class="siteMenu siteMenuDimension"></div>');
    this.siteMenu = $('#' + this.prefix + 'siteMenu');
};

/**
* Inserts button into main menu
*
* @method _insertButtonIntoMainMenu
* @author Jan Herzan
* @param {String} Button text
* @param {String} Id of the button
* @param {Function} Functionality
* @param {String} extra parameters CSS
*/
View.prototype._insertButtonIntoMainMenu = function (content, id, functionality, extraType) {
    if (extraType === undefined) {
        extraType = "";
    }

    $('#' + this.prefix + 'mainMenu').append('<div class="mainMenuButton mainMenuButtonDimension ' + extraType + '" id="' + this.prefix + id + '">' + content + '</div>');
    $('#' + this.prefix + id).on('click', (function () {
        this.viewEvents.fireEvent(functionality, {})
    }).bind(this));
};

/**
* Inserts button into main menu
*
* @method _insertButtonIntoMainMenu
* @author Jan Herzan
* @param {String} Button text
* @param {String} Id of the button
* @param {Function} Functionality
* @param {String} extra parameters CSS
*/
View.prototype._insertButtonIntoSiteMenu = function (content, id, functionality) {
    $('#' + this.prefix + 'siteMenu').append('<div class="playerButton playerButtonDimension siteMenuButton" id="' + this.prefix + id + '">' + content + '</div>');
    $('#' + this.prefix + id).on('click', functionality.bind(this));
};

/**
* DragOver handler for Site menu
*
* @method _dragOverHandlerSiteMenu
* @author Jan Herzan
* @param {Object} handler params
*/
View.prototype._dragOverHandlerSiteMenu = function (e) {
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    var child = $('#' + data);
    var target = $('#' + e.target.id);

    if (!target.hasClass('isDropable')) {
        return;
    }

    if (target.children().size() < 5) {
        this.changeButtonClassesAsShadeFromDeck(child);
        target.append(child);
    }
};

/**
* Drop handler for site menu
*
* @method _dropHandlerSiteMenu
* @author Jan Herzan
* @param {Object} handler params
*/
View.prototype._dropHandlerSiteMenu = function (e) {
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    var child = $('#' + data);
    var target = $('#' + e.target.id);

    if (!target.hasClass('isDropable')) {
        return;
    }

    if (target.children().size() < 5) {
        this.changeButtonClassesAsShadeFromDeck(child);
        this.changeButtonClassesToNormalButton();
        target.append(child);
    }
};

/**
* Dragover handler for work place
*
* @method _dragOverHandlerWorkPlace
* @author Jan Herzan
* @param {Object} handler params
*/
View.prototype._dragOverHandlerWorkPlace = function (e) {
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    var child = $('#' + data);
    var target = $('#' + e.target.id);

    if (!target.hasClass('isDropable')) {
        return;
    }

    this.changeButtonClassesAsShadeFromBoard(child);
    target.append(child);
};

/**
* Drop handler for work place
*
* @method _dropHandlerWorkPlace
* @author Jan Herzan
* @param {Object} handler params
*/
View.prototype._dropHandlerWorkPlace = function (e) {
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    var child = $('#' + data);
    var target = $('#' + e.target.id);

    if (!target.hasClass('isDropable')) {
        return;
    }

    this.changeButtonClassesAsShadeFromBoard(child);
    this.changeButtonClassesToNormalButton();
    target.append(child);
};
