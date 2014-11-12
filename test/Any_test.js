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
var shouldCoherceTo = util.shouldCoherceTo(immutato.Any);
var shouldPassAssertionWith = util.shouldPassAssertionWith(immutato.Any);
var shouldFailAssertionWith = util.shouldFailAssertionWith(immutato.Any);


describe('Any @only', function() {
    var Imm;

    before(function() {
        Imm = immutato.struct({
            age: immutato.Any
        }, 'Person');

    });

    it('convert primitive Any', function() {
        Imm.meta.fields.age.type.type.should.be.equal('Any');
    });

    it('is defined', function() {
        immutato.Any.should.be.a('object');
    });

    shouldCoherceTo('string to string', '12.42', '12.42');
    shouldCoherceTo('number to number', 12, 12);
    shouldCoherceTo('undefined to undefined', undefined, undefined);
    shouldCoherceTo('null to null', null, null);
    shouldCoherceTo('0 to 0', 0, 0);
    shouldCoherceTo('NaN to NaN', NaN, NaN);

    shouldPassAssertionWith('positive float',42.42);
    shouldPassAssertionWith('positive integer',42);
    shouldPassAssertionWith('positive zero',0);
    shouldPassAssertionWith('negative float',-42.42);
    shouldPassAssertionWith('negative integer',-42);
    shouldPassAssertionWith('negative zero',-0);

    shouldPassAssertionWith('string','a string');
    shouldPassAssertionWith('boolean',true);
    shouldPassAssertionWith('object',{});
    shouldPassAssertionWith('null',null);
    shouldPassAssertionWith('undefined',undefined);
    shouldPassAssertionWith('RegExp',/./);
    shouldPassAssertionWith('NaN',NaN);
    shouldPassAssertionWith('Function',function(){});
    shouldPassAssertionWith('Infinity',Infinity);



});
