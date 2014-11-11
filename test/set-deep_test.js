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

var setDeep = require('../lib/set-deep.js');
var immutato = require('../lib/immutato.js');

var Country = immutato.struct({
    name: immutato.String,
    population: immutato.Number,

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


describe('setDeep @only', function() {
    var person;

    before(function() {

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

    it('is defined', function() {
        setDeep.should.be.a('function');
    });

    it('can be applied only to struct', function() {
        expect(function() {
            setDeep.call('');
        }).to.throws(TypeError, 'setDeep context must be a struct');

    });

    it('work on struct', function() {

        setDeep.call(person,'born.name','Ceranesi');

    });

    describe('when applyed', function() {
        var personNewVer;

        before(function(){
            personNewVer = setDeep.call(person,'born.state.country.name','Italia');
        });


        it('change final property', function() {
            personNewVer.born.state.country.name.should.be.equal('Italia');
        });

        it('change mid properties', function() {
            personNewVer.born.state.country.should.not.be.equal(person.born.state.country);
            personNewVer.born.state.should.not.be.equal(person.born.state);
            personNewVer.born.should.not.be.equal(person.born);
        });

        it('original final property immutate', function() {
            person.born.state.country.name.should.be.equal('Italy');
        });

        it('return new root Object', function() {
            
            person.should.not.be.equal(personNewVer);
        });

        it('return struct', function() {
            
            personNewVer.constructor.meta.type.should.be.equal('Person');
        });

        it('return same type', function() {
            
            personNewVer.constructor.meta.kind.should.be.equal('structure');
        });


        it('other property are immutate', function() {
            person.live.should.be.equal(personNewVer.live);
        });

    });
});
