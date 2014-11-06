/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = struct;

var util = require('./util');
var namedFunction = util.namedFunction;
var assign = require('object-assign');

var threshold = 100;

var proto = struct.proto = {
    _ver: 0,
    set: function(propName, value) {
        if (this._ver > 100) {
            return new this.constructor(this, 'not idempotent');
        }

        var props = {
            set: {
                value: proto.set
            },
            _ver: {
                value: this._ver + 1
            }
        };
        props[propName] = {
            value: value
        };
        var newObject = Object.create(this, props);
        Object.freeze(newObject);
        return newObject;
    }
};




function struct(props, name) {
    var propNames = Object.keys(props);

    var typeName = name || 'ImmutableType';


    var Constructor = new namedFunction(typeName, function(value, unidempotent) {
        if (!unidempotent && value instanceof Constructor ) {
            return value;
        }

        if ( !(this instanceof Constructor) ) {
            return new Constructor(value);
        }

        Constructor.assertIs(value);

        assign(this, value);
        Object.freeze(this);

    });

    Constructor.prototype = Object.create(proto);

    Constructor.meta = {
        type: typeName,
        kind: 'structure',
        fields: {}
    };

    var fields = Constructor.meta.fields;

    propNames.forEach(function(propName) {
        fields[propName] = {
            type: props[propName],
            name: propName
        };
    });

    Constructor.assertIs = function(value) {
        var keys = Object.keys(value);

        if (keys.length !== propNames.length) {
            throw new TypeError(typeName + ' expect ' + propNames.length + ' arguments, ' + keys.length + ' given.');
        }

        propNames.forEach(function(propName) {
            fields[propName].type.assertIs(value[propName]);
        });
    };

    Constructor.from = function(value) {
        value = value || {};
        propNames.forEach(function(propName) {
            var propType = fields[propName].type;
            value[propName] = propType.from(value[propName]);
        });

        return new Constructor(value);
    };

    return Constructor;

}
