import {Arrow} from "react-konva";
import React from "react";
import {rads} from "../utils/Utils";

function WindPointer(props) {

    function arrowPoints(x, y, r, angle) {
        const alpha = rads(angle)
        const xs = x + r * Math.sin(alpha)
        const ys = y - r * Math.cos(alpha)

        const xe = x - r * Math.sin(alpha)
        const ye = y + r * Math.cos(alpha)

        return [xs, ys, xs, ys, xe, ye];
    }

    const windPoints = arrowPoints(props.x, props.y, props.r, props.twd);


    return(
        <Arrow points={windPoints} stroke={'lightblue'} pointerLength={10} pointerWidth={12} />
    )
}

export default WindPointer;
