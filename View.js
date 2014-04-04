//-----------------------------------------------------------------------
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

    this.data = new Data();

    this._insertMainMenu();
    this._insertSiteMenu();

    var thisInstance = this;

    this._insertButtonIntoMainMenu("Střídání ukončeno", "changingEnds", function (params) {
        thisInstance._hideButton("changingEnds");
        thisInstance._showButton("changingStarts");
        thisInstance._showButton("faulPlus");
        thisInstance._showButton("faulMinus");
        thisInstance._showButton("gain");
        thisInstance._showButton("loss");
        thisInstance._showButton("reboundO");
        thisInstance._showButton("reboundD");
    }, "mainMenuButtonChanging");

    this._hideButton("changingEnds");

    this._insertButtonIntoMainMenu("Střídání", "changingStarts", function (params) {
        thisInstance.showDataForPlayer();
        thisInstance._showButton("changingEnds");
        thisInstance._hideButton("changingStarts");
        thisInstance._hideButton("faulPlus");
        thisInstance._hideButton("faulMinus");
        thisInstance._hideButton("gain");
        thisInstance._hideButton("loss");
        thisInstance._hideButton("reboundO");
        thisInstance._hideButton("reboundD");
    }, "mainMenuButtonChanging");

    this._insertButtonIntoMainMenu("Faul +", "faulPlus", function (params) { }, "mainMenuButtonNormal");
    this._insertButtonIntoMainMenu("Faul -", "faulMinus", function (params) { }, "mainMenuButtonNormal");
    this._insertButtonIntoMainMenu("Zisk", "gain", function (params) { }, "mainMenuButtonNormal");
    this._insertButtonIntoMainMenu("Ztráta", "loss", function (params) { }, "mainMenuButtonNormal");
    this._insertButtonIntoMainMenu("Doskok U.", "reboundO", function (params) { }, "mainMenuButtonNormal");
    this._insertButtonIntoMainMenu("Doskok O.", "reboundD", function (params) { }, "mainMenuButtonNormal");

    this._insertWorkPlace();

    this.showPlayersList();
}

/**
* Show players list
*
* @method sthowPlayersList
* @author Jan Herzan
*/
View.prototype.showPlayersList = function () {
    this.workPlace.empty();

    this.workPlace.addClass('isDropable');
    this.workPlace.addClass('dropableUnlimited');
    this.workPlace.attr("draggable", "true");

    this.siteMenu.addClass('isDropable');
    this.siteMenu.attr("draggable", "true");

    //this.workPlace.on('drop', this._dropHandlerWorkPlace);
    this.workPlace.on('dragover', this._dragOverHandlerWorkPlace);
    //this.siteMenu.on('drop', this._dropHandlerSiteMenu);
    this.siteMenu.on('dragover', this._dragOverHandlerSiteMenu);


    var playerList = this.data.getData();
    for (var i = 0; i < playerList.length; i++) {
        this.workPlace.append('<div id="' + this.prefix + 'player' + playerList[i].playerNumber + '" class="playerButton playerListButton siteMenuButtonUnselected" draggable="true" ondragstart="">' + playerList[i].playerNumber + '</div>');
        var actualNumber = $('#' + this.prefix + 'player' + playerList[i].playerNumber);
        actualNumber.data('prefix', this.prefix);
        actualNumber.data('playerNumber', playerList[i].playerNumber);

        actualNumber.on('dragstart', function (e) {
            e.originalEvent.dataTransfer.effectAllowed = 'copy';
            e.originalEvent.dataTransfer.setData('Player', e.originalEvent.target.id);
        });

        actualNumber.on('dragend', function (e) {
            e.preventDefault();
            var data = e.originalEvent.dataTransfer.getData("Player");
            var child = $('#' + data);

            child.removeClass("siteMenuButtonBlank");
            child.addClass("siteMenuButtonUnselected");
        });

        actualNumber.on('click', function (s) {
            console.log("click");
        });


    }
}

/**
* Hides button
*
* @method _hideButton
* @author Jan Herzan
* @param {String} Id of the button
*/
View.prototype._hideButton = function (idOfTheButton) {
    $('#' + this.prefix + idOfTheButton).css({ "display": "none" });
}

/**
* Shows button
*
* @method _showButton
* @author Jan Herzan
* @param {String} Id of the button
*/
View.prototype._showButton = function (idOfTheButton) {
    $('#' + this.prefix + idOfTheButton).css({ "display": "block" });
}

View.prototype._insertWorkPlace = function () {
    this.parentElement.append('<div id="' + this.prefix + 'workPlace" class="workPlace"></div>');
    this.workPlace = $('#' + this.prefix + 'workPlace');
};

View.prototype.showDataForPlayer = function (idOfPlayer) {

}

/**
* Inserts main menu
*
* @method _insertMainMenu
* @author Jan Herzan
*/
View.prototype._insertMainMenu = function () {
    this.parentElement.append('<div id="' + this.prefix + 'mainMenu" class="mainMenu"></div>');
    this.mainMenu = $('#' + this.prefix + 'mainMenu');
};

/**
* Inserts site menu
*
* @method _insertSiteMenu
* @author Jan Herzan
*/
View.prototype._insertSiteMenu = function () {
    this.parentElement.append('<div id="' + this.prefix + 'siteMenu" class="siteMenu"></div>');
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

    $('#' + this.prefix + 'mainMenu').append('<div class="mainMenuButton ' + extraType + '" id="' + this.prefix + id + '">' + content + '</div>');
    $('#' + this.prefix + id).bind('click', functionality);
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
    $('#' + this.prefix + 'siteMenu').append('<div class="playerButton siteMenuButton" id="' + this.prefix + id + '">' + content + '</div>');
    $('#' + this.prefix + id).bind('click', functionality);
};

/**
* Insert playground into div.
*
* @method insertPlayground
* @author Jan Herzan
* @param {Object} Div selector
*/
View.prototype.insertPlayground = function (space) {
    space.append(
        '<svg width="500" height="470" xmlns="http://www.w3.org/2000/svg" class="playgroundSVG">' +
        '<g>' +
            '<title>Playground</title>' +
            '<circle fill="#ffffff" stroke="#000000" stroke-width="4" cx="249.99998" cy="398.25" r="200" id="svg_8"/>' +
            '<line id="svg_1" y2="399" x2="50" y1="470" x1="50" stroke-width="4" stroke="#000000" fill="none"/>' +
            '<line id="svg_2" y2="397.5" x2="450" y1="470" x1="450" stroke-width="4" stroke="#000000" fill="none"/>' +
            '<clipPath id="cut-off-bottom">' +
                '<rect id="svg_5" height="100" width="200" y="0" x="0"/>' +
            '</clipPath>' +
            '<rect fill="#ffffff" stroke="#000000" stroke-width="0" x="137.5" y="355" width="197.5" height="76.5" id="svg_9"/>' +
            '<rect fill="#ffffff" stroke="#000000" stroke-width="0" x="52" y="391" width="396" height="80" id="svg_10"/>' +
            '<circle fill="#ffffff" stroke="#000000" stroke-width="4" cx="250" cy="278" r="38.3054" id="svg_13"/>' +
            '<rect fill="#ffffff" stroke="#000000" stroke-width="4" x="190" y="278" width="120" height="190" id="svg_11"/>' +
            '<circle fill="#ffffff" stroke="#000000" stroke-width="4" cx="250.00001" cy="1.75" r="65.1795" id="svg_14"/>' +
            '<rect fill="none" stroke="#000000" stroke-width="4" x="-0.5" y="-0.5" width="501" height="471" id="svg_15"/>' +
        '</g>' +
        '</svg>'
        );
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
    console.log("siteDragOver");
    var data = e.originalEvent.dataTransfer.getData("Player");
    var child = $('#' + data);
    var target = $('#' + e.target.id);

    if (!target.hasClass('isDropable')) {
        return;
    }

    if (target.children().size() < 5) {
        child.removeClass("playerListButton");
        child.removeClass("siteMenuButtonSelected");
        child.addClass("siteMenuButton");
        child.addClass("siteMenuButtonBlank");
        target.append(child);
    }
}

/**
* Drop handler for site menu
*
* @method _dropHandlerSiteMenu
* @author Jan Herzan
* @param {Object} handler params
*/
View.prototype._dropHandlerSiteMenu = function (e) {
    e.preventDefault();
    console.log("siteDrop");
    var data = e.originalEvent.dataTransfer.getData("Player");
    var child = $('#' + data);
    var target = $('#' + e.target.id);

    if (!target.hasClass('isDropable')) {
        return;
    }

    if (target.children().size() < 5) {
        child.removeClass("siteMenuButtonBlank");
        child.addClass("siteMenuButtonUnselected");
        target.append(child);
    }
}

/**
* Dragover handler for work place
*
* @method _dragOverHandlerWorkPlace
* @author Jan Herzan
* @param {Object} handler params
*/
View.prototype._dragOverHandlerWorkPlace = function (e) {
    e.preventDefault();
    console.log("siteDragOver");
    var data = e.originalEvent.dataTransfer.getData("Player");
    var child = $('#' + data);
    var target = $('#' + e.target.id);

    if (!target.hasClass('isDropable')) {
        return;
    }

    child.removeClass("siteMenuButton");
    child.removeClass("siteMenuButtonSelected");
    child.addClass("playerListButton");
    child.addClass("siteMenuButtonBlank");
    target.append(child);
}

/**
* Drop handler for work place
*
* @method _dropHandlerWorkPlace
* @author Jan Herzan
* @param {Object} handler params
*/
View.prototype._dropHandlerWorkPlace = function (e) {
    e.preventDefault();
    console.log("WorkDrop");
    var data = e.originalEvent.dataTransfer.getData("Player");
    var child = $('#' + data);
    var target = $('#' + e.target.id);

    if (!target.hasClass('isDropable')) {
        return;
    }

    child.removeClass("siteMenuButtonBlank");
    child.addClass("siteMenuButtonUnselected");
    target.append(child);
}
