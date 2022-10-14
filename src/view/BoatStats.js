import {useEffect, useState} from "react";
import * as React from "react";
import {toHHMMSS} from "../utils/Utils";


function BoatStats(props) {

    const [boatStats, setBoatStats] = useState({
        timeMs: props.bm.timeMs,
        distanceMeters: props.bm.distanceMeters,
        boatSpeedKts: props.bm.boatSpeedKts,
        vmgKts: props.bm.vmgKts
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setBoatStats({
                timeMs: props.bm.timeMs,
                distanceMeters: props.bm.distanceMeters,
                boatSpeedKts: props.bm.boatSpeedKts,
                vmgKts: props.bm.vmgKts
            })
        }, 1000);
        return () => clearInterval(interval);
    }, [props.bm]);

    return (
        <div>
            {`SPD: ${boatStats.boatSpeedKts.toFixed(1)} kts`}
            <br/>
            {`VMG ${boatStats.vmgKts.toFixed(1)} kts `}
            <br/>
            { `Distance: ${boatStats.distanceMeters.toFixed(0)} meters`}
            <br/>
            {`Time: ${toHHMMSS(boatStats.timeMs / 1000)} `}
        </div>
    )
}



export default BoatStats;
