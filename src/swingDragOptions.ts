/**
 * The options for the jQuery UI swingdrag plugin.
 * 
 * @export
 * @class SwingDragOptions
 */
export class SwingDragOptions {

    /**
     * The maximum angle of rotation in degree.
     * Default: 3
     * @type {number}
     * @memberOf SwingDragOptions
     */
    public maxRotationAngleDeg: number;


    /**
     * Indicates whether a pickup-/drop-shadow should be shown.
     * Default: true
     * @type {boolean}
     * @memberOf SwingDragOptions
     */
    public showShadow: boolean;


    /**
     * The pick up scale factor indicates the size change during dragging.
     * Default: 1.1
     * @type {number}
     * @memberOf SwingDragOptions
     */
    public pickUpScaleFactor: number;


    /**
     * Creates an instance of SwingDragOptions.
     * 
     * @memberOf SwingDragOptions
     */
    public constructor() {
        this.maxRotationAngleDeg = 2;
        this.showShadow = true;
        this.pickUpScaleFactor = 1.1;
    }

}