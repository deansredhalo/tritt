'use strict';

window.Tritt = function(element, events) {
	console.log(events);
	var that = this;

	window.addEventListener('DOMContentLoaded', function() {
		Tritt.registerElement(element, events);
		Tritt.createShadowDOM(element);
		Tritt.parseStylesAndScripts(element);
	}, false);
};

Tritt.registerElement = function(element, events) {
	var that = this;

	var CustomElementPrototype;
	var custom_element;

	CustomElementPrototype = Object.create(HTMLElement.prototype);

	window.Tritt.attachEvents(CustomElementPrototype, events).then(function(response) {
		console.log(response);
		CustomElementPrototype = response;
	});

	try {
		custom_element = document.registerElement(element, {
			prototype: CustomElementPrototype
		});

		console.log('Registered Element', element);

		return;
	}
	catch (err) {
		return;
	}
};

Tritt.createShadowDOM = function(element) {
	var that = this;

	var unaltered;

	unaltered = document.querySelectorAll(element);

	(function() {
		for (var i = 0; i < unaltered.length; i++) {
			if (unaltered[i].hasAttributes()) {
				if (unaltered[i].attributes['shadow'] !== undefined) {
					window.Tritt.populateShadowDOM(unaltered[i]);
				}
			}
		}
	})();
};

Tritt.populateShadowDOM = function(element) {	
	var shadow = element.createShadowRoot();

	shadow.innerHTML = element.innerHTML;

	element.innerHTML = null;

	console.log('Created and populated Shadow DOM for element', element);

	return;
};

Tritt.parseStylesAndScripts = function(element) {
	var that = this;

	var styleNode;
	var styleNodeTypeAttr;
	var styleContents;
	var scriptNode;
	var scriptNodeTypeAttr;
	var scriptContents;

	var element = document.querySelector(element);

	if (element.hasAttributes()) {
		if (element.attributes['shadow'] !== undefined) {

			if (element.attributes['style'].nodeValue !== undefined) {
				styleNode = document.createElement('style');

				styleNodeTypeAttr = document.createAttribute('type');
				styleNodeTypeAttr.value = "text/css";

				window.Tritt.processFile(element.attributes['style'].nodeValue).then(function(response) {
					styleContents = response;

					styleNode.attributes.setNamedItem(styleNodeTypeAttr);

					styleNode.textContent = styleContents;

					element.shadowRoot.insertBefore(styleNode, element.shadowRoot.childNodes[0]);

				});
			}

			if (element.attributes['script'].nodeValue !== undefined) {
				scriptNode = document.createElement('script');

				scriptNodeTypeAttr = document.createAttribute('type');
				scriptNodeTypeAttr.value = "text/javascript";

				window.Tritt.processFile(element.attributes['script'].nodeValue).then(function(response) {
					scriptContents = response;

					scriptNode.attributes.setNamedItem(scriptNodeTypeAttr);

					scriptNode.textContent = scriptContents;
					
					element.shadowRoot.insertBefore(scriptNode, element.shadowRoot.childNodes[element.shadowRoot.childNodes.length]);
				});
			}
		}
	}
};

Tritt.processFile = function(file) {

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

Tritt.attachEvents = function(prototype, events) {

	return new Promise(function(resolve, reject) {
		for (var key in events) {
			if (key !== undefined) {
				prototype[key] = events[key];
			}
		}
	});


};