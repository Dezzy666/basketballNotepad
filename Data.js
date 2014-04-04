//-----------------------------------------------------------------------
// <copyright file="Data.js" company="Perfect Long Bow s.r.o.">
//     Copyright Perfect Long Bow s.r.o.
// </copyright>
//-----------------------------------------------------------------------

function Data() {
    this.players = new Array();
    this.players.push({ playerNumber: 2, name: "Name2" });
    this.players.push({ playerNumber: 3, name: "Name1" });
    this.players.push({ playerNumber: 6, name: "Name3" });
    this.players.push({ playerNumber: 8, name: "Name4" });
    this.players.push({ playerNumber: 10, name: "Name5" });
    this.players.push({ playerNumber: 12, name: "Name6" });
    this.players.push({ playerNumber: 17, name: "Name7" });
    this.players.push({ playerNumber: 18, name: "Name8" });
    this.players.push({ playerNumber: 19, name: "Name9" });
    this.players.push({ playerNumber: 20, name: "Name10" });
    this.players.push({ playerNumber: 21, name: "Name11" });
    this.players.push({ playerNumber: 22, name: "Name12" });
    this.players.push({ playerNumber: 24, name: "Name13" });
}

Data.prototype.getData = function () {
    return this.players;
}