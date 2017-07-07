/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var swingDragPlugIn_1 = __webpack_require__(1);
	// Create and register the PlugIn
	var swingDragPlugIn = new swingDragPlugIn_1.SwingDragPlugIn();
	swingDragPlugIn.register();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../node_modules/@types/jqueryui/index.d.ts" />
	Object.defineProperty(exports, "__esModule", { value: true });
	var swingDragOptions_1 = __webpack_require__(2);
	var vector2D_1 = __webpack_require__(3);
	/**
	 * The main jQuery PlugIn implementation of swingdrag.
	 *
	 * @export
	 * @class SwingDragPlugIn
	 */
	var SwingDragPlugIn = (function () {
	    /**
	     * Creates an instance of SwingDragPlugIn.
	     * @param {SwingDragOptions} [swingDragOptions]
	     *
	     * @memberof SwingDragPlugIn
	     */
	    function SwingDragPlugIn(swingDragOptions) {
	        this.plugInName = 'ui.swingdrag';
	        this.swingDragOptions = swingDragOptions;
	        if (!this.swingDragOptions) {
	            this.swingDragOptions = new swingDragOptions_1.SwingDragOptions();
	        }
	        this.updateCurrentDragVectorIntervalMS = 1000 / 30; // 30fps
	    }
	    /**
	     * Maps a given value from a source range of numbers to a target range of numbers.
	     *
	     * @private
	     * @param {number} value
	     * @param {number} sourceMin
	     * @param {number} sourceMax
	     * @param {number} targetMin
	     * @param {number} targetMax
	     * @memberof SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.mapValue = function (value, sourceMin, sourceMax, targetMin, targetMax) {
	        return (value - sourceMin) * (targetMax - targetMin) / (sourceMax - sourceMin) + targetMin;
	    };
	    /**
	     * Destroys the plugin instance.
	     *
	     *
	     * @memberof SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.destroy = function () {
	        if (!$ || !$.Widget) {
	            return;
	        }
	        $.Widget.prototype.destroy.call(this);
	        if (!this.element) {
	            return;
	        }
	        var elementRef = $(this.element);
	        elementRef.draggable('destroy');
	        this.disableSwing(elementRef);
	        this.disableSwingDragShadow(elementRef);
	        elementRef.removeClass("dragging");
	        $(this.element).css({
	            "transform": "",
	        });
	    };
	    /**
	     * Registers this instance as a jQuery UI plugin.
	     *
	     * @memberof SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.register = function () {
	        $.widget(this.plugInName, this);
	    };
	    /**
	     * Adds CSS styles, so that the swingdrag effect is visible.
	     *
	     * @private
	     * @param {JQuery} elementRef
	     *
	     * @memberof SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.enableSwing = function (elementRef) {
	        elementRef.addClass('swingdrag');
	    };
	    /**
	     * Removes CSS styles, so that the swingdrag effect is not visible.
	     *
	     * @private
	     * @param {JQuery} elementRef
	     *
	     * @memberof SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.disableSwing = function (elementRef) {
	        elementRef.removeClass('swingdrag');
	    };
	    /**
	     * Adds CSS styles, so that the swingdrag shadow is visible.
	     *
	     * @private
	     * @param {JQuery} elementRef
	     *
	     * @memberof SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.enableSwingDragShadow = function (elementRef) {
	        elementRef.addClass('shadow');
	    };
	    /**
	     * Removes CSS styles, so that the swingdrag shadow is not visible.
	     *
	     * @private
	     * @param {JQuery} elementRef
	     *
	     * @memberof SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.disableSwingDragShadow = function (elementRef) {
	        elementRef.removeClass('shadow');
	    };
	    /**
	     * Updates CSS styles.
	     *
	     * @private
	     * @param {JQuery} elementRef
	     * @param {number} rotationAngleDeg
	     * @param {number} scaleFactor
	     *
	     * @memberof SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.updateElementTransform = function (elementRef, rotationAngleDeg, scaleFactor) {
	        elementRef.css({
	            "transform": 'rotate(' + (rotationAngleDeg) + 'deg) scale(' + scaleFactor + ')'
	        });
	    };
	    /**
	     * Creates the plugin.
	     *
	     * @private
	     *
	     * @memberof SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype._create = function () {
	        var _this = this;
	        var elementRef = $(this.element);
	        this.initOptions();
	        // enable swing effect
	        this.enableSwing(elementRef);
	        // the main implementation logic
	        var dragIntervalId;
	        var calculatedAngleDeg;
	        var currentDrag = new vector2D_1.Vector2D();
	        var oldDrag = new vector2D_1.Vector2D();
	        var diffDrag = new vector2D_1.Vector2D();
	        // Used to update the drag effect.
	        // Will be called from a separate interval.
	        var updateCurrentDrag = function () {
	            var currentPos = elementRef.position();
	            currentDrag.x = currentPos.left;
	            currentDrag.y = currentPos.top;
	            diffDrag.x = currentDrag.x - oldDrag.x;
	            diffDrag.y = currentDrag.y - oldDrag.y;
	            var speedX = Math.abs(diffDrag.x) / _this.updateCurrentDragVectorIntervalMS;
	            speedX = speedX * _this.swingDragOptions.speedInfluenceFactor;
	            calculatedAngleDeg = _this.mapValue(speedX, 0.0, 5.0, 0.0, _this.swingDragOptions.maxRotationAngleDeg);
	            calculatedAngleDeg = calculatedAngleDeg * (diffDrag.x > 0 ? 1.0 : -1.0);
	            _this.updateElementTransform(elementRef, calculatedAngleDeg, _this.swingDragOptions.pickUpScaleFactor);
	            oldDrag.x = currentDrag.x;
	            oldDrag.y = currentDrag.y;
	        };
	        // dragstart event handler
	        elementRef.on("dragstart", function (event) {
	            elementRef.addClass("dragging");
	            if (_this.swingDragOptions.showShadow) {
	                _this.enableSwingDragShadow(elementRef);
	            }
	            currentDrag.x = elementRef.position().left;
	            currentDrag.y = elementRef.position().top;
	            calculatedAngleDeg = Math.abs(_this.swingDragOptions.maxRotationAngleDeg);
	            // Start the drag analyst handler.                
	            dragIntervalId = setInterval(updateCurrentDrag, _this.updateCurrentDragVectorIntervalMS);
	        });
	        // dragend event handler
	        elementRef.on("dragstop", function (event) {
	            elementRef.removeClass("dragging");
	            // Stop the drag analyst handler.
	            if (dragIntervalId) {
	                clearInterval(dragIntervalId);
	            }
	            _this.disableSwingDragShadow(elementRef);
	            _this.updateElementTransform(elementRef, 0, 1);
	        });
	        // Check if the target element is already draggable
	        // If not, then make it draggable
	        if (!elementRef.data('draggable')) {
	            elementRef.draggable();
	        }
	    };
	    /**
	     * Creates the swingdrag options instance
	     * and synchronizes the jQuery UI options with the swingdrag options values.
	     *
	     * @private
	     *
	     * @memberof SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype.initOptions = function () {
	        this.swingDragOptions = new swingDragOptions_1.SwingDragOptions();
	        if (this.options.rotationAngleDeg || this.options.rotationAngleDeg === 0) {
	            this.swingDragOptions.maxRotationAngleDeg = this.options.rotationAngleDeg;
	        }
	        if (this.options.maxRotationAngleDeg || this.options.maxRotationAngleDeg === 0) {
	            this.swingDragOptions.maxRotationAngleDeg = this.options.maxRotationAngleDeg;
	        }
	        if (this.options.showShadow !== undefined) {
	            this.swingDragOptions.showShadow = this.options.showShadow;
	        }
	        if (this.options.pickUpScaleFactor || this.options.pickUpScaleFactor === 0) {
	            this.swingDragOptions.pickUpScaleFactor = this.options.pickUpScaleFactor;
	        }
	        if (this.options.speedInfluenceFactor || this.options.speedInfluenceFactor === 0) {
	            this.swingDragOptions.speedInfluenceFactor = this.options.speedInfluenceFactor;
	        }
	    };
	    /**
	     * Sets an option.
	     *
	     * @private
	     * @param {*} option
	     * @param {*} value
	     *
	     * @memberof SwingDragPlugIn
	     */
	    SwingDragPlugIn.prototype._setOption = function (option, value) {
	        $.Widget.prototype._setOption.apply(this, arguments);
	        switch (option) {
	            case "rotationAngleDeg":
	                this.swingDragOptions.maxRotationAngleDeg = value;
	                break;
	            case "maxRotationAngleDeg":
	                this.swingDragOptions.maxRotationAngleDeg = value;
	                break;
	            case "showShadow":
	                this.swingDragOptions.showShadow = value;
	                break;
	            case "pickUpScaleFactor":
	                this.swingDragOptions.pickUpScaleFactor = value;
	                break;
	            case "speedInfluenceFactor":
	                this.swingDragOptions.speedInfluenceFactor = value;
	                break;
	        }
	    };
	    return SwingDragPlugIn;
	}());
	exports.SwingDragPlugIn = SwingDragPlugIn;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * The options for the jQuery UI swingdrag plugin.
	 *
	 * @export
	 * @class SwingDragOptions
	 */
	var SwingDragOptions = (function () {
	    /**
	     * Creates an instance of SwingDragOptions.
	     *
	     * @memberof SwingDragOptions
	     */
	    function SwingDragOptions() {
	        this.maxRotationAngleDeg = 20;
	        this.showShadow = true;
	        this.pickUpScaleFactor = 1.1;
	        this.speedInfluenceFactor = 2.0;
	    }
	    return SwingDragOptions;
	}());
	exports.SwingDragOptions = SwingDragOptions;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Represents a vector in 2D space.
	 *
	 * @export
	 * @class Vector2D
	 */
	var Vector2D = (function () {
	    /**
	     * Creates an instance of Vector2D.
	     *
	     * @memberof Vector2D
	     */
	    function Vector2D() {
	        this.x = 0;
	        this.y = 0;
	    }
	    return Vector2D;
	}());
	exports.Vector2D = Vector2D;


/***/ })
/******/ ]);