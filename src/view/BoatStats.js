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
            {`SPD:\u00A0${boatStats.boatSpeedKts.toFixed(1)}\u00A0kts\u00A0`}
            {`VMG:\u00A0${boatStats.vmgKts.toFixed(1)}\u00A0kts `}
            <br/>
            {`${toHHMMSS(boatStats.timeMs / 1000)}\u00A0` }
            {`${boatStats.distanceMeters.toFixed(0)}\u00A0m`}
        </div>
    )
}



export default BoatStats;
