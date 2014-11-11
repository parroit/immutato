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
    born: City
}, 'Person');


describe('setDeep @only', function() {
    it('is defined', function() {
        setDeep.should.be.a('function');
    });

  
});
