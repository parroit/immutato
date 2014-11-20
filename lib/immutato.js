'use strict';

var I = (function () {
    var cacheCount = 300;
    var caches = [];

    function buildPropertyIndexes(keysLength) {
        var propertyIndexes = {};
        var i = keysLength;
        while (i--) {
            propertyIndexes[i] = 0;
        }
        propertyIndexes.indexGeneration = 0;
        //Object.freeze(propertyIndexes);
        return propertyIndexes;
    }
    var k = cacheCount;

    while(k--) {
        caches[k] = buildPropertyIndexes(k);
    }


    function buildFirstPropertyIndexes(keysLength) {
        if (keysLength > cacheCount) {
            console.log('CACHE REBUILD');
            return buildPropertyIndexes(keysLength);
        } else{
            return caches[keysLength];

        }


    }


    function get(self, opts) {
        //console.dir(opts.transactionsForClass)

        var propertyIndexes = self.propertyIndexes;
        var instanceId = self.instanceId;
        var propertyIndex = opts.propertyIndex;
        var propertyName = opts.propertyName;
        var transactionsForClass = opts.transactionsForClass;
        var transactionIndex = propertyIndexes[propertyIndex];
        var transactions = transactionsForClass[instanceId];
        var transaction = transactions[transactionIndex];

        return transaction[propertyName];
    }


    var create = function(){
        function C(){}
        return function create(proto, properties) {
            C.prototype = proto;
            var instance = new C();
            Object.defineProperties(instance, properties);
        };
    };

    function set(value, self, opts) {
        var propertyIndexes = self.propertyIndexes;
        var instanceId = self.instanceId;
        var propertyIndex = opts.propertyIndex;
        var propertyName = opts.propertyName;
        var transactionsForClass = opts.transactionsForClass;
        var keysLength = opts.keysLength;
        var Contructor = opts.Contructor;

        var transactions = transactionsForClass[instanceId];

        //TODO: check for data immutability or do a shallow copy
        //of input data

        //save new transaction
        var newTransaction = {};
        newTransaction[propertyName] = value;
        transactions.push(newTransaction);

        //create new propertyIndex for prop
        //it points to last transaction position

        var newPropertyIndexes;
/*
        if (propertyIndexes.indexGeneration === 100) {

            newPropertyIndexes = {};
            var i = keysLength;
            while (i--) {
                newPropertyIndexes[i] = propertyIndexes[i];
            }

            newPropertyIndexes[propertyIndex] = transactions.length -1;
            newPropertyIndexes.indexGeneration = 0;

        } else {
*/

            var propertyIndexDescriptor = {
               /* indexGeneration: {
                    value: propertyIndexes.indexGeneration + 1
                }*/
            };
            propertyIndexDescriptor[propertyIndex] = {
                value: transactions.length -1
            };
            newPropertyIndexes = create(propertyIndexes, propertyIndexDescriptor);
       // }


        //Object.freeze(newPropertyIndexes);

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

    function I(dataSample){

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

        while(i--) {

            var propertyName = keys[i];
            var opts = {
                propertyIndex: i,
                propertyName: propertyName,
                transactionsForClass: transactionsForClass,
                Contructor: Contructor,
                keysLength: keysLength
            };


            Proto[propertyName] = mkGetterSetter(opts);
        }

        function Contructor(propertyIndexes, instanceId){
            this.propertyIndexes = propertyIndexes;
            this.instanceId = instanceId;

        }

        //Object.freeze(Proto);

        Contructor.prototype = Proto;

        var instanceId = 0;

        return function(data) {
            var propertyIndexes = buildFirstPropertyIndexes(keysLength);
            var clonedData = {};

            i = keysLength;
            while(i--) {
                var propertyName = keys[i];
                clonedData[propertyName] = data[propertyName];
            }

            transactionsForClass[instanceId] = [clonedData];
            var res =  new Contructor(propertyIndexes, instanceId);

            instanceId++;

            return res;
        };




    }

    return I;
})();


module.exports = I;
