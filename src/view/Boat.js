import {Group, Line, Path} from "react-konva";
import React, {useEffect, useState} from "react";

function Boat(props) {

    const [boatPos, setBoatPos] = useState({x:0, y:0, hdg: 45});
    const [opponentsPos, setOpponentPos] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            props.bm.updatePosition(1000)
            setBoatPos({
                x:props.bm.x / props.milesInPixel,
                y:props.bm.y / props.milesInPixel,
                hdg: props.bm.hdg
            })

            setOpponentPos( props.bm.getOpponentsPos().map( (opponent) => {return{
                x:opponent.x / props.milesInPixel,
                y:opponent.y / props.milesInPixel,
                hdg: opponent.hdg,
                color: opponent.color
            }}))

        }, 100);
        return () => clearInterval(interval);
    }, [props.bm, props.milesInPixel]);

    const trail = props.bm.trail.map( (v) => Math.round(v / props.milesInPixel))

    function boatHull(x, y, hdg, color) {
        return <Group x={x} y={y} rotation={hdg}>
            <Path
                data={'M -0.16185357,-60.528489 C -23.351101,0.18972333 -20.565871,43.334463 0.42371743,43.344773 m -0.585571,-103.873262 C 23.027391,0.18972333 21.413303,43.334463 0.42371743,43.344773'}
                fill={color}
                stroke="black"
                scaleX={0.5}
                scaleY={0.5}
            />
        </Group>;
    }

    const opponents = opponentsPos.map( (opponent, idx) => {
        return <Group key={idx}>{boatHull(opponent.x, opponent.y, opponent.hdg, opponent.color)}</Group>
    })

    return (
        <Group>
            {opponents}
            <Line points={trail} stroke={'black'}/>
            {boatHull(boatPos.x, boatPos.y, boatPos.hdg, 'yellow')}
        </Group>
    );
}

export default Boat;
