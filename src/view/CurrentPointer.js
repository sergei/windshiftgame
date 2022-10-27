import {Arc, Circle, Group} from "react-konva";
import React from "react";

function CurrentPointer(props) {

    const currentDirection = props.cd
    const currentSpeed = props.cs

    const scale = 1 + currentSpeed * 1.2
    const angle = 180 + currentDirection

    const markR = 5
    const wakeFillColor = 'Aquamarine';
    return(
        <Group x={props.x} y={props.y} rotation={angle} >

            <Arc innerRadius={0} outerRadius={markR + 6} angle={180} rotation={0}   strokeWidth={0.5} stroke={'lightgrey'} fill={wakeFillColor} />
            <Arc innerRadius={0} outerRadius={markR + 6} angle={180} rotation={180}  scaleY={scale} strokeWidth={0.5} stroke={'lightgrey'} fill={wakeFillColor} />
            <Arc innerRadius={0} outerRadius={markR + 2} angle={180} rotation={0}   strokeWidth={0.5} stroke={'grey'} fill={wakeFillColor} />
            <Arc innerRadius={0} outerRadius={markR + 2} angle={180} rotation={180}  scaleY={scale} strokeWidth={0.5} stroke={'grey'} fill={wakeFillColor} />
            <Circle radius={markR} strokeWidth={0.5} stroke={'black'} fill={'darkgreen'} />

        </Group>
    )
}

export default CurrentPointer;
