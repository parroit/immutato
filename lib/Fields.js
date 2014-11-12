/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = Fields;

function Fields() {}

Fields.prototype.toArray = function() {
    var _this = this;
    var names = Object.keys(_this);
    return names.map(function(name) {
        return _this[name];
    });
};

Fields.prototype.map = function(fn) {

    return this.toArray().map(fn);
};


Fields.prototype.forEach = function(fn) {

    this.toArray().forEach(fn);
};

Fields.prototype.filter = function(fn) {
    return this.toArray().filter(fn);
};