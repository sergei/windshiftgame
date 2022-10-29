import {Circle, Group, Line, Text} from "react-konva";
import React from "react";

function Isochrone(props) {

    const nodes = props.ic.map( (node, idx) => {
        return ( <Circle  key={idx}  radius={2} x={node.x/props.milesInPixel} y={node.y/props.milesInPixel} stroke={'black'} fill={'green'}/> )
    } )

    return( <Group>{nodes}</Group>)
}

function IsoChrones(props){
    const [routeUpdateStatus, setRouteUpdateStatus] = React.useState('Creating route ...')
    const [fastestUpwindRoute, setFastestUpwindRoute] = React.useState([...props.wr.upwindRoute])
    const [fastestDownwindRoute, setFastestDownwindRoute] = React.useState([...props.wr.downwindRoute])

    console.log(`Rendering isochrones fastestRoute.length=${fastestUpwindRoute.length}`)
    React.useEffect(() => {
        if ( ! props.wr.isRoutingComplete() ){
            const text = `step=${props.wr.rs.totalNodesCount}`
            console.log(`In use effect text=${text}`)
            const done = props.wr.routeCreationBatch(200, 50000)
            if ( done ){
                setRouteUpdateStatus('Done')
                setFastestUpwindRoute([...props.wr.upwindRoute])
                setFastestDownwindRoute([...props.wr.downwindRoute])
            }else{
                setRouteUpdateStatus(text)
            }
            console.log(`In use effect done=${done}`)
        }
    }, [routeUpdateStatus, fastestUpwindRoute, props.wr]);

    const xyUpwindPairs = fastestUpwindRoute.reduce(function(result, value, index, array) {
        if (index % 2 === 0)
            result.push({x: array[index], y:array[index+1]});
        return result;
    }, []);

    const xyDownWindPairs = fastestDownwindRoute.reduce(function(result, value, index, array) {
        if (index % 2 === 0)
            result.push({x: array[index], y:array[index+1]});
        return result;
    }, []);

    // const isochrones = xyPairs.map( (isochrone, idx) => {
    //     return ( <Isochrone key={idx} ic={isochrone} milesInPixel={props.milesInPixel}/> )
    // } )
    //
    //
    const upwindTrail = fastestUpwindRoute.map( (v) => Math.round(v / props.milesInPixel))
    const downwindTrail = fastestDownwindRoute.map( (v) => Math.round(v / props.milesInPixel))


    return( <Group>
        {/*{isochrones}*/}

        <Line points={upwindTrail} stroke={'green'}/>
        <Isochrone  ic={xyUpwindPairs} milesInPixel={props.milesInPixel}/>

        <Line points={downwindTrail} stroke={'red'}/>
        <Isochrone  ic={xyDownWindPairs} milesInPixel={props.milesInPixel}/>


        <Text x={20} y={20} text={routeUpdateStatus} fill={'black'}/>
    </Group>)
}

export default IsoChrones
