/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var sauceRun = require('sauce-run');

sauceRun('http://www.parro.it/immutato/test.html')
    .auth(process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESS_KEY)
    .build('0.2.0')
    .browser('firefox', 'Windows 7' , '33')
    .browser('firefox', 'Linux' , '33')

    .browser('chrome', 'Linux' , '38')
    .browser('chrome', 'Linux' , 'dev')
    .browser('chrome', 'Windows 7' , '38')

    .browser('internet explorer', 'Windows 7' , '11')
    .browser('internet explorer', 'Windows 7' , '10')
    .browser('internet explorer', 'Windows 8.1' , '11')

    .browser('safari', 'OS X 10.9' , '7')
    .browser('safari', 'OS X 10.10' , '8')

    .browser('opera', 'Windows 7' , '12')
    .browser('opera', 'Windows 7' , '11')

    .run()

    .then(function(result){
        console.log( JSON.stringify(result,null,'\t') );
    })
  
    .catch(function(err){
        console.log(err);
    });



