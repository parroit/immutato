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
var shouldCoherceTo = util.shouldCoherceTo(immutato.Date);
var shouldPassAssertionWith = util.shouldPassAssertionWith(immutato.Date);
var shouldFailAssertionWith = util.shouldFailAssertionWith(immutato.Date);

describe('Date', function() {
    var Imm;

    before(function() {
        Imm = immutato.struct({
            born: immutato.Date
        }, 'Person');

    });

    it('convert primitive Number', function() {
        Imm.meta.fields.born.type.type.should.be.equal('Date');
    });

    it('is defined', function() {
        immutato.Date.should.be.a('object');
    });


    
    

    shouldCoherceTo('ISO string to date', '2012-04-23T18:25:43.511Z', 1335205543511);
    shouldCoherceTo('number ms from epoch to date', 1414092429000, 1414092429000 );



    shouldPassAssertionWith('date',new Date());


    shouldFailAssertionWith('boolean',true);
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



