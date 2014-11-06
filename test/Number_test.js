/*
 * \
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.should();

var immutato = require('../lib/immutato');
var util = require('./util');
var shouldCoherceTo = util.shouldCoherceTo(immutato.Number);
var shouldPassAssertionWith = util.shouldPassAssertionWith(immutato.Number);
var shouldFailAssertionWith = util.shouldFailAssertionWith(immutato.Number);


describe('Number', function() {
    var Imm;

    before(function() {
        Imm = immutato.struct({
            age: immutato.Number
        }, 'Person');

    });

    it('convert primitive Number', function() {
        Imm.meta.fields.age.type.type.should.be.equal('Number');
    });

    it('is defined', function() {
        immutato.Number.should.be.a('object');
    });

    shouldCoherceTo('string float to Number', '12.42', 12.42);
    shouldCoherceTo('string int to Number', '12', 12);
    shouldCoherceTo('undefined to 0', undefined, 0);
    shouldCoherceTo('null to 0', null, 0);
    shouldCoherceTo('NaN to 0', NaN, 0);
    shouldPassAssertionWith('positive float',42.42);
    shouldPassAssertionWith('positive integer',42);
    shouldPassAssertionWith('positive zero',0);
    shouldPassAssertionWith('negative float',-42.42);
    shouldPassAssertionWith('negative integer',-42);
    shouldPassAssertionWith('negative zero',-0);

    shouldFailAssertionWith('string','a string');
    shouldFailAssertionWith('boolean',true);
    shouldFailAssertionWith('object',{});
    shouldFailAssertionWith('null',null);
    shouldFailAssertionWith('undefined',undefined);
    shouldFailAssertionWith('RegExp',/./);
    shouldFailAssertionWith('NaN',NaN);
    shouldFailAssertionWith('Function',function(){});
    shouldFailAssertionWith('Infinity',Infinity);



});
