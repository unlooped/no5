'use strict';

var prime = require('prime')
var item = require('../item')
var array = {
	'forEach': require('prime/array/forEach')
}
var object = {
	'mixIn': require('prime/object/mixIn')
}
var Partial = require('./Partial')
var Promise = require('promise')
var all = Promise.all

var DynPartial = prime({

	constructor: function (varTypeTag, tplDesc, tplController) {
		this.templateController = tplController
		this.varTypeTag = varTypeTag
		this.tplDesc = tplDesc
	},

	render: function() {
		return new Promise(function(resolve, reject) {
			var desc = this.tplDesc
			var items = this.tplDesc.values[this.varTypeTag.name]
			var ps = []
			if (!items || items.length === 0) return resolve('')

			items.sort(function(a, b) {
				return a.pos - b.pos
			})

			array.forEach(items, function(item) {
				ps.push(this.templateController.getTemplateParser().parse(item))
			}, this)

			all(ps).then(function(templates) {
				resolve(templates.join(''))
			})
		}.bind(this));
	}

})

module.exports = DynPartial