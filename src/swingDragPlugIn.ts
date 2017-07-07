/// <reference path="../node_modules/@types/jqueryui/index.d.ts" />

import * as jQuery from 'jquery';
import { SwingDragOptions } from './swingDragOptions';
import { Vector2D } from "./vector2D";


/**
 * The main jQuery PlugIn implementation of swingdrag.
 * 
 * @export
 * @class SwingDragPlugIn
 */
export class SwingDragPlugIn {

    private plugInName: string = 'ui.swingdrag';
    private options: any;
    private swingDragOptions: SwingDragOptions;
    private element: HTMLElement;

    private readonly updateCurrentDragVectorIntervalMS: number;


    /**
     * Creates an instance of SwingDragPlugIn.
     * @param {SwingDragOptions} [swingDragOptions] 
     * 
     * @memberof SwingDragPlugIn
     */
    public constructor(swingDragOptions?: SwingDragOptions) {
        this.swingDragOptions = swingDragOptions;

        if (!this.swingDragOptions) {
            this.swingDragOptions = new SwingDragOptions();
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
    private mapValue(value: number, sourceMin: number, sourceMax: number, targetMin: number, targetMax: number) {
        return (value - sourceMin) * (targetMax - targetMin) / (sourceMax - sourceMin) + targetMin;
    }


    /**
     * Destroys the plugin instance.
     * 
     * 
     * @memberof SwingDragPlugIn
     */
    public destroy() {
        if (!$ || !$.Widget) {
            return;
        }

        $.Widget.prototype.destroy.call(this);

        if (!this.element) {
            return;
        }

        let elementRef = $(this.element);
        elementRef.draggable('destroy');

        this.disableSwing(elementRef);
        this.disableSwingDragShadow(elementRef);
        elementRef.removeClass("dragging");

        $(this.element).css({
            "transform": "",
        });
    }


    /**
     * Registers this instance as a jQuery UI plugin.
     * 
     * @memberof SwingDragPlugIn
     */
    public register(): void {
        $.widget(this.plugInName, this);
    }


    /**
     * Adds CSS styles, so that the swingdrag effect is visible.
     * 
     * @private
     * @param {JQuery} elementRef 
     * 
     * @memberof SwingDragPlugIn
     */
    private enableSwing(elementRef: JQuery) {
        elementRef.addClass('swingdrag');
    }


    /**
     * Removes CSS styles, so that the swingdrag effect is not visible.
     * 
     * @private
     * @param {JQuery} elementRef 
     * 
     * @memberof SwingDragPlugIn
     */
    private disableSwing(elementRef: JQuery) {
        elementRef.removeClass('swingdrag');
    }


    /**
     * Adds CSS styles, so that the swingdrag shadow is visible.
     * 
     * @private
     * @param {JQuery} elementRef 
     * 
     * @memberof SwingDragPlugIn
     */
    private enableSwingDragShadow(elementRef: JQuery) {
        elementRef.addClass('shadow');
    }


    /**
     * Removes CSS styles, so that the swingdrag shadow is not visible.
     * 
     * @private
     * @param {JQuery} elementRef 
     * 
     * @memberof SwingDragPlugIn
     */
    private disableSwingDragShadow(elementRef: JQuery) {
        elementRef.removeClass('shadow');
    }


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
    private updateElementTransform(elementRef: JQuery, rotationAngleDeg: number, scaleFactor: number) {
        elementRef.css({
            "transform": 'rotate(' + (rotationAngleDeg) + 'deg) scale(' + scaleFactor + ')'
        });
    }


    /**
     * Creates the plugin.
     * 
     * @private
     * 
     * @memberof SwingDragPlugIn
     */
    private _create() {

        let elementRef = $(this.element);

        this.initOptions();

        // enable swing effect
        this.enableSwing(elementRef);

        // the main implementation logic
        let dragIntervalId: any;

        let calculatedAngleDeg: number;
        let currentDrag = new Vector2D();
        let oldDrag = new Vector2D();
        let diffDrag = new Vector2D();

        // Used to update the drag effect.
        // Will be called from a separate interval.
        let updateCurrentDrag = () => {

            let currentPos = elementRef.position();
            currentDrag.x = currentPos.left;
            currentDrag.y = currentPos.top;

            diffDrag.x = currentDrag.x - oldDrag.x;
            diffDrag.y = currentDrag.y - oldDrag.y;

            let speedX = Math.abs(diffDrag.x) / this.updateCurrentDragVectorIntervalMS;
            speedX = speedX * this.swingDragOptions.speedInfluenceFactor;
            calculatedAngleDeg = this.mapValue(speedX, 0.0, 5.0, 0.0, this.swingDragOptions.maxRotationAngleDeg);

            calculatedAngleDeg = calculatedAngleDeg * (diffDrag.x > 0 ? 1.0 : -1.0);

            this.updateElementTransform(elementRef, calculatedAngleDeg, this.swingDragOptions.pickUpScaleFactor);

            oldDrag.x = currentDrag.x;
            oldDrag.y = currentDrag.y;
        };

        // dragstart event handler
        elementRef.on("dragstart", (event: JQueryEventObject) => {
            elementRef.addClass("dragging");

            if (this.swingDragOptions.showShadow) {
                this.enableSwingDragShadow(elementRef);
            }

            currentDrag.x = elementRef.position().left;
            currentDrag.y = elementRef.position().top;

            calculatedAngleDeg = Math.abs(this.swingDragOptions.maxRotationAngleDeg);

            // Start the drag analyst handler.                
            dragIntervalId = setInterval(updateCurrentDrag, this.updateCurrentDragVectorIntervalMS);
        });

        // dragend event handler
        elementRef.on("dragstop", (event: JQueryEventObject) => {
            elementRef.removeClass("dragging");

            // Stop the drag analyst handler.
            if (dragIntervalId) {
                clearInterval(dragIntervalId);
            }

            this.disableSwingDragShadow(elementRef);
            this.updateElementTransform(elementRef, 0, 1);
        });

        // Check if the target element is already draggable
        // If not, then make it draggable
        if (!elementRef.data('draggable')) {
            elementRef.draggable();
        }
    }


    /**
     * Creates the swingdrag options instance 
     * and synchronizes the jQuery UI options with the swingdrag options values.
     * 
     * @private
     * 
     * @memberof SwingDragPlugIn
     */
    private initOptions() {
        this.swingDragOptions = new SwingDragOptions();

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
    }


    /**
     * Sets an option.
     * 
     * @private
     * @param {*} option 
     * @param {*} value 
     * 
     * @memberof SwingDragPlugIn
     */
    private _setOption(option: any, value: any) {
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
    }

}