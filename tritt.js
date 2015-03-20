'use strict';

var useShadow;

function Tritt(element){
	var that = this;

	window.addEventListener('DOMContentLoaded', function() {
		that.registerElement(element);
		that.createShadowDOM(element);
		that.parseStylesAndScripts(element);
	}, false);
};

Tritt.prototype.registerElement = function(element) {
	var that = this;

	var CustomElementPrototype = Object.create(HTMLElement.prototype);

	try {
		var custom_element = document.registerElement(element, {
			prototype: CustomElementPrototype
		});

		console.log('Registered Element', element);

		return;
	}
	catch (err) {
		return;
	}
};

Tritt.prototype.createShadowDOM = function(element) {
	var that = this;

	var unaltered = document.querySelectorAll(element);

	(function() {
		for (var i = 0; i < unaltered.length; i++) {
			if (unaltered[i].hasAttributes()) {
				if (unaltered[i].attributes['shadow'] !== undefined) {
					that.populateShadowDOM(unaltered[i]);
				}
			}
		}
	})();
};

Tritt.prototype.populateShadowDOM = function(element) {	
	var shadow = element.createShadowRoot();

	shadow.innerHTML = element.innerHTML;

	element.innerHTML = null;

	console.log('Created and populated Shadow DOM for element', element);

	return;
};

Tritt.prototype.parseStylesAndScripts = function(element) {
	var that = this;

	var element = document.querySelector(element);

	if (element.hasAttributes()) {
		if (element.attributes['style'].nodeValue !== undefined) {
			var styleNode = document.createElement('style');

			var styleNodeTypeAttr = document.createAttribute('type');
			styleNodeTypeAttr.value = "text/css";

			var styleContents;

			that.processFile(element.attributes['style'].nodeValue).then(function(response) {
				styleContents = response;

				styleNode.attributes.setNamedItem(styleNodeTypeAttr);

				styleNode.textContent = styleContents;

				element.shadowRoot.insertBefore(styleNode, element.shadowRoot.childNodes[0]);

				var scriptNode = document.createElement('script');

				var scriptNodeTypeAttr = document.createAttribute('type');
				scriptNodeTypeAttr.value = "text/javascript";

				var scriptContents;

				that.processFile(element.attributes['script'].nodeValue).then(function(response) {
					scriptContents = response;

					scriptNode.attributes.setNamedItem(scriptNodeTypeAttr);

					scriptNode.textContent = scriptContents;
					
					element.shadowRoot.insertBefore(scriptNode, element.shadowRoot.childNodes[element.shadowRoot.childNodes.length]);
				});
			});
		}
	}
};

Tritt.prototype.processFile = function(file) {

	var loc = window.location.pathname;
	var dir = loc.substring(0, loc.lastIndexOf('/'));

	file = 'http://' + window.location.host + dir + '/' + file;

	return new Promise(function(resolve, reject) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('GET', file, true);
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
				resolve(this.responseText);
			}
		}
		xmlhttp.send();
	});


};