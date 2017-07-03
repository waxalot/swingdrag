/**
 * Represents a vector in 2D space.
 * 
 * @export
 * @class Vector2D
 */
export class Vector2D {

    /**
     * The x component of the vector.
     * 
     * @type {number}
     * @memberof Vector2D
     */
    public x: number;

    /**
     * The y component of the vector.
     * 
     * @type {number}
     * @memberof Vector2D
     */
    public y: number;


    /**
     * Creates an instance of Vector2D.
     * 
     * @memberof Vector2D
     */
    public constructor() {
        this.x = 0;
        this.y = 0;
    }

}