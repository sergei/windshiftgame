import {Circle, Group, Line, RegularPolygon} from "react-konva";
import React from "react";

function RaceCourse(props) {

    const r = props.weatherMarkRadiusPix
    const markFillColor = props.markWasRounded ? 'grey' : 'red'

    return (
        <Group>
            <Circle radius={r} x={props.rc.wm.x/props.milesInPixel} y={props.rc.wm.y/props.milesInPixel} stroke={'black'} fill={markFillColor} />
            <RegularPolygon sides={3} radius={r} x={props.rc.rcb.x/props.milesInPixel} y={props.rc.rcb.y/props.milesInPixel} stroke={'black'} fill={'blue'} />
            <RegularPolygon sides={3} radius={r} x={props.rc.pin.x/props.milesInPixel} y={props.rc.pin.y/props.milesInPixel} stroke={'black'} fill={'grin'} />
            <Line points={[props.rc.pin.x/props.milesInPixel, props.rc.pin.y/props.milesInPixel, props.rc.rcb.x/props.milesInPixel, props.rc.pin.y/props.milesInPixel]} stroke={'black'} fill={'grin'}/>
        </Group>
    );

}
export default RaceCourse;
