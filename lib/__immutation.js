/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';



module.exports = immutato;

var payloads = new WeakMap();
var primitives = new Map();


immutato.type = function(sourceType, representation) {
    primitives.set(sourceType, representation);
    immutato[sourceType.name + 'Type'] = representation;
};


var proto = immutato.prototype = {
    set: function(propertyName, value) {

        var payload = payloads.get(this);

        var newPayload = {};

        for (var prop in payload) {
            if (payload.hasOwnProperty(prop)) {
                newPayload[prop] = payload[prop];
            }

        }

        newPayload[propertyName] = value;

        return new this.Builder(newPayload);

    }
};

require('./StringType');
require('./NumberType');
require('./BooleanType');
require('./DateType');


function immutato(props, name) {
    var propNames = Object.keys(props);

    var typeName = name || 'ImmutableType';

    var Constructor;

    //jshint evil:true
    eval(
        'Constructor = function ' + typeName + ' (value) {' +
        '    Constructor.assertIs(value);' +
        '    this.Builder = Constructor;' +
        '    payloads.set(this, value);' +
        '    Object.freeze(this);' +
        '};'
    );

    Constructor.props = {};
    Constructor.prototype = Object.create(proto);

    propNames.forEach(function(propName) {
        var propType = props[propName];
        if (primitives.has(propType)) {
            propType = primitives.get(propType);
        }

        Constructor.props[propName] = {
            type: propType,
            name: propName
        };

        Object.defineProperty(
            Constructor.prototype,
            propName, {
                get: function() {
                    return payloads.get(this)[propName];
                }
            });

    });

    Constructor.assertIs = function(value, name) {
        var keys = Object.keys(value);

        if (keys.length !== propNames.length) {
            throw new TypeError(typeName + ' expect ' + propNames.length + ' arguments, ' + keys.length + ' given.');
        }

        propNames.forEach(function(propName) {
            Constructor.props[propName].type.assertIs(value[propName]);
        });
    };

    Constructor.from = function(value) {
        value = value || {};
        propNames.forEach(function(propName) {
            var propType = Constructor.props[propName].type;
            value[propName] = propType.from(value[propName]);
        });

        return new Constructor(value);
    };

    return Constructor;

}
