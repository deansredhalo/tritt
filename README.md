![Travis Tritt](http://celebratearkansasmagazine.com/wp-content/uploads/2011/07/travis-tritt.jpg) 

# Tritt [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

### Web Component Custom Elements with events handling and simple data-binding

Tritt is a lightweight, fast, simple-to-use tool for creating inline custom elements complete with Shadow DOM, external style/script imports, encapsulation and of course simple event and data binding.  It allows you to create a web component spec custom element that can be used throughout your page. Tritt is built on top of Google's [webcomponentsjs](https://www.github.com/webcomponents/webcomponentsjs) polyfills.

Like all of my current projects, it's named after a 90s era country star, this one of course none other than Travis Tritt.

## Why custom elements?

The idea behind custom elements is simple: to give us, as developers, the ability to create a set of reusable, modular components that _just work_.  Think about a browser's `<select>` element or `<input type="radio">`.  These elements can be used throughout your markup and they work exactly as expected, look exactly as expected, and are relatively lightweight.  Sure, there are differences in appearance between the major browsers, but for the most part, they are all identical, making it simple for a developer to know what they are using when they drop these elements onto a page.  Custom elements and the overall web component spec that is currently in the earliest phases of integration are aiming for being able to do just that.  Tritt allows you to create a custom element that you can insert into any page and expect it to work just exactly as it should every time, just like a `<select>` or an `<input>` element native to the browser.

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

### Defining an element

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
### Using your element

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

Tritt will parse these files and place their contents at the beginning and end of the shadow DOM. These styles will be encapsulated within the scope of the element, so any class names or IDs you use will only reach as far as within the shadow DOM of the element.

The scripts will have global run access. 

### Data and event binding in Tritt

Tritt employs a simple yet poweful data and event binding system.  It uses familiar {{ }} syntax to denote bindings, the main difference being between text bindings and event bindings. These events should be specified in your actions object when you invoked Tritt.
	
	{{text}}
	
	{{event()}}

Note the inclusion of the () at the end of the event name.  Text bindings are bound to an element using the **bind** attribute. Events are also bound to the element they should affect by using the the **action** attribute, such as:

```html
<element-name shadow script="script.js" style="style.css" action="{{event()}}">
	<span bind="{{text}}"></span>
</element-name>
```

You can have multiple events bound to one element, just separate each of them with a space.

```html
<element-name shadow script="script.js" style="style.css" action="{{event1()}} {{event2()}}">
	<span bind="{{text}}"></span>
</element-name>
```

Event bindings have access to the text bindings listed under the `bindings` object of the actions.  These are passed as the `bindings` parameter.

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

### Styling your element

You can style your element directly in CSS by targeting the `element-name` in your styles.  If you want access to the internals of the element within a shadow DOM, you will need to use the `::shadow` psuedo-selector. The shadow DOM protects your element's internal contents from being affect by outside global styles, so your element will always come straight out of the box styled the way you intended.

```css
element-name::shadow {
	...
}
```

Remember that any styles included inside your element will be encapsulated, so this is the best practice to use when styling internals of a custom element. 

## Things to do

Thorough testing and unit tests.