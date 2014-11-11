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


describe('setDeep', function() {
    var person;

    function create() {

        person = new Person({
            name: 'Gianni',
            born: {
                name: 'Genova',

                country: {
                    name: 'Italy',
                    population: 50000000
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
    }


    it('non optional properties must be supplied', function() {
        expect(function() {
            create();
        }).to.throws(TypeError, '.born.state.name should be a String, but `undefined` was given.');

    });


});
