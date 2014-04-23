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
    this.players.push(this.createPlayer(4, "Name4"));
    this.players.push(this.createPlayer(5, "Name5"));
    this.players.push(this.createPlayer(6, "Name6"));
    this.players.push(this.createPlayer(7, "Name7"));
    this.players.push(this.createPlayer(8, "Name8"));
    this.players.push(this.createPlayer(9, "Name9"));
    this.players.push(this.createPlayer(10, "Name10"));
    this.players.push(this.createPlayer(11, "Name11"));
    this.players.push(this.createPlayer(12, "Name12"));
    this.players.push(this.createPlayer(13, "Name13"));
    this.players.push(this.createPlayer(14, "Name14"));
    this.players.push(this.createPlayer(15, "Name15"));
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
    return { playerNumber: playerNumber, name: playerName, faulPlus: 1, faulMinus: 2, gain: 2, loss: 3, reboundO: 3, reboundD: 2, penaltsGetted: 5, penaltsScored: 2, shots: [{ x: 100, y: 130, scored: true }, { x: 100, y: 130, scored: true }], shotsUnderBasket: 2, shotsUnderBasketScored: 2 };
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