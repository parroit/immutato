(function (define) {
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
            mixinModifiers(immutato.Boolean);
        },
        function (module, exports) {
            var assign = _require(44);
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
                type.maxlength = maxlength;
                type.minlength = minlength;
                type.optional = optional;
                type.size = size;
                type.label = label;
                type.default = defaultValue;
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
            var assign = _require(44);
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
                        if (this._ver > 100) {
                            var clone = new this.constructor(this, 'not idempotent');
                            return clone.set(propName, value);
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
                        throw new TypeError(typeName + '.' + name + ' expect ' + propNames.length + ' arguments, ' + keys.length + ' given.');
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
            module.exports = _require(12);
        },
        function (module, exports) {
            var used = [], exports = module.exports = {};
            exports.version = '1.9.2';
            exports.AssertionError = _require(38);
            var util = _require(19);
            exports.use = function (fn) {
                if (!~used.indexOf(fn)) {
                    fn(this, util);
                    used.push(fn);
                }
                return this;
            };
            var config = _require(14);
            exports.config = config;
            var assertion = _require(13);
            exports.use(assertion);
            var core = _require(15);
            exports.use(core);
            var expect = _require(17);
            exports.use(expect);
            var should = _require(18);
            exports.use(should);
            var assert = _require(16);
            exports.use(assert);
        },
        function (module, exports) {
            var config = _require(14);
            module.exports = function (_chai, util) {
                var AssertionError = _chai.AssertionError, flag = util.flag;
                _chai.Assertion = Assertion;
                function Assertion(obj, msg, stack) {
                    flag(this, 'ssfi', stack || arguments.callee);
                    flag(this, 'object', obj);
                    flag(this, 'message', msg);
                }
                Object.defineProperty(Assertion, 'includeStack', {
                    get: function () {
                        console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
                        return config.includeStack;
                    },
                    set: function (value) {
                        console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
                        config.includeStack = value;
                    }
                });
                Object.defineProperty(Assertion, 'showDiff', {
                    get: function () {
                        console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
                        return config.showDiff;
                    },
                    set: function (value) {
                        console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
                        config.showDiff = value;
                    }
                });
                Assertion.addProperty = function (name, fn) {
                    util.addProperty(this.prototype, name, fn);
                };
                Assertion.addMethod = function (name, fn) {
                    util.addMethod(this.prototype, name, fn);
                };
                Assertion.addChainableMethod = function (name, fn, chainingBehavior) {
                    util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
                };
                Assertion.overwriteProperty = function (name, fn) {
                    util.overwriteProperty(this.prototype, name, fn);
                };
                Assertion.overwriteMethod = function (name, fn) {
                    util.overwriteMethod(this.prototype, name, fn);
                };
                Assertion.overwriteChainableMethod = function (name, fn, chainingBehavior) {
                    util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
                };
                Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {
                    var ok = util.test(this, arguments);
                    if (true !== showDiff)
                        showDiff = false;
                    if (true !== config.showDiff)
                        showDiff = false;
                    if (!ok) {
                        var msg = util.getMessage(this, arguments), actual = util.getActual(this, arguments);
                        throw new AssertionError(msg, {
                            actual: actual,
                            expected: expected,
                            showDiff: showDiff
                        }, config.includeStack ? this.assert : flag(this, 'ssfi'));
                    }
                };
                Object.defineProperty(Assertion.prototype, '_obj', {
                    get: function () {
                        return flag(this, 'object');
                    },
                    set: function (val) {
                        flag(this, 'object', val);
                    }
                });
            };
        },
        function (module, exports) {
            module.exports = {
                includeStack: false,
                showDiff: true,
                truncateThreshold: 40
            };
        },
        function (module, exports) {
            module.exports = function (chai, _) {
                var Assertion = chai.Assertion, toString = Object.prototype.toString, flag = _.flag;
                [
                    'to',
                    'be',
                    'been',
                    'is',
                    'and',
                    'has',
                    'have',
                    'with',
                    'that',
                    'at',
                    'of',
                    'same'
                ].forEach(function (chain) {
                    Assertion.addProperty(chain, function () {
                        return this;
                    });
                });
                Assertion.addProperty('not', function () {
                    flag(this, 'negate', true);
                });
                Assertion.addProperty('deep', function () {
                    flag(this, 'deep', true);
                });
                function an(type, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    type = type.toLowerCase();
                    var obj = flag(this, 'object'), article = ~[
                            'a',
                            'e',
                            'i',
                            'o',
                            'u'
                        ].indexOf(type.charAt(0)) ? 'an ' : 'a ';
                    this.assert(type === _.type(obj), 'expected #{this} to be ' + article + type, 'expected #{this} not to be ' + article + type);
                }
                Assertion.addChainableMethod('an', an);
                Assertion.addChainableMethod('a', an);
                function includeChainingBehavior() {
                    flag(this, 'contains', true);
                }
                function include(val, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    var expected = false;
                    if (_.type(obj) === 'array' && _.type(val) === 'object') {
                        for (var i in obj) {
                            if (_.eql(obj[i], val)) {
                                expected = true;
                                break;
                            }
                        }
                    } else if (_.type(val) === 'object') {
                        if (!flag(this, 'negate')) {
                            for (var k in val)
                                new Assertion(obj).property(k, val[k]);
                            return;
                        }
                        var subset = {};
                        for (var k in val)
                            subset[k] = obj[k];
                        expected = _.eql(subset, val);
                    } else {
                        expected = obj && ~obj.indexOf(val);
                    }
                    this.assert(expected, 'expected #{this} to include ' + _.inspect(val), 'expected #{this} to not include ' + _.inspect(val));
                }
                Assertion.addChainableMethod('include', include, includeChainingBehavior);
                Assertion.addChainableMethod('contain', include, includeChainingBehavior);
                Assertion.addProperty('ok', function () {
                    this.assert(flag(this, 'object'), 'expected #{this} to be truthy', 'expected #{this} to be falsy');
                });
                Assertion.addProperty('true', function () {
                    this.assert(true === flag(this, 'object'), 'expected #{this} to be true', 'expected #{this} to be false', this.negate ? false : true);
                });
                Assertion.addProperty('false', function () {
                    this.assert(false === flag(this, 'object'), 'expected #{this} to be false', 'expected #{this} to be true', this.negate ? true : false);
                });
                Assertion.addProperty('null', function () {
                    this.assert(null === flag(this, 'object'), 'expected #{this} to be null', 'expected #{this} not to be null');
                });
                Assertion.addProperty('undefined', function () {
                    this.assert(undefined === flag(this, 'object'), 'expected #{this} to be undefined', 'expected #{this} not to be undefined');
                });
                Assertion.addProperty('exist', function () {
                    this.assert(null != flag(this, 'object'), 'expected #{this} to exist', 'expected #{this} to not exist');
                });
                Assertion.addProperty('empty', function () {
                    var obj = flag(this, 'object'), expected = obj;
                    if (Array.isArray(obj) || 'string' === typeof object) {
                        expected = obj.length;
                    } else if (typeof obj === 'object') {
                        expected = Object.keys(obj).length;
                    }
                    this.assert(!expected, 'expected #{this} to be empty', 'expected #{this} not to be empty');
                });
                function checkArguments() {
                    var obj = flag(this, 'object'), type = Object.prototype.toString.call(obj);
                    this.assert('[object Arguments]' === type, 'expected #{this} to be arguments but got ' + type, 'expected #{this} to not be arguments');
                }
                Assertion.addProperty('arguments', checkArguments);
                Assertion.addProperty('Arguments', checkArguments);
                function assertEqual(val, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    if (flag(this, 'deep')) {
                        return this.eql(val);
                    } else {
                        this.assert(val === obj, 'expected #{this} to equal #{exp}', 'expected #{this} to not equal #{exp}', val, this._obj, true);
                    }
                }
                Assertion.addMethod('equal', assertEqual);
                Assertion.addMethod('equals', assertEqual);
                Assertion.addMethod('eq', assertEqual);
                function assertEql(obj, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    this.assert(_.eql(obj, flag(this, 'object')), 'expected #{this} to deeply equal #{exp}', 'expected #{this} to not deeply equal #{exp}', obj, this._obj, true);
                }
                Assertion.addMethod('eql', assertEql);
                Assertion.addMethod('eqls', assertEql);
                function assertAbove(n, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    if (flag(this, 'doLength')) {
                        new Assertion(obj, msg).to.have.property('length');
                        var len = obj.length;
                        this.assert(len > n, 'expected #{this} to have a length above #{exp} but got #{act}', 'expected #{this} to not have a length above #{exp}', n, len);
                    } else {
                        this.assert(obj > n, 'expected #{this} to be above ' + n, 'expected #{this} to be at most ' + n);
                    }
                }
                Assertion.addMethod('above', assertAbove);
                Assertion.addMethod('gt', assertAbove);
                Assertion.addMethod('greaterThan', assertAbove);
                function assertLeast(n, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    if (flag(this, 'doLength')) {
                        new Assertion(obj, msg).to.have.property('length');
                        var len = obj.length;
                        this.assert(len >= n, 'expected #{this} to have a length at least #{exp} but got #{act}', 'expected #{this} to have a length below #{exp}', n, len);
                    } else {
                        this.assert(obj >= n, 'expected #{this} to be at least ' + n, 'expected #{this} to be below ' + n);
                    }
                }
                Assertion.addMethod('least', assertLeast);
                Assertion.addMethod('gte', assertLeast);
                function assertBelow(n, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    if (flag(this, 'doLength')) {
                        new Assertion(obj, msg).to.have.property('length');
                        var len = obj.length;
                        this.assert(len < n, 'expected #{this} to have a length below #{exp} but got #{act}', 'expected #{this} to not have a length below #{exp}', n, len);
                    } else {
                        this.assert(obj < n, 'expected #{this} to be below ' + n, 'expected #{this} to be at least ' + n);
                    }
                }
                Assertion.addMethod('below', assertBelow);
                Assertion.addMethod('lt', assertBelow);
                Assertion.addMethod('lessThan', assertBelow);
                function assertMost(n, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    if (flag(this, 'doLength')) {
                        new Assertion(obj, msg).to.have.property('length');
                        var len = obj.length;
                        this.assert(len <= n, 'expected #{this} to have a length at most #{exp} but got #{act}', 'expected #{this} to have a length above #{exp}', n, len);
                    } else {
                        this.assert(obj <= n, 'expected #{this} to be at most ' + n, 'expected #{this} to be above ' + n);
                    }
                }
                Assertion.addMethod('most', assertMost);
                Assertion.addMethod('lte', assertMost);
                Assertion.addMethod('within', function (start, finish, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object'), range = start + '..' + finish;
                    if (flag(this, 'doLength')) {
                        new Assertion(obj, msg).to.have.property('length');
                        var len = obj.length;
                        this.assert(len >= start && len <= finish, 'expected #{this} to have a length within ' + range, 'expected #{this} to not have a length within ' + range);
                    } else {
                        this.assert(obj >= start && obj <= finish, 'expected #{this} to be within ' + range, 'expected #{this} to not be within ' + range);
                    }
                });
                function assertInstanceOf(constructor, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var name = _.getName(constructor);
                    this.assert(flag(this, 'object') instanceof constructor, 'expected #{this} to be an instance of ' + name, 'expected #{this} to not be an instance of ' + name);
                }
                ;
                Assertion.addMethod('instanceof', assertInstanceOf);
                Assertion.addMethod('instanceOf', assertInstanceOf);
                Assertion.addMethod('property', function (name, val, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var descriptor = flag(this, 'deep') ? 'deep property ' : 'property ', negate = flag(this, 'negate'), obj = flag(this, 'object'), value = flag(this, 'deep') ? _.getPathValue(name, obj) : obj[name];
                    if (negate && undefined !== val) {
                        if (undefined === value) {
                            msg = msg != null ? msg + ': ' : '';
                            throw new Error(msg + _.inspect(obj) + ' has no ' + descriptor + _.inspect(name));
                        }
                    } else {
                        this.assert(undefined !== value, 'expected #{this} to have a ' + descriptor + _.inspect(name), 'expected #{this} to not have ' + descriptor + _.inspect(name));
                    }
                    if (undefined !== val) {
                        this.assert(val === value, 'expected #{this} to have a ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}', 'expected #{this} to not have a ' + descriptor + _.inspect(name) + ' of #{act}', val, value);
                    }
                    flag(this, 'object', value);
                });
                function assertOwnProperty(name, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    this.assert(obj.hasOwnProperty(name), 'expected #{this} to have own property ' + _.inspect(name), 'expected #{this} to not have own property ' + _.inspect(name));
                }
                Assertion.addMethod('ownProperty', assertOwnProperty);
                Assertion.addMethod('haveOwnProperty', assertOwnProperty);
                function assertLengthChain() {
                    flag(this, 'doLength', true);
                }
                function assertLength(n, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    new Assertion(obj, msg).to.have.property('length');
                    var len = obj.length;
                    this.assert(len == n, 'expected #{this} to have a length of #{exp} but got #{act}', 'expected #{this} to not have a length of #{act}', n, len);
                }
                Assertion.addChainableMethod('length', assertLength, assertLengthChain);
                Assertion.addMethod('lengthOf', assertLength);
                Assertion.addMethod('match', function (re, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    this.assert(re.exec(obj), 'expected #{this} to match ' + re, 'expected #{this} not to match ' + re);
                });
                Assertion.addMethod('string', function (str, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    new Assertion(obj, msg).is.a('string');
                    this.assert(~obj.indexOf(str), 'expected #{this} to contain ' + _.inspect(str), 'expected #{this} to not contain ' + _.inspect(str));
                });
                function assertKeys(keys) {
                    var obj = flag(this, 'object'), str, ok = true;
                    keys = keys instanceof Array ? keys : Array.prototype.slice.call(arguments);
                    if (!keys.length)
                        throw new Error('keys required');
                    var actual = Object.keys(obj), expected = keys, len = keys.length;
                    ok = keys.every(function (key) {
                        return ~actual.indexOf(key);
                    });
                    if (!flag(this, 'negate') && !flag(this, 'contains')) {
                        ok = ok && keys.length == actual.length;
                    }
                    if (len > 1) {
                        keys = keys.map(function (key) {
                            return _.inspect(key);
                        });
                        var last = keys.pop();
                        str = keys.join(', ') + ', and ' + last;
                    } else {
                        str = _.inspect(keys[0]);
                    }
                    str = (len > 1 ? 'keys ' : 'key ') + str;
                    str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;
                    this.assert(ok, 'expected #{this} to ' + str, 'expected #{this} to not ' + str, expected.sort(), actual.sort(), true);
                }
                Assertion.addMethod('keys', assertKeys);
                Assertion.addMethod('key', assertKeys);
                function assertThrows(constructor, errMsg, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    new Assertion(obj, msg).is.a('function');
                    var thrown = false, desiredError = null, name = null, thrownError = null;
                    if (arguments.length === 0) {
                        errMsg = null;
                        constructor = null;
                    } else if (constructor && (constructor instanceof RegExp || 'string' === typeof constructor)) {
                        errMsg = constructor;
                        constructor = null;
                    } else if (constructor && constructor instanceof Error) {
                        desiredError = constructor;
                        constructor = null;
                        errMsg = null;
                    } else if (typeof constructor === 'function') {
                        name = constructor.prototype.name || constructor.name;
                        if (name === 'Error' && constructor !== Error) {
                            name = new constructor().name;
                        }
                    } else {
                        constructor = null;
                    }
                    try {
                        obj();
                    } catch (err) {
                        if (desiredError) {
                            this.assert(err === desiredError, 'expected #{this} to throw #{exp} but #{act} was thrown', 'expected #{this} to not throw #{exp}', desiredError instanceof Error ? desiredError.toString() : desiredError, err instanceof Error ? err.toString() : err);
                            flag(this, 'object', err);
                            return this;
                        }
                        if (constructor) {
                            this.assert(err instanceof constructor, 'expected #{this} to throw #{exp} but #{act} was thrown', 'expected #{this} to not throw #{exp} but #{act} was thrown', name, err instanceof Error ? err.toString() : err);
                            if (!errMsg) {
                                flag(this, 'object', err);
                                return this;
                            }
                        }
                        var message = 'object' === _.type(err) && 'message' in err ? err.message : '' + err;
                        if (message != null && errMsg && errMsg instanceof RegExp) {
                            this.assert(errMsg.exec(message), 'expected #{this} to throw error matching #{exp} but got #{act}', 'expected #{this} to throw error not matching #{exp}', errMsg, message);
                            flag(this, 'object', err);
                            return this;
                        } else if (message != null && errMsg && 'string' === typeof errMsg) {
                            this.assert(~message.indexOf(errMsg), 'expected #{this} to throw error including #{exp} but got #{act}', 'expected #{this} to throw error not including #{act}', errMsg, message);
                            flag(this, 'object', err);
                            return this;
                        } else {
                            thrown = true;
                            thrownError = err;
                        }
                    }
                    var actuallyGot = '', expectedThrown = name !== null ? name : desiredError ? '#{exp}' : 'an error';
                    if (thrown) {
                        actuallyGot = ' but #{act} was thrown';
                    }
                    this.assert(thrown === true, 'expected #{this} to throw ' + expectedThrown + actuallyGot, 'expected #{this} to not throw ' + expectedThrown + actuallyGot, desiredError instanceof Error ? desiredError.toString() : desiredError, thrownError instanceof Error ? thrownError.toString() : thrownError);
                    flag(this, 'object', thrownError);
                }
                ;
                Assertion.addMethod('throw', assertThrows);
                Assertion.addMethod('throws', assertThrows);
                Assertion.addMethod('Throw', assertThrows);
                Assertion.addMethod('respondTo', function (method, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object'), itself = flag(this, 'itself'), context = 'function' === _.type(obj) && !itself ? obj.prototype[method] : obj[method];
                    this.assert('function' === typeof context, 'expected #{this} to respond to ' + _.inspect(method), 'expected #{this} to not respond to ' + _.inspect(method));
                });
                Assertion.addProperty('itself', function () {
                    flag(this, 'itself', true);
                });
                Assertion.addMethod('satisfy', function (matcher, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    var result = matcher(obj);
                    this.assert(result, 'expected #{this} to satisfy ' + _.objDisplay(matcher), 'expected #{this} to not satisfy' + _.objDisplay(matcher), this.negate ? false : true, result);
                });
                Assertion.addMethod('closeTo', function (expected, delta, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    new Assertion(obj, msg).is.a('number');
                    if (_.type(expected) !== 'number' || _.type(delta) !== 'number') {
                        throw new Error('the arguments to closeTo must be numbers');
                    }
                    this.assert(Math.abs(obj - expected) <= delta, 'expected #{this} to be close to ' + expected + ' +/- ' + delta, 'expected #{this} not to be close to ' + expected + ' +/- ' + delta);
                });
                function isSubsetOf(subset, superset, cmp) {
                    return subset.every(function (elem) {
                        if (!cmp)
                            return superset.indexOf(elem) !== -1;
                        return superset.some(function (elem2) {
                            return cmp(elem, elem2);
                        });
                    });
                }
                Assertion.addMethod('members', function (subset, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    new Assertion(obj).to.be.an('array');
                    new Assertion(subset).to.be.an('array');
                    var cmp = flag(this, 'deep') ? _.eql : undefined;
                    if (flag(this, 'contains')) {
                        return this.assert(isSubsetOf(subset, obj, cmp), 'expected #{this} to be a superset of #{act}', 'expected #{this} to not be a superset of #{act}', obj, subset);
                    }
                    this.assert(isSubsetOf(obj, subset, cmp) && isSubsetOf(subset, obj, cmp), 'expected #{this} to have the same members as #{act}', 'expected #{this} to not have the same members as #{act}', obj, subset);
                });
            };
        },
        function (module, exports) {
            module.exports = function (chai, util) {
                var Assertion = chai.Assertion, flag = util.flag;
                var assert = chai.assert = function (express, errmsg) {
                        var test = new Assertion(null, null, chai.assert);
                        test.assert(express, errmsg, '[ negation message unavailable ]');
                    };
                assert.fail = function (actual, expected, message, operator) {
                    message = message || 'assert.fail()';
                    throw new chai.AssertionError(message, {
                        actual: actual,
                        expected: expected,
                        operator: operator
                    }, assert.fail);
                };
                assert.ok = function (val, msg) {
                    new Assertion(val, msg).is.ok;
                };
                assert.notOk = function (val, msg) {
                    new Assertion(val, msg).is.not.ok;
                };
                assert.equal = function (act, exp, msg) {
                    var test = new Assertion(act, msg, assert.equal);
                    test.assert(exp == flag(test, 'object'), 'expected #{this} to equal #{exp}', 'expected #{this} to not equal #{act}', exp, act);
                };
                assert.notEqual = function (act, exp, msg) {
                    var test = new Assertion(act, msg, assert.notEqual);
                    test.assert(exp != flag(test, 'object'), 'expected #{this} to not equal #{exp}', 'expected #{this} to equal #{act}', exp, act);
                };
                assert.strictEqual = function (act, exp, msg) {
                    new Assertion(act, msg).to.equal(exp);
                };
                assert.notStrictEqual = function (act, exp, msg) {
                    new Assertion(act, msg).to.not.equal(exp);
                };
                assert.deepEqual = function (act, exp, msg) {
                    new Assertion(act, msg).to.eql(exp);
                };
                assert.notDeepEqual = function (act, exp, msg) {
                    new Assertion(act, msg).to.not.eql(exp);
                };
                assert.isTrue = function (val, msg) {
                    new Assertion(val, msg).is['true'];
                };
                assert.isFalse = function (val, msg) {
                    new Assertion(val, msg).is['false'];
                };
                assert.isNull = function (val, msg) {
                    new Assertion(val, msg).to.equal(null);
                };
                assert.isNotNull = function (val, msg) {
                    new Assertion(val, msg).to.not.equal(null);
                };
                assert.isUndefined = function (val, msg) {
                    new Assertion(val, msg).to.equal(undefined);
                };
                assert.isDefined = function (val, msg) {
                    new Assertion(val, msg).to.not.equal(undefined);
                };
                assert.isFunction = function (val, msg) {
                    new Assertion(val, msg).to.be.a('function');
                };
                assert.isNotFunction = function (val, msg) {
                    new Assertion(val, msg).to.not.be.a('function');
                };
                assert.isObject = function (val, msg) {
                    new Assertion(val, msg).to.be.a('object');
                };
                assert.isNotObject = function (val, msg) {
                    new Assertion(val, msg).to.not.be.a('object');
                };
                assert.isArray = function (val, msg) {
                    new Assertion(val, msg).to.be.an('array');
                };
                assert.isNotArray = function (val, msg) {
                    new Assertion(val, msg).to.not.be.an('array');
                };
                assert.isString = function (val, msg) {
                    new Assertion(val, msg).to.be.a('string');
                };
                assert.isNotString = function (val, msg) {
                    new Assertion(val, msg).to.not.be.a('string');
                };
                assert.isNumber = function (val, msg) {
                    new Assertion(val, msg).to.be.a('number');
                };
                assert.isNotNumber = function (val, msg) {
                    new Assertion(val, msg).to.not.be.a('number');
                };
                assert.isBoolean = function (val, msg) {
                    new Assertion(val, msg).to.be.a('boolean');
                };
                assert.isNotBoolean = function (val, msg) {
                    new Assertion(val, msg).to.not.be.a('boolean');
                };
                assert.typeOf = function (val, type, msg) {
                    new Assertion(val, msg).to.be.a(type);
                };
                assert.notTypeOf = function (val, type, msg) {
                    new Assertion(val, msg).to.not.be.a(type);
                };
                assert.instanceOf = function (val, type, msg) {
                    new Assertion(val, msg).to.be.instanceOf(type);
                };
                assert.notInstanceOf = function (val, type, msg) {
                    new Assertion(val, msg).to.not.be.instanceOf(type);
                };
                assert.include = function (exp, inc, msg) {
                    new Assertion(exp, msg, assert.include).include(inc);
                };
                assert.notInclude = function (exp, inc, msg) {
                    new Assertion(exp, msg, assert.notInclude).not.include(inc);
                };
                assert.match = function (exp, re, msg) {
                    new Assertion(exp, msg).to.match(re);
                };
                assert.notMatch = function (exp, re, msg) {
                    new Assertion(exp, msg).to.not.match(re);
                };
                assert.property = function (obj, prop, msg) {
                    new Assertion(obj, msg).to.have.property(prop);
                };
                assert.notProperty = function (obj, prop, msg) {
                    new Assertion(obj, msg).to.not.have.property(prop);
                };
                assert.deepProperty = function (obj, prop, msg) {
                    new Assertion(obj, msg).to.have.deep.property(prop);
                };
                assert.notDeepProperty = function (obj, prop, msg) {
                    new Assertion(obj, msg).to.not.have.deep.property(prop);
                };
                assert.propertyVal = function (obj, prop, val, msg) {
                    new Assertion(obj, msg).to.have.property(prop, val);
                };
                assert.propertyNotVal = function (obj, prop, val, msg) {
                    new Assertion(obj, msg).to.not.have.property(prop, val);
                };
                assert.deepPropertyVal = function (obj, prop, val, msg) {
                    new Assertion(obj, msg).to.have.deep.property(prop, val);
                };
                assert.deepPropertyNotVal = function (obj, prop, val, msg) {
                    new Assertion(obj, msg).to.not.have.deep.property(prop, val);
                };
                assert.lengthOf = function (exp, len, msg) {
                    new Assertion(exp, msg).to.have.length(len);
                };
                assert.Throw = function (fn, errt, errs, msg) {
                    if ('string' === typeof errt || errt instanceof RegExp) {
                        errs = errt;
                        errt = null;
                    }
                    var assertErr = new Assertion(fn, msg).to.Throw(errt, errs);
                    return flag(assertErr, 'object');
                };
                assert.doesNotThrow = function (fn, type, msg) {
                    if ('string' === typeof type) {
                        msg = type;
                        type = null;
                    }
                    new Assertion(fn, msg).to.not.Throw(type);
                };
                assert.operator = function (val, operator, val2, msg) {
                    if (!~[
                            '==',
                            '===',
                            '>',
                            '>=',
                            '<',
                            '<=',
                            '!=',
                            '!=='
                        ].indexOf(operator)) {
                        throw new Error('Invalid operator "' + operator + '"');
                    }
                    var test = new Assertion(eval(val + operator + val2), msg);
                    test.assert(true === flag(test, 'object'), 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2), 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2));
                };
                assert.closeTo = function (act, exp, delta, msg) {
                    new Assertion(act, msg).to.be.closeTo(exp, delta);
                };
                assert.sameMembers = function (set1, set2, msg) {
                    new Assertion(set1, msg).to.have.same.members(set2);
                };
                assert.includeMembers = function (superset, subset, msg) {
                    new Assertion(superset, msg).to.include.members(subset);
                };
                assert.ifError = function (val, msg) {
                    new Assertion(val, msg).to.not.be.ok;
                };
                (function alias(name, as) {
                    assert[as] = assert[name];
                    return alias;
                }('Throw', 'throw')('Throw', 'throws'));
            };
        },
        function (module, exports) {
            module.exports = function (chai, util) {
                chai.expect = function (val, message) {
                    return new chai.Assertion(val, message);
                };
            };
        },
        function (module, exports) {
            module.exports = function (chai, util) {
                var Assertion = chai.Assertion;
                function loadShould() {
                    function shouldGetter() {
                        if (this instanceof String || this instanceof Number) {
                            return new Assertion(this.constructor(this), null, shouldGetter);
                        } else if (this instanceof Boolean) {
                            return new Assertion(this == true, null, shouldGetter);
                        }
                        return new Assertion(this, null, shouldGetter);
                    }
                    function shouldSetter(value) {
                        Object.defineProperty(this, 'should', {
                            value: value,
                            enumerable: true,
                            configurable: true,
                            writable: true
                        });
                    }
                    Object.defineProperty(Object.prototype, 'should', {
                        set: shouldSetter,
                        get: shouldGetter,
                        configurable: true
                    });
                    var should = {};
                    should.equal = function (val1, val2, msg) {
                        new Assertion(val1, msg).to.equal(val2);
                    };
                    should.Throw = function (fn, errt, errs, msg) {
                        new Assertion(fn, msg).to.Throw(errt, errs);
                    };
                    should.exist = function (val, msg) {
                        new Assertion(val, msg).to.exist;
                    };
                    should.not = {};
                    should.not.equal = function (val1, val2, msg) {
                        new Assertion(val1, msg).to.not.equal(val2);
                    };
                    should.not.Throw = function (fn, errt, errs, msg) {
                        new Assertion(fn, msg).to.not.Throw(errt, errs);
                    };
                    should.not.exist = function (val, msg) {
                        new Assertion(val, msg).to.not.exist;
                    };
                    should['throw'] = should['Throw'];
                    should.not['throw'] = should.not['Throw'];
                    return should;
                }
                ;
                chai.should = loadShould;
                chai.Should = loadShould;
            };
        },
        function (module, exports) {
            var exports = module.exports = {};
            exports.test = _require(35);
            exports.type = _require(37);
            exports.getMessage = _require(26);
            exports.getActual = _require(24);
            exports.inspect = _require(30);
            exports.objDisplay = _require(31);
            exports.flag = _require(23);
            exports.transferFlags = _require(36);
            exports.eql = _require(39);
            exports.getPathValue = _require(28);
            exports.getName = _require(27);
            exports.addProperty = _require(22);
            exports.addMethod = _require(21);
            exports.overwriteProperty = _require(34);
            exports.overwriteMethod = _require(33);
            exports.addChainableMethod = _require(20);
            exports.overwriteChainableMethod = _require(32);
        },
        function (module, exports) {
            var transferFlags = _require(36);
            var flag = _require(23);
            var config = _require(14);
            var hasProtoSupport = '__proto__' in Object;
            var excludeNames = /^(?:length|name|arguments|caller)$/;
            var call = Function.prototype.call, apply = Function.prototype.apply;
            module.exports = function (ctx, name, method, chainingBehavior) {
                if (typeof chainingBehavior !== 'function') {
                    chainingBehavior = function () {
                    };
                }
                var chainableBehavior = {
                        method: method,
                        chainingBehavior: chainingBehavior
                    };
                if (!ctx.__methods) {
                    ctx.__methods = {};
                }
                ctx.__methods[name] = chainableBehavior;
                Object.defineProperty(ctx, name, {
                    get: function () {
                        chainableBehavior.chainingBehavior.call(this);
                        var assert = function assert() {
                            var old_ssfi = flag(this, 'ssfi');
                            if (old_ssfi && config.includeStack === false)
                                flag(this, 'ssfi', assert);
                            var result = chainableBehavior.method.apply(this, arguments);
                            return result === undefined ? this : result;
                        };
                        if (hasProtoSupport) {
                            var prototype = assert.__proto__ = Object.create(this);
                            prototype.call = call;
                            prototype.apply = apply;
                        } else {
                            var asserterNames = Object.getOwnPropertyNames(ctx);
                            asserterNames.forEach(function (asserterName) {
                                if (!excludeNames.test(asserterName)) {
                                    var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
                                    Object.defineProperty(assert, asserterName, pd);
                                }
                            });
                        }
                        transferFlags(this, assert);
                        return assert;
                    },
                    configurable: true
                });
            };
        },
        function (module, exports) {
            var config = _require(14);
            var flag = _require(23);
            module.exports = function (ctx, name, method) {
                ctx[name] = function () {
                    var old_ssfi = flag(this, 'ssfi');
                    if (old_ssfi && config.includeStack === false)
                        flag(this, 'ssfi', ctx[name]);
                    var result = method.apply(this, arguments);
                    return result === undefined ? this : result;
                };
            };
        },
        function (module, exports) {
            module.exports = function (ctx, name, getter) {
                Object.defineProperty(ctx, name, {
                    get: function () {
                        var result = getter.call(this);
                        return result === undefined ? this : result;
                    },
                    configurable: true
                });
            };
        },
        function (module, exports) {
            module.exports = function (obj, key, value) {
                var flags = obj.__flags || (obj.__flags = Object.create(null));
                if (arguments.length === 3) {
                    flags[key] = value;
                } else {
                    return flags[key];
                }
            };
        },
        function (module, exports) {
            module.exports = function (obj, args) {
                return args.length > 4 ? args[4] : obj._obj;
            };
        },
        function (module, exports) {
            module.exports = function getEnumerableProperties(object) {
                var result = [];
                for (var name in object) {
                    result.push(name);
                }
                return result;
            };
        },
        function (module, exports) {
            var flag = _require(23), getActual = _require(24), inspect = _require(30), objDisplay = _require(31);
            module.exports = function (obj, args) {
                var negate = flag(obj, 'negate'), val = flag(obj, 'object'), expected = args[3], actual = getActual(obj, args), msg = negate ? args[2] : args[1], flagMsg = flag(obj, 'message');
                if (typeof msg === 'function')
                    msg = msg();
                msg = msg || '';
                msg = msg.replace(/#{this}/g, objDisplay(val)).replace(/#{act}/g, objDisplay(actual)).replace(/#{exp}/g, objDisplay(expected));
                return flagMsg ? flagMsg + ': ' + msg : msg;
            };
        },
        function (module, exports) {
            module.exports = function (func) {
                if (func.name)
                    return func.name;
                var match = /^\s?function ([^(]*)\(/.exec(func);
                return match && match[1] ? match[1] : '';
            };
        },
        function (module, exports) {
            var getPathValue = module.exports = function (path, obj) {
                    var parsed = parsePath(path);
                    return _getPathValue(parsed, obj);
                };
            function parsePath(path) {
                var str = path.replace(/\[/g, '.['), parts = str.match(/(\\\.|[^.]+?)+/g);
                return parts.map(function (value) {
                    var re = /\[(\d+)\]$/, mArr = re.exec(value);
                    if (mArr)
                        return { i: parseFloat(mArr[1]) };
                    else
                        return { p: value };
                });
            }
            ;
            function _getPathValue(parsed, obj) {
                var tmp = obj, res;
                for (var i = 0, l = parsed.length; i < l; i++) {
                    var part = parsed[i];
                    if (tmp) {
                        if ('undefined' !== typeof part.p)
                            tmp = tmp[part.p];
                        else if ('undefined' !== typeof part.i)
                            tmp = tmp[part.i];
                        if (i == l - 1)
                            res = tmp;
                    } else {
                        res = undefined;
                    }
                }
                return res;
            }
            ;
        },
        function (module, exports) {
            module.exports = function getProperties(object) {
                var result = Object.getOwnPropertyNames(subject);
                function addProperty(property) {
                    if (result.indexOf(property) === -1) {
                        result.push(property);
                    }
                }
                var proto = Object.getPrototypeOf(subject);
                while (proto !== null) {
                    Object.getOwnPropertyNames(proto).forEach(addProperty);
                    proto = Object.getPrototypeOf(proto);
                }
                return result;
            };
        },
        function (module, exports) {
            var getName = _require(27);
            var getProperties = _require(29);
            var getEnumerableProperties = _require(25);
            module.exports = inspect;
            function inspect(obj, showHidden, depth, colors) {
                var ctx = {
                        showHidden: showHidden,
                        seen: [],
                        stylize: function (str) {
                            return str;
                        }
                    };
                return formatValue(ctx, obj, typeof depth === 'undefined' ? 2 : depth);
            }
            var isDOMElement = function (object) {
                if (typeof HTMLElement === 'object') {
                    return object instanceof HTMLElement;
                } else {
                    return object && typeof object === 'object' && object.nodeType === 1 && typeof object.nodeName === 'string';
                }
            };
            function formatValue(ctx, value, recurseTimes) {
                if (value && typeof value.inspect === 'function' && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
                    var ret = value.inspect(recurseTimes);
                    if (typeof ret !== 'string') {
                        ret = formatValue(ctx, ret, recurseTimes);
                    }
                    return ret;
                }
                var primitive = formatPrimitive(ctx, value);
                if (primitive) {
                    return primitive;
                }
                if (isDOMElement(value)) {
                    if ('outerHTML' in value) {
                        return value.outerHTML;
                    } else {
                        try {
                            if (document.xmlVersion) {
                                var xmlSerializer = new XMLSerializer();
                                return xmlSerializer.serializeToString(value);
                            } else {
                                var ns = 'http://www.w3.org/1999/xhtml';
                                var container = document.createElementNS(ns, '_');
                                container.appendChild(value.cloneNode(false));
                                html = container.innerHTML.replace('><', '>' + value.innerHTML + '<');
                                container.innerHTML = '';
                                return html;
                            }
                        } catch (err) {
                        }
                    }
                }
                var visibleKeys = getEnumerableProperties(value);
                var keys = ctx.showHidden ? getProperties(value) : visibleKeys;
                if (keys.length === 0 || isError(value) && (keys.length === 1 && keys[0] === 'stack' || keys.length === 2 && keys[0] === 'description' && keys[1] === 'stack')) {
                    if (typeof value === 'function') {
                        var name = getName(value);
                        var nameSuffix = name ? ': ' + name : '';
                        return ctx.stylize('[Function' + nameSuffix + ']', 'special');
                    }
                    if (isRegExp(value)) {
                        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                    }
                    if (isDate(value)) {
                        return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');
                    }
                    if (isError(value)) {
                        return formatError(value);
                    }
                }
                var base = '', array = false, braces = [
                        '{',
                        '}'
                    ];
                if (isArray(value)) {
                    array = true;
                    braces = [
                        '[',
                        ']'
                    ];
                }
                if (typeof value === 'function') {
                    var name = getName(value);
                    var nameSuffix = name ? ': ' + name : '';
                    base = ' [Function' + nameSuffix + ']';
                }
                if (isRegExp(value)) {
                    base = ' ' + RegExp.prototype.toString.call(value);
                }
                if (isDate(value)) {
                    base = ' ' + Date.prototype.toUTCString.call(value);
                }
                if (isError(value)) {
                    return formatError(value);
                }
                if (keys.length === 0 && (!array || value.length == 0)) {
                    return braces[0] + base + braces[1];
                }
                if (recurseTimes < 0) {
                    if (isRegExp(value)) {
                        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                    } else {
                        return ctx.stylize('[Object]', 'special');
                    }
                }
                ctx.seen.push(value);
                var output;
                if (array) {
                    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
                } else {
                    output = keys.map(function (key) {
                        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
                    });
                }
                ctx.seen.pop();
                return reduceToSingleString(output, base, braces);
            }
            function formatPrimitive(ctx, value) {
                switch (typeof value) {
                case 'undefined':
                    return ctx.stylize('undefined', 'undefined');
                case 'string':
                    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, '\\\'').replace(/\\"/g, '"') + '\'';
                    return ctx.stylize(simple, 'string');
                case 'number':
                    return ctx.stylize('' + value, 'number');
                case 'boolean':
                    return ctx.stylize('' + value, 'boolean');
                }
                if (value === null) {
                    return ctx.stylize('null', 'null');
                }
            }
            function formatError(value) {
                return '[' + Error.prototype.toString.call(value) + ']';
            }
            function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                var output = [];
                for (var i = 0, l = value.length; i < l; ++i) {
                    if (Object.prototype.hasOwnProperty.call(value, String(i))) {
                        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
                    } else {
                        output.push('');
                    }
                }
                keys.forEach(function (key) {
                    if (!key.match(/^\d+$/)) {
                        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
                    }
                });
                return output;
            }
            function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                var name, str;
                if (value.__lookupGetter__) {
                    if (value.__lookupGetter__(key)) {
                        if (value.__lookupSetter__(key)) {
                            str = ctx.stylize('[Getter/Setter]', 'special');
                        } else {
                            str = ctx.stylize('[Getter]', 'special');
                        }
                    } else {
                        if (value.__lookupSetter__(key)) {
                            str = ctx.stylize('[Setter]', 'special');
                        }
                    }
                }
                if (visibleKeys.indexOf(key) < 0) {
                    name = '[' + key + ']';
                }
                if (!str) {
                    if (ctx.seen.indexOf(value[key]) < 0) {
                        if (recurseTimes === null) {
                            str = formatValue(ctx, value[key], null);
                        } else {
                            str = formatValue(ctx, value[key], recurseTimes - 1);
                        }
                        if (str.indexOf('\n') > -1) {
                            if (array) {
                                str = str.split('\n').map(function (line) {
                                    return '  ' + line;
                                }).join('\n').substr(2);
                            } else {
                                str = '\n' + str.split('\n').map(function (line) {
                                    return '   ' + line;
                                }).join('\n');
                            }
                        }
                    } else {
                        str = ctx.stylize('[Circular]', 'special');
                    }
                }
                if (typeof name === 'undefined') {
                    if (array && key.match(/^\d+$/)) {
                        return str;
                    }
                    name = JSON.stringify('' + key);
                    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                        name = name.substr(1, name.length - 2);
                        name = ctx.stylize(name, 'name');
                    } else {
                        name = name.replace(/'/g, '\\\'').replace(/\\"/g, '"').replace(/(^"|"$)/g, '\'');
                        name = ctx.stylize(name, 'string');
                    }
                }
                return name + ': ' + str;
            }
            function reduceToSingleString(output, base, braces) {
                var numLinesEst = 0;
                var length = output.reduce(function (prev, cur) {
                        numLinesEst++;
                        if (cur.indexOf('\n') >= 0)
                            numLinesEst++;
                        return prev + cur.length + 1;
                    }, 0);
                if (length > 60) {
                    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
                }
                return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
            }
            function isArray(ar) {
                return Array.isArray(ar) || typeof ar === 'object' && objectToString(ar) === '[object Array]';
            }
            function isRegExp(re) {
                return typeof re === 'object' && objectToString(re) === '[object RegExp]';
            }
            function isDate(d) {
                return typeof d === 'object' && objectToString(d) === '[object Date]';
            }
            function isError(e) {
                return typeof e === 'object' && objectToString(e) === '[object Error]';
            }
            function objectToString(o) {
                return Object.prototype.toString.call(o);
            }
        },
        function (module, exports) {
            var inspect = _require(30);
            var config = _require(14);
            module.exports = function (obj) {
                var str = inspect(obj), type = Object.prototype.toString.call(obj);
                if (config.truncateThreshold && str.length >= config.truncateThreshold) {
                    if (type === '[object Function]') {
                        return !obj.name || obj.name === '' ? '[Function]' : '[Function: ' + obj.name + ']';
                    } else if (type === '[object Array]') {
                        return '[ Array(' + obj.length + ') ]';
                    } else if (type === '[object Object]') {
                        var keys = Object.keys(obj), kstr = keys.length > 2 ? keys.splice(0, 2).join(', ') + ', ...' : keys.join(', ');
                        return '{ Object (' + kstr + ') }';
                    } else {
                        return str;
                    }
                } else {
                    return str;
                }
            };
        },
        function (module, exports) {
            module.exports = function (ctx, name, method, chainingBehavior) {
                var chainableBehavior = ctx.__methods[name];
                var _chainingBehavior = chainableBehavior.chainingBehavior;
                chainableBehavior.chainingBehavior = function () {
                    var result = chainingBehavior(_chainingBehavior).call(this);
                    return result === undefined ? this : result;
                };
                var _method = chainableBehavior.method;
                chainableBehavior.method = function () {
                    var result = method(_method).apply(this, arguments);
                    return result === undefined ? this : result;
                };
            };
        },
        function (module, exports) {
            module.exports = function (ctx, name, method) {
                var _method = ctx[name], _super = function () {
                        return this;
                    };
                if (_method && 'function' === typeof _method)
                    _super = _method;
                ctx[name] = function () {
                    var result = method(_super).apply(this, arguments);
                    return result === undefined ? this : result;
                };
            };
        },
        function (module, exports) {
            module.exports = function (ctx, name, getter) {
                var _get = Object.getOwnPropertyDescriptor(ctx, name), _super = function () {
                    };
                if (_get && 'function' === typeof _get.get)
                    _super = _get.get;
                Object.defineProperty(ctx, name, {
                    get: function () {
                        var result = getter(_super).call(this);
                        return result === undefined ? this : result;
                    },
                    configurable: true
                });
            };
        },
        function (module, exports) {
            var flag = _require(23);
            module.exports = function (obj, args) {
                var negate = flag(obj, 'negate'), expr = args[0];
                return negate ? !expr : expr;
            };
        },
        function (module, exports) {
            module.exports = function (assertion, object, includeAll) {
                var flags = assertion.__flags || (assertion.__flags = Object.create(null));
                if (!object.__flags) {
                    object.__flags = Object.create(null);
                }
                includeAll = arguments.length === 3 ? includeAll : true;
                for (var flag in flags) {
                    if (includeAll || flag !== 'object' && flag !== 'ssfi' && flag != 'message') {
                        object.__flags[flag] = flags[flag];
                    }
                }
            };
        },
        function (module, exports) {
            var natives = {
                    '[object Arguments]': 'arguments',
                    '[object Array]': 'array',
                    '[object Date]': 'date',
                    '[object Function]': 'function',
                    '[object Number]': 'number',
                    '[object RegExp]': 'regexp',
                    '[object String]': 'string'
                };
            module.exports = function (obj) {
                var str = Object.prototype.toString.call(obj);
                if (natives[str])
                    return natives[str];
                if (obj === null)
                    return 'null';
                if (obj === undefined)
                    return 'undefined';
                if (obj === Object(obj))
                    return 'object';
                return typeof obj;
            };
        },
        function (module, exports) {
            function exclude() {
                var excludes = [].slice.call(arguments);
                function excludeProps(res, obj) {
                    Object.keys(obj).forEach(function (key) {
                        if (!~excludes.indexOf(key))
                            res[key] = obj[key];
                    });
                }
                return function extendExclude() {
                    var args = [].slice.call(arguments), i = 0, res = {};
                    for (; i < args.length; i++) {
                        excludeProps(res, args[i]);
                    }
                    return res;
                };
            }
            ;
            module.exports = AssertionError;
            function AssertionError(message, _props, ssf) {
                var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON'), props = extend(_props || {});
                this.message = message || 'Unspecified AssertionError';
                this.showDiff = false;
                for (var key in props) {
                    this[key] = props[key];
                }
                ssf = ssf || arguments.callee;
                if (ssf && Error.captureStackTrace) {
                    Error.captureStackTrace(this, ssf);
                }
            }
            AssertionError.prototype = Object.create(Error.prototype);
            AssertionError.prototype.name = 'AssertionError';
            AssertionError.prototype.constructor = AssertionError;
            AssertionError.prototype.toJSON = function (stack) {
                var extend = exclude('constructor', 'toJSON', 'stack'), props = extend({ name: this.name }, this);
                if (false !== stack && this.stack) {
                    props.stack = this.stack;
                }
                return props;
            };
        },
        function (module, exports) {
            module.exports = _require(40);
        },
        function (module, exports) {
            var type = _require(41);
            var Buffer;
            try {
                Buffer = require('buffer').Buffer;
            } catch (ex) {
                Buffer = {};
                Buffer.isBuffer = function () {
                    return false;
                };
            }
            module.exports = deepEqual;
            function deepEqual(a, b, m) {
                if (sameValue(a, b)) {
                    return true;
                } else if ('date' === type(a)) {
                    return dateEqual(a, b);
                } else if ('regexp' === type(a)) {
                    return regexpEqual(a, b);
                } else if (Buffer.isBuffer(a)) {
                    return bufferEqual(a, b);
                } else if ('arguments' === type(a)) {
                    return argumentsEqual(a, b, m);
                } else if (!typeEqual(a, b)) {
                    return false;
                } else if ('object' !== type(a) && 'object' !== type(b) && ('array' !== type(a) && 'array' !== type(b))) {
                    return sameValue(a, b);
                } else {
                    return objectEqual(a, b, m);
                }
            }
            function sameValue(a, b) {
                if (a === b)
                    return a !== 0 || 1 / a === 1 / b;
                return a !== a && b !== b;
            }
            function typeEqual(a, b) {
                return type(a) === type(b);
            }
            function dateEqual(a, b) {
                if ('date' !== type(b))
                    return false;
                return sameValue(a.getTime(), b.getTime());
            }
            function regexpEqual(a, b) {
                if ('regexp' !== type(b))
                    return false;
                return sameValue(a.toString(), b.toString());
            }
            function argumentsEqual(a, b, m) {
                if ('arguments' !== type(b))
                    return false;
                a = [].slice.call(a);
                b = [].slice.call(b);
                return deepEqual(a, b, m);
            }
            function enumerable(a) {
                var res = [];
                for (var key in a)
                    res.push(key);
                return res;
            }
            function iterableEqual(a, b) {
                if (a.length !== b.length)
                    return false;
                var i = 0;
                var match = true;
                for (; i < a.length; i++) {
                    if (a[i] !== b[i]) {
                        match = false;
                        break;
                    }
                }
                return match;
            }
            function bufferEqual(a, b) {
                if (!Buffer.isBuffer(b))
                    return false;
                return iterableEqual(a, b);
            }
            function isValue(a) {
                return a !== null && a !== undefined;
            }
            function objectEqual(a, b, m) {
                if (!isValue(a) || !isValue(b)) {
                    return false;
                }
                if (a.prototype !== b.prototype) {
                    return false;
                }
                var i;
                if (m) {
                    for (i = 0; i < m.length; i++) {
                        if (m[i][0] === a && m[i][1] === b || m[i][0] === b && m[i][1] === a) {
                            return true;
                        }
                    }
                } else {
                    m = [];
                }
                try {
                    var ka = enumerable(a);
                    var kb = enumerable(b);
                } catch (ex) {
                    return false;
                }
                ka.sort();
                kb.sort();
                if (!iterableEqual(ka, kb)) {
                    return false;
                }
                m.push([
                    a,
                    b
                ]);
                var key;
                for (i = ka.length - 1; i >= 0; i--) {
                    key = ka[i];
                    if (!deepEqual(a[key], b[key], m)) {
                        return false;
                    }
                }
                return true;
            }
        },
        function (module, exports) {
            module.exports = _require(42);
        },
        function (module, exports) {
            var exports = module.exports = getType;
            var natives = {
                    '[object Array]': 'array',
                    '[object RegExp]': 'regexp',
                    '[object Function]': 'function',
                    '[object Arguments]': 'arguments',
                    '[object Date]': 'date'
                };
            function getType(obj) {
                var str = Object.prototype.toString.call(obj);
                if (natives[str])
                    return natives[str];
                if (obj === null)
                    return 'null';
                if (obj === undefined)
                    return 'undefined';
                if (obj === Object(obj))
                    return 'object';
                return typeof obj;
            }
            exports.Library = Library;
            function Library() {
                this.tests = {};
            }
            Library.prototype.of = getType;
            Library.prototype.define = function (type, test) {
                if (arguments.length === 1)
                    return this.tests[type];
                this.tests[type] = test;
                return this;
            };
            Library.prototype.test = function (obj, type) {
                if (type === getType(obj))
                    return true;
                var test = this.tests[type];
                if (test && 'regexp' === getType(test)) {
                    return test.test(obj);
                } else if (test && 'function' === getType(test)) {
                    return test(obj);
                } else {
                    throw new ReferenceError('Type test "' + type + '" not defined or invalid.');
                }
            };
        },
        function (module, exports) {
            'use strict';
            var concat = [].concat;
            var slice = [].slice;
            module.exports = function curry(fn, thisContext) {
                var arity = fn.length;
                function curryCall() {
                    var args = slice.call(arguments);
                    if (args.length == arity) {
                        return fn.apply(thisContext, args);
                    }
                    if (args.length < arity) {
                        return function () {
                            var allArgs = concat.apply(args, arguments);
                            return curryCall.apply(null, allArgs);
                        };
                    }
                    throw new Error('Too many arguments supplied.');
                }
                return curryCall;
            };
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
        },
        function (module, exports) {
            'use strict';
            var chai = _require(11);
            var expect = chai.expect;
            chai.should();
            var immutato = _require(6);
            var util = _require(56);
            var shouldCoherceTo = util.shouldCoherceTo(immutato.Any);
            var shouldPassAssertionWith = util.shouldPassAssertionWith(immutato.Any);
            var shouldFailAssertionWith = util.shouldFailAssertionWith(immutato.Any);
            describe('Any', function () {
                var Imm;
                before(function () {
                    Imm = immutato.struct({ age: immutato.Any }, 'Person');
                });
                it('convert primitive Any', function () {
                    Imm.meta.fields.age.type.type.should.be.equal('Any');
                });
                it('is defined', function () {
                    immutato.Any.should.be.a('object');
                });
                shouldCoherceTo('string to string', '12.42', '12.42');
                shouldCoherceTo('number to number', 12, 12);
                shouldCoherceTo('undefined to undefined', undefined, undefined);
                shouldCoherceTo('null to null', null, null);
                shouldCoherceTo('0 to 0', 0, 0);
                shouldCoherceTo('NaN to NaN', NaN, NaN);
                shouldPassAssertionWith('positive float', 42.42);
                shouldPassAssertionWith('positive integer', 42);
                shouldPassAssertionWith('positive zero', 0);
                shouldPassAssertionWith('negative float', -42.42);
                shouldPassAssertionWith('negative integer', -42);
                shouldPassAssertionWith('negative zero', -0);
                shouldPassAssertionWith('string', 'a string');
                shouldPassAssertionWith('boolean', true);
                shouldPassAssertionWith('object', {});
                shouldPassAssertionWith('null', null);
                shouldPassAssertionWith('undefined', undefined);
                shouldPassAssertionWith('RegExp', /./);
                shouldPassAssertionWith('NaN', NaN);
                shouldPassAssertionWith('Function', function () {
                });
                shouldPassAssertionWith('Infinity', Infinity);
            });
        },
        function (module, exports) {
            'use strict';
            var chai = _require(11);
            var expect = chai.expect;
            chai.should();
            var immutato = _require(6);
            var util = _require(56);
            var shouldCoherceTo = util.shouldCoherceTo(immutato.Boolean);
            var shouldPassAssertionWith = util.shouldPassAssertionWith(immutato.Boolean);
            var shouldFailAssertionWith = util.shouldFailAssertionWith(immutato.Boolean);
            describe('Boolean', function () {
                var Imm;
                before(function () {
                    Imm = immutato.struct({ female: immutato.Boolean }, 'Person');
                });
                it('convert primitive Number', function () {
                    Imm.meta.fields.female.type.type.should.be.equal('Boolean');
                });
                it('is defined', function () {
                    immutato.Boolean.should.be.a('object');
                });
                shouldCoherceTo('1 to true', 1, true);
                shouldCoherceTo('0 to false', 0, false);
                shouldCoherceTo('string true to true', 'true', true);
                shouldCoherceTo('string false to false', 'false', false);
                shouldCoherceTo('string on to true', 'on', true);
                shouldCoherceTo('string off to false', 'off', false);
                shouldCoherceTo('string yes to true', 'yes', true);
                shouldCoherceTo('string no to false', 'no', false);
                shouldCoherceTo('string 1 to true', '1', true);
                shouldCoherceTo('string 0 to false', '0', false);
                shouldPassAssertionWith('true', true);
                shouldPassAssertionWith('false', false);
                shouldFailAssertionWith('number', 42);
                shouldFailAssertionWith('string', 'true');
                shouldFailAssertionWith('object', {});
                shouldFailAssertionWith('null', null);
                shouldFailAssertionWith('undefined', undefined);
                shouldFailAssertionWith('RegExp', /./);
                shouldFailAssertionWith('NaN', NaN);
                shouldFailAssertionWith('Function', function () {
                });
                shouldFailAssertionWith('Infinity', Infinity);
            });
        },
        function (module, exports) {
            'use strict';
            var chai = _require(11);
            var expect = chai.expect;
            chai.should();
            var immutato = _require(6);
            var util = _require(56);
            var shouldCoherceTo = util.shouldCoherceTo(immutato.Date);
            var shouldPassAssertionWith = util.shouldPassAssertionWith(immutato.Date);
            var shouldFailAssertionWith = util.shouldFailAssertionWith(immutato.Date);
            describe('Date', function () {
                var Imm;
                before(function () {
                    Imm = immutato.struct({ born: immutato.Date }, 'Person');
                });
                it('convert primitive Number', function () {
                    Imm.meta.fields.born.type.type.should.be.equal('Date');
                });
                it('is defined', function () {
                    immutato.Date.should.be.a('object');
                });
                var dt1 = new Date(2012, 3, 23, 18, 25, 43, 511);
                var toString = Object.prototype.toString;
                dt1.setUTCHours(18);
                var dt2 = new Date(2014, 9, 23, 19, 27, 9);
                dt2.setUTCHours(19);
                shouldCoherceTo('ISO string to date', '2012-04-23T18:25:43.511Z', dt1);
                shouldCoherceTo('number ms from epoch to date', 1414092429000, dt2);
                shouldPassAssertionWith('date', new Date());
                shouldFailAssertionWith('boolean', true);
                shouldFailAssertionWith('number', 42);
                shouldFailAssertionWith('string', 'true');
                shouldFailAssertionWith('object', {});
                shouldFailAssertionWith('null', null);
                shouldFailAssertionWith('undefined', undefined);
                shouldFailAssertionWith('RegExp', /./);
                shouldFailAssertionWith('NaN', NaN);
                shouldFailAssertionWith('Function', function () {
                });
                shouldFailAssertionWith('Infinity', Infinity);
            });
        },
        function (module, exports) {
            'use strict';
            var chai = _require(11);
            var expect = chai.expect;
            chai.should();
            var Fields = _require(3);
            describe('Fields', function () {
                var fields;
                before(function () {
                    fields = new Fields();
                    fields.a = 'one';
                    fields.b = 'property';
                    fields.c = 'another';
                });
                it('is defined', function () {
                    Fields.should.be.a('function');
                });
                it('loop values with forEach', function () {
                    var results = [];
                    fields.forEach(function (f) {
                        results.push(f);
                    });
                    results.should.be.deep.equal([
                        'one',
                        'property',
                        'another'
                    ]);
                });
                it('transform values with map', function () {
                    var results = fields.map(function (f) {
                            return f.toUpperCase();
                        });
                    results.should.be.deep.equal([
                        'ONE',
                        'PROPERTY',
                        'ANOTHER'
                    ]);
                });
                it('get an array of values with toArray', function () {
                    var results = fields.toArray();
                    results.should.be.deep.equal([
                        'one',
                        'property',
                        'another'
                    ]);
                });
                it('filter values with filter', function () {
                    var results = fields.filter(function (v) {
                            return v.length > 3;
                        });
                    results.should.be.deep.equal([
                        'property',
                        'another'
                    ]);
                });
            });
        },
        function (module, exports) {
            'use strict';
            var chai = _require(11);
            var expect = chai.expect;
            chai.should();
            var immutato = _require(6);
            var util = _require(56);
            var shouldCoherceTo = util.shouldCoherceTo(immutato.Number);
            var shouldPassAssertionWith = util.shouldPassAssertionWith(immutato.Number);
            var shouldFailAssertionWith = util.shouldFailAssertionWith(immutato.Number);
            describe('Number', function () {
                var Imm;
                before(function () {
                    Imm = immutato.struct({ age: immutato.Number }, 'Person');
                });
                it('convert primitive Number', function () {
                    Imm.meta.fields.age.type.type.should.be.equal('Number');
                });
                it('is defined', function () {
                    immutato.Number.should.be.a('object');
                });
                shouldCoherceTo('string float to Number', '12.42', 12.42);
                shouldCoherceTo('string int to Number', '12', 12);
                shouldCoherceTo('undefined to 0', undefined, 0);
                shouldCoherceTo('null to 0', null, 0);
                shouldCoherceTo('NaN to 0', NaN, 0);
                shouldPassAssertionWith('positive float', 42.42);
                shouldPassAssertionWith('positive integer', 42);
                shouldPassAssertionWith('positive zero', 0);
                shouldPassAssertionWith('negative float', -42.42);
                shouldPassAssertionWith('negative integer', -42);
                shouldPassAssertionWith('negative zero', -0);
                shouldFailAssertionWith('string', 'a string');
                shouldFailAssertionWith('boolean', true);
                shouldFailAssertionWith('object', {});
                shouldFailAssertionWith('null', null);
                shouldFailAssertionWith('undefined', undefined);
                shouldFailAssertionWith('RegExp', /./);
                shouldFailAssertionWith('NaN', NaN);
                shouldFailAssertionWith('Function', function () {
                });
                shouldFailAssertionWith('Infinity', Infinity);
            });
        },
        function (module, exports) {
            'use strict';
            var chai = _require(11);
            var expect = chai.expect;
            chai.should();
            var immutato = _require(6);
            var util = _require(56);
            var shouldCoherceTo = util.shouldCoherceTo(immutato.String);
            var shouldPassAssertionWith = util.shouldPassAssertionWith(immutato.String);
            var shouldFailAssertionWith = util.shouldFailAssertionWith(immutato.String);
            describe('String', function () {
                var Imm;
                before(function () {
                    Imm = immutato.struct({ name: immutato.String }, 'Person');
                });
                it('convert primitive Number', function () {
                    Imm.meta.fields.name.type.type.should.be.equal('String');
                });
                it('is defined', function () {
                    immutato.String.should.be.a('object');
                });
                shouldCoherceTo('float to String', 12.42, '12.42');
                shouldCoherceTo('int to String', 12, '12');
                shouldCoherceTo('boolean true to String', true, 'true');
                shouldCoherceTo('boolean false to String', false, 'false');
                shouldCoherceTo('undefined to empty string', undefined, '');
                shouldCoherceTo('null to empty string', null, '');
                shouldPassAssertionWith('empty string', '');
                shouldPassAssertionWith('a string', 'ciao');
                shouldFailAssertionWith('number', 42);
                shouldFailAssertionWith('boolean', true);
                shouldFailAssertionWith('object', {});
                shouldFailAssertionWith('null', null);
                shouldFailAssertionWith('undefined', undefined);
                shouldFailAssertionWith('RegExp', /./);
                shouldFailAssertionWith('NaN', NaN);
                shouldFailAssertionWith('Function', function () {
                });
                shouldFailAssertionWith('Infinity', Infinity);
            });
        },
        function (module, exports) {
            _require(46);
            _require(47);
            _require(52);
            _require(49);
            _require(50);
            _require(54);
            _require(45);
            _require(48);
            _require(53);
            _require(55);
        },
        function (module, exports) {
            'use strict';
            var chai = _require(11);
            var expect = chai.expect;
            chai.should();
            var i = _require(6);
            var Cliente = i.struct({ description: i.String.maxlength(4) }, 'Cliente');
            var Person = i.struct({ age: i.Number.maxlength(4) }, 'Person');
            var ClienteMin = i.struct({ description: i.String.minlength(4) }, 'ClienteMin');
            var ClienteOpt = i.struct({ description: i.String.optional() }, 'ClienteOpt');
            var PersonMin = i.struct({ age: i.Number.minlength(4) }, 'PersonMin');
            var ClienteSize = i.struct({ description: i.String.size(4) }, 'ClienteSize');
            var PersonSize = i.struct({ age: i.Number.size(4) }, 'PersonSize');
            var PersonLabeled = i.struct({ age: i.Number.label('Age of person') }, 'PersonLabeled');
            var PersonDef = i.struct({ age: i.Number.default(42) }, 'PersonDef');
            describe('immutato', function () {
                describe('type modifiers', function () {
                    describe('default', function () {
                        it('pass for missing values', function () {
                            new PersonDef({});
                        });
                        it('pass for undefined', function () {
                            new PersonDef({ age: undefined });
                        });
                        it('pass for null', function () {
                            new PersonDef({ age: null });
                        });
                        it('pass for value', function () {
                            new PersonDef({ age: 23 });
                        });
                        it('set value to given', function () {
                            var p = new PersonDef({});
                            p.age.should.be.equal(42);
                        });
                        it('don\'t alter type name', function () {
                            var type = PersonDef.meta.fields.age.type.type;
                            type.should.be.equal('Number');
                        });
                        it('alter meta info', function () {
                            var def = PersonDef.meta.fields.age.type.default;
                            def.should.be.equal(42);
                        });
                    });
                    describe('label', function () {
                        it('pass for valid value on base type', function () {
                            new PersonLabeled({ age: 42 });
                        });
                        it('don\'t alter type name', function () {
                            var type = PersonLabeled.meta.fields.age.type.type;
                            type.should.be.equal('Number');
                        });
                        it('alter meta info', function () {
                            var label = PersonLabeled.meta.fields.age.type.label;
                            label.should.be.equal('Age of person');
                        });
                    });
                    describe('optional', function () {
                        it('pass for missing values', function () {
                            new ClienteOpt({});
                        });
                        it('pass for undefined', function () {
                            new ClienteOpt({ description: undefined });
                        });
                        it('pass for null', function () {
                            new ClienteOpt({ description: null });
                        });
                        it('pass for value', function () {
                            new ClienteOpt({ description: 'ciao' });
                        });
                        it('alter type name', function () {
                            var type = ClienteOpt.meta.fields.description.type.type;
                            type.should.be.equal('String_optional');
                        });
                        it('alter meta info', function () {
                            var optional = ClienteOpt.meta.fields.description.type.optional;
                            optional.should.be.equal(true);
                        });
                    });
                    describe('size', function () {
                        it('is checked for lenght != size', function () {
                            expect(function () {
                                new ClienteSize({ description: 'Eban++' });
                            }).to.throws(TypeError, 'Length of `Eban++` is different than 4');
                        });
                        it('is checked for undefined lenght', function () {
                            expect(function () {
                                new PersonSize({ age: 42 });
                            }).to.throws(TypeError, 'Length of `42` is undefined');
                        });
                        it('pass for correct values', function () {
                            new ClienteSize({ description: 'Eban' });
                        });
                        it('alter type name', function () {
                            var type = ClienteSize.meta.fields.description.type.type;
                            type.should.be.equal('String_size');
                        });
                        it('alter meta info', function () {
                            var size = ClienteSize.meta.fields.description.type.size;
                            size.should.be.equal(4);
                        });
                    });
                    describe('maxlength', function () {
                        it('is checked for lenght > max', function () {
                            expect(function () {
                                new Cliente({ description: 'Eban++' });
                            }).to.throws(TypeError, 'Length of `Eban++` is greater than 4');
                        });
                        it('is checked for undefined lenght', function () {
                            expect(function () {
                                new Person({ age: 42 });
                            }).to.throws(TypeError, 'Length of `42` is undefined');
                        });
                        it('pass for correct values', function () {
                            new Cliente({ description: 'Eban' });
                        });
                        it('alter type name', function () {
                            var type = Cliente.meta.fields.description.type.type;
                            type.should.be.equal('String_maxlength');
                        });
                        it('alter meta info', function () {
                            var max = Cliente.meta.fields.description.type.maxlength;
                            max.should.be.equal(4);
                        });
                    });
                    describe('minlength', function () {
                        it('is checked for lenght < min', function () {
                            expect(function () {
                                new ClienteMin({ description: 'Eb' });
                            }).to.throws(TypeError, 'Length of `Eb` is less than 4');
                        });
                        it('is checked for undefined lenght', function () {
                            expect(function () {
                                new PersonMin({ age: 42 });
                            }).to.throws(TypeError, 'Length of `42` is undefined');
                        });
                        it('pass for correct values', function () {
                            new ClienteMin({ description: 'Ebanaa' });
                        });
                        it('alter type name', function () {
                            var type = ClienteMin.meta.fields.description.type.type;
                            type.should.be.equal('String_minlength');
                        });
                        it('alter meta info', function () {
                            var min = ClienteMin.meta.fields.description.type.minlength;
                            min.should.be.equal(4);
                        });
                    });
                });
            });
        },
        function (module, exports) {
            'use strict';
            var chai = _require(11);
            var expect = chai.expect;
            chai.should();
            var setDeep = _require(8);
            var immutato = _require(6);
            var Country = immutato.struct({
                    name: immutato.String,
                    population: immutato.Number
                }, 'Country');
            var State = immutato.struct({
                    name: immutato.String,
                    country: Country
                }, 'State');
            var City = immutato.struct({
                    name: immutato.String,
                    state: State
                }, 'City');
            var Person = immutato.struct({
                    name: immutato.String,
                    born: City,
                    live: City
                }, 'Person');
            describe('setDeep', function () {
                var person;
                before(function () {
                    person = new Person({
                        name: 'Gianni',
                        born: {
                            name: 'Genova',
                            state: {
                                name: 'Liguria',
                                country: {
                                    name: 'Italy',
                                    population: 50000000
                                }
                            }
                        },
                        live: {
                            name: 'Milano',
                            state: {
                                name: 'Lombardia',
                                country: {
                                    name: 'Italy',
                                    population: 50000000
                                }
                            }
                        }
                    });
                });
                it('is defined', function () {
                    setDeep.should.be.a('function');
                });
                it('can be applied only to struct', function () {
                    expect(function () {
                        setDeep.call('');
                    }).to.throws(TypeError, 'setDeep context must be a struct');
                });
                it('work on struct', function () {
                    setDeep.call(person, 'born.name', 'Ceranesi');
                });
                describe('when applyed', function () {
                    var personNewVer;
                    before(function () {
                        personNewVer = setDeep.call(person, 'born.state.country.name', 'Italia');
                    });
                    it('change final property', function () {
                        personNewVer.born.state.country.name.should.be.equal('Italia');
                    });
                    it('change mid properties', function () {
                        personNewVer.born.state.country.should.not.be.equal(person.born.state.country);
                        personNewVer.born.state.should.not.be.equal(person.born.state);
                        personNewVer.born.should.not.be.equal(person.born);
                    });
                    it('original final property immutate', function () {
                        person.born.state.country.name.should.be.equal('Italy');
                    });
                    it('return new root Object', function () {
                        person.should.not.be.equal(personNewVer);
                    });
                    it('return struct', function () {
                        personNewVer.constructor.meta.type.should.be.equal('Person');
                    });
                    it('return same type', function () {
                        personNewVer.constructor.meta.kind.should.be.equal('structure');
                    });
                    it('other property are immutate', function () {
                        person.live.should.be.equal(personNewVer.live);
                    });
                });
            });
        },
        function (module, exports) {
            'use strict';
            var chai = _require(11);
            var expect = chai.expect;
            chai.should();
            var immutato = _require(6);
            describe('immutato', function () {
                it('is defined', function () {
                    immutato.should.be.a('object');
                });
                describe('build a constructor', function () {
                    var Imm;
                    before(function () {
                        Imm = immutato.struct({
                            name: immutato.String,
                            age: immutato.Number
                        }, 'Person');
                    });
                    it('has properly name', function () {
                        Imm.name.should.be.equal('Person');
                    });
                    it('throws with bad argument number', function () {
                        expect(function () {
                            new Imm({ a: 1 });
                        }).to.throw(TypeError);
                    });
                    it('throws with bad argument type', function () {
                        expect(function () {
                            new Imm({
                                name: 1,
                                age: 2
                            });
                        }).to.throw(TypeError);
                    });
                    it('return immutable instances', function () {
                        var imm = new Imm({
                                name: 'Andrea',
                                age: 2
                            });
                        Object.isFrozen(imm).should.be.equal(true);
                    });
                    it('set return immutable instances', function () {
                        var imm = new Imm({
                                name: 'Andrea',
                                age: 2
                            });
                        imm = imm.set('age', 3);
                        Object.isFrozen(imm).should.be.equal(true);
                    });
                    it('provide access to properties', function () {
                        var imm = new Imm({
                                name: 'Andrea',
                                age: 2
                            });
                        imm.name.should.be.equal('Andrea');
                    });
                    it('support instanceof', function () {
                        var imm = new Imm({
                                name: 'Andrea',
                                age: 2
                            });
                        (imm instanceof Imm).should.be.equal(true);
                        (imm instanceof immutato.struct).should.be.equal(false);
                    });
                    it('coherce empty arguments', function () {
                        var imm = Imm.from();
                        imm.name.should.be.equal('');
                        imm.age.should.be.equal(0);
                    });
                    it('coherce all arguments', function () {
                        var imm = Imm.from({
                                name: 42.42,
                                age: '42'
                            });
                        imm.name.should.be.equal('42.42');
                        imm.age.should.be.equal(42);
                    });
                    it('set return new immutable instance', function () {
                        var imm = Imm.from({
                                name: 'Giorgio',
                                age: '42'
                            });
                        var imm2 = imm.set('name', 'Gigio');
                        imm2.should.not.be.equal(imm);
                        imm2.name.should.be.equal('Gigio');
                    });
                    it('is idempotent', function () {
                        var imm = Imm.from({
                                name: 'Giorgio',
                                age: '42'
                            });
                        var imm2 = new Imm(imm);
                        var imm3 = Imm.from({
                                name: 'Giorgio',
                                age: '42'
                            });
                        imm2.should.be.equal(imm);
                        imm3.should.not.be.equal(imm);
                    });
                    it('render to json', function () {
                        var imm = Imm.from({
                                name: 'Giorgio',
                                age: '42'
                            }).set('name', 'Giorgio2').set('age', 44);
                        var expected = '{"name":"Giorgio2","age":44}';
                        JSON.stringify(imm).should.be.equal(expected);
                    });
                    it('keep value of unchanged props ', function () {
                        var imm = Imm.from({
                                name: 'Giorgio',
                                age: '42'
                            });
                        imm = imm.set('name', 'Gianni').set('name', 'Gino');
                        imm.name.should.be.equal('Gino');
                        imm.age.should.be.equal(42);
                    });
                    it('save constructor value ', function () {
                        var imm = Imm.from({
                                name: 'Giorgio',
                                age: '42'
                            }, 'Person');
                        imm = imm.set('name', 'Gianni').set('name', 'Gino');
                        imm.constructor.name.should.be.equal('Person');
                    });
                });
            });
        },
        function (module, exports) {
            'use strict';
            var chai = _require(11);
            var expect = chai.expect;
            chai.should();
            var immutato = _require(6);
            var Country = immutato.struct({
                    name: immutato.String,
                    population: immutato.Number
                }, 'Country');
            var State = immutato.struct({
                    name: immutato.String,
                    country: Country
                }, 'State');
            var City = immutato.struct({
                    name: immutato.String,
                    state: State
                }, 'City');
            var Person = immutato.struct({
                    name: immutato.String,
                    born: City,
                    live: City
                }, 'Person');
            describe('setDeep', function () {
                var person;
                function create() {
                    person = new Person({
                        name: 'Gianni',
                        born: {
                            name: 'Genova',
                            country: {
                                name: 'Italy',
                                population: 50000000
                            }
                        },
                        live: {
                            name: 'Milano',
                            state: {
                                name: 'Lombardia',
                                country: {
                                    name: 'Italy',
                                    population: 50000000
                                }
                            }
                        }
                    });
                }
                it('non optional properties must be supplied', function () {
                    expect(function () {
                        create();
                    }).to.throws(TypeError, '.born.state.name should be a String, but `undefined` was given.');
                });
            });
        },
        function (module, exports) {
            'use strict';
            var chilli = _require(43);
            var chai = _require(11);
            var expect = chai.expect;
            var toString = Object.prototype.toString;
            exports.shouldCoherceTo = chilli(function (type, description, sourceValue, expectedResult) {
                it('Coherce ' + description, function () {
                    var coherced = type.from(sourceValue);
                    if (toString.call(expectedResult) === '[object Date]') {
                        expectedResult = expectedResult.getTime();
                        coherced = coherced.getTime();
                    }
                    if (isNaN(expectedResult)) {
                        expect(isNaN(coherced)).to.be.equal(true);
                    } else {
                        expect(coherced).to.be.equal(expectedResult);
                    }
                });
            });
            exports.shouldPassAssertionWith = chilli(function (type, description, sourceValue) {
                it('Assert successfully with ' + description, function () {
                    type.assertIs(sourceValue);
                });
            });
            exports.shouldFailAssertionWith = chilli(function (type, description, sourceValue) {
                it('Fail assertion with ' + description, function () {
                    expect(function () {
                        type.assertIs(sourceValue, 'fieldName');
                    }).to.throw(TypeError, 'fieldName should be a ' + type.meta.type + ', but `' + sourceValue + '` was given.');
                });
            });
        }
    ];
    return _require(51);
}());