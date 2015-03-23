'use strict';

/*****************************************
*
* Tritt.js
* Simple, flexible custom
* elements with events and
* data-binding
*
* Author: T-Jay Tipps
* https://github.com/deansredhalo/tritt
*
*****************************************/

window.hostElements = [];

window.Tritt = function(element, events) {
	var that = this;

	events = events || {};

	Tritt.addHostElements(element, events);

	window.addEventListener('DOMContentLoaded', function() {
		Tritt.registerElement(element, events);
		Tritt.createShadowDOM(element);
		Tritt.parseStylesAndScripts(element);
		Tritt.parseBindings(element, events['bindings']);
	}, false);
};

Tritt.addHostElements = function(element, events) {
	console.log(events);
	window.hostElements.push({ 'name': element });
	for (var i = 0; i < window.hostElements.length; i++) {
		if (window.hostElements[i]['name'] === element) {
			window.hostElements[i].events = events;
		}
	}
}

Tritt.registerElement = function(element, events) {
	var that = this;

	var CustomElementPrototype;
	var custom_element;

	CustomElementPrototype = Object.create(HTMLElement.prototype);

	try {
		custom_element = document.registerElement(element, {
			prototype: CustomElementPrototype
		});

		Tritt.attachEvents(element, events).then(function(response) {
			console.log(element);
			custom_element = response;
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

	var element 			= document.querySelector(element);
	var styleNode;
	var styleNodeTypeAttr;
	var styleContents;
	var scriptNode;
	var scriptNodeTypeAttr;
	var scriptContents;


	if (element.hasAttributes()) {
		if (element.attributes['shadow'] !== undefined) {

			if (element.attributes['style'].nodeValue !== undefined) {
				styleNode = document.createElement('style');

				styleNodeTypeAttr = document.createAttribute('type');
				styleNodeTypeAttr.value = "text/css";

				Tritt.processFile(element.attributes['style'].nodeValue).then(function(response) {
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

				Tritt.processFile(element.attributes['script'].nodeValue).then(function(response) {
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
	var loc 		= window.location.pathname;
	var dir 		= loc.substring(0, loc.lastIndexOf('/'));
	var xmlhttp;

	file = 'http://' + window.location.host + dir + '/' + file;

	return new Promise(function(resolve, reject) {
		xmlhttp = new XMLHttpRequest();
		xmlhttp.open('GET', file, true);
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
				resolve(this.responseText);
			}
		}
		xmlhttp.send();
	});
};

Tritt.attachEvents = function(element, events) {

	return new Promise(function(resolve, reject) {
		element = document.querySelector(element);

		if (events) {
			for (var key in events['events']) {
				if (key !== undefined) {
					element[key] = events.events[key];
				}
			}
		}
	});
};

Tritt.parseBindings = function(element, bindings) {
	var elementSel 		= document.querySelector(element);
	var parseElement 	= elementSel.shadowRoot;
	var bound;
	var bound1;
	var bound2;
	var bindValue;
	var rewritable;

	if (elementSel.shadowRoot) {
		bound = elementSel.shadowRoot.innerHTML.match(/{{(.*?)}}/g);

		for (var i = 0; i < bound.length; i++) {

			if (bound[i].indexOf('{{') !== -1) {
				bound1 = bound[i].replace(/{{/g, '');
				bound2 = bound1.replace(/}}/g, '');

				if (bound2.indexOf('()') === -1) {
					if (elementSel.shadowRoot.querySelectorAll('[bind]')) {
						for (var j = 0; j < elementSel.shadowRoot.querySelectorAll('[bind]').length; j++) {
							if (elementSel.shadowRoot.querySelectorAll('[bind]')[j].attributes['bind'].nodeValue === bound[i]) {
								bindValue = bindings[bound2];
								elementSel.shadowRoot.querySelectorAll('[bind]')[j].textContent = bindValue;		
							} 
						}
					}
				}
				else {
					rewritable = bound2.replace(/\(\)/g, '');
					elementSel[rewritable](elementSel, parseElement, bindings);
				}
			}
		}
	}

	Tritt.watchForChanges(element, bindings);
};

Tritt.watchForChanges = function(element, object) {
	if (object !== undefined) {
		Object.observe(object, function(changes) {
			for (var i = 0; i < changes.length; i++) {
				Tritt.parseBindings(element, changes[i].object);
			}
		});
	}
};

// TODO: Bring in events, such as click, mouseover, etc
