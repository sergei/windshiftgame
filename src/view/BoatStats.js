import {useEffect, useState} from "react";
import * as React from "react";
import {toHHMMSS} from "../utils/Utils";
import {Box, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";


function BoatStats(props) {

    const [boatStats, setBoatStats] = useState({
        timeMs: props.bm.timeMs,
        distanceMeters: props.bm.distanceMeters,
        boatSpeedKts: props.bm.boatSpeedKts,
        upwindDistanceMeters: props.bm.upwindDistanceMeters,
        upwindTimeMs: props.bm.upwindTimeMs,
        vmgKts: props.bm.vmgKts
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setBoatStats({
                timeMs: props.bm.timeMs,
                distanceMeters: props.bm.distanceMeters,
                boatSpeedKts: props.bm.boatSpeedKts,
                upwindDistanceMeters: props.bm.upwindDistanceMeters,
                upwindTimeMs: props.bm.upwindTimeMs,
                vmgKts: props.bm.vmgKts
            })
        }, 1000);
        return () => clearInterval(interval);
    }, [props.bm]);

    return (
        <Box>
            <Grid container spacing={0} disableEqualOverflow>
                <Grid xs={12}>
                    <Typography  variant="h6" gutterBottom>
                        Your Boat stats
                    </Typography>
                </Grid>
                <Grid xs={12}>
                    <Typography variant="caption" display="block">
                        Upwind leg
                    </Typography>
                </Grid>
                <Grid xs={6}>
                    <Typography variant="body1" gutterBottom>
                        Time {`${toHHMMSS(boatStats.upwindTimeMs / 1000)}\u00A0` }
                    </Typography>
                </Grid>
                <Grid xs={6}>
                    <Typography variant="body1" gutterBottom>
                        Distance {`${boatStats.upwindDistanceMeters.toFixed(0)}\u00A0m`}
                    </Typography>
                </Grid>
                <Grid xs={12}>
                    <Typography variant="caption" display="block">
                        Total
                    </Typography>
                </Grid>
                <Grid xs={6}>
                    <Typography variant="body1" gutterBottom>
                        Time {`${toHHMMSS(boatStats.timeMs / 1000)}\u00A0` }
                    </Typography>
                </Grid>
                <Grid xs={6}>
                    <Typography variant="body1" gutterBottom>
                        Distance {`${boatStats.distanceMeters.toFixed(0)}\u00A0m`}
                    </Typography>
                </Grid>
                <Grid xs={12}>
                    <Typography variant="caption" display="block">
                        Speed
                    </Typography>
                </Grid>
                <Grid xs={6}>
                    <Typography variant="body1" gutterBottom>
                        {`SPD:\u00A0${boatStats.boatSpeedKts.toFixed(1)}\u00A0kts\u00A0`}
                    </Typography>
                </Grid>
                <Grid xs={6}>
                    <Typography variant="body1" gutterBottom>
                        {`VMG:\u00A0${boatStats.vmgKts.toFixed(1)}\u00A0kts `}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}



export default BoatStats;
