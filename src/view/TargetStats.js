import {useEffect, useState} from "react";
import * as React from "react";
import {toHHMMSS} from "../utils/Utils";
import {Box, Tooltip, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";


function TargetStats(props) {
    const [routeUpdateStatus, setRouteUpdateStatus] = React.useState('Creating route ...')
    const [weatherId, setWeatherId] = React.useState(-1)

    const [targetStats, setTargetStats] = useState({
        timeSec: Math.round(props.wr.elapsedTimeHr * 3600),
        distanceMeters: props.wr.totalDistMiles * 1852,
        upwindTimeSec: Math.round(props.wr.elapsedUpwindTimeHr * 3600),
        upwindDistanceMeters: props.wr.upwindDistMiles * 1852,
    });

    useEffect(() => {
        if ( weatherId !== props.weatherId){
            console.log(`Weather has changed`)
            setWeatherId(props.weatherId)
            props.wr.resetRouter()
        }

        if ( ! props.wr.isRoutingComplete() ){
            const text = `step=${props.wr.rs.totalNodesCount}`
            // console.log(`In use effect text=${text}`)
            const done = props.wr.routeCreationBatch(200, 50000)
            if ( done ){
                if ( props.wr.rs.failed){
                    setRouteUpdateStatus(`Oops. Failed to find route after examining ${props.wr.rs.step +1} isochrones. Please try to change the weather`)
                }else{
                    setRouteUpdateStatus('Done')
                    setTargetStats({
                        timeSec: Math.round(props.wr.elapsedTimeHr * 3600),
                        distanceMeters: props.wr.totalDistMiles * 1852,
                        upwindTimeSec: Math.round(props.wr.elapsedUpwindTimeHr * 3600),
                        upwindDistanceMeters: props.wr.upwindDistMiles * 1852,
                    })
                    props.onTargetRouteComputed()
                }
            }else{
                setRouteUpdateStatus(text)
            }
            console.log(`In use effect done=${done}`)
        }
    }, [routeUpdateStatus, targetStats, props, props.weatherId, weatherId]);

    // console.log('Rendering Target stats ')
    // console.log(`props.weatherId=${props.weatherId} weatherId=${weatherId} `)
    // console.log(`routeUpdateStatus=${routeUpdateStatus}`)
    // console.log(`props.wr.isRoutingComplete()=${props.wr.isRoutingComplete()}`)

    if ( props.wr.isRoutingComplete() ){
        return (
            <Box>
                <Grid container spacing={0} disableEqualOverflow>
                        <Grid xs={12}>
                            <Tooltip title="The stats of the boat sailed by computer. You would see its track once you finish">
                                <Typography  variant="h6" gutterBottom>
                                    Boat To Beat stats
                                </Typography>
                            </Tooltip>
                        </Grid>
                        <Grid xs={12}>
                            <Typography variant="caption" display="block">
                                Upwind leg
                            </Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography variant="body1" gutterBottom>
                                Time {`${toHHMMSS(targetStats.upwindTimeSec)}\u00A0` }
                            </Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography variant="body1" gutterBottom>
                                Distance {`${targetStats.upwindDistanceMeters.toFixed(0)}\u00A0m`}
                            </Typography>
                        </Grid>
                        <Grid xs={12}>
                            <Typography variant="caption" display="block">
                                Total
                            </Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography variant="body1" gutterBottom>
                                Time {`${toHHMMSS(targetStats.timeSec)}\u00A0` }
                            </Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography variant="body1" gutterBottom>
                                Distance {`${targetStats.distanceMeters.toFixed(0)}\u00A0m`}
                            </Typography>
                        </Grid>
                    </Grid>
            </Box>
        )
    }else{
        return (
            <Box>
                {`${routeUpdateStatus}` }
            </Box>
        )
    }

}



export default TargetStats;
