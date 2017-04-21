/// <reference path="../node_modules/@types/jqueryui/index.d.ts" />

import * as jQuery from 'jquery';


/**
 * The main jQuery PlugIn implementation of swingdrag.
 * 
 * @export
 * @class SwingDragPlugIn
 */
export class SwingDragPlugIn {

    private plugInName: string = 'ui.swingdrag';
    private plugInObject: any;


    /**
     * Creates an instance of SwingDragPlugIn.
     * @param {JQueryStatic} $ 
     * 
     * @memberOf SwingDragPlugIn
     */
    public constructor($: JQueryStatic) {

        this.plugInObject = {

            _create: function () {

                let self = this;
                let o = self.options;
                let el = self.element;
                let elementRef = $(el);

                // add styles for a smoother animation effect
                elementRef.css({
                    "-webkit-transition": "all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)",
                    "transition": "all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)",
                });

                // the main implementation logic
                let direction = 0;
                let currentDirection = 0;
                let oldX: number;
                let diffX;
                let dragging = false;

                let maxRotation = o.maxRotation;
                if (!maxRotation || maxRotation <= 0)
                    maxRotation = 2;


                elementRef.draggable({

                    start: function (e) {
                        dragging = true;
                        elementRef.css({
                            "box-shadow": "0px 12px 11px #383838"
                        });
                    },

                    drag: function (e: JQueryEventObject) {

                        diffX = e.clientX - oldX;
                        if (Math.abs(diffX) < 2)
                            return;

                        if (e.clientX < oldX) {
                            direction = -1;
                        } else if (e.clientX > oldX) {
                            direction = 1;
                        } else {
                            direction = 0;
                        }

                        oldX = e.clientX;
                        if (currentDirection != direction) {
                            elementRef.css({
                                "WebkitTransform": 'rotate(' + (maxRotation * direction) + 'deg) scale(1.1)'
                            });

                            currentDirection = direction;
                        }

                    },

                    stop: function (e) {

                        elementRef.css({
                            "WebkitTransform": "rotate(0deg) scale(1)",
                            "box-shadow": ""
                        });

                        dragging = false;
                    }
                });

            },


            _setOption: function (option: any, value: any) {
                $.Widget.prototype._setOption.apply(this, arguments);

                switch (option) {
                    case "maxRotation":
                        break;
                }
            },


            destroy: function () {
                $.Widget.prototype.destroy.call(this);

                $(this.element).draggable("destroy");
                $(this.element).css({
                    "-webkit-transition": "",
                    "transition": "",
                    "WebkitTransform": "",
                    "box-shadow": ""
                });
            }

        };

        $.widget(this.plugInName, this.plugInObject);
    }

}