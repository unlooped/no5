'use strict';

var prime = require('prime')
var TemplateController = require('./TemplateController')
var object = {
    'merge': require('mout/object/merge'),
    'forOwn': require('mout/object/forOwn')
}

var ENUM_MODE = require('./enums').ENUM_MODE

var TemplateDescriptor = prime({

    'constants': {
        'language': 'en_EN',
        'dateFormat': 'DD.MM.YYYY',
        'mode': ENUM_MODE.DEVELOP,
        'throwError': false,
        'parser': {
            'cache': false
        }
    },

    'ENUM_MODE': ENUM_MODE,

    'typeController': null,
    'dataController': null,

    constructor: function (templateLoader, constants) {
        this.constants = object.merge(this.constants, constants);

        this.templateLoader = templateLoader

        this.typeController = {}
        this.dataController = {}
    },

    registerTypeController: function(name, controller, options) {
        this.typeController[name] = {'controller': controller, 'options': options}
    },

    registerDataController: function(name, controller, options) {
        this.dataController[name] = {'controller': controller, 'options': options}
    },

    getDataController: function(name) {
        if (this.dataController[name]) return this.dataController[name].controller
        return null
    },

    getTemplateController: function() {
        var tplController = new TemplateController(this.templateLoader, this.constants)

        object.forOwn(this.typeController, function(item, name) {
            tplController.registerTypeController(name, item.controller, item.options)
        })

        object.forOwn(this.dataController, function(item, name) {
            tplController.registerDataController(name, item.controller, item.options)
        })

        return tplController
    },

    parse: function(item, session) {
        if (!item) throw new Error('Need input!')
        var tplController = this.getTemplateController()
        tplController.setSession(session)

        return tplController.parse(item)
    }

});

TemplateDescriptor.ENUM_MODE = ENUM_MODE

module.exports = TemplateDescriptor