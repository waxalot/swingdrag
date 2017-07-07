/**
 * The options for the jQuery UI swingdrag plugin.
 * 
 * @export
 * @class SwingDragOptions
 */
export class SwingDragOptions {


    /**
     * The maximum possible angle of rotation in degrees.
     * Default: 20
     * 
     * @type {number}
     * @memberof SwingDragOptions
     */
    public maxRotationAngleDeg: number;


    /**
     * Indicates whether a pickup-/drop shadow should be shown.
     * Default: true
     * 
     * @type {boolean}
     * @memberof SwingDragOptions
     */
    public showShadow: boolean;


    /**
     * The pick up scale factor indicates the size change during dragging.
     * Default: 1.1
     * 
     * @type {number}
     * @memberof SwingDragOptions
     */
    public pickUpScaleFactor: number;


    /**
     * This factor controls the influence of the drag speed on the rotation angle.
     * It is useful to control the rotation angle for different display resolutions (DPI).
     * Default: 2.0
     * 
     * @type {number}
     * @memberof SwingDragOptions
     */
    public speedInfluenceFactor: number;


    /**
     * Creates an instance of SwingDragOptions.
     * 
     * @memberof SwingDragOptions
     */
    public constructor() {
        this.maxRotationAngleDeg = 20;
        this.showShadow = true;
        this.pickUpScaleFactor = 1.1;
        this.speedInfluenceFactor = 2.0;
    }

}