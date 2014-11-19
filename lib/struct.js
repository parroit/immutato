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
var mixinModifiers = require('./modifiers');

var namedFunction = util.namedFunction;
var assign = require('object-assign');

var threshold = 100;
var setDeep = require('./set-deep');
var Fields = require('./Fields');

var proto = struct.proto = {
    _ver: 0,
    debug: function() {
        var result = '{\n';
        var _this = this;
        _this.constructor.meta.fields.forEach(function(f) {
            result += '\t' + f.name + ': ' + _this[f.name] + ',\n';
        });
        result += '}\n';
        console.log(result);
    },

    toJSON:function() {
        var _this = this;
        var pojo = _this.constructor.meta.fields.map(function(f) {
            var prop = {};
            prop[f.name] = _this[f.name];
            return prop;
        });

        return assign.apply(null,[{}].concat(pojo));
    },
    set: function(propName, value) {
        if (typeof propName === 'string' && propName.indexOf('.') !== -1) {
            return setDeep.call(this, propName, value);
        }
/*
        if (this._ver > 100) {

            var clone = new this.constructor(this, 'not idempotent');

            return clone.set(propName,value);
        }
*/
        var operations = {};

        if (arguments.length === 1 && typeof propName === 'object') {
            var values = propName;
            Object.keys(values).forEach(function(propName){
                operations[propName] = values[propName];
            });
        } else {
            operations[propName] = value;
        }

        var _this  = this;
         var props = {
            set: {
                value: proto.set
            },
            _ver: {
                value: this._ver + 1
            },
            constructor: {
                value: this.constructor
            }
        };


        Object.keys(operations).forEach(function(propName){
            var value = operations[propName];
            var Type = _this.constructor.props[propName];
            //console.dir(Type.meta)
            if (Type.meta.kind === 'structure' && typeof value === 'object') {
                value = new Type(value);
            }

            Type.assertIs(value);

            props[propName] = {
                value: value
            };
        });


        var newObject = Object.create(this, props);
        Object.freeze(newObject);
        return newObject;
    }
};


function struct(props, name) {
    var propNames = Object.keys(props);

    var typeName = name || 'ImmutableType';


    var Constructor = new namedFunction(typeName, function(value, unidempotent) {
        if (!unidempotent && value instanceof Constructor) {
            return value;
        }

        if (!(this instanceof Constructor)) {
            return new Constructor(value);
        }
        value = value || {};


        Constructor.assertValueIs(value);

        propNames.forEach(function(propName) {
            var Type = props[propName];
            var kind = Type.meta.kind;
            var vl = value[propName];
            if (vl !== null && vl !== undefined ) {
                if (kind === 'primitive' ||
                    kind === 'any' ) {

                    this[propName] = vl;
                } else if (kind === 'structure') {
                    this[propName] = new Type(vl);
                } else {
                    throw new Error('Unknown kind:',kind);
                }

            }

        }.bind(this));


        Object.freeze(this);

    });

    //Function.name not supported by IE
    Constructor.typeName = typeName;

    Constructor.prototype = Object.create(proto);
    Constructor.prototype.constructor = Constructor;

    Constructor.meta = {
        type: typeName,
        kind: 'structure',
        fields: new Fields()
    };

    var fields = Constructor.meta.fields;

    Constructor.props = props;

    propNames.forEach(function(propName) {
        var meta = props[propName].meta;
        meta.label = meta.label || labelize(propName);
        fields[propName] = {
            type: meta,
            name: propName,

        };

    });

    Constructor.assertIs = function(value, name) {
        if (! (value instanceof Constructor)) {
            throw new TypeError(name + ' must be a ' + typeName + ' but got ' + value);
        }
    };

    Constructor.assertValueIs  = function(value, name){

        value = value || {};
        if (typeof value !== 'object') {
            throw new TypeError('You must supply an object to structures constructor');
        }

        var keys =  Object.keys(value);

        if (keys.length > propNames.length) {
            throw new TypeError(typeName+'.'+name + ' expect ' + propNames.length + ' arguments, ' + keys.length + ' given:\n' + JSON.stringify(keys,null,4) );
        }



        propNames.forEach(function(propName) {

            if (props[propName].meta.default) {
                value[propName] = props[propName].meta.default;
            }

            if (!props[propName].meta.optional) {
                if (props[propName].meta.kind === 'structure') {

                    props[propName].assertValueIs(value[propName], (name || '')+'.'+propName);
                } else {

                    props[propName].assertIs(value[propName], (name || '')+'.'+propName);
                }
            }


        });


    };

    Constructor.from = function(value) {
        value = value || {};
        propNames.forEach(function(propName) {
            var propType = props[propName];
            value[propName] = propType.from(value[propName]);
        });
        return new Constructor(value);
    };

    mixinModifiers(Constructor);

    return Constructor;

}



function labelize(name) {
    return name
        // insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, function(str) {
            return str.toUpperCase();
        });
}
