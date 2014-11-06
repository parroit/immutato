'use strict';
var primitives = new Map();

function proto() {

}

module.exports = {


    type: function(sourceType, representation) {
        primitives.set(sourceType, representation);
        this[sourceType.name + 'Type'] = representation;
    },


    i: function(typeProperties, name) {
        var properties = Object.keys(typeProperties);
        var types = properties.map(function(name) {
            var type = typeProperties[name];
            if (primitives.has(type)) {
                return primitives.get(type);
            } else {
                return type;
            }

        });

        function mkProperty(name, data, type) {
            type.assertIs(data[name]);
            return function(value) {
                if (value === undefined) {
                    return data[name];
                } else {
                    type.assertIs(value);
                    
                    var newPropertyDefs = {};
                    var newData = {};
                    newData[name] = value;
                    newPropertyDefs[name] = mkProperty(name, newData, type);
                    
                    return Object.create(this, newPropertyDefs);
                }
            };
        }

        return function constructor(data) {
            var object = Object.create(proto);
            properties.forEach(function(name) {
                var type = types[name];
                object.props[name] = mkProperty(name, data, type);
            });
            Object.freeze(object);

            return object;
        };



    }
};
