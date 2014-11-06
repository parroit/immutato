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
var shouldCoherceTo = util.shouldCoherceTo(immutato.String);
var shouldPassAssertionWith = util.shouldPassAssertionWith(immutato.String);
var shouldFailAssertionWith = util.shouldFailAssertionWith(immutato.String);

describe('String', function() {
    var Imm;

    before(function() {
        Imm = immutato.struct({
            name: immutato.String
        }, 'Person');

    });

    it('convert primitive Number', function() {
        Imm.meta.fields.name.type.type.should.be.equal('String');
    });

    it('is defined', function() {
        immutato.String.should.be.a('object');
    });


    shouldCoherceTo('float to String', 12.42,'12.42');
    shouldCoherceTo('int to String', 12, '12');
    shouldCoherceTo('boolean true to String', true, 'true');
    shouldCoherceTo('boolean false to String', false, 'false');
    shouldCoherceTo('undefined to empty string', undefined, '');
    shouldCoherceTo('null to empty string', null, '');

    shouldPassAssertionWith('empty string','');
    shouldPassAssertionWith('a string','ciao');

    shouldFailAssertionWith('number',42);
    shouldFailAssertionWith('boolean',true);
    shouldFailAssertionWith('object',{});
    shouldFailAssertionWith('null',null);
    shouldFailAssertionWith('undefined',undefined);
    shouldFailAssertionWith('RegExp',/./);
    shouldFailAssertionWith('NaN',NaN);
    shouldFailAssertionWith('Function',function(){});
    shouldFailAssertionWith('Infinity',Infinity);



});



