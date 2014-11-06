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

var immutato = require('../lib/immutato.js');
var util = require('./util');
var shouldCoherceTo = util.shouldCoherceTo(immutato.BooleanType);
var shouldPassAssertionWith = util.shouldPassAssertionWith(immutato.BooleanType);
var shouldFailAssertionWith = util.shouldFailAssertionWith(immutato.BooleanType);

describe('BooleanType', function() {
    var Imm;

    before(function() {
        Imm = immutato.struct({
            female: immutato.BooleanType
        }, 'Person');

    });

    it('convert primitive Number', function() {
        Imm.props.female.type.should.be.equal(immutato.BooleanType);
    });

    it('is defined', function() {
        immutato.BooleanType.should.be.a('object');
    });


    shouldCoherceTo('1 to true', 1,true);
    shouldCoherceTo('0 to false', 0, false);
    shouldCoherceTo('string true to true', 'true', true);
    shouldCoherceTo('string false to false', 'false', false);
    shouldCoherceTo('string on to true', 'on', true);
    shouldCoherceTo('string off to false', 'off', false);
    shouldCoherceTo('string yes to true', 'yes', true);
    shouldCoherceTo('string no to false', 'no', false);
    shouldCoherceTo('string 1 to true', '1', true);
    shouldCoherceTo('string 0 to false', '0', false);


    shouldPassAssertionWith('true',true);
    shouldPassAssertionWith('false',false);

    shouldFailAssertionWith('number',42);
    shouldFailAssertionWith('string','true');
    shouldFailAssertionWith('object',{});
    shouldFailAssertionWith('null',null);
    shouldFailAssertionWith('undefined',undefined);
    shouldFailAssertionWith('RegExp',/./);
    shouldFailAssertionWith('NaN',NaN);
    shouldFailAssertionWith('Function',function(){});
    shouldFailAssertionWith('Infinity',Infinity);



});



