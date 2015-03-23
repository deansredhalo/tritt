![Travis Tritt](http://celebratearkansasmagazine.com/wp-content/uploads/2011/07/travis-tritt.jpg) 

# Tritt

### Web Component Custom Elements with events handling and simple data-binding

Tritt is a lightweight, fast, simple-to-use tool for creating inline custom elements complete with Shadow DOM, external style/script imports, encapsulation and of course simple event and data binding.  It allows you to create a web component spec custom element that can be used throughout your page. Tritt is built on top of Google's [webcomponentsjs](https://www.github.com/webcomponents/webcomponentsjs) polyfills and uses [Gulp](http://gulpjs.com) for building its imports.

Like all of my current projects, it's named after a 90s era country star, this one of course none other than Travis Tritt.

## Installation

Installation is simplest by using [Bower](http://www.bower.io) with the following command
	
	$ bower install tritt --save

to ensure that Tritt is saved in your application's dependencies.  Tritt will be automatically installed into your `bower_components` directory, along with Tritt's own dependencies.

Once installation is completed, you can import Tritt and webcomponentsjs polyfill into the page by placing the following lines in the HEAD of your HTML file

	<script src="bower_components/tritt/bower_components/webcomponentsjs/webcomponents.js"></script>
    <script type="text/javascript" src="bower_components/tritt/tritt.js"></script>

You're ready to roll at this point.

## Usage

Tritt makes it very simple to create custom elements with bindings and custom events attached. Either create a new JS file, or inline in the HEAD of your HTML file inside a `<script>` tag, you can invoke Tritt to run on the custom element you want to create.

### Invoke Tritt (JS)

```js
Tritt('element-name', {actions});
```

The element name is required, however the second parameter (the actions) is not.  If you just want to register your custom element with no data binding to any special events, that is all you will need.  

To invoke Tritt with actions, note the following example

```js
Tritt('element-name', {
	events: {
		myEvent: function(rootElement, rootShadow, bindings) {
			...
		}
	},
	bindings: {
		myBinding: "Your name here"
	}
});
```
### HTML Markup for Tritt (HTML)

Create your element as you would any other piece of HTML markup.  It must contain a `-` in the name.

```html
<element-name>
</element-name>
```

You can place content inside your element just as you would any other HTML element, such as

```html
<element-name>
	<div>
		<span>Here's some text</span>
	</div>
</element-name>
```

To have Tritt create a shadow DOM for you in your element, you can use the **shadow** attribute on your element.

```html
<element-name shadow>
	...
</element-name>
```

Any content found inside the element will automatically be moved into the shadow DOM.

If you'd like to include an external script or style within your element, you can use the **script** and **style** attributes to specify your local files. **Note:** Tritt expects a shadow DOM within your element to include external scripts and styles.

```html
<element-name shadow script="script.js" style="style.css">
	...
</element-name>
```

Tritt will parse these files and place their contents at the beginning and end of the shadow DOM.

### Data and event binding in Tritt

Tritt employs a simple yet poweful data and event binding system.  It uses familiar {{}} syntax to denote bindings, the main difference being between text bindings and event bindings. These events should be specified in your actions object when you invoked Tritt.

Text binding
	{{text}}

Event binding
	{{event()}}

Note the inclusion of the () at the end of the event name.  Text bindings are bound to an element using the **bind** attributeEvents are also bound to the element they should affect by using the the **action** attribute, such as

```html
<element-name shadow script="script.js" style="style.css" action="{{event()}}">
	<span bind="{{text}}"></span>
</element-name>
```

You can have multiple events bound to one element, just separate each of them with a space.

Event bindings have access to the text bindings listed under the `bindings` object of the actions.  Example

```js
Tritt('element-name', {
	events: {
		myEvent: function(rootElement, rootShadow, bindings) {
			bindings.myBinding: "New name goes here"
		}
	},
	bindings: {
		myBinding: "Your name here"
	}
});
```

Tritt's events system allows you to write normal JS commands in the event and using the **rootElement** and **rootShadow** parameters, you can target the specific element you have bound the event to. Thus, clicks and mouseovers can be used and will only affect your custom element, although global access and access to other elements is available to you.

Tritt will automatically update bindings for you within your custom element when they change.

### Putting it all together

Here's an example of all the Tritt functionality we've covered:

```js
Tritt('custom-greeting', {
	events: {
		changeGreeting: function(rootElement, rootShadow, bindings) {
			rootElement.addEventListener('mouseover', function() {
				bindings.userName = 'Travis Tritt!'
			});
		}
	},
	bindings: {
		userName: "Reveal user name..."
	}
});
```

```html
<custom-greeting shadow style="style.css">
	<div action="{{changeGreeting()}}">
		<span bind="{{userName}}"></span>
	</div>
</custom-greeting>
``` 

## Things to do

Thorough testing and unit tests.

Add `light` attribute support.

Add Gulp task to export custom element for HTML Imports.