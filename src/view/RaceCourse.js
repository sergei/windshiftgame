import {Circle, Group, Line, RegularPolygon} from "react-konva";
import React from "react";

function RaceCourse(props) {

    const r = props.weatherMarkRadiusPix
    const markFillColor = props.markWasRounded ? 'grey' : 'red'

    return (
        <Group>
            <Circle radius={r} x={props.rc.wm.x/props.milesInPixel} y={props.rc.wm.y/props.milesInPixel} stroke={'black'} fill={markFillColor} />
            <RegularPolygon sides={3} radius={r*1.5} x={props.rc.rcb.x/props.milesInPixel} y={props.rc.rcb.y/props.milesInPixel} stroke={'black'} fill={'orange'} />
            <Circle  radius={r} x={props.rc.pin.x/props.milesInPixel} y={props.rc.pin.y/props.milesInPixel} stroke={'black'} fill={'yellow'} />
            <Line points={[props.rc.pin.x/props.milesInPixel, props.rc.pin.y/props.milesInPixel, props.rc.rcb.x/props.milesInPixel, props.rc.pin.y/props.milesInPixel]} stroke={'black'} fill={'grin'}/>
        </Group>
    );

}
export default RaceCourse;
