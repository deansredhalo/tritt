console.log('script loaded successfully!');

console.log(window.hostElements); 

setTimeout(function() {
	document.querySelector('::shadow div').style.backgroundColor = 'red';

}, 5000);