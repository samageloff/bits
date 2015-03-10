```
______________   ________________  _______________   _____________
_____    ______  ________________  _______________  _______________
_____     _____        ____             _____       _______
_____    ______        ____             _____       ______
______________         ____             _____        _____________
_____    ______        ____             _____              ________
_____     _____        ____             _____               _______
_____    ______  ________________       _____       _______________
______________   ________________       _____        _____________

```

Bits are basic, configurable web components, made with JavaScript. No external library dependencies.

## Doesn't the web have enough of these?

Yes. The web has plenty of these. This is an exercise in simple, dependency-free, web component development. Modules are initialized on the DOM using a data-mod attribute, and can be passed an optional configuration object.


## How do I intitialize a bit?
The data-mod attribute value needs to match the name of your constructor. The data-conf-[constructorname] passes a configuration object. The following snippet initializes a 'slideshow' module.

```
<section data-mod="slideshow" data-conf-slideshow="{'counter': true, 'navigation': true, 'animate': true}">
...
</section>

```

### And the corresponding JavaScript constructor:

```
bit.slideshow = function (elem, config) {
...
}
```

# How does it work?
The core.js scans the document, and locates all modules with the data-mod attribute. It then instantiates and renders each module, with it's (optional) configuration object.

# Try it yourself
1. npm install
1. grunt
1. navigate to http://localhost:9001

## Completed modules:
1. Slideshow
1. Accordion
1. Tabs
1. Tooltips

## In the pipe:
1. Animation support for vendor-prefixes