import React, {useState} from 'react';
import {Group, Line, Rect, Text} from "react-konva";
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

    const windString = `TWS ${props.wm.cells[props.idx].tws.toFixed(0)} kts TWD ${props.wm.cells[props.idx].twd.toFixed(0)}°`
    const currentString = `CS ${props.wm.cells[props.idx].cs.toFixed(1)} kts CD ${props.wm.cells[props.idx].cd.toFixed(0)}°`

    const windTextX = props.side / 32;
    const windTextY = props.side / 16 + props.side / 8 ;
    const currTextX = props.side / 32;
    const currTextY = props.side / 16 * 2 + props.side / 8;


    const rungsNum = 6
    const rungStep = props.side  / rungsNum

    const rungs = []
    for(let i = -rungsNum; i < rungsNum * 2; i++){
        let x0 = - props.side
        let y0 = 0
        let x1 = props.side
        let y1 = 0
        let offsetX = props.side / 2
        let offsetY = rungStep * i
        const rotation = props.wm.cells[props.idx].twd;
        rungs.push(
            <Line points={[x0, y0, x1, y1]} x={offsetX} y={offsetY} stroke={'lightblue'} rotation={rotation} dash={[5, 15]} />
        )
    }

    return (
        <Group x={props.x} y={props.y}  clipX={0} clipY={0} clipWidth={props.side} clipHeight={props.side}>

            <Rect width={props.side} height={props.side} stroke="lightgrey" />

            <WindPointer x={windX} y={windY} r={windR} twd={props.wm.cells[props.idx].twd}/>

            {props.showCurrent ?  <CurrentPointer x={currX} y={currY} r={currR} cs={props.wm.cells[props.idx].cs} cd={props.wm.cells[props.idx].cd}  /> : ''}

            <Text x={windTextX} y={windTextY} text={windString} fill={'lightgrey'}/>

            {props.showCurrent ?  <Text x={currTextX} y={currTextY} text={currentString} fill={'lightgrey'}/> : null }

            {windControl}

            {props.showCurrent ?  currentControl : ''}

            {rungs}

        </Group>
    );
}

export default WindCell;
