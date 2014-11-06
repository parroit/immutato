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

var threshold = 100;

var proto = immutato.fn = {
    _ver: 0,
    set: function(propName, value) {
        if (this._ver > 100) {
            return immutato(this);
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
    },
};



function namedFunction(name, fn) {
    var cnstr;
    //jshint evil:true
    eval('cnstr = function ' + name + '(){' + (fn ? 'return fn.apply(this,arguments);' : '') + '}');
    return cnstr;
}


function immutato(data) {
    var obj = Object.create(proto);
    assign(obj, data);
    Object.freeze(obj);
    return obj;
}


immutato.struct = function struct(props, name) {
    var propNames = Object.keys(props);

    var typeName = name || 'ImmutableType';


    var Constructor = new namedFunction(typeName, function(value) {
        Constructor.assertIs(value);
        if ( !(this instanceof Constructor) ) {
            return new Constructor(value);
        }
        assign(this, value);
        Object.freeze(this);

    });

    Constructor.prototype = proto;

    Constructor.props = {};

    propNames.forEach(function(propName) {
        var propType = props[propName];

        Constructor.props[propName] = {
            type: propType,
            name: propName
        };

    });

    Constructor.assertIs = function(value) {
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

};



require('./StringType');
require('./NumberType');
require('./BooleanType');
require('./DateType');
