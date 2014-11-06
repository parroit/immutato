/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var immutato = require('../lib/immutato.js');

describe('immutato', function() {
    this.timeout(200000);

    it('is defined', function() {
        immutato.should.be.a('function');
    });

    function profile(descr,  fn) {
        var start = new Date().getTime();
        fn();
        var end = new Date().getTime();

        console.log(descr + ':%s ms.', end - start);
    }

    it('is fast', function() {
        var data = {
            ciao: 'ciao'
        };
        var iterations = 10000;
        var i = 0;

        for (; i < 100; i++) {
            data[String(i)] = 0;
        }

        var o = immutato(data);
        var test;

        profile('Set property using object assign', function() {

            var i = 0;

            for (; i < iterations; i++) {
                o = o.set('seed', i);
            }
        });

        profile('Read property using object assign', function() {
            var i = 0;
            for (; i < iterations; i++) {
                test = o.ciao;
            }
        });

        profile('Set property using prototype chain', function() {

            var i = 0;

            for (; i < iterations; i++) {
                o = o.setP('seed', i);
            }
        });

        profile('Read property using prototype chain', function() {
            var i = 0;
            for (; i < iterations; i++) {
                test = o.ciao;
            }
        });



    });

});
