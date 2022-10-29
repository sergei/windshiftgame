import * as React from 'react';
import {useEffect, useState} from 'react';
import './App.css';
import WindFieldModel from "./model/WindFieldModel";
import polar_text_j105 from './assets/J105.txt'
import PolarTable from "./model/PolarTable";
import BoatModel from "./model/BoatModel";
import Game from "./view/Game";
import RaceCourseModel from "./model/RaceCourseModel";
import GameStorage from "./model/GameStorage";
import WeatherRouter from "./model/WeatherRouter";
import ErrorBoundary from "./ErrorBoundary";

function App() {

    // Loading polar data
    const [polarCsv, setPolarCsv] = useState('')
    useEffect(() => {
        function loadData() {
            fetch(polar_text_j105)
                .then(r => r.text())
                .then(data => {
                    setPolarCsv(data)
                })
                .catch(reason => {
                    console.log("Error " + reason)
                });
        }

        loadData();

    }, []);

    const [windGridDims, setWindGridDims] = useState({nrows:3, ncols:3})
    const onWindGridDimChange = (gridDims) => {
        setWindGridDims(gridDims)
        console.log(`Grid dims = ${JSON.stringify(gridDims)}`)
    }

    const maxStageWidth = window.innerWidth
    const maxStageHeight = window.innerHeight* 0.8
    const stageHeightMiles = 1.
    const milesInPixel = stageHeightMiles / maxStageHeight

    const wm = new WindFieldModel(maxStageHeight * milesInPixel, maxStageWidth * milesInPixel, windGridDims);

    const stageWidthPix = wm.ncols * wm.cellSide / milesInPixel
    const stageHeightPix = wm.nrows * wm.cellSide / milesInPixel

    const rc = new RaceCourseModel(wm.ncols, wm.nrows, wm.cellSide)

    // Set boat initial position in the middle of start line
    const boatX = (rc.rcb.x + rc.pin.x) / 2
    const boatY = rc.rcb.y

    const gs = new GameStorage()

    const bm = new BoatModel(wm, rc, boatX, boatY)

    let gameView;
    if ( polarCsv.length === 0){
        gameView = <div>Loading...</div>;
    }else{
        const pt = new PolarTable(polarCsv)

        wm.setPolarTable(pt)

        bm.setPolarTable(pt)
        bm.computeLayLines()

        const wr = new WeatherRouter(rc, wm, bm)

        return (
                <ErrorBoundary>
                    <Game stageWidth={stageWidthPix} stageHeight={stageHeightPix} milesInPixel={milesInPixel}
                             wm={wm} bm={bm} rc={rc} gs={gs} wr={wr} onWindGridDimChange={onWindGridDimChange}
                             layLine={[...bm.layLine]} fastestRoute={[...wr.upwindRoute]} />
                </ErrorBoundary>
            )
    }

    return (gameView)
}

export default App;
