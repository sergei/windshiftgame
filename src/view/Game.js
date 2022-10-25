import {Layer, Stage} from "react-konva";
import WindField from "./WindField";
import Boat from "./Boat";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from "react";
import {Box, Button, FormControl, Link, Paper, Radio, RadioGroup} from "@mui/material";
import RaceCourse from "./RaceCourse";
import BoatStats from "./BoatStats";
import {useEffect} from "react";
import ScoreBoard from "./ScoreBoard";

// Game states

const GAME_STATE_READY    = 'ready'    // Start button shown, boat is at the start line upwind starboard, opponents selection is enabled
const GAME_STATE_RUNNING  = 'running'  // Pause button is shown, opponents selection is disabled
const GAME_STATE_PAUSED   = 'paused'   // Done button is shown, Resume button is shown, opponents selection is disabled
const GAME_STATE_FINISHED = 'finished' // Done button is shown, opponents selection is enabled

function Game(props) {

    const [layLine, setLayLLne] = React.useState(props.bm.layLine);

    const [gameState, setGameState] = React.useState(GAME_STATE_READY);

    const [showControls, setShowControls] = React.useState(false);
    const handleChangeShowControls = (event) => {
        setShowControls(event.target.checked);
    };

    const [tack, setTack] = React.useState('stbd');
    const handleTackChange = (event) => {
        setTack(event.target.value);
        props.bm.setTack(event.target.value === 'stbd')
        setAdjustment('target');
        props.bm.setAdjustmentAngle(0)
    };

    const [pointOfSail, setPointOfSail] = React.useState('upwind');
    const handleUpDownChange = (event) => {
        setPointOfSail(event.target.value);
        if (event.target.value === 'reach'){
            props.bm.setAdjustmentAngle(90)
        }
        else{
            props.bm.setUpDown(event.target.value === 'upwind')
            props.bm.setAdjustmentAngle(0)
        }
    };

    const [adjustment, setAdjustment] = React.useState('target');
    const handleAdjustment = (event) => {
        setAdjustment(event.target.value);
        let adjustmentAngle = 0
        if( event.target.value === 'high')
            adjustmentAngle = -5
        else if (event.target.value === 'low')
            adjustmentAngle = 5
        props.bm.setAdjustmentAngle(adjustmentAngle)
    };


    const toggleGameState = () => {
        switch (gameState){
            case GAME_STATE_READY:
                props.bm.startPause(true)
                setGameState(GAME_STATE_RUNNING)
                break
            case GAME_STATE_RUNNING:
                props.bm.startPause(false)
                setGameState(GAME_STATE_PAUSED)
                break
            case GAME_STATE_PAUSED:
                props.bm.startPause(true)
                setGameState(GAME_STATE_RUNNING)
                break
            case GAME_STATE_FINISHED:
                break
            default:
        }
    }

    const stopGame = () => {
        setGameState(GAME_STATE_READY)
        setTack('stbd');
        props.bm.setTack(true)
        setPointOfSail('upwind');
        props.bm.setAdjustmentAngle(0)
        setAdjustment('target');
        props.bm.setUpDown(true)
        props.bm.stopGame()
        setMarkWasRounded(false)
        setLayLineCrossed(false)
    }

    const [weatherId, setWeatherId] = React.useState(0)
    const changeWeather = () => {
        props.wm.generateField()
        props.bm.computeLayLines()
        setLayLLne(props.bm.layLine)
        setWeatherId(weatherId + 1)
    }

    const [markWasRounded, setMarkWasRounded] = React.useState(false)
    const onWeatherMarkReached = () => {
        if( layLineCrossed && ! markWasRounded ){
            setPointOfSail('downwind');
            props.bm.setUpDown(false)
            setMarkWasRounded(true)
        }
    }

    const [layLineCrossed, setLayLineCrossed] = React.useState(false)
    const onLayLineCrossed = () => {
        if( ! layLineCrossed ){
            setTack('stbd');
            props.bm.setTack(true)
            setAdjustment('target');
            props.bm.setAdjustmentAngle(0)
            setLayLineCrossed(true)
        }
    }

    const [gameStats, setGameStats] = React.useState(props.gs.getStats())

    useEffect(() => {
        const interval = setInterval(() => {
            if ( props.bm.isFinishLineCrossed() && markWasRounded){
                if ( gameState === GAME_STATE_RUNNING){
                    // Update the score
                    props.gs.addScore(props.bm)
                    setGameStats(props.gs.getStats())
                    setGameState(GAME_STATE_FINISHED)
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [props.gs, props.bm, gameState, markWasRounded]);

    const onOpponentsSelected = (gsInd) => {
        props.bm.setOpponents(props.gs.getTracks(gsInd))
    }


    const highLabel = pointOfSail === 'upwind' ? 'Pinch' : 'Heat'
    const lowLabel = pointOfSail === 'upwind' ? 'Foot' : 'Soak'

    let startPauseResumeLabel = ''
    let startPauseResumeIcon = ''

    if ( gameState === GAME_STATE_READY ){
        startPauseResumeLabel = 'Go'
        startPauseResumeIcon = <PlayArrowIcon />
    }else if ( gameState === GAME_STATE_RUNNING ){
        startPauseResumeLabel = 'Pause'
        startPauseResumeIcon = <PauseIcon />
    }else if ( gameState === GAME_STATE_PAUSED ){
        startPauseResumeLabel = 'Resume'
        startPauseResumeIcon = <PlayArrowIcon />
    }else if ( gameState === GAME_STATE_FINISHED ) {
        startPauseResumeLabel = ''
        startPauseResumeIcon = <PauseIcon />
    }

    const doneButton = (gameState === GAME_STATE_PAUSED) || (gameState === GAME_STATE_FINISHED) ?
        <Button variant="contained" endIcon={<StopIcon />} onClick={stopGame}>Back to Start</Button> : ''

    const startPauseResumeButton = startPauseResumeLabel === '' ?
        '' : <Button variant="contained" endIcon={startPauseResumeIcon} onClick={toggleGameState}>{startPauseResumeLabel}</Button>


    const lr = [
        {value: 'stbd', label: 'Starboard'},
        {value: 'port', label: 'Port'},
    ]
    const left = pointOfSail === 'upwind' || pointOfSail === 'reach'? lr[0] : lr[1]
    const right = pointOfSail === 'upwind' || pointOfSail === 'reach'? lr[1] : lr[0]

    const weatherMarkRadiusPix = 10

    const stageRotation = pointOfSail === 'upwind' || pointOfSail === 'reach'
        ?{rotation:0, offsetX:0, offsetY:0}
        :{rotation:180, offsetX:props.stageWidth, offsetY:props.stageHeight}

    return (
        <div>
            <div>
                <Grid container spacing={2} disableEqualOverflow>
                    <Grid item xs={1} >
                    </Grid>
                    <Grid item style={{ width: props.stageWidth * 1.1 }}  xs={9} >
                        <Stage width={props.stageWidth} height={props.stageHeight}>
                            <Layer rotation={stageRotation.rotation} offsetY={stageRotation.offsetY} offsetX={stageRotation.offsetX}>
                                <WindField width={props.stageWidth} height={props.stageHeight} nrows={props.wm.nrows}
                                           ncols={props.wm.ncols} wm={props.wm} showControls={showControls}
                                           weatherId={weatherId}/>
                                <RaceCourse weatherMarkRadiusPix={weatherMarkRadiusPix} milesInPixel={props.milesInPixel}
                                            rc={props.rc} layLine={layLine} markWasRounded={markWasRounded}  layLineCrossed={layLineCrossed}/>
                                <Boat milesInPixel={props.milesInPixel} bm={props.bm} rc={props.rc}
                                      weatherMarkRadiusPix={weatherMarkRadiusPix} onWeatherMarkReached={onWeatherMarkReached} onLayLineCrossed={onLayLineCrossed} />
                            </Layer>
                        </Stage>
                    </Grid>
                    <Grid item xs={2} >
                        <Box mt={1}>
                            <Link href="https://github.com/sergei/windshiftgame/wiki" target="_blank"  rel="noopener">Help</Link>
                        </Box>
                        <Box  mt={2}>
                            <Paper elevation={1} >
                                <BoatStats bm={props.bm}/>
                            </Paper>
                        </Box>
                        <Box  mt={2}>
                            <Paper elevation={1} >
                                <ScoreBoard gameStats={gameStats} onOpponentsSelected={onOpponentsSelected}/>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </div>
            <div>
                <FormControl>
                <Grid container spacing={2}>
                    <Grid item xs={1} >
                    </Grid>
                    <Grid xs={3}>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="tack-group"
                                    value={tack}
                                    onChange={handleTackChange}>
                            <FormControlLabel value={left.value} control={<Radio />} label={left.label} />
                            <FormControlLabel value={right.value} control={<Radio />} label={right.label} />
                        </RadioGroup>
                    </Grid>
                    <Grid xs={3}>
                        <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="adj-group"
                                    value={adjustment}
                                    onChange={handleAdjustment}>
                            <FormControlLabel value="high" control={<Radio />} label={highLabel} />
                            <FormControlLabel value="target" control={<Radio />} label="Target" />
                            <FormControlLabel value="low" control={<Radio />} label={lowLabel} />
                        </RadioGroup>
                    </Grid>
                    <Grid xs={3}>
                        <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="dir-group"
                                    value={pointOfSail}
                                    onChange={handleUpDownChange}>
                            <FormControlLabel value="upwind" control={<Radio />} label="Upwind" />
                            <FormControlLabel value="reach" control={<Radio />} label="Reach" />
                            <FormControlLabel value="downwind" control={<Radio />} label="Downwind" />
                        </RadioGroup>
                    </Grid>
                    <Grid xs={2}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={showControls} onChange={handleChangeShowControls}/>} label="Show controls" />
                        </FormGroup>
                    </Grid>
                    <Grid xs={4} >
                        <Button variant="contained" endIcon={<AutorenewIcon />} onClick={changeWeather}>
                            Change weather
                        </Button>
                    </Grid>
                    <Grid xs={4} >
                        {startPauseResumeButton}
                    </Grid>
                    <Grid xs={4} >
                        {doneButton}
                    </Grid>
                </Grid>
                </FormControl>
            </div>
        </div>
    );

}

export default Game;
