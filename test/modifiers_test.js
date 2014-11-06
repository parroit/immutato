/*
 * jt
 * https://github.com/parroit/jt
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.should();

var i = require('../lib/immutato.js');

var Cliente = i.struct({
    description: i.String.maxlength(4)

}, 'Cliente');

var Person = i.struct({
    age: i.Number.maxlength(4)

}, 'Person');


var ClienteMin = i.struct({
    description: i.String.minlength(4)

}, 'ClienteMin');


var ClienteOpt = i.struct({
    description: i.String.optional()

}, 'ClienteOpt');

var PersonMin = i.struct({
    age: i.Number.minlength(4)

}, 'PersonMin');


var ClienteSize = i.struct({
    description: i.String.size(4)

}, 'ClienteSize');

var PersonSize = i.struct({
    age: i.Number.size(4)

}, 'PersonSize');


var PersonLabeled = i.struct({
    age: i.Number.label('Age of person')

}, 'PersonLabeled');


var PersonDef = i.struct({
    age: i.Number.default(42)

}, 'PersonDef');


describe('immutato', function() {

    describe('type modifiers', function() {
        describe('default', function() {
            it('pass for missing values', function() {
                new PersonDef({});
            });

            it('pass for undefined', function() {
                new PersonDef({
                    age: undefined
                });
            });

            it('pass for null', function() {
                new PersonDef({
                    age: null
                });
            });

            it('pass for value', function() {
                new PersonDef({
                    age: 23
                });
            });

            it('set value to given', function() {
                var p = new PersonDef({});
                p.age.should.be.equal(42);
            });

            it('don\'t alter type name', function() {
                var type = PersonDef.meta.fields.age.type.type;
                type.should.be.equal('Number');

            });

            it('alter meta info', function() {
                var def = PersonDef.meta.fields.age.type.default;
                def.should.be.equal(42);

            });
        });

        describe('label', function() {


            it('pass for valid value on base type', function() {
                new PersonLabeled({
                    age: 42
                });
            });

            it('don\'t alter type name', function() {
                var type = PersonLabeled.meta.fields.age.type.type;
                type.should.be.equal('Number');

            });

            it('alter meta info', function() {
                var label = PersonLabeled.meta.fields.age.type.label;
                label.should.be.equal('Age of person');

            });
        });

        describe('optional', function() {


            it('pass for missing values', function() {
                new ClienteOpt({});
            });

            it('pass for undefined', function() {
                new ClienteOpt({
                    description: undefined
                });
            });

            it('pass for null', function() {
                new ClienteOpt({
                    description: null
                });
            });

            it('pass for value', function() {
                new ClienteOpt({
                    description: 'ciao'
                });
            });


            it('alter type name', function() {
                var type = ClienteOpt.meta.fields.description.type.type;
                type.should.be.equal('String_optional');

            });

            it('alter meta info', function() {
                var optional = ClienteOpt.meta.fields.description.type.optional;
                optional.should.be.equal(true);

            });
        });

        describe('size', function() {

            it('is checked for lenght != size', function() {
                expect(function() {
                    new ClienteSize({
                        description: 'Eban++'
                    });
                }).to.throws(TypeError, 'Length of `Eban++` is different than 4');
            });

            it('is checked for undefined lenght', function() {
                expect(function() {
                    new PersonSize({
                        age: 42
                    });
                }).to.throws(TypeError, 'Length of `42` is undefined');
            });

            it('pass for correct values', function() {
                new ClienteSize({
                    description: 'Eban'
                });
            });

            it('alter type name', function() {
                var type = ClienteSize.meta.fields.description.type.type;
                type.should.be.equal('String_size');

            });

            it('alter meta info', function() {
                var size = ClienteSize.meta.fields.description.type.size;
                size.should.be.equal(4);

            });
        });

        describe('maxlength', function() {

            it('is checked for lenght > max', function() {
                expect(function() {
                    new Cliente({
                        description: 'Eban++'
                    });
                }).to.throws(TypeError, 'Length of `Eban++` is greater than 4');
            });

            it('is checked for undefined lenght', function() {
                expect(function() {
                    new Person({
                        age: 42
                    });
                }).to.throws(TypeError, 'Length of `42` is undefined');
            });

            it('pass for correct values', function() {
                new Cliente({
                    description: 'Eban'
                });
            });

            it('alter type name', function() {
                var type = Cliente.meta.fields.description.type.type;
                type.should.be.equal('String_maxlength');

            });

            it('alter meta info', function() {
                var max = Cliente.meta.fields.description.type.maxlength;
                max.should.be.equal(4);

            });
        });

        describe('minlength', function() {

            it('is checked for lenght < min', function() {
                expect(function() {
                    new ClienteMin({
                        description: 'Eb'
                    });
                }).to.throws(TypeError, 'Length of `Eb` is less than 4');
            });

            it('is checked for undefined lenght', function() {
                expect(function() {
                    new PersonMin({
                        age: 42
                    });
                }).to.throws(TypeError, 'Length of `42` is undefined');
            });

            it('pass for correct values', function() {
                new ClienteMin({
                    description: 'Ebanaa'
                });
            });

            it('alter type name', function() {
                var type = ClienteMin.meta.fields.description.type.type;
                type.should.be.equal('String_minlength');

            });

            it('alter meta info', function() {
                var min = ClienteMin.meta.fields.description.type.minlength;
                min.should.be.equal(4);

            });
        });
    });


    /*
    it('check structure', function() {
        var t = new Cliente({
            description: 'Eban',
            cliente: true
        });
        t.description.should.be.equal('Eban');
        t.cliente.should.be.equal(true);
    });


    it('set default values', function() {
        var t = new Cliente({
            description: 'Eban'
        });
        t.cliente.should.be.equal(true);
    });

*/



    /*
        it('check minlength', function() {
            expect(function() {
                new Cliente({
                    description: 'Eban',
                    codiceFiscale: '-'
                });
            }).to.throws(Error);
        });

        it('check size', function() {
            expect(function() {
                new Cliente({
                    description: 'Eban',
                    partitaIva: '-'
                });
            }).to.throws(Error);
        });


        it('concatenation of type modifiers works', function() {
            expect(function() {
                new Cliente({
                    description: 'Eban',
                    indirizzo: 'Via Casata'
                });
            }).to.throws(Error);

        });
    */
});
