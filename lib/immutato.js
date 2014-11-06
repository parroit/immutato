/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var immutato = module.exports = {};
var mixinModifiers = require('./modifiers');

immutato.struct = require('./struct');
immutato.String = require('./String');
immutato.Number = require('./Number');
immutato.Boolean = require('./Boolean');
immutato.Date = require('./Date');
immutato.Any = require('./Any');



mixinModifiers(immutato.Number);
mixinModifiers(immutato.String);
mixinModifiers(immutato.Boolean);
mixinModifiers(immutato.Boolean);
