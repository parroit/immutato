'use strict';

var THRESHOLD = 100;

var I = (function() {
    var cacheCount = 300;
    var caches = [];

    function buildPropertyIndexes(keysLength) {
        var propertyIndexes = {};
        var i = keysLength;
        while (i--) {
            propertyIndexes[i] = 0;
        }
        propertyIndexes.generation = 0;
        //Object.freeze(propertyIndexes);
        return propertyIndexes;
    }
    var k = cacheCount;

    while (k--) {
        caches[k] = buildPropertyIndexes(k);
    }


    function buildFirstPropertyIndexes(keysLength) {
        if (keysLength > cacheCount) {
            console.log('CACHE REBUILD');
            return buildPropertyIndexes(keysLength);
        } else {
            return caches[keysLength];

        }


    }


    function get(self, opts) {
        //console.dir(opts.transactionsForClass)

        var propertyIndexes = self.propertyIndexes;
        var instanceId = self.instanceId;
        var propertyIndex = opts.propertyIndex;
        //var propertyName = opts.propertyName;
        var transactionsForClass = opts.transactionsForClass;
        var transactionIndex = propertyIndexes[propertyIndex];
        var transactions = transactionsForClass[instanceId];
        var transaction = transactions[transactionIndex];


        return transaction[propertyIndex];
    }


    var create = (function() {
        function C() {}
        return function create(proto, properties) {

            C.prototype = proto;
            var instance = new C();

            return Object.defineProperties(instance, properties);
        };
    })();

    function set(value, self, opts) {
        var propertyIndexes = self.propertyIndexes;
        var instanceId = self.instanceId;
        var propertyIndex = opts.propertyIndex;
        var transactionsForClass = opts.transactionsForClass;
        var Contructor = opts.Contructor;
        var transactions = transactionsForClass[instanceId];
        var keysLength = opts.keysLength;

        //TODO: check for data immutability or do a shallow copy
        //of input data

        //save new transaction
        var newTransaction = new Array(propertyIndex + 1);
        newTransaction[propertyIndex] = value;
        transactions.push(newTransaction);

        //create new propertyIndex for prop
        //it points to last transaction position
        var newPropertyIndexes = {generation:0};
        var i = keysLength;
        while (i--) {
            newPropertyIndexes[i] = propertyIndexes[i];
        }

        newPropertyIndexes[propertyIndex] = transactions.length -1;

        //return new instance, give new property
        //indexes
        return new Contructor(newPropertyIndexes, instanceId);
    }

    function mkGetterSetter(opts) {
        return function getterSetter(value) {
            if (typeof value === 'undefined') {
                return get(this, opts);
            } else {
                return set(value, this, opts);
            }
        };
    }

    function I(dataSample) {

        //cache key names
        var keys = Object.keys(dataSample);
        var keysLength = keys.length;



        //TODO: check for data immutability or do a shallow copy
        //of input data
        var transactionsForClass = [];


        //
        // build getter/setter for all properties
        // and save them in prototype.
        //
        var Proto = {};
        var i = keysLength;
        var clonedData = {};

        while (i--) {


            var opts = {
                propertyIndex: i,
                transactionsForClass: transactionsForClass,
                Contructor: Contructor,
                keysLength: keysLength
            };

            var propertyName = keys[i];
            Proto[propertyName] = mkGetterSetter(opts);
        }

        function Contructor(propertyIndexes, instanceId) {
            this.propertyIndexes = propertyIndexes;
            this.instanceId = instanceId;

        }

        //Object.freeze(Proto);

        Contructor.prototype = Proto;

        var instanceId = 0;

        return function(data) {
            var propertyIndexes = buildFirstPropertyIndexes(keysLength);
            var clonedData = [];

            i = 0;
            while (i < keysLength) {
                clonedData.push(data[keys[i]]);
                i++;
            }
            //console.dir(clonedData)
            transactionsForClass[instanceId] = [clonedData];
            var res = new Contructor(propertyIndexes, instanceId);

            instanceId++;

            return res;
        };




    }

    return I;
})();


module.exports = I;
