import React from 'react';
import {Group} from "react-konva";
import WindCell from "./WindCell";

function WindField(props) {

    const cells = props.wm.cells;
    const side = Math.min(props.height / props.nrows, props.width / props.ncols)

    const WindCells = cells.map((cell, i) => {
        const row = Math.floor(i / props.ncols)
        const col = i % props.ncols
        const x =  col * side
        const y = row * side

        return <WindCell
            key={i}
            idx={i}
            x={x}
            y={y}
            side={side}
            twd={cells[i].twd}
            tws={cells[i].tws}
            wm={props.wm}
            showControls={props.showControls}
            weatherId={props.weatherId}
        />
    })

    return (
        <Group>
            {WindCells}
        </Group>
    );

}

export default WindField;
