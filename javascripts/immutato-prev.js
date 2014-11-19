(function (name, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        this[name] = factory();
    }
}('immutato_prev', function (define) {
    function _require(index) {
        var module = _require.cache[index];
        if (!module) {
            var exports = {};
            module = _require.cache[index] = {
                id: index,
                exports: exports
            };
            _require.modules[index].call(exports, module, exports);
        }
        return module.exports;
    }
    _require.cache = [];
    _require.modules = [
        function (module, exports) {
            'use strict';
            module.exports = {
                meta: {
                    type: 'Any',
                    kind: 'any'
                },
                assertIs: function (value, name) {
                },
                from: function (value) {
                    return value;
                }
            };
        },
        function (module, exports) {
            'use strict';
            module.exports = {
                meta: {
                    primitive: Boolean,
                    type: 'Boolean',
                    kind: 'primitive'
                },
                assertIs: function (value, name) {
                    if (typeof value !== 'boolean') {
                        throw new TypeError(name + ' should be a Boolean, but `' + value + '` was given.');
                    }
                },
                from: function (value) {
                    if (value === 'true' || value === '1' || value === 1 || value === 'on' || value === 'yes') {
                        return true;
                    }
                    if (value === 'false' || value === '0' || value === 0 || value === 'off' || value === 'no') {
                        return false;
                    }
                    return !!value;
                }
            };
        },
        function (module, exports) {
            'use strict';
            var toString = Object.prototype.toString;
            module.exports = {
                meta: {
                    primitive: Date,
                    type: 'Date',
                    kind: 'primitive'
                },
                assertIs: function (value, name) {
                    if (typeof value !== 'object' || toString.call(value) !== '[object Date]') {
                        throw new TypeError(name + ' should be a Date, but `' + value + '` was given.');
                    }
                },
                from: function (value) {
                    return new Date(value);
                }
            };
        },
        function (module, exports) {
            'use strict';
            module.exports = Fields;
            function Fields() {
            }
            Fields.prototype.toArray = function () {
                var _this = this;
                var names = Object.keys(_this);
                return names.map(function (name) {
                    return _this[name];
                });
            };
            Fields.prototype.map = function (fn) {
                return this.toArray().map(fn);
            };
            Fields.prototype.forEach = function (fn) {
                this.toArray().forEach(fn);
            };
            Fields.prototype.filter = function (fn) {
                return this.toArray().filter(fn);
            };
        },
        function (module, exports) {
            'use strict';
            module.exports = {
                meta: {
                    primitive: Number,
                    type: 'Number',
                    kind: 'primitive'
                },
                assertIs: function (value, name) {
                    if (typeof value !== 'number' || isNaN(value) || value === Infinity) {
                        throw new TypeError(name + ' should be a Number, but `' + value + '` was given.');
                    }
                },
                from: function (value) {
                    if (value === null || value === undefined || isNaN(value)) {
                        return 0;
                    }
                    return parseFloat(value);
                }
            };
        },
        function (module, exports) {
            'use strict';
            module.exports = {
                meta: {
                    primitive: String,
                    type: 'String',
                    kind: 'primitive'
                },
                assertIs: function (value, name) {
                    if (typeof value !== 'string') {
                        throw new TypeError(name + ' should be a String, but `' + value + '` was given.');
                    }
                },
                from: function (value) {
                    if (value === null || value === undefined) {
                        return '';
                    }
                    return value.toString();
                }
            };
        },
        function (module, exports) {
            'use strict';
            var immutato = module.exports = {};
            var mixinModifiers = _require(7);
            immutato.struct = _require(9);
            immutato.String = _require(5);
            immutato.Number = _require(4);
            immutato.Boolean = _require(1);
            immutato.Date = _require(2);
            immutato.Any = _require(0);
            mixinModifiers(immutato.Number);
            mixinModifiers(immutato.String);
            mixinModifiers(immutato.Boolean);
            mixinModifiers(immutato.Date);
            mixinModifiers(immutato.Any);
        },
        function (module, exports) {
            var assign = _require(11);
            function buildModifier(options) {
                var name = options.name;
                var validate = options.assertIs;
                var from = options.from;
                var metaImprover = options.metaImprover;
                function modifier() {
                    var args = [].slice.call(arguments);
                    var basicType = this;
                    var typeName = basicType.meta.type;
                    var newTypeName = name ? typeName + '_' + name : typeName;
                    var type = function () {
                        return basicType.apply(this, arguments);
                    };
                    type.assertValueIs = basicType.assertValueIs;
                    type.assertIs = function (value, name) {
                        var basicAssert = basicType.assertIs.bind(basicType, value, name);
                        try {
                            validate(value, args, basicAssert);
                        } catch (err) {
                            throw err;
                        }
                    };
                    type.from = function (value) {
                        var basicFrom = basicType.from.bind(basicType);
                        return from(value, basicFrom);
                    };
                    var improvements = metaImprover.apply(null, args);
                    type.meta = assign({}, basicType.meta, improvements);
                    type.meta.type = newTypeName;
                    mixinModifiers(type, newTypeName);
                    return type;
                }
                return modifier;
            }
            function mixinModifiers(type) {
                type.max = max;
                type.min = min;
                type.maxlength = maxlength;
                type.minlength = minlength;
                type.optional = optional;
                type.size = size;
                type.label = label;
                type.default = defaultValue;
                type.info = info;
                type.validate = validate;
            }
            var maxlength = buildModifier({
                    name: 'maxlength',
                    assertIs: function (value, args, basicAssert) {
                        var max = args[0];
                        basicAssert(value);
                        if (value.length === undefined) {
                            throw new TypeError('Length of `' + value + '` is undefined');
                        }
                        if (value.length > max) {
                            throw new TypeError('Length of `' + value + '` is greater than ' + max);
                        }
                    },
                    from: function (value, basicFrom) {
                        return basicFrom(value);
                    },
                    metaImprover: function (maxlength) {
                        return { maxlength: maxlength };
                    }
                });
            var minlength = buildModifier({
                    name: 'minlength',
                    assertIs: function (value, args, basicAssert) {
                        var min = args[0];
                        basicAssert(value);
                        if (value.length === undefined) {
                            throw new TypeError('Length of `' + value + '` is undefined');
                        }
                        if (value.length < min) {
                            throw new TypeError('Length of `' + value + '` is less than ' + min);
                        }
                    },
                    from: function (value, basicFrom) {
                        return basicFrom(value);
                    },
                    metaImprover: function (minlength) {
                        return { minlength: minlength };
                    }
                });
            var max = buildModifier({
                    name: 'max',
                    assertIs: function (value, args, basicAssert) {
                        var max = args[0];
                        basicAssert(value);
                        if (value > max) {
                            throw new TypeError('`' + value + '` is greater than ' + max);
                        }
                    },
                    from: function (value, basicFrom) {
                        return basicFrom(value);
                    },
                    metaImprover: function (max) {
                        return { max: max };
                    }
                });
            var min = buildModifier({
                    name: 'min',
                    assertIs: function (value, args, basicAssert) {
                        var min = args[0];
                        basicAssert(value);
                        if (value < min) {
                            throw new TypeError('`' + value + '` is less than ' + min);
                        }
                    },
                    from: function (value, basicFrom) {
                        return basicFrom(value);
                    },
                    metaImprover: function (min) {
                        return { min: min };
                    }
                });
            var size = buildModifier({
                    name: 'size',
                    assertIs: function (value, args, basicAssert) {
                        var sz = args[0];
                        basicAssert(value);
                        if (value.length === undefined) {
                            throw new TypeError('Length of `' + value + '` is undefined');
                        }
                        if (value.length !== sz) {
                            throw new TypeError('Length of `' + value + '` is different than ' + sz);
                        }
                    },
                    from: function (value, basicFrom) {
                        return basicFrom(value);
                    },
                    metaImprover: function (size) {
                        return { size: size };
                    }
                });
            var optional = buildModifier({
                    name: 'optional',
                    assertIs: function (value, args, basicAssert) {
                        if (value !== null && value !== undefined) {
                            basicAssert(value);
                        }
                    },
                    from: function (value, basicFrom) {
                        return basicFrom(value);
                    },
                    metaImprover: function (minlength) {
                        return { optional: true };
                    }
                });
            var label = buildModifier({
                    name: '',
                    assertIs: function (value, args, basicAssert) {
                        basicAssert(value);
                    },
                    from: function (value, basicFrom) {
                        return basicFrom(value);
                    },
                    metaImprover: function (text) {
                        return { label: text };
                    }
                });
            var info = buildModifier({
                    name: '',
                    assertIs: function (value, args, basicAssert) {
                        basicAssert(value);
                    },
                    from: function (value, basicFrom) {
                        return basicFrom(value);
                    },
                    metaImprover: function (info) {
                        return info;
                    }
                });
            var validate = buildModifier({
                    name: 'validate',
                    assertIs: function (value, args, basicAssert) {
                        var validateFn = args[0];
                        var results = validateFn(value);
                        if (results) {
                            throw new TypeError(results);
                        }
                        basicAssert(value);
                    },
                    from: function (value, basicFrom) {
                        return basicFrom(value);
                    },
                    metaImprover: function (value) {
                        return {};
                    }
                });
            var defaultValue = buildModifier({
                    name: '',
                    assertIs: function (value, args, basicAssert) {
                        if (value !== null && value !== undefined) {
                            basicAssert(value);
                        }
                    },
                    from: function (value, basicFrom) {
                        if (value === null || value === undefined) {
                            return this.default;
                        }
                        return basicFrom(value);
                    },
                    metaImprover: function (value) {
                        return { default: value };
                    }
                });
            module.exports = mixinModifiers;
        },
        function (module, exports) {
            'use strict';
            module.exports = function setDeep(propertyPath, value) {
                var Type = this.constructor;
                if (!Type || !Type.meta || Type.meta.kind !== 'structure') {
                    throw new TypeError('setDeep context must be a struct');
                }
                var pathSegments = propertyPath.split('.');
                var pathObjects = [];
                var current = this;
                pathSegments.forEach(function (segment) {
                    pathObjects.push({
                        target: current,
                        property: segment
                    });
                    current = current[segment];
                });
                var i = pathObjects.length;
                var currentValue = value;
                var currentPath;
                while (i--) {
                    currentPath = pathObjects[i];
                    currentValue = currentPath.target.set(currentPath.property, currentValue);
                }
                return currentValue;
            };
        },
        function (module, exports) {
            'use strict';
            module.exports = struct;
            var util = _require(10);
            var mixinModifiers = _require(7);
            var namedFunction = util.namedFunction;
            var assign = _require(11);
            var threshold = 100;
            var setDeep = _require(8);
            var Fields = _require(3);
            var proto = struct.proto = {
                    _ver: 0,
                    debug: function () {
                        var result = '{\n';
                        var _this = this;
                        _this.constructor.meta.fields.forEach(function (f) {
                            result += '\t' + f.name + ': ' + _this[f.name] + ',\n';
                        });
                        result += '}\n';
                        console.log(result);
                    },
                    toJSON: function () {
                        var _this = this;
                        var pojo = _this.constructor.meta.fields.map(function (f) {
                                var prop = {};
                                prop[f.name] = _this[f.name];
                                return prop;
                            });
                        return assign.apply(null, [{}].concat(pojo));
                    },
                    set: function (propName, value) {
                        if (typeof propName === 'string' && propName.indexOf('.') !== -1) {
                            return setDeep.call(this, propName, value);
                        }
                        var operations = {};
                        if (arguments.length === 1 && typeof propName === 'object') {
                            var values = propName;
                            Object.keys(values).forEach(function (propName) {
                                operations[propName] = values[propName];
                            });
                        } else {
                            operations[propName] = value;
                        }
                        var _this = this;
                        var props = {
                                set: { value: proto.set },
                                _ver: { value: this._ver + 1 },
                                constructor: { value: this.constructor }
                            };
                        Object.keys(operations).forEach(function (propName) {
                            var value = operations[propName];
                            var Type = _this.constructor.props[propName];
                            if (Type.meta.kind === 'structure' && typeof value === 'object') {
                                value = new Type(value);
                            }
                            Type.assertIs(value);
                            props[propName] = { value: value };
                        });
                        var newObject = Object.create(this, props);
                        Object.freeze(newObject);
                        return newObject;
                    }
                };
            function struct(props, name) {
                var propNames = Object.keys(props);
                var typeName = name || 'ImmutableType';
                var Constructor = new namedFunction(typeName, function (value, unidempotent) {
                        if (!unidempotent && value instanceof Constructor) {
                            return value;
                        }
                        if (!(this instanceof Constructor)) {
                            return new Constructor(value);
                        }
                        value = value || {};
                        Constructor.assertValueIs(value);
                        propNames.forEach(function (propName) {
                            var Type = props[propName];
                            var kind = Type.meta.kind;
                            var vl = value[propName];
                            if (vl !== null && vl !== undefined) {
                                if (kind === 'primitive' || kind === 'any') {
                                    this[propName] = vl;
                                } else if (kind === 'structure') {
                                    this[propName] = new Type(vl);
                                } else {
                                    throw new Error('Unknown kind:', kind);
                                }
                            }
                        }.bind(this));
                        Object.freeze(this);
                    });
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
                propNames.forEach(function (propName) {
                    var meta = props[propName].meta;
                    meta.label = meta.label || labelize(propName);
                    fields[propName] = {
                        type: meta,
                        name: propName
                    };
                });
                Constructor.assertIs = function (value, name) {
                    if (!(value instanceof Constructor)) {
                        throw new TypeError(name + ' must be a ' + typeName + ' but got ' + value);
                    }
                };
                Constructor.assertValueIs = function (value, name) {
                    value = value || {};
                    if (typeof value !== 'object') {
                        throw new TypeError('You must supply an object to structures constructor');
                    }
                    var keys = Object.keys(value);
                    if (keys.length > propNames.length) {
                        throw new TypeError(typeName + '.' + name + ' expect ' + propNames.length + ' arguments, ' + keys.length + ' given:\n' + JSON.stringify(keys, null, 4));
                    }
                    propNames.forEach(function (propName) {
                        if (props[propName].meta.default) {
                            value[propName] = props[propName].meta.default;
                        }
                        if (!props[propName].meta.optional) {
                            if (props[propName].meta.kind === 'structure') {
                                props[propName].assertValueIs(value[propName], (name || '') + '.' + propName);
                            } else {
                                props[propName].assertIs(value[propName], (name || '') + '.' + propName);
                            }
                        }
                    });
                };
                Constructor.from = function (value) {
                    value = value || {};
                    propNames.forEach(function (propName) {
                        var propType = props[propName];
                        value[propName] = propType.from(value[propName]);
                    });
                    return new Constructor(value);
                };
                mixinModifiers(Constructor);
                return Constructor;
            }
            function labelize(name) {
                return name.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
                    return str.toUpperCase();
                });
            }
        },
        function (module, exports) {
            'use strict';
            module.exports = { namedFunction: namedFunction };
            function namedFunction(name, fn) {
                var cnstr;
                eval('cnstr = function ' + name + '(){' + (fn ? 'return fn.apply(this,arguments);' : '') + '}');
                return cnstr;
            }
        },
        function (module, exports) {
            'use strict';
            function ToObject(val) {
                if (val == null) {
                    throw new TypeError('Object.assign cannot be called with null or undefined');
                }
                return Object(val);
            }
            module.exports = Object.assign || function (target, source) {
                var pendingException;
                var from;
                var keys;
                var to = ToObject(target);
                for (var s = 1; s < arguments.length; s++) {
                    from = arguments[s];
                    keys = Object.keys(Object(from));
                    for (var i = 0; i < keys.length; i++) {
                        try {
                            to[keys[i]] = from[keys[i]];
                        } catch (err) {
                            if (pendingException === undefined) {
                                pendingException = err;
                            }
                        }
                    }
                }
                if (pendingException) {
                    throw pendingException;
                }
                return to;
            };
        }
    ];
    return _require(6);
}));