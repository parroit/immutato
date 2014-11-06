/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = immutato;
var assign = require('object-assign');

var proto = {
    set: function(propName, value) {
        var newData = assign({},this);
        newData[propName] = value;
        return immutato(newData);
    },
    setP: function(propName, value) {
        var props = {
            setP: {value:proto.setP}
        };
        props[propName] = {value:value};
        var newObject =  Object.create(this, props);
        Object.freeze(newObject);
        return newObject;
    },
};

function immutato(data) {
    var obj = Object.create(proto);
    assign(obj, data);
    Object.freeze(obj);
    return obj;
}
