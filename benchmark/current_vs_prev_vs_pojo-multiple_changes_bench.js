/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var assign = require('object-assign');
var immutato_prev = require('../..');
var immutato = require('../lib/immutato.js');
var Immutable = require('immutable');

var suite = module.exports = {
    maxTime: 2,
    setup: function() {
        var i = 100;
        var payloadTypes = {
            name: immutato_prev.String,
            age: immutato_prev.Number
        };

        var payloadProps = {
            name: 'Andrea',
            age: 38
        };


        while(i--) {
            payloadTypes['field'+i] = immutato_prev.Number;
            payloadProps['field'+i] = i;
        }

        suite.payloadProps = payloadProps;

        var Imm = immutato_prev.struct(payloadTypes, 'Person');
        var $f = immutato(suite.payloadProps);


        suite.immPrev = new Imm(payloadProps);
        suite.immCurr = $f(payloadProps);
        suite.immJs = Immutable.Map(payloadProps);

        suite.pojo = payloadProps;

        suite.pojoCounter = 0;
        suite.prevCounter = 0;
        suite.currCounter = 0;
        suite.immJsCounter = 0;
        Object.freeze(suite.pojo);
    },

    name: 'current vs prev version vs pojo -- change properties multiple times',

    tests: {
        'current version': {
            fn: function() {
                suite.immCurr = suite.immCurr.age(suite.currCounter++);
            },
            onComplete: function(){
                suite.immCurr.dispose();
            }
        },

        
        'immutable.js': function() {
            suite.immJs = suite.immJs.set('age', suite.immJsCounter++);

        },

        'previous version': function() {
            suite.immPrev = suite.immPrev.set('age', suite.prevCounter++);
        },

        'pojo': function() {
            suite.pojo = assign({},suite.pojo);
            suite.pojo.age = suite.pojoCounter++;
            Object.freeze(suite.pojo);
        }

    }
};

suite.setup();

