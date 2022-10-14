import React from 'react';
import {Group, RegularPolygon, Text} from "react-konva";

function VectorControl(props) {
    const r = props.radius

    return (
        <Group  x={props.x} y={props.y}>
            <RegularPolygon sides={3} radius={r} x={  2 * r} y={0} stroke={'black'} fill={'blue'} rotation={90} onClick={props.onDirCW}/>
            <RegularPolygon sides={3} radius={r} x={- 2 * r} y={0} stroke={'black'} fill={'blue'} rotation={-90}  onClick={props.onDirCCW}/>
            <RegularPolygon sides={3} radius={r} x={0} y={ - 2 * r} stroke={'black'} fill={'green'} rotation={0} onClick={props.onSpeedUp}/>
            <RegularPolygon sides={3} radius={r} x={0} y={   2 * r} stroke={'black'} fill={'green'} rotation={180} onClick={props.onSpeedDown}/>
            <Text text={props.title} x={-2 * r}  width={4*r} y={-r/2} fontSize={14} align={'center'}/>
        </Group>
    );
}

export default VectorControl;
