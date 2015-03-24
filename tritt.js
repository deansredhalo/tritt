'use strict'

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

/**
 * Global variable for all items that we create.
 *
 * @global
 */
window.hostElements = []

var Tritt = Tritt || {}

/*
 * Main constructor function
 *
 * @function Tritt
 * @param {string} element The name of the element to create.
 * @param {object} events The events and bindings attached to the element.
 */
window.Tritt = function (element, events) {
  // error catch
  if (element === undefined) {
    console.log('No element name!')
  }
  // if the events are undefined we want to create them
  // as an object anyway
  events = events || {}
  // call addHostElements
  Tritt.addHostElements(element, events)
  // this will allow Tritt to make sure all the DOM elements have been
  // successfully loaded before we try and begin
  window.addEventListener('DOMContentLoaded', function () {
    // call the primary functions of Tritt, in order
    Tritt.registerElement(element, events)
    Tritt.createShadowDOM(element)
    Tritt.parseStylesAndScripts(element)
    Tritt.parseBindings(element, events['bindings'])
  }, false)
}

/*
 * Add our elements to the global hostElements variable
 *
 * @function addHostElements
 * @param {string} element The name of the element we created
 * @param {object} events The events and bindings attached to the element
 */
Tritt.addHostElements = function (element, events) {
  window.hostElements.push({ 'name': element })
  for (var i = 0; i < window.hostElements.length; i++) {
    if (window.hostElements[i]['name'] === element) {
      window.hostElements[i].events = events
    }
  }
}

/*
 * Register our custom element with a custom prototype
 *
 * @function registerElement
 * @param {string} element The name of the element we created
 * @param {object} events The events and bindings attached to the element
 */
Tritt.registerElement = function (element, events) {
  var CustomElementPrototype
  var custom_element //eslint-disable-line
  // new basic prototype
  CustomElementPrototype = Object.create(HTMLElement.prototype) //eslint-disable-line
  // let's try and register the element...
  try {
    // register the element with our prototype
    custom_element = document.registerElement(element, {
      prototype: CustomElementPrototype
    })
    // attach the events
    Tritt.attachEvents(element, events).then(function (response) {
      custom_element = response
    })
    console.log('Registered Element', element)
    return
    // ...if we can't, or it's already been registered, just ignore it and move on
  } catch (err) {
    return
  }
}

/*
 * Create the shadow DOM for our elements if specified
 *
 * @function createShadowDOM
 * @param {string} element The name of the element we created
 */
Tritt.createShadowDOM = function (element) {
  // let's get the element before we do any modifications to it
  var unaltered = document.querySelectorAll(element)
  // check all of our elements
  for (var i = 0; i < unaltered.length; i++) {
    // does it have attributes?
    if (unaltered[i].hasAttributes()) {
      // ...does it have a shadow attribute?
      if (unaltered[i].attributes['shadow'] !== undefined) {
        // populate the shadow DOM with content
        Tritt.populateShadowDOM(unaltered[i])
      }
    }
  }
}

/*
 * Move content into the Shadow DOM
 *
 * @function populateShadowDOM
 * @param {string} element The name of the element we created
 */
Tritt.populateShadowDOM = function (element) {
  // create a shadow DOM portion
  var shadow = element.createShadowRoot()
  // fill it with the HTML content of the element
  shadow.innerHTML = element.innerHTML
  // remove the light DOM content
  element.innerHTML = null
  console.log('Created and populated Shadow DOM for element', element)
  return
}

/*
 * Dynamically include the specified scripts and styles
 *
 * @function parseStylesAndScripts
 * @param {string} element The name of the element we created
 */
Tritt.parseStylesAndScripts = function (element) {
  var elementAlt = document.querySelector(element)
  var styleNode
  var styleContents
  var scriptNode
  var scriptContents

  // does our element have attributes?
  if (elementAlt.hasAttributes()) {
    // does our element have a shadow DOM?
    if (elementAlt.attributes['shadow'] !== undefined) {
      // does our element have a style attribute
      if (elementAlt.attributes['style'] !== undefined) {
        if (elementAlt.attributes['style'].value !== undefined) {
          // create a style element
          styleNode = document.createElement('style')
          // set the type attribute to text/css
          styleNode.setAttribute('type', 'text/css')
          // read the style file
          Tritt.processFile(elementAlt.attributes['style'].value).then(function (response) {
            // set the content
            styleContents = response
            // make the content equal the contents of the file
            styleNode.textContent = styleContents
            // place this guy before the first element in the shadow DOM
            elementAlt.shadowRoot.insertBefore(styleNode, elementAlt.shadowRoot.childNodes[0])
          })
        }
      }
      // what about a script attribute?
      if (elementAlt.attributes['script'] !== undefined) {
        if (elementAlt.attributes['script'].value !== undefined) {
          // create a new element for the script
          scriptNode = document.createElement('script')
          // set the script type attribute to text/javascript
          scriptNode.setAttribute('type', 'text/javascript')
          // read the script
          Tritt.processFile(elementAlt.attributes['script'].value).then(function (response) {
            // grab the contents
            scriptContents = response
            // set the content equal to the file
            scriptNode.textContent = scriptContents
            // insert the new tag before the last element in the shadow DOM
            elementAlt.shadowRoot.insertBefore(scriptNode, elementAlt.shadowRoot.childNodes[elementAlt.shadowRoot.childNodes.length])
          })
        }
      }
    }
  }
}

/*
 * Read our file
 *
 * @function processFile
 * @param {string} file Filename to go and get
 * @returns {string} response The responseText of the file
 */
Tritt.processFile = function (file) {
  // var loc    = window.location.pathname
  // var dir    = loc.substring(0, loc.lastIndexOf('/'))
  var xmlhttp
  // set the full pathname for the reader
  // file = 'http://' + window.location.host + dir + '/' + file

  // create a new Promise object
  return new Promise(function (resolve, reject) {
      // new XMLHttpRequest object
      xmlhttp = new XMLHttpRequest() //eslint-disable-line
      // do a get
      xmlhttp.open('GET', file, true)
      // if everything goes smoothly, resolve with the contents of the file
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.status === 200 && xmlhttp.readyState === 4) {
          resolve(this.responseText)
        }
      }
      // send our request
      xmlhttp.send()
    })
}

/*
 * Attach the events to the element
 *
 * @function attachEvents
 * @param {string} element The name of the element we created
 * @param {object} events The events and bindings attached to the element
 */
Tritt.attachEvents = function (element, events) {
  // create a new Promise object
  return new Promise(function (resolve, reject) {
      element = document.querySelector(element)

      // if we have events
      if (events) {
        // loop through and create keys
        for (var key in events['events']) {
          if (key !== undefined) {
            element[key] = events.events[key]
          }
        }
      }
    })
}

/*
 * Add our elements to the global hostElements variable.
 *
 * @function parseBindings
 * @param {string} element The name of the element we created
 * @param {object} bindings The bindings attached to the element
 */
Tritt.parseBindings = function (element, bindings) {
  var elementSel = document.querySelector(element)
  var parseElement = elementSel.shadowRoot
  var bound
  var bound1
  var bound2
  var bindValue
  var rewritable

  if (bindings) {
    // do we have a shadow DOM?
    if (elementSel.shadowRoot) {
      // look for all text between {{ }} and return those elements
      bound = elementSel.shadowRoot.innerHTML.match(/{{(.*?)}}/g)
      // loop them
      for (var i = 0; i < bound.length; i++) {
        // if we have the bindings markup
        if (bound[i].indexOf('{{') !== -1) {
          // remove the sets of braces
          bound1 = bound[i].replace(/{{/g, '')
          bound2 = bound1.replace(/}}/g, '')
          // if there's not a function marker, we know it's a text binding
          if (bound2.indexOf('()') === -1) {
            // make sure we have a bind attribute that it's assigned to
            if (elementSel.shadowRoot.querySelectorAll('[bind]')) {
              // loop through any of the elements that have that particular binding
              for (var j = 0; j < elementSel.shadowRoot.querySelectorAll('[bind]').length; j++) {
                // make sure the values match the element selected
                if (elementSel.shadowRoot.querySelectorAll('[bind]')[j].attributes['bind'].value === bound[i]) {
                  // find the value of the binding
                  bindValue = bindings[bound2]
                  // attach it
                  elementSel.shadowRoot.querySelectorAll('[bind]')[j].textContent = bindValue
                }
              }
            }
          // otherwise we have a function binding
          } else {
            // get rid of the parentheses
            rewritable = bound2.replace(/\(\)/g, '')
            // run the function assigned
            elementSel[rewritable](elementSel, parseElement, bindings)
          }
        }
      }
    }
  }
  // observe the binding for any changes that may occur
  Tritt.watchForChanges(element, bindings)
}

/*
 * Watch any bindings objects for updates
 *
 * @function watchForChanges
 * @param {string} element The name of the element we created
 * @param {object} object The object we want to observe
 */
Tritt.watchForChanges = function (element, object) {
  if (object !== undefined) {
    // observe the object and note any changes
    Object.observe(object, function (changes) {
      for (var i = 0; i < changes.length; i++) {
        // re-run the binding function with the updates
        Tritt.parseBindings(element, changes[i].object)
      }
    })
  }
}


