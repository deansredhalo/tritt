'use strict';

var useShadow;

function Tritt(element){
	var that = this;

	this.options = {};
	this.events = {};

	window.addEventListener('DOMContentLoaded', function() {
		that.registerElement(element);
	}, false);
};

Tritt.prototype.registerElement = function(element) {
	var that = this;

	if (this.options.useShadow !== undefined) {
		if (this.options.useShadow === true) {
			useShadow = true;
		}
		delete this.options.useShadow;
	}
	
	var CustomElementPrototype = Object.create(HTMLElement.prototype);

	CustomElementPrototype.createdCallback = function() {

		for (var key in that.options) {
			if (key !== undefined ) {
				this[key] = that.options[key];
			}
		}

		this.createShadowRoot();
	}

	try {
		var custom_element = document.registerElement(element, {
			prototype: CustomElementPrototype
		});
		console.log('Registered Element', element);
	}
	catch (err) {
		return;
	}

};