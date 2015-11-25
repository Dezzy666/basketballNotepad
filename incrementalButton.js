//-----------------------------------------------------------------------
// <copyright file="incrementalButton.js" company="Perfect Long Bow s.r.o.">
//     Copyright Perfect Long Bow s.r.o.
// </copyright>
//-----------------------------------------------------------------------

$.widget("basketballNotepad.incrementalButton", {
    options: {
        // value of button
        value: 0,
        // bounds
        minBound: 0,
        maxBound: 5,
        // if true buttons value is incremented on click
        incrementalByTap: true,
        // when value changes - callback
        valueChanged: function (value, element) { },
        // when value is increased - callback
        valueIncreased: function (value, element) { },
        // when value is decreased - callback
        valueDecreased: function (value, element) {},
        // on click event
        onClickEvent: function (e) { e.preventDefault(); }
    },

    // Creates new button
    _create: function () {
        this.setValue(this.options.value);
        this.element.addClass("incrementalButtonMain");

        if (this.options.incrementalByTap) {
            this.element.on('click', (function () {
                if (this.options.maxBound === -1 || this.options.value < this.options.maxBound) {
                    this.options.value = this.options.value + 1;
                    this.element.html(this.options.value);
                    this.options.valueChanged(this.options.value, this.element);
                    this.options.valueIncreased(this.options.value, this.element);
                }
            }).bind(this));

            this.element.on('taphold', (function (e) {
                e.preventDefault();
                if (this.options.value > this.options.minBound) {
                    this.options.value = this.options.value - 1;
                    this.element.html(this.options.value);
                    this.options.valueChanged(this.options.value, this.element);
                    this.options.valueDecreased(this.options.value, this.element);
                }
            }).bind(this));

            this.element.on('contextmenu', (function (e) {
                e.preventDefault();
                if (this.options.value > this.options.minBound) {
                    this.options.value = this.options.value - 1;
                    this.element.html(this.options.value);
                    this.options.valueChanged(this.options.value, this.element);
                    this.options.valueDecreased(this.options.value, this.element);
                }
            }).bind(this));
        } else {
            this.element.on('click', this.options.onClickEvent);
        }
    },

    // sets the value
    setValue: function (value) {
        this.options.value = value;
        this.element.html(this.options.value);
    }
});
