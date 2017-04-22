/// <reference path="../node_modules/@types/jqueryui/index.d.ts" />

import * as jQuery from 'jquery';
import { SwingDragOptions } from './swingDragOptions';
import { Directions } from './directions';


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

        elementRef.removeClass('swingdrag');
        elementRef.removeClass('swingdrag-shadow');

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
     * Creates the plugin.
     * 
     * @private
     * 
     * @memberOf SwingDragPlugIn
     */
    private _create() {

        let elementRef = $(this.element);

        elementRef.addClass('swingdrag');

        // the main implementation logic
        let direction: Directions = Directions.undefined;
        let oldDirection: Directions = Directions.undefined;
        let oldX: number;
        let dragging = false;

        if (!this.options.maxRotationAngleDeg || this.options.maxRotationAngleDeg <= 0) {
            this.options.maxRotationAngleDeg = this.swingDragOptions.maxRotationAngleDeg;
        }

        if (this.options.showShadow === undefined) {
            this.options.showShadow = this.swingDragOptions.showShadow;
        }

        if (!this.options.pickUpScaleFactor) {
            this.options.pickUpScaleFactor = this.swingDragOptions.pickUpScaleFactor;
        }

        elementRef.draggable({

            start: (e: JQueryEventObject) => {
                dragging = true;

                if (this.swingDragOptions.showShadow) {
                    elementRef.addClass('swingdrag-shadow');
                }
            },

            drag: (e: JQueryEventObject) => {
                direction = this.getDirection(e.clientX, oldX);
                oldX = e.clientX;

                if (oldDirection != direction) {
                    elementRef.css({
                        "transform": 'rotate(' + (this.swingDragOptions.maxRotationAngleDeg * direction) + 'deg) scale(' + this.swingDragOptions.pickUpScaleFactor + ')'
                    });
                    oldDirection = direction;
                }
            },

            stop: (e: JQueryEventObject) => {
                elementRef.removeClass('swingdrag-shadow');
                elementRef.css({
                    "transform": "rotate(0deg) scale(1)"
                });
                oldDirection = Directions.undefined;
                dragging = false;
            }
        });

    }


    /**
     * Calculates the dragging direction.
     * 
     * @param {number} actualX 
     * @param {number} oldX 
     * @returns {Directions} 
     * 
     * @memberOf SwingDragPlugIn
     */
    public getDirection(actualX: number, oldX: number): Directions {

        let diffX = actualX - oldX;
        if (actualX < oldX) {
            return Directions.left;
        } else if (actualX > oldX) {
            return Directions.right;
        } else {
            return Directions.undefined;
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
            case "maxRotationAngleDeg":
                this.swingDragOptions.maxRotationAngleDeg = value;
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