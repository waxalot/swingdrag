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
     * @memberOf SwingDragPlugIn
     */
    public constructor(swingDragOptions?: SwingDragOptions) {
        this.swingDragOptions = swingDragOptions;

        if (!this.swingDragOptions) {
            this.swingDragOptions = new SwingDragOptions();
        }

        this.updateCurrentDragVectorIntervalMS = 1000 / 60; // 60fps
    }


    /**
     * Destroys the plugin instance.
     * 
     * 
     * @memberOf SwingDragPlugIn
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

        $(this.element).css({
            "transform": "",
        });
    }


    /**
     * Registers this instance as a jQuery UI plugin.
     * 
     * @memberOf SwingDragPlugIn
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
     * @memberOf SwingDragPlugIn
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
     * @memberOf SwingDragPlugIn
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
     * @memberOf SwingDragPlugIn
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
     * @memberOf SwingDragPlugIn
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
     * @memberOf SwingDragPlugIn
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
     * @memberOf SwingDragPlugIn
     */
    private _create() {

        let elementRef = $(this.element);

        this.initOptions();

        // enable swing effect
        this.enableSwing(elementRef);

        // the main implementation logic
        let dragIntervalId: any;

        let dragging = false;

        let calculatedAngleDeg: number;
        let currentDrag = new Vector2D();
        let oldDrag = new Vector2D();
        let diffDrag = new Vector2D();


        // Used to update the drag effect.
        // Will be called from a separate interval.
        let updateCurrentDrag = () => {

            diffDrag.x = currentDrag.x - oldDrag.x;
            diffDrag.y = currentDrag.y - oldDrag.y;

            let speed = diffDrag.x;
            calculatedAngleDeg = speed;

            // Limit the rotation angle.
            if (calculatedAngleDeg > this.swingDragOptions.rotationAngleDeg) {
                calculatedAngleDeg = this.swingDragOptions.rotationAngleDeg;
            } else if (calculatedAngleDeg < -this.swingDragOptions.rotationAngleDeg) {
                calculatedAngleDeg = -this.swingDragOptions.rotationAngleDeg;
            }

            this.updateElementTransform(elementRef, calculatedAngleDeg, this.swingDragOptions.pickUpScaleFactor);

            oldDrag.x = currentDrag.x;
            oldDrag.y = currentDrag.y;
        };


        elementRef.draggable({

            start: (e: JQueryEventObject, ui: any) => {
                dragging = true;

                if (this.swingDragOptions.showShadow) {
                    this.enableSwingDragShadow(elementRef);
                }

                currentDrag.x = ui.position.left;
                currentDrag.y = ui.position.top;

                calculatedAngleDeg = Math.abs(this.swingDragOptions.rotationAngleDeg);

                // Start the drag analyst handler.                
                dragIntervalId = setInterval(updateCurrentDrag, this.updateCurrentDragVectorIntervalMS);
            },

            drag: (e: JQueryEventObject, ui: any) => {
                currentDrag.x = ui.position.left;
                currentDrag.y = ui.position.top;
            },

            stop: (e: JQueryEventObject) => {

                // Stop the drag analyst handler.
                if (dragIntervalId) {
                    clearInterval(dragIntervalId);
                }

                this.disableSwingDragShadow(elementRef);
                this.updateElementTransform(elementRef, 0, 1);

                dragging = false;
            }
        });

    }


    /**
     * Creates the swingdrag options instance 
     * and synchronizes the jQuery UI options with the swingdrag options values.
     * 
     * @private
     * 
     * @memberOf SwingDragPlugIn
     */
    private initOptions() {
        this.swingDragOptions = new SwingDragOptions();

        if (this.options.rotationAngleDeg || this.options.rotationAngleDeg === 0) {
            this.swingDragOptions.rotationAngleDeg = this.options.rotationAngleDeg;
        }

        if (this.options.showShadow !== undefined) {
            this.swingDragOptions.showShadow = this.options.showShadow;
        }

        if (this.options.pickUpScaleFactor || this.options.pickUpScaleFactor === 0) {
            this.swingDragOptions.pickUpScaleFactor = this.options.pickUpScaleFactor;
        }
    }


    /**
     * Sets an option.
     * 
     * @private
     * @param {*} option 
     * @param {*} value 
     * 
     * @memberOf SwingDragPlugIn
     */
    private _setOption(option: any, value: any) {
        $.Widget.prototype._setOption.apply(this, arguments);

        switch (option) {
            case "rotationAngleDeg":
                this.swingDragOptions.rotationAngleDeg = value;
                break;
            case "showShadow":
                this.swingDragOptions.showShadow = value;
                break;
            case "pickUpScaleFactor":
                this.swingDragOptions.pickUpScaleFactor = value;
                break;
        }
    }

}