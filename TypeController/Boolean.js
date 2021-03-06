'use strict';

var prime = require('prime');
var VTC = require('../TypeController')
var Promise = require('promise')
var object = {
    'get': require('mout/object/get'),
    'merge': require('mout/object/merge')
};

var Boolean = prime({

    inherits: VTC,

    options: {
        "true": "true",
        "false": "false"
    },

    constructor: function () {
        VTC.apply(this, arguments)
    },

    render: function() {
        var t = this.typeTag['true'] || ""
        var f = this.typeTag['false'] || ""

        if (!this.typeTag['true'] && ! this.typeTag['false']) {
            t = this.options['true']
            f = this.options['false']
        }

        var val = object.get(this.item.values, this.typeTag.key)
        return Promise.resolve(val !== false && val !== undefined && val !== null ? t : f)
    }

});

module.exports = Boolean