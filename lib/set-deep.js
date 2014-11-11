/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function setDeep(propertyPath, value) {
    var Type = this.constructor;
    //console.dir(Type)
    if (!Type || !Type.meta || Type.meta.kind !== 'structure') {
        throw new TypeError('setDeep context must be a struct');
    }

    var pathSegments = propertyPath.split('.');
    console.dir(pathSegments);
    var pathObjects = [];
    var current = this;

    pathSegments.forEach(function(segment) {
        pathObjects.push({
        	target:current,
        	property: segment
        });
        current = current[segment];
    });

    console.dir(pathObjects);
};
