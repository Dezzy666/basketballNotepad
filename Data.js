//-----------------------------------------------------------------------
// <copyright file="Data.js" company="Perfect Long Bow s.r.o.">
//     Copyright Perfect Long Bow s.r.o.
// </copyright>
//-----------------------------------------------------------------------

/**
* Data creation constructor
*
* @method Data
* @author Jan Herzan
*/
function Data() {
    this.players = [];
}

/**
* Adds players without names
*
* @method loadEmptyNumbers
* @author Jan Herzan
*/
Data.prototype.loadEmptyNumbers = function () {
    var i;
    for (i = 4; i < 26; i++) {
        this.players.push(this.createPlayer(i, "Hráč " + i));
    }
}

/**
* Creates data for one player
*
* @method createPlayer
* @author Jan Herzan
* @param Players number
* @param Players name
*/
Data.prototype.createPlayer = function (playerNumber, playerName) {
    return { playerNumber: playerNumber, name: playerName, faulPlus: 0, faulMinus: 0, gain: 0, loss: 0, reboundO: 0, reboundD: 0, penaltsGetted: 0, penaltsScored: 0, shots: [], shotsUnderBasket: 0, shotsUnderBasketScored: 0 };
}

/**
* Returns data of players
*
* @method getData
* @author Jan Herzan
*/
Data.prototype.getData = function () {
    return this.players;
}

/**
* Returns data of one player
*
* @method getDataOfPlayer
* @author Jan Herzan
* @param {Integer} Players number
* @return {Object} Players data
*/
Data.prototype.getDataOfPlayer = function (playerNumber) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].playerNumber === playerNumber) {
            return this.players[i];
        }
    }

    return undefined;
}