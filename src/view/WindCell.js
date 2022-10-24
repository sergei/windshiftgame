import React, {useState} from 'react';
import {Arrow, Group, Rect} from "react-konva";
import VectorControl from "./VectorControl";
import {rads} from "../utils/Utils";

function WindCell(props) {

    const [cellData, setCellData] = useState(props.wm.cells[props.idx]);

    console.log("Rendering wind cell " + props.idx)

    const windR =  props.side/2 * cellData.tws / props.wm.MAX_WIND_SPEED
    const currR =  props.side/2 * cellData.cs / props.wm.MAX_CURR_SPEED

    const xc = props.side/2
    const yc = props.side/2

    function arrowPoints(x, y, r, angle) {
        const alpha = rads(angle)
        const xs = x + r * Math.sin(alpha)
        const ys = y - r * Math.cos(alpha)

        const xe = x - r * Math.sin(alpha)
        const ye = y + r * Math.cos(alpha)

        return [xs, ys, xs, ys, xe, ye];
    }

    const windPoints = arrowPoints(xc, yc, windR, props.wm.cells[props.idx].twd);
    const currPoints = arrowPoints(xc, yc, currR, props.wm.cells[props.idx].cd);

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

    return (
        <Group x={props.x} y={props.y}>

            <Rect width={props.side} height={props.side} stroke="lightgrey" />

            <Arrow points={windPoints} stroke={'lightblue'} pointerLength={10} pointerWidth={12} />

            {/*<Arrow points={currPoints} stroke={'red'} pointerLength={10} pointerWidth={12} />*/}

            {windControl}

            {currentControl}

        </Group>
    );
}

export default WindCell;
