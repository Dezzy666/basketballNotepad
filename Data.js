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
    this.data = {};
    this.data.version = "2.0";
    this.data.team = {};
    this.data.opponent = {};
    this.data.players = [];
    this.highestPlayerNumber = 0;
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
        this.data.players.push(this.createPlayer(i, "Hráč " + i));
    }
};

/**
* Loads data from JSON
*
* @method loadDataFromJSON
* @author Jan Herzan
* @param {String} data
* @return if data was loaded successfully
*/
Data.prototype.loadDataFromJSON = function (data) {
    var i, transformedData;
    try {
        transformedData = jQuery.parseJSON(data);
    } catch (e) {
        console.log(e);
        return false;
    }

    if (transformedData.players !== undefined) {
        for (i = 0; i < transformedData.players.length; i++) {
            if (transformedData.players[i].playerNumber !== undefined && transformedData.players[i].playerName !== undefined) {
                this.data.players.push(this.createPlayer(transformedData.players[i].playerNumber, transformedData.players[i].playerName, transformedData.players[i].nick));
            } else {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }

};

/**
* Loads data from JSON and save it without changing.
*
*@method loadCompleteDataFromJSON
*@authro Jan Herzan
*@param {String} data
*@return If data was loaded successfully
*/
Data.prototype.loadCompleteDataFromJSON = function (data) {
    var transformedData;
    try {
        transformedData = jQuery.parseJSON(data);
    } catch (e) {
        console.log(e);
        return false;
    }

    this.data = transformedData.players;
}

/**
* Creates data for one player
*
* @method createPlayer
* @author Jan Herzan
* @param Players number
* @param Players name
*/
Data.prototype.createPlayer = function (playerNumber, playerName, nick) {
    if (nick === undefined) {
        nick = playerName.substring(0, 8);
    }

    if (this.highestPlayerNumber < playerNumber) {
        this.highestPlayerNumber = playerNumber;
    }

    return { playerNumber: playerNumber, name: playerName, nick: nick, faulPlus: 0, faulMinus: 0, gain: 0, loss: 0, reboundO: 0, reboundD: 0, penaltsGetted: 0, penaltsScored: 0, shots: [], shotsUnderBasket: 0, shotsUnderBasketScored: 0 };
};

/**
* Returns data of players
*
* @method getData
* @author Jan Herzan
*/
Data.prototype.getData = function () {
    return this.data;
};

/**
* Returns data of players
*
* @method getData
* @author Jan Herzan
*/
Data.prototype.getPlayersList = function () {
    return this.data.players;
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
    for (var i = 0; i < this.data.players.length; i++) {
        if (this.data.players[i].playerNumber === playerNumber) {
            return this.data.players[i];
        }
    }

    return undefined;
};

/**
* Add players data node
*
* @method playerDataChanged
* @author Jan Herzan
* @param {Integer} Players number
* @param {Object} Changed data
*/
Data.prototype.playerDataChanged = function (playerNumber, dataNode) {
    var clearDataNode = EventSlots.getClearObject(dataNode);
    var playerData = this.getDataOfPlayer(playerNumber);

    if (dataNode.valueChanged !== undefined && dataNode.value !== undefined) {
        playerData[dataNode.valueChanged] = dataNode.value;
    } else if (dataNode.valueIncreased !== undefined) {
        playerData[dataNode.valueIncreased]++;
    } else if (dataNode.penaltyScored !== undefined) {
        if (dataNode.penaltyScored) {
            playerData.penaltsScored++;
        }
        playerData.penaltsGetted++;
    } else {
        console.log("WARNING: UNSIGNED DATA");
    }

    console.log("PN " + playerNumber);
    for (var key in clearDataNode) {
        console.log("NODE KEY: " + key);
        console.log("NODE VALUE: " + clearDataNode[key]);
    }
}

/**
* Adds shot into data
*
* @method addShot
* @author Jan Herzan
* @param {Integer} Players number
* @param {Object} Shot object
*/
Data.prototype.addShot = function (playerNumber, shotData) {
    this.getDataOfPlayer(playerNumber).shots.push(shotData);
}

/**
* Returns the highest player number
*
* @method getHighestPlayerNumber
* @author Jan Herzan
* @return {Integer} number of players
*/
Data.prototype.getHighestPlayerNumber = function () {
    return this.highestPlayerNumber;
}

/**
* Exports data into JSON file
*
* @method exportDataInFile
* @author Jan Herzan
* @param {String} File name
*/
Data.prototype.exportDataInLink = function (filename) {
    var exportedData = JSON.stringify(this.data);
    var file = document.createElement('a');
    file.download = filename;
    file.href = "data:text/plain;charset=UTF-8," + exportedData;
    file.style.display = "none";
    document.body.appendChild(file);
    file.click();

};