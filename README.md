# swingdrag

What's swingdrag?\
swingdrag is a jQuery UI plugin, which adds a nice swing effect to the jQuery UI drag function.

## Demo
For a full working demo click [here](http://codepen.io/waxalot/pen/xdOaRW)

## What`s new?

### v1.4.0
* swingdrag works together with other draggable plugins like [gridstack](https://www.npmjs.com/package/gridstack)

### v1.3.1
* The API documentation and the examples were updated.

### v1.3.0
* The swing effect is now depending on drag speed.

### v1.2.0
* All used styles have been moved from code into a `css/swingdrag.css` file.
* The source file swingdrag.scss have been added, too.

### v1.1.0
* The options `maxRotationAngleDeg` was renamed to `rotationAngleDeg` and its default value was set to 8.
* The size of the deployed `jquery.ui.swingdrag.min.js` file was reduced.

### v1.0.0
* Display/performance bugs were fixed.
* swingdrag now works smooth in all popular browsers like Chrome, Firefox, Internet Explorer, Edge, etc...
* Options have been added.

### v0.5.0
* First released version. 
* There are performance bugs in some browsers.

## Install
```
npm install swingdrag
```

## Usage
### HTML
```html
<script src="node_modules/swingdrag/dist/src/jquery.ui.swingdrag.min.js"></script>
<link rel="stylesheet" href="node_modules/swingdrag/dist/css/swingdrag.css" />

<div id="container">The container element which should be dragged</div>
```
### JavaScript
```js
$("#container").swingdrag();
```

## Options

### rotationAngleDeg
```
The maximum possible angle of rotation in degrees.
Default : 20
```

### showShadow
```
Indicates whether a pickup-/drop shadow should be shown.
Default: true
```

### pickUpScaleFactor
```
The pick up scale factor indicates the size change during dragging.
Default: 1.1
```

#### Example
```js
let options = {
    rotationAngleDeg: 20, 
    showShadow: true, 
    pickUpScaleFactor: 1.1
}

$("#container").swingdrag(options);
```