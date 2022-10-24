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
            {`SPD: ${boatStats.boatSpeedKts.toFixed(1)} kts `}
            {`VMG ${boatStats.vmgKts.toFixed(1)} kts `}
            <br/>
            {`${toHHMMSS(boatStats.timeMs / 1000)} ` }
            { `${boatStats.distanceMeters.toFixed(0)} m`}
        </div>
    )
}



export default BoatStats;
