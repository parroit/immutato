# immutato 

immutable js object

[![Build Status](https://secure.travis-ci.org/parroit/immutato.png?branch=master)](http://travis-ci.org/parroit/immutato) [![NPM version](https://badge-me.herokuapp.com/api/npm/immutato.png)](http://badges.enytc.com/for/npm/immutato) 

## Getting Started
Install the module with: `npm install immutato`

```javascript
var i = require('immutato');
var Person = i.struct('Person', {
    name: i.String,
    age: i.Number
});

var me = Person({name:'Andrea', age:38});    //ok
var him = Person({name:12, age:38});    //throws

```

## Features

* Immutable data structure
* Set method to create a new immutable object with updated data
* Idempotent types
* Optional new 
* Predefined types for primitives, structures, list, enums
* Retain type information at runtime
* Minimize object copy using prototype chain.



## Other stuff

* documentation - maybe I will add documentation if you ask it. open an issue for this.
* support - open an issue [here](https://github.com/parroit/immutato/issues).

## License
[MIT](http://opensource.org/licenses/MIT) © 2014, Andrea Parodi
