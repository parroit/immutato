/*
 *
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.should();

var immutato = require('../lib/immutato.js');

describe('immutato', function() {
    it('is defined', function() {
        immutato.should.be.a('function');
    });

    describe('build a constructor', function() {
        var Imm;

        before(function() {
            Imm = immutato.struct({
                name: immutato.StringType,
                age: immutato.NumberType
            }, 'Person');

        });


        it('has properly name', function() {
            Imm.name.should.be.equal('Person');
        });


        it('throws with bad argument number', function() {
            expect(function() {
                new Imm({
                    a: 1
                });
            }).to.throw(TypeError);
        });

        it('throws with bad argument type', function() {
            expect(function() {
                new Imm({
                    name: 1,
                    age: 2
                });
            }).to.throw(TypeError);
        });

        it('return immutable instances', function() {
            expect(function() {
                var imm = new Imm({
                    name: 'Andrea',
                    age: 2
                });
                imm.name = 'Giorgio';

            }).to.throw(TypeError);
        });



        it('provide access to properties', function() {
            var imm = new Imm({
                name: 'Andrea',
                age: 2
            });

            imm.name.should.be.equal('Andrea');
        });

        it('support instanceof', function() {

            var imm = new Imm({
                name: 'Andrea',
                age: 2
            });

            (imm instanceof Imm).should.be.equal(true);
            (imm instanceof immutato).should.be.equal(false);
        });

        it('coherce empty arguments', function() {

            var imm = Imm.from();

            imm.name.should.be.equal('');
            imm.age.should.be.equal(0);
        });

        it('coherce all arguments', function() {

            var imm = Imm.from({
                name: 42.42,
                age: '42'
            });

            imm.name.should.be.equal('42.42');
            imm.age.should.be.equal(42);
        });

        it('set return new immutable instance', function() {

            var imm = Imm.from({
                name: 'Giorgio',
                age: '42'
            });

            var imm2 = imm.set('name', 'Gigio');

            imm2.should.not.be.equal(imm);
            imm2.name.should.be.equal('Gigio');

        });




    });

});
