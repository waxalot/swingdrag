# swingdrag

What's swingdrag?\
swingdrag is a jQuery UI plugin, which adds a nice swing effect to the jQuery UI drag function.

# What`s new?

## v1.1.0
* The options `maxRotationAngleDeg` was renamed to `rotationAngleDeg` and its default value was set to 8.
* The size of the deployed `jquery.ui.swingdrag.min.js` file was reduced.

## v1.0.0
* Display/performance bugs were fixed.
* swingdrag now works smooth in all popular browsers like Chrome, Firefox, Internet Explorer, Edge, etc...
* Options have been added.

## v0.5.0
* First released version. 
* There are performance bugs in some browsers.

# Demo
For a full working demo click [here](http://codepen.io/waxalot/pen/xdOaRW)

# Install
```
npm install swingdrag
```

# Usage
## HTML
```html
<script src="node_modules/swingdrag/dist/jquery.ui.swingdrag.min.js"></script>

<div id="container">The container element which should be dragged</div>
```
## JavaScript
```js
$("#container").swingdrag();
```

# Options

## rotationAngleDeg
```
The rotation angle in degrees.
Default : 8
```

## showShadow
```
Indicates whether a pickup-/drop shadow should be shown.
Default: true
```

## pickUpScaleFactor
```
The pick up scale factor indicates the size change during dragging.
Default: 1.1
```

### Example
```js
let options = {
    rotationAngleDeg: 8, 
    showShadow: true, 
    pickUpScaleFactor: 1.1
}

$("#container").swingdrag(options);
```