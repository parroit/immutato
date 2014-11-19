(function (name, factory) {
    
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        this[name] = factory();
    }
}('immutato', function (define) {
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
    _require.modules = [function (module, exports) {
            'use strict';
            var I = function () {
                    function buildFirstPropertyIndexes(keysLength) {
                        var propertyIndexes = {};
                        var i = keysLength;
                        while (i--) {
                            propertyIndexes[i] = 0;
                        }
                        propertyIndexes.indexGeneration = 0;
                        Object.freeze(propertyIndexes);
                        return propertyIndexes;
                    }
                    function get(propertyIndexes, opts) {
                        var propertyIndex = opts.propertyIndex;
                        var propertyName = opts.propertyName;
                        var transactions = opts.transactions;
                        var transactionIndex = propertyIndexes[propertyIndex];
                        var transaction = transactions[transactionIndex];
                        return transaction[propertyName];
                    }
                    function set(value, propertyIndexes, opts) {
                        var propertyIndex = opts.propertyIndex;
                        var propertyName = opts.propertyName;
                        var transactions = opts.transactions;
                        var keysLength = opts.keysLength;
                        var Contructor = opts.Contructor;
                        var newTransaction = {};
                        newTransaction[propertyName] = value;
                        transactions.push(newTransaction);
                        var newPropertyIndexes;
                        if (propertyIndexes.indexGeneration === 100) {
                            newPropertyIndexes = {};
                            var i = keysLength;
                            while (i--) {
                                newPropertyIndexes[i] = propertyIndexes[i];
                            }
                            newPropertyIndexes[propertyIndex] = transactions.length - 1;
                            newPropertyIndexes.indexGeneration = 0;
                        } else {
                            var propertyIndexDescriptor = { indexGeneration: { value: propertyIndexes.indexGeneration + 1 } };
                            propertyIndexDescriptor[propertyIndex] = { value: transactions.length - 1 };
                            newPropertyIndexes = Object.create(propertyIndexes, propertyIndexDescriptor);
                        }
                        Object.freeze(newPropertyIndexes);
                        return new Contructor(newPropertyIndexes);
                    }
                    function mkGetterSetter(opts) {
                        return function getterSetter(value) {
                            if (typeof value === 'undefined') {
                                return get(this.propertyIndexes, opts);
                            } else {
                                return set(value, this.propertyIndexes, opts);
                            }
                        };
                    }
                    function I(data) {
                        var keys = Object.keys(data);
                        var keysLength = keys.length;
                        var transactions = [data];
                        var propertyIndexes = buildFirstPropertyIndexes(keysLength);
                        var Proto = {};
                        function Contructor(propertyIndexes) {
                            this.propertyIndexes = propertyIndexes;
                            Object.freeze(this);
                        }
                        Contructor.prototype = Proto;
                        var i = keysLength;
                        while (i--) {
                            var opts = {
                                    propertyIndex: i,
                                    propertyName: keys[i],
                                    transactions: transactions,
                                    Contructor: Contructor,
                                    keysLength: keysLength
                                };
                            Proto[opts.propertyName] = mkGetterSetter(opts);
                        }
                        Object.freeze(Proto);
                        return new Contructor(propertyIndexes);
                    }
                    return I;
                }();
            module.exports = I;
        }];
    return _require(0);
}));
//# sourceMappingURL=immutato.js.map