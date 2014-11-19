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
var I = require('../devel/lib/immutato.js');

describe('immutato', function() {
    var Imm;

    this.timeout(5000);

    before(function() {
        Imm = immutato.struct({
            name: immutato.String,
            age: immutato.Number
        }, 'Person');

    });

    function profile(descr, fn) {
        var start = new Date().getTime();
        fn();
        var end = new Date().getTime();

        console.log(descr + ':%s ms.', end - start);
    }

    it('creation and set @perf', function() {
        var imm;
        var i;

        profile('create immutato', function() {
            for (i = 0; i < 10000; i++) {
                imm = new Imm({
                    name: 'Andrea',
                    age: i
                });

                imm.name.should.be.equal('Andrea');
                imm.age.should.be.equal(i);
            }
        });

        profile('create pojo', function() {
            for (i = 0; i < 10000; i++) {
                imm = {
                    name: 'Andrea',
                    age: i
                };

                imm.name.should.be.equal('Andrea');
                imm.age.should.be.equal(i);
            }
        });

        profile('create immutato NEW VERSION', function() {
            for (i = 0; i < 10000; i++) {
                imm = I({
                    name: 'Andrea',
                    age: i
                });

                imm.name().should.be.equal('Andrea');
                imm.age().should.be.equal(i);
            }
        });


        profile('create immutato object & change property', function() {
            imm = new Imm({
                name: 'Andrea',
                age: 0
            });

            for (i = 0; i < 1000; i++) {

                imm = imm.set('age', 42);
                imm.age.should.be.equal(42);
            }
        });

        profile('create pojo & change property', function() {
            for (i = 0; i < 1000; i++) {
                imm = {
                    name: 'Andrea',
                    age: i
                };

                imm.age = 42;
                imm.age.should.be.equal(42);
            }
        });

        profile('create immutato NEW VERSION & change property', function() {
            for (i = 0; i < 1000; i++) {
                imm = I({
                    name: 'Andrea',
                    age: i
                });

                imm = imm.age(42);
                imm.age().should.be.equal(42);
            }
        });

    });

    it('repeated set property @perf', function() {

        var data = {
            ciao: 'ciao'
        };
        var fields = {
            ciao: immutato.String
        };
        var iterations = 10000;
        var i = 0;

        for (; i < 100; i++) {
            fields['prop' + i] = immutato.String;
            data['prop' + i] = '0';
        }

        var Struct = immutato.struct(fields);

        var o = new Struct(data);
        var inv = I(data);
        var test;


        profile('Set property using prototype chain', function() {

            var i = 0;
            for (; i < iterations; i++) {
                o = o.set('ciao', 'ciao' + i);
            }
        });


        profile('Read property using prototype chain', function() {

            var i = 0;
            for (; i < iterations/10; i++) {
                test = o.ciao;
            }
        });


        profile('Set property using transactions', function() {

            var i = 0;
            for (; i < iterations; i++) {
                inv = inv.ciao('ciao' + i);
            }
        });


        profile('Read property using transactions', function() {

            var i = 0;
            for (; i < iterations/10; i++) {
                test = inv.ciao();
            }
        });
    });

});
