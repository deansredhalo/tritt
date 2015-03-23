![Travis Tritt](http://celebratearkansasmagazine.com/wp-content/uploads/2011/07/travis-tritt.jpg) 

# Tritt

### Web Component Custom Elements with events handling and simple data-binding

Tritt is a lightweight, fast, simple-to-use tool for creating inline custom elements complete with Shadow DOM, external style/script imports, encapsulation and of course simple event and data binding.  It allows you to create a web component spec custom element that can be used throughout your page. Tritt is built on top of Google's [webcomponentsjs](https://www.github.com/webcomponents/webcomponentsjs) polyfills and uses [Gulp](http://gulpjs.com) for building its imports.

Like all of my current projects, it's named after a 90s era country star, this one of course is named after none other than Travis Tritt.

## Installation

Installation is simplest by using [Bower](http://www.bower.io) with the following command
	
	$ bower install tritt --save

to ensure that Tritt is saved in your application's dependencies.  Tritt will be automatically installed into your `bower_components` directory, along with Tritt's own dependencies.

Once installation is completed, you can import Tritt and webcomponentsjs polyfill into the page by placing the following lines in the HEAD of your HTML file

	<script src="bower_components/tritt/bower_components/webcomponentsjs/webcomponents.js"></script>
    <script type="text/javascript" src="bower_components/tritt/tritt.js"></script>

You're ready to roll at this point.

## Usage

## Things to do

Add Gulp task to export custom element for HTML Imports.