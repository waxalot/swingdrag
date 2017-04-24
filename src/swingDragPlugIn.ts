/// <reference path="../node_modules/@types/jqueryui/index.d.ts" />

import * as jQuery from 'jquery';
import { SwingDragOptions } from './swingDragOptions';
import { Directions } from './directions';
import { CSSConstants } from './cssConstants';


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
        elementRef.css(CSSConstants.css_swingdrag_transition, CSSConstants.css_swingdrag_transition_value);
        elementRef.css(CSSConstants.css_swingdrag_boxShadow, CSSConstants.css_swingdrag_boxShadow_value);
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
        elementRef.css(CSSConstants.css_swingdrag_transition, CSSConstants.css_swingdrag_transition_value_clear);
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
        elementRef.css(CSSConstants.css_swingdragShadow, CSSConstants.css_swingdragShadow_value);
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
        elementRef.css(CSSConstants.css_swingdragShadow, CSSConstants.css_swingdragShadow_value_clear);
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
        let direction: Directions = Directions.undefined;
        let oldDirection: Directions = Directions.undefined;
        let oldX: number;
        let dragging = false;

        elementRef.draggable({

            start: (e: JQueryEventObject) => {
                dragging = true;

                if (this.swingDragOptions.showShadow) {
                    this.enableSwingDragShadow(elementRef);
                }
            },

            drag: (e: JQueryEventObject) => {
                direction = this.getDirection(e.clientX, oldX);
                oldX = e.clientX;

                if (oldDirection != direction) {
                    elementRef.css({
                        "transform": 'rotate(' + (this.swingDragOptions.rotationAngleDeg * direction) + 'deg) scale(' + this.swingDragOptions.pickUpScaleFactor + ')'
                    });
                    oldDirection = direction;
                }
            },

            stop: (e: JQueryEventObject) => {
                this.disableSwingDragShadow(elementRef);
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