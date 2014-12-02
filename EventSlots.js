/**
 * Events slots for given element
 *
 * @constructor
 * @param {Object} element
 */
var EventSlots = function (element) {
    this.callbacks = {};
    this.element = element;
};

/**
 * Add event listener
 * @method addEventListener
 * @param {String} event without 'no', i.e. hover, mousemove
 * @param {function} handler to be fired
 */
EventSlots.prototype.addEventListener = function (event, handler) {
    if (this.callbacks[event] === undefined)
    {
        this.callbacks[event] = [];
    }
    this.callbacks[event].push(handler);

    // register on element
    if (this.element !== undefined && this.element !== null) {
        if (this.element.addEventListener) {
            this.element.addEventListener(event, handler, false);
        }
    }
};

/**
 * Manually fire specific event
 * @method fireEvent
 * @param {String} event without 'no', i.e. hover, mousemove
 * @param {Object} eventParams
 * @return if the operation was aborted (true means aborted operation)
 */
EventSlots.prototype.fireEvent = function (event, params) {
    var handlers = this.callbacks[event];
    if (handlers === undefined) { return; } // no specific events

    var i;
    eventParams = this.transformData(params);

    for (i = 0; i < handlers.length; i++) {
        if (!eventParams.continueOnAbort && eventParams.aborted) {
            return true;
        }
        handlers[i](eventParams);
    }

    return eventParams.aborted;
};

/**
 * Clears specific event handlers
 * @method clearEvent
 * @param {string} event without 'no', i.e. hover, mousemove
 */
EventSlots.prototype.clearEvent = function (event) {
    this.callbacks[event] = [];
};

/**
* Transforms data for handler
*
* @method transformData
* @param {Object} data
* @return transformed data
*/
EventSlots.prototype.transformData = function (data) {
    data.aborted = false;

    if (data.continueOnAbort === undefined) {
        data.continueOnAbort = true;
    }

    return data;
}

/**
* Returns object without transformation
*
* @method getClearObject
* @author Jan Herzan
* @param {Object} Transformed data
* @return {Object} Data without transformation properties
*/
EventSlots.getClearObject = function (data) {
    var clearDataObject = {};
    for (var key in data) {
        if (key !== "aborted" && key !== "continueOnAbort") {
            clearDataObject[key] = data[key]
        }
    }

    return clearDataObject;
}
