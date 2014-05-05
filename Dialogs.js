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
        this.actualShowedPlayer.shotsUnderBasket = this.actualShowedPlayer.shotsUnderBasket + 1;
        if (this.yesNoTupples[i].yesNoTupple("option", "value") === 1) {
            this.actualShowedPlayer.shotsUnderBasketScored = this.actualShowedPlayer.shotsUnderBasketScored + 1;
        }
    }

    this.dialogElement.dialog("close");
    this.showDataForPlayer(this.actualShowedPlayer.playerNumber);
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
        this.actualShowedPlayer.shots.push({ x: recountedPosition.positionX, y: recountedPosition.positionY, scored: this.yesNoTupples[0].yesNoTupple("option", "value") === 1 });
        this.showDataForPlayer(this.actualShowedPlayer.playerNumber);
        this.dialogElement.dialog("close");
    }).bind(this));
    this.dialogElement.dialog("option", "title", "Úspěšnost");
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
        this.actualShowedPlayer.penaltsGetted = this.actualShowedPlayer.penaltsGetted + 1;
        if (this.yesNoTupples[i].yesNoTupple("option", "value") === 1) {
            this.actualShowedPlayer.penaltsScored = this.actualShowedPlayer.penaltsScored + 1;
        }
    }

    this.dialogElement.dialog("close");
    this.showDataForPlayer(this.actualShowedPlayer.playerNumber);

};
