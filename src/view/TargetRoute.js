import {Circle, Group, Line} from "react-konva";
import React from "react";

function Nodes(props) {

    const nodes = props.ic.map( (node, idx) => {
        return ( <Circle  key={idx}  radius={2} x={node.x/props.milesInPixel} y={node.y/props.milesInPixel} stroke={'black'} fill={'green'}/> )
    } )

    return( <Group>{nodes}</Group>)
}

function TargetRoute(props){

    if ( props.targetUpwindRoute.length >= 2 || props.targetDownwindRoute.length >= 2 )
    {
        const xyUpwindPairs = props.targetUpwindRoute.reduce(function(result, value, index, array) {
            if (index % 2 === 0)
                result.push({x: array[index], y:array[index+1]});
            return result;
        }, []);

        const xyDownWindPairs = props.targetDownwindRoute.reduce(function(result, value, index, array) {
            if (index % 2 === 0)
                result.push({x: array[index], y:array[index+1]});
            return result;
        }, []);

        const upwindTrail = props.targetUpwindRoute.map( (v) => Math.round(v / props.milesInPixel))
        const downwindTrail = props.targetDownwindRoute.map( (v) => Math.round(v / props.milesInPixel))


        return( <Group>
            <Line points={upwindTrail} stroke={'green'}/>
            <Nodes  ic={xyUpwindPairs} milesInPixel={props.milesInPixel}/>

            <Line points={downwindTrail} stroke={'red'}/>
            <Nodes  ic={xyDownWindPairs} milesInPixel={props.milesInPixel}/>
        </Group>)

    }else{
        return ( <Group/>)
    }
}

export default TargetRoute
