//-----------------------------------------------------------------------
// <copyright file="basketballNotepad.js" company="Perfect Long Bow s.r.o.">
//     Copyright Perfect Long Bow s.r.o.
// </copyright>
//-----------------------------------------------------------------------

$.widget("perfectLongBowLib.basketballNotepad", {
    options: {
        prefix: "BNP001",
    },

    _create: function () {
        this.element.addClass("mainWindow");
        this.element.addClass("mainWindowDimension");
        this.view = new View(this.element, this.options.prefix);

        this.data = new Data();

        this.timeForChanging = { min: 10, sec: 0 };

        this.view.viewEvents.addEventListener("changingButtonPressed", (function () {
            if (this.timeForChanging == undefined) {
                this.view.createTimeGettingDialog((function (time) {
                    if (time !== undefined) {
                        this.timeForChanging = time;
                    }
                }).bind(this));
            }
            this.view.showPlayersList(this.data.getPlayersList(), this.view.switchPositionOfPlayerButtonHandler);
            this.view.switchHandlersForChanging();
            this.view._hideButton("changingStarts");
            this.view._hideButton("statistics");
            this.view._showButton("changingEnds");
        }).bind(this));

        this.view.viewEvents.addEventListener("changingEndsButtonPressed", (function () {
            this.data.addDataIntoTableForTeam(1, {
                event: "changing",
                time: this.timeForChanging,
                players: this.view.getPlayersOnTheGround()
            });
            this.view._showButton("changingStarts");
            this.view._showButton("statistics");
            this.view._hideButton("changingEnds");
            this.view.switchHandlersForPlaying();
            this.timeForChanging = undefined;
            this.view.clearWorkPlace();
        }).bind(this));

        this.view.viewEvents.addEventListener("exportDataDemand", (function () {
            this.data.exportDataInLink("exportMatch.json");
        }).bind(this));

        this.view.viewEvents.addEventListener("loadEmptyNumbers", (function () {
            this.data.loadEmptyNumbers();
            this.view.initializeAfterDataLoaded(this.data.getPlayersList());
        }).bind(this));

        this.view.viewEvents.addEventListener("loadDataFromJSON", (function (params) {
            if (!this.data.loadDataFromJSON(params.fileData)) {
                params.aborted = true;
            }
        }).bind(this));

        this.view.viewEvents.addEventListener("loadMainProgram", (function () {
            this.view.initializeAfterDataLoaded(this.data.getPlayersList());
        }).bind(this));

        this.view.viewEvents.addEventListener("numberClicked", (function (params) {
            this.view.showDataForPlayer(this.data.getDataOfPlayer(params.playerNumber));
        }).bind(this));

        this.view.viewEvents.addEventListener("endgameButtonPressed", (function () {
            this.view.clearWorkPlace();
            this.view.createEndingScreen();
        }).bind(this));

        this.view.viewEvents.addEventListener("addDataNodeForPlayer", (function (params) {
            if (params.playerNumber === undefined) {
                console.log("UNKNOWN PLAYER");
                return;
            }
            this.data.playerDataChanged(params.playerNumber, params);
        }).bind(this));


        this.view.viewEvents.addEventListener("addShot", (function (params) {
            if (params.playerNumber === undefined) {
                console.log("UNKNOWN PLAYER");
                return;
            }
            this.data.addShot(params.playerNumber, params);
            this.view.showDataForPlayer(this.data.getDataOfPlayer(params.playerNumber));
        }).bind(this));

        this.view.viewEvents.addEventListener("solutionDone", (function (params) {
            this.data.setDefaultSolution(params.team);
            this.view.viewEvents.fireEvent("changingEndsButtonPressed", {});
        }).bind(this));
    }
});
