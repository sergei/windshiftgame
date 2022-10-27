import React, {useState} from 'react';
import {Group, Rect, Text} from "react-konva";
import VectorControl from "./VectorControl";
import WindPointer from "./WindPointer";
import CurrentPointer from "./CurrentPointer";

function WindCell(props) {

    const [cellData, setCellData] = useState(props.wm.cells[props.idx]);

    const windR =  props.side/2 * cellData.tws / props.wm.MAX_WIND_SPEED
    const currR =  props.side/4 * cellData.cs / props.wm.MAX_WIND_SPEED

    const windX = props.side/2
    const windY = props.side/2

    const currX = props.side/4 * 2
    const currY = props.side/4 * 2

    const vcr = props.side/12;
    const xwc = vcr * 4
    const ywc = vcr * 4
    const xcc = props.side - vcr * 4
    const ycc = props.side - vcr * 4

    let windControl = ''
    let currentControl = ''

    if ( props.showControls ){
        windControl = <VectorControl
            title={'Wind'}
            x={xwc}
            y={ywc}
            radius={vcr}
            onDirCW={ () => {
                props.wm.onWindDirectionChanged(props.idx, 5)
                setCellData({...props.wm.cells[props.idx]})
            }}
            onDirCCW={ () => {
                props.wm.onWindDirectionChanged(props.idx, -5)
                setCellData({...props.wm.cells[props.idx]})
            }}
            onSpeedUp={ () => {
                props.wm.onWindSpeedChanged(props.idx, 1)
                setCellData({...props.wm.cells[props.idx]})
            }}
            onSpeedDown={ () => {
                props.wm.onWindSpeedChanged(props.idx, -1)
                setCellData({...props.wm.cells[props.idx]})
            }}
        />

        currentControl = <VectorControl
            title={'Current'}
            x={xcc}
            y={ycc}
            radius={vcr}
            onDirCW={ () => {
                props.wm.onCurrentDirectionChanged(props.idx, -5)
                setCellData({...props.wm.cells[props.idx]})
            }}
            onDirCCW={() => {
                props.wm.onCurrentDirectionChanged(props.idx, 5)
                setCellData({...props.wm.cells[props.idx]})
            }}
            onSpeedUp={() => {
                props.wm.onCurrentSpeedChanged(props.idx, 1)
                setCellData({...props.wm.cells[props.idx]})
            }}
            onSpeedDown={() => {
                props.wm.onCurrentSpeedChanged(props.idx, -1)
                setCellData({...props.wm.cells[props.idx]})
            }}
        />

    }

    const windString = `TWS ${props.wm.cells[props.idx].tws.toFixed(0)} kts TWD ${props.wm.cells[props.idx].tws.toFixed(0)}°`
    const currentString = `CS ${props.wm.cells[props.idx].cs.toFixed(1)} kts CD ${props.wm.cells[props.idx].cd.toFixed(0)}°`

    const windTextX = props.side / 32;
    const windTextY = props.side / 16 + props.side / 8 ;
    const currTextX = props.side / 32;
    const currTextY = props.side / 16 * 2 + props.side / 8;

    return (
        <Group x={props.x} y={props.y}>

            <Rect width={props.side} height={props.side} stroke="lightgrey" />

            <WindPointer x={windX} y={windY} r={windR} twd={props.wm.cells[props.idx].twd}/>

            {props.showCurrent ?  <CurrentPointer x={currX} y={currY} r={currR} cs={props.wm.cells[props.idx].cs} cd={props.wm.cells[props.idx].cd}  /> : ''}

            <Text x={windTextX} y={windTextY} text={windString} fill={'lightgrey'}/>

            <Text x={currTextX} y={currTextY} text={currentString} fill={'lightgrey'}/>

            {windControl}

            {props.showCurrent ?  currentControl : ''}

        </Group>
    );
}

export default WindCell;
