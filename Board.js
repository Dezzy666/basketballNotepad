//-----------------------------------------------------------------------
// <copyright file="Board.js" company="Perfect Long Bow s.r.o.">
//     Copyright Perfect Long Bow s.r.o.
// </copyright>
//-----------------------------------------------------------------------

/**
* This method turns the board to the left
*
* @method turnBoardLeft
* @author Jan Herzan
*/
View.prototype.turnBoardLeft = function () {
    this.turnOfTheBoard++;
    this.turnOfTheBoard %= 4;
    this.removeAllClassesForOrientation();
    this.setClassForOrientation();
    this.setPlayerNameBoxClass();
};

/**
* This method turns the board to the right
*
* @method turnBoardRight
* @author Jan Herzan
*/
View.prototype.turnBoardRight = function () {
    this.turnOfTheBoard--;
    this.turnOfTheBoard += 4;
    this.turnOfTheBoard %= 4;
    this.removeAllClassesForOrientation();
    this.setClassForOrientation();
    this.setPlayerNameBoxClass();
};

/**
* This method sets the right class to board.
*
* @method setClassForOrientation
* @author Jan Herzan
*/
View.prototype.setClassForOrientation = function () {
    switch (this.turnOfTheBoard) {
        case 0:
            $('#' + this.prefix + 'playground' + this.actualShowedPlayer.playerNumber).addClass("playgroundSVG-normal");
            break;
        case 1:
            $('#' + this.prefix + 'playground' + this.actualShowedPlayer.playerNumber).addClass("playgroundSVG-leftOriented");
            break;
        case 2:
            $('#' + this.prefix + 'playground' + this.actualShowedPlayer.playerNumber).addClass("playgroundSVG-upsiteDown");
            break;
        case 3:
            $('#' + this.prefix + 'playground' + this.actualShowedPlayer.playerNumber).addClass("playgroundSVG-rightOriented");
            break;
    }
};

/**
* This method removes all classes from the board
*
* @method removeAllSlassesForOrientation
* @author Jan Herzan
*/
View.prototype.removeAllClassesForOrientation = function () {
    $('#' + this.prefix + 'playground' + this.actualShowedPlayer.playerNumber).removeClass("playgroundSVG-normal");
    $('#' + this.prefix + 'playground' + this.actualShowedPlayer.playerNumber).removeClass("playgroundSVG-leftOriented");
    $('#' + this.prefix + 'playground' + this.actualShowedPlayer.playerNumber).removeClass("playgroundSVG-rightOriented");
    $('#' + this.prefix + 'playground' + this.actualShowedPlayer.playerNumber).removeClass("playgroundSVG-upsiteDown");
};

/**
* Insert playground into div.
*
* @method insertPlayground
* @author Jan Herzan
* @param {Object} Div selector
*/
View.prototype.insertPlayground = function (space) {
    var i;
    var actualShot;
    var svgPicture = '<svg width="' + this.svnBoardWidth + '" height="' + this.svnBoardHeight + '" xmlns="http://www.w3.org/2000/svg" class="playgroundSVG" id="' + this.prefix + 'playGroundSVG' + this.actualShowedPlayer.playerNumber + '">' +
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
            '<rect id="svg_17" height="205" width="201" y="815" x="1276" stroke-width="5" stroke="#000000" fill="none"/>';

    for (i = 0; i < this.actualShowedPlayer.shots.length; i++) {
        actualShot = this.actualShowedPlayer.shots[i];
        if (actualShot.scored) {
            svgPicture = svgPicture + '<circle cx="' + actualShot.x + '" cy="' + actualShot.y + '" r="2" stroke="green" stroke-width="1" fill="green" />';
        } else {
            svgPicture = svgPicture + '<circle cx="' + actualShot.x + '" cy="' + actualShot.y + '" r="2" stroke="red" stroke-width="1" fill="red" />';
        }

    }
    svgPicture = svgPicture + '</g>' +
        '</svg>';

    space.append(svgPicture);

    this.setClassForOrientation();

    space.on('click',
    (function (e) {
        var positionX = e.pageX - $('#' + e.currentTarget.id).offset().left;
        var positionY = e.pageY - $('#' + e.currentTarget.id).offset().top;
        this.createShotSuccDialog(positionX, positionY);
    }).bind(this));
};