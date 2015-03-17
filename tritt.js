'use strict';

function Tritt(element){
	this.registerElement(element);
	this.options = {};
};

Tritt.prototype.registerElement = function(element) {
	var that = this;
	
	var CustomElementPrototype = Object.create(HTMLElement.prototype);

	CustomElementPrototype.createdCallback = function() {

		for (var key in that.options) {
			if (key !== undefined ) {
				this[key] = that.options[key];
			}
		}
	}

	var custom_element = document.registerElement(element, {
		prototype: CustomElementPrototype
	});

};