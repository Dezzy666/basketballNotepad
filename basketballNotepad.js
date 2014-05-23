//-----------------------------------------------------------------------
// <copyright file="basketballNotepad.js" company="Perfect Long Bow s.r.o.">
//     Copyright Perfect Long Bow s.r.o.
// </copyright>
//-----------------------------------------------------------------------

$.widget("perfectLongBowLib.basketballNotepad", {
    options: {
        prefix: "BNP001",
        view: undefined
    },

    _create: function () {
        this.element.addClass("mainWindow");
        this.element.addClass("mainWindowDimension");
        this.options.view = new View(this.element, this.options.prefix);
    }

});