/*
 * jt
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

var assign = require('object-assign');

function buildModifier(options) {
    var name = options.name;
    var validate = options.assertIs;
    var from = options.from;
    var metaImprover = options.metaImprover;

    return function() {
        var args = [].slice.call(arguments);
        var basicType = this;
        var typeName = basicType.meta.type;
        var newTypeName = name ? (typeName + '_' + name) : typeName;

        var type = function() {
            return basicType.apply(this, arguments);
        };

        type.assertIs = function(value) {
            var basicAssert = basicType.assertIs.bind(basicType);
            validate(value, args, basicAssert);
        };

        type.from = function(value) {
            var basicFrom = basicType.from.bind(basicType);
            return from(value, basicFrom);
        };

        var improvements = metaImprover.apply(null, args);
        type.meta = assign({}, basicType.meta, improvements);
        type.meta.type = newTypeName;
        mixinModifiers(type, newTypeName);
        return type;
    };
}

function mixinModifiers(type) {
    type.maxlength = maxlength;
    type.minlength = minlength;
    type.optional = optional;
    type.size = size;
    type.label = label;
    type.default = defaultValue;

}


var maxlength = buildModifier({
    name: 'maxlength',
    assertIs: function(value, args, basicAssert) {
        var max = args[0];

        basicAssert(value);

        if (value.length === undefined) {
            throw new TypeError('Length of `' + value + '` is undefined');
        }

        if (value.length > max) {
            throw new TypeError('Length of `' + value + '` is greater than ' + max);
        }


    },
    from: function(value, basicFrom) {
        return basicFrom(value);
    },
    metaImprover: function(maxlength) {
        return {
            maxlength: maxlength
        };
    }
});

var minlength = buildModifier({
    name: 'minlength',
    assertIs: function(value, args, basicAssert) {
        var min = args[0];

        basicAssert(value);

        if (value.length === undefined) {
            throw new TypeError('Length of `' + value + '` is undefined');
        }

        if (value.length < min) {
            throw new TypeError('Length of `' + value + '` is less than ' + min);
        }


    },
    from: function(value, basicFrom) {
        return basicFrom(value);
    },
    metaImprover: function(minlength) {
        return {
            minlength: minlength
        };
    }
});

var size = buildModifier({
    name: 'size',
    assertIs: function(value, args, basicAssert) {
        var sz = args[0];

        basicAssert(value);

        if (value.length === undefined) {
            throw new TypeError('Length of `' + value + '` is undefined');
        }

        if (value.length !== sz) {
            throw new TypeError('Length of `' + value + '` is different than ' + sz);
        }


    },
    from: function(value, basicFrom) {
        return basicFrom(value);
    },
    metaImprover: function(size) {
        return {
            size: size
        };
    }
});


var optional = buildModifier({
    name: 'optional',
    assertIs: function(value, args, basicAssert) {
        if (value !== null && value !== undefined) {
            basicAssert(value);
        }
    },

    from: function(value, basicFrom) {
        return basicFrom(value);
    },

    metaImprover: function(minlength) {
        return {
            optional: true
        };
    }
});


var label = buildModifier({
    name: '',
    assertIs: function(value, args, basicAssert) {
        basicAssert(value);
    },

    from: function(value, basicFrom) {
        return basicFrom(value);
    },

    metaImprover: function(text) {
        return {
            label: text
        };
    }
});


var defaultValue = buildModifier({
    name: '',
    assertIs: function(value, args, basicAssert) {
        if (value !== null && value !== undefined) {
            basicAssert(value);
        }

    },

    from: function(value, basicFrom) {
        if (value === null || value === undefined) {
            return this.default;
        }
        return basicFrom(value);
    },

    metaImprover: function(value) {
        return {
            default: value
        };
    }
});

module.exports = function(i) {
    mixinModifiers(i.Number, 'number');
    mixinModifiers(i.String, 'string');
    mixinModifiers(i.Boolean, 'boolean');

};
