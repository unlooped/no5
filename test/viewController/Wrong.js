'use strict';

var prime = require('prime')
var VC = require('../../ViewController')

var Wrong = prime({

    inherits: VC,

    constructor: function () {
        VC.apply(this, arguments)
    }

})

module.exports = Wrong