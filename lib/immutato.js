'use strict';

var I = (function(){


    function buildFirstPropertyIndexes(keysLength){
        var propertyIndexes = /*new Array(keysLength)*/ {};
         //All properties start at transaction index 0
        var i = keysLength;
        while(i--){
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

        //TODO: check for data immutability or do a shallow copy
        //of input data

        //save new transaction
        var newTransaction = {};
        newTransaction[propertyName] = value;
        transactions.push(newTransaction);
        //console.log('transactions: ', JSON.stringify(transactions,null,4))

        //create new propertyIndex for prop
        //it points to last transaction position

        var newPropertyIndexes;

        if (propertyIndexes.indexGeneration === 100) {
            //console.log('new prop index using object copy');

            newPropertyIndexes = /*new Array(keysLength)*/ {};
            var i = keysLength;
            while (i--) {
                newPropertyIndexes[i] = propertyIndexes[i];
            }

            newPropertyIndexes[propertyIndex] = transactions.length -1;
            newPropertyIndexes.indexGeneration = 0;

        } else {

            //console.log('new prop index using object create');

            var propertyIndexDescriptor = {
                indexGeneration: {
                    value: propertyIndexes.indexGeneration + 1
                }
            };
            propertyIndexDescriptor[propertyIndex] = {
                value: transactions.length -1
            };
            //console.log('propertyIndexDescriptor: ', JSON.stringify(propertyIndexDescriptor,null,4))
            newPropertyIndexes = Object.create(propertyIndexes, propertyIndexDescriptor);
        }


        //console.log('propertyIndexes: ', JSON.stringify(propertyIndexes,null,4))
        //console.log('newPropertyIndexes: ', JSON.stringify(newPropertyIndexes,null,4))
        Object.freeze(newPropertyIndexes);

        //return new instance, give new property
        //indexes
        return new Contructor(newPropertyIndexes);
    }

    function mkGetterSetter(opts) {
        return function getterSetter(value) {
            if (typeof value === 'undefined') {
                return get(this.propertyIndexes, opts);
            } else {
                return set(value, this.propertyIndexes,opts);
            }
        };
    }

    function I(data){
        //cache key names
        var keys = Object.keys(data);
        var keysLength = keys.length;

        //TODO: check for data immutability or do a shallow copy
        //of input data


        var transactions = [data];
        var propertyIndexes = buildFirstPropertyIndexes(keysLength);
        var Proto = {};

        function Contructor(propertyIndexes){
            this.propertyIndexes = propertyIndexes;
            Object.freeze(this);
        }
        Contructor.prototype = Proto;

        //
        // build getter/setter for all properties
        // and save them in prototype.
        //

        var i = keysLength;
        while(i--){
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
})();


module.exports = I;
