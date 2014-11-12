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

var Fields = require('../lib/Fields');

describe('Fields', function() {
    var fields;

    before(function() {
        fields = new Fields();
        fields.a = 'one';
        fields.b = 'property';
        fields.c = 'another';
    });

    it('is defined', function() {
        Fields.should.be.a('function');
    });

    it('loop values with forEach', function() {
        var results = [];
        fields.forEach(function(f) {
            results.push(f);
        });
        results.should.be.deep.equal([
            'one',
            'property',
            'another'
        ]);
    });

    it('transform values with map', function() {
        var results = fields.map(function(f) {
            return f.toUpperCase();
        });
        results.should.be.deep.equal([
            'ONE',
            'PROPERTY',
            'ANOTHER'
        ]);
    });

    it('get an array of values with toArray', function() {
        var results = fields.toArray();

        results.should.be.deep.equal([
            'one',
            'property',
            'another'
        ]);
    });

    it('filter values with filter', function() {
        var results = fields.filter(function(v){
            return v.length > 3;
        });
        
        results.should.be.deep.equal([
            'property',
            'another'
        ]);
    });


});
