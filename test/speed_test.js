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
var assign = require('object-assign');

immutato.fn.setCopy = function(propName, value) {
    var newData = assign({}, this);
    newData[propName] = value;
    return immutato(newData);
};

describe('immutato', function() {
    var Imm;

    before(function() {
        Imm = immutato.struct({
            name: immutato.StringType,
            age: immutato.NumberType
        }, 'Person');

    });

    function profile(descr, fn) {
        var start = new Date().getTime();
        fn();
        var end = new Date().getTime();

        console.log(descr + ':%s ms.', end - start);
    }

    it('creation and set', function() {
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


        profile('change property of immutato object', function() {
            for (i = 0; i < 10000; i++) {
                imm = new Imm({
                    name: 'Andrea',
                    age: i
                });

                var imm2 = imm.set('age', 42);
                imm2.age.should.be.equal(42);
            }
        });

        profile('change property of pojo', function() {
            for (i = 0; i < 10000; i++) {
                imm = {
                    name: 'Andrea',
                    age: i
                };

                imm.age = 42;
                imm.age.should.be.equal(42);
            }
        });

    });

    it('repeated set property', function() {
        this.timeout(20000);

        var data = {
            ciao: 'ciao'
        };
        var fields = {
            ciao: immutato.StringType
        };
        var iterations = 10000;
        var i = 0;

        for (; i < 100; i++) {
            fields['prop' + i] = immutato.StringType;
            data['prop' + i] = '0';
        }

        var Struct = immutato.struct(fields);

        var o = new Struct(data);
        var test;

        profile('Set property using object assign', function() {

            var i = 0;

            for (; i < iterations; i++) {
                o = o.setCopy('seed', i);
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
                o = o.set('seed', i);
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
