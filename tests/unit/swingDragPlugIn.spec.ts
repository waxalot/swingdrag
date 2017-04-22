import { expect } from 'chai';
import { SwingDragPlugIn } from '../../src/swingDragPlugIn';
import { Directions } from "../../src/directions";

describe('SwingDragPlugIn', () => {

    describe('constructor', () => {

        it('should be creatable', () => {

            // Arrange
            let plugIn: SwingDragPlugIn;

            // Act
            plugIn = new SwingDragPlugIn();

            // Assert
            expect(plugIn).to.be.not.null;

        });

    });

    describe('direction analysis', () => {

        let tests = [
            { oldX: 0, actualX: 1, expectedDirection: Directions.right },
            { oldX: 0, actualX: -1, expectedDirection: Directions.left },
            { oldX: 0, actualX: 0, expectedDirection: Directions.undefined }
        ];

        tests.forEach((test) => {

            it('should be able to calculate the dragging direction', () => {
                // Arrange
                let swingDragPlugIn = new SwingDragPlugIn();

                // Act
                let resultDirection = swingDragPlugIn.getDirection(test.actualX, test.oldX);

                // Assert
                expect(resultDirection).to.be.equal(test.expectedDirection);
            });
        });

    });

});