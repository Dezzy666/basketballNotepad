//-----------------------------------------------------------------------
// <copyright file="yesNoTupple.js" company="Perfect Long Bow s.r.o.">
//     Copyright Perfect Long Bow s.r.o.
// </copyright>
//-----------------------------------------------------------------------

$.widget("perfectLongBowLib.yesNoTupple", {
    options: {
        value: -1,
        prefix: "YNT001",
        title: "",
        stateChanged: function (value) { }
    },

    // creates instance
    _create: function () {
        this.element.addClass('yesNoTupple');

        this.element.append('<div class="yesNoHeadline">' + this.options.title + '</div>');

        this.element.append('<div class="yesNoButton" id="' + this.options.prefix + 'YesButton">' +
            '<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">' +
            '<g>' +
            '<path id="tick" d="m1.88252,23.99325l4.79508,-4.85549l13.13598,13.29522l21.89718,-22.15869l4.79676,4.85213l-26.69394,27.01756" stroke-width="5" stroke="#000000" fill="#000000"/>' +
            '</g>' +
            '</svg>' +
            '</div>');

        this.element.append('<div class="yesNoButton" id="' + this.options.prefix + 'NoButton">' +
            '<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">' +
            '<g>' +
            '<path id="cross" d="m45.91183,39.1563l-13.66256,-13.86897l13.66009,-13.86895l-7.02247,-7.13357l-13.66253,13.86895l-13.66257,-13.86895l-7.02253,7.13357l13.66015,13.86895l-13.66257,13.86897l7.02742,7.13121l13.6601,-13.86907l13.66003,13.86907" stroke-linecap="null" stroke-linejoin="null" stroke-width="5" stroke="#000000" fill="#000000"/>' +
            '</g>' +
            '</svg>' +
            '</div>');

        this.yesButton = $('#' + this.options.prefix + 'YesButton');
        this.noButton = $('#' + this.options.prefix + 'NoButton');

        this.yesButton.on('click', (function (e) {
            this.options.value = 1;
            this.yesButton.css({ "background-color": "green" });
            this.noButton.css({ "background-color": "white" });
            this.options.stateChanged(this.options.value);
        }).bind(this));

        this.noButton.on('click', (function (e) {
            this.options.value = 0;
            this.yesButton.css({ "background-color": "white" });
            this.noButton.css({ "background-color": "red" });
            this.options.stateChanged(this.options.value);
        }).bind(this));
    }

});