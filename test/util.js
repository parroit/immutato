/*
 *
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';
var chilli = require('chilli');
var chai = require('chai');
var expect = chai.expect;
var toString = Object.prototype.toString;

exports.shouldCoherceTo = chilli(function(type, description, sourceValue, expectedResult) {
    it('Coherce ' + description, function() {


        var coherced = type.from(sourceValue);

        if (toString.call(expectedResult) === '[object Date]') {
            expectedResult = expectedResult.getTime();
            coherced = coherced.getTime();

        }
        coherced.should.be.equal(expectedResult);
    });

});

exports.shouldPassAssertionWith = chilli(function(type, description, sourceValue) {
    it('Assert successfully with ' + description, function() {
        type.assertIs(sourceValue);
    });

});


exports.shouldFailAssertionWith = chilli(function(type, description, sourceValue) {
    it('Fail assertion with ' + description, function() {
        expect(function() {
            type.assertIs(sourceValue, 'fieldName');
        }).to.throw(TypeError, 'fieldName should be a ' + type.meta.type + ', but `' + sourceValue + '` was given.');
    });

});
