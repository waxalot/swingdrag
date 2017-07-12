export class MathUtils {

    /**
     * Returns a number whose value was mapped from a source into a target range.
     * 
     * Implemented function: f(value) = minTargetVal + ((maxTargetVal-minTargetVal) / (maxSourceVal - minSourceVal)) * (value - minSourceVal)
     * 
     * @static
     * @param {number} value 
     * @param {number} minSourceVal
     * @param {number} maxSourceVal
     * @param {number} minTargetVal
     * @param {number} maxTargetVal
     * @returns {number} 
     * 
     * @memberof MathUtils
     */
    public static mapInterval(value: number, minSourceVal: number, maxSourceVal: number, minTargetInterval: number, maxTargetInterval: number): number {

        let clampedValue: number = MathUtils.clamp(value, minSourceVal, maxSourceVal);
        let result: number = minTargetInterval + ((maxTargetInterval - minTargetInterval) / (maxSourceVal - minSourceVal)) * (clampedValue - minSourceVal);

        return result;
    }


    /**
     * Returns a number whose value is limited to the given range.
     * 
     * @static
     * @param {number} value 
     * @param {number} min The lower boundary of the output range
     * @param {number} max The upper boundary of the output range
     * @returns {number} A number in the range [min, max]
     * 
     * @memberof MathUtils
     */
    public static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

}