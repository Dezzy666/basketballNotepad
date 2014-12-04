//-----------------------------------------------------------------------
// <copyright file="Dialogs.js" company="Perfect Long Bow s.r.o." autor="Jan Herzan">
//     Copyright Perfect Long Bow s.r.o.
// </copyright>
//-----------------------------------------------------------------------

/**
* Inserts the dialog into page
*
* @method insertDialog
* @author Jan Herzán
*/
View.prototype.insertDialog = function () {
    this.parentElement.append('<div id="' + this.prefix + 'dialog"></div>');

    this.dialogElement = $('#' + this.prefix + 'dialog');

    this.yesNoTupples = [];

    this.dialogElement.dialog({
        autoOpen: false,
        hide: {
            effect: "explode",
            duration: 500
        },
        resizable: false,
        draggable: false,
        closeOnEscape: true,
        modal: true
    });
};

/**
* Clears dialog content
*
* @method clearDialogElement
* @author Jan Herzán
*/
View.prototype.clearDialogElement = function () {
    this.dialogElement.empty();
    this.dialogElement.dialog({
        close: function (event, ui) {
        }
    });

    this.dialogElement.dialog("option", "position", {
        my: "center",
        at: "center",
        of: this.parentElement
    });
};

/**
* Creates dialog for near shot successibility
*
* @method createUnderDeskShotDialog
* @author Jan Herzán
*/
View.prototype.createUnderDeskShotDialog = function () {
    this.clearDialogElement();
    this.createYesNoTupple(1, this.stateChangedShot.bind(this));
    this.dialogElement.dialog("option", "title", "Úspěšnost");
    this.dialogElement.dialog("option", "width", 170);
    this.dialogElement.dialog("open");
};

/**
* Creates dialog for time insertion
*
* @method createTimeGettingDialog
* @author Jan Herzán
* @param {Function} Handler which is called when value is inserted.
*/
View.prototype.createTimeGettingDialog = function (handler) {
    this.clearDialogElement();
    this.dialogElement.dialog("option", "title", "Čas střídání");
    this.addTimeElementsIntoDialog(handler);
    this.dialogElement.dialog("option", "width", 350);
    this.dialogElement.dialog("open");
    this.dialogElement.dialog({
        close: function (event, ui) {
            handler(undefined);
        }
    });
};

/**
* Adds "time display" into dialog
*
* @method addTimeElementsIntoDialog
* @author Jan Herzán
* @param {Function} Handler for returning value
*/
View.prototype.addTimeElementsIntoDialog = function (handler) {
    this.dialogElement.append('<div class="timeGettingNumbers timeGettingNumbersTimeShowers" id="' + this.prefix + 'TimeGetterMinute0">0</div>');
    this.dialogElement.append('<div class="bigDobleDott">:</div>');
    this.dialogElement.append('<div class="timeGettingNumbers timeGettingNumbersTimeShowers" id="' + this.prefix + 'TimeGetterMinute1">0</div>');
    this.dialogElement.append('<div class="timeGettingNumbers timeGettingNumbersTimeShowers" id="' + this.prefix + 'TimeGetterMinute2">0</div>');

    this.positionOfCursor = 0;
    this.setCursorColored();

    this.dialogElement.append('<div class="keyBoard" id="' + this.prefix + 'KeyBoard"></div>');

    var keyBoard = $("#" + this.prefix + "KeyBoard");

    for (var i = 1; i < 10; i++) {
        keyBoard.append('<div class="timeGettingNumbers" id="' + this.prefix + 'TimeKeybordNumber' + i + '">' + i + '</div>');
        $('#' + this.prefix + 'TimeKeybordNumber' + i).click(this.numberClickHandler.bind(this));
    }

    keyBoard.append('<div class="timeGettingNumbers zero" id="' + this.prefix + 'TimeKeybordNumber0">0</div>');

    $('#' + this.prefix + 'TimeKeybordNumber0').on("click", this.numberClickHandler.bind(this));

    keyBoard.append('<div class="timeGettingNumbers ok" id="' + this.prefix + 'TimeOK">OK</div>');

    $("#" + this.prefix + "TimeOK").on("click", (function (e) {
        handler({
            minutes: parseInt($('#' + this.prefix + 'TimeGetterMinute0').html()),
            seconds: parseInt($('#' + this.prefix + 'TimeGetterMinute1').html()) * 10 + parseInt($('#' + this.prefix + 'TimeGetterMinute2').html())
        });
        this.dialogElement.dialog("close");
    }).bind(this));
};

/**
* Colors right number on "display"
*
* @method setCursorColored
* @author Jan Herzán
*/
View.prototype.setCursorColored = function () {
    for (var i = 0; i < 3; i++) {
        $("#" + this.prefix + "TimeGetterMinute" + i).css({ "background-color": "white" });
    }
    $("#" + this.prefix + "TimeGetterMinute" + this.positionOfCursor).css({ "background-color": "lightgray" });
};

/**
* Handler for number clicking
*
* @method numberClickHandler
* @author Jan Herzán
* @param {Object} params of click handler
*/
View.prototype.numberClickHandler = function (e) {
    var name = e.currentTarget.id;
    var number = parseInt(name.substring(name.length - 1));

    if (this.positionOfCursor == 1 && number > 5) {
        return;
    }

    $("#" + this.prefix + "TimeGetterMinute" + this.positionOfCursor).html(number);
    this.positionOfCursor++;
    this.positionOfCursor %= 3;
    this.setCursorColored();
};

/**
* Creates penalty shot dialog
*
* @method createPenaltyShotDialog
* @author Jan Herzán
*/
View.prototype.createPenaltyShotDialog = function () {
    this.clearDialogElement();

    this.dialogElement.append('<div id="' + this.prefix + 'oneShot" class="penaltyNumberButton"></div>');
    this.dialogElement.append('<div id="' + this.prefix + 'twoShots" class="penaltyNumberButton"></div>');
    this.dialogElement.append('<div id="' + this.prefix + 'threeShots" class="penaltyNumberButton"></div>');

    var oneShot = $('#' + this.prefix + 'oneShot');
    var twoShots = $('#' + this.prefix + 'twoShots');
    var threeShots = $('#' + this.prefix + 'threeShots');

    oneShot.incrementalButton({
        incrementalByTap: false,
        value: 1,
        onClickEvent: (function (e) {
            this.dialogElement.dialog("close");
            this.clearDialogElement();
            this.createYesNoTupple(1, this.stateChangedPenalty.bind(this));
            this.dialogElement.dialog("option", "title", "Úspěšnost");
            this.dialogElement.dialog("option", "width", 170);
            this.dialogElement.dialog("open");
        }).bind(this)
    });

    twoShots.incrementalButton({
        incrementalByTap: false,
        value: 2,
        onClickEvent: (function (e) {
            this.dialogElement.dialog("close");
            this.clearDialogElement();
            this.createYesNoTupple(2, this.stateChangedPenalty.bind(this));
            this.dialogElement.dialog("option", "title", "Úspěšnost");
            this.dialogElement.dialog("option", "width", 270);
            this.dialogElement.dialog("open");
        }).bind(this)
    });

    threeShots.incrementalButton({
        incrementalByTap: false,
        value: 3,
        onClickEvent: (function (e) {
            this.dialogElement.dialog("close");
            this.clearDialogElement();
            this.createYesNoTupple(3, this.stateChangedPenalty.bind(this));
            this.dialogElement.dialog("option", "title", "Úspěšnost");
            this.dialogElement.dialog("option", "width", 360);
            this.dialogElement.dialog("open");
        }).bind(this)
    });

    this.dialogElement.dialog("option", "width", 550);
    this.dialogElement.dialog("option", "title", "Kolik je trestných střel?");
    this.dialogElement.dialog("open");
};

/**
* Creates yesNoTupples
*
* @method createYesNoTupple
* @author Jan Herzán
* @param {Integer} How many tupples should be created
* @param {Function} Call back function when state changed
*/
View.prototype.createYesNoTupple = function (howMany, callBackFunction) {
    var i, tupple;
    this.yesNoTupples = [];

    for (i = 0; i < howMany; i++) {
        this.dialogElement.append('<div id="' + this.prefix + 'Tupple' + i + '"></div>');
        tupple = $('#' + this.prefix + 'Tupple' + i);
        tupple.yesNoTupple({ title: 'Pokus ' + (i + 1), prefix: 'YNT00' + i });
        tupple.yesNoTupple("option", "stateChanged", callBackFunction);
        this.yesNoTupples.push(tupple);
    }
};

/**
* This function is callback function for yesNoTupple for shots near basket
*
* @method stateChangedShot
* @author Jan Herzán
*/
View.prototype.stateChangedShot = function (value) {
    var i;
    for (i = 0; i < this.yesNoTupples.length; i++) {
        if (this.yesNoTupples[i].yesNoTupple("option", "value") === -1) {
            return;
        }
    }

    for (i = 0; i < this.yesNoTupples.length; i++) {
        this.viewEvents.fireEvent("addDataNodeForPlayer", {
            playerNumber: this.actualShowedPlayer.playerNumber,
            valueIncreased: "shotsUnderBasket"
        });
        if (this.yesNoTupples[i].yesNoTupple("option", "value") === 1) {
            this.viewEvents.fireEvent("addDataNodeForPlayer", {
                playerNumber: this.actualShowedPlayer.playerNumber,
                valueIncreased: "shotsUnderBasketScored"
            });
        }
    }

    this.dialogElement.dialog("close");
    this.viewEvents.fireEvent("numberClicked", { playerNumber: this.actualShowedPlayer.playerNumber });
};

/**
* Creates shot success dialog
*
* @method createShotSuccDialog
* @author Jan Herzán
* @param {Integer} Position of shoter X
* @param {Integer} Position of shoter Y
*/
View.prototype.createShotSuccDialog = function (positionX, positionY) {
    var recountedPosition = this.recountPositionOfTheShot(positionX, positionY);
    this.clearDialogElement();
    this.createYesNoTupple(1, (function (value) {
        if (this.yesNoTupples[0].yesNoTupple("option", "value") === -1) {
            return;
        }
        this.viewEvents.fireEvent("addShot", { playerNumber: this.actualShowedPlayer.playerNumber, x: recountedPosition.positionX, y: recountedPosition.positionY, scored: this.yesNoTupples[0].yesNoTupple("option", "value") === 1 });
        this.dialogElement.dialog("close");
    }).bind(this));
    this.dialogElement.dialog("option", "title", "Úspěšnost");
    if ($(".siteMenu").width() < 200) {
        this.dialogElement.dialog({ position: [this.parentElement.offset().left + $(".siteMenu").width() + $(".basicIncrementalButtons").width() - 200, 200] });
    } else {
        this.dialogElement.dialog({ position: [this.parentElement.offset().left + ($(".siteMenu").width()/2), 200] });
    }
    this.dialogElement.dialog("option", "width", 170);
    this.dialogElement.dialog("open");
};

/**
* This function is callback function for penalty shots.
*
* @method stateCHangedPenalty
* @author Jan Herzán
*/
View.prototype.stateChangedPenalty = function (value) {
    var i;
    for (i = 0; i < this.yesNoTupples.length; i++) {
        if (this.yesNoTupples[i].yesNoTupple("option", "value") === -1) {
            return;
        }
    }

    for (i = 0; i < this.yesNoTupples.length; i++) {
        if (this.yesNoTupples[i].yesNoTupple("option", "value") === 1) {
            this.viewEvents.fireEvent("addDataNodeForPlayer", { playerNumber: this.actualShowedPlayer.playerNumber, penaltyNumber: i, penaltyScored: true });
        } else {
            this.viewEvents.fireEvent("addDataNodeForPlayer", { playerNumber: this.actualShowedPlayer.playerNumber, penaltyNumber: i, penaltyScored: false });
        }
    }

    this.dialogElement.dialog("close");
    this.viewEvents.fireEvent("numberClicked", { playerNumber: this.actualShowedPlayer.playerNumber });

};
