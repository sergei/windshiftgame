import * as React from 'react';
import './App.css';
import WindFieldModel from "./model/WindFieldModel";
import polar_text_j105 from './assets/J105.txt'
import PolarTable from "./model/PolarTable";
import BoatModel from "./model/BoatModel";
import Game from "./view/Game";
import RaceCourseModel from "./model/RaceCourseModel";
import GameStorage from "./model/GameStorage";
import {useEffect, useState} from "react";

function App() {

    const [game, setGame] = useState(<div>Loading ...</div>)

    useEffect(() => {
        const maxStageWidth = window.innerWidth
        const maxStageHeight = window.innerHeight* 0.7
        const stageHeightMiles = 1.
        const milesInPixel = stageHeightMiles / maxStageHeight

        const wm = new WindFieldModel(maxStageHeight * milesInPixel, maxStageWidth * milesInPixel);

        const stageWidthPix = wm.ncols * wm.cellSide / milesInPixel
        const stageHeightPix = wm.nrows * wm.cellSide / milesInPixel

        const rc = new RaceCourseModel(wm.ncols, wm.nrows, wm.cellSide)

        // Set boat initial position in the middle of start line
        const boatX = (rc.rcb.x + rc.pin.x) / 2
        const boatY = rc.rcb.y

        const gs = new GameStorage()

        const bm = new BoatModel(wm, rc, boatX, boatY)

        function loadData() {
            fetch(polar_text_j105)
                .then(r => r.text())
                .then(data => {
                    const pt = new PolarTable(data)
                    bm.setPolarTable(pt)
                    bm.computeLayLines()
                    setGame(<Game stageWidth={stageWidthPix} stageHeight={stageHeightPix} milesInPixel={milesInPixel}
                                  wm={wm} bm={bm} rc={rc} gs={gs}/>)
                })
                .catch(reason => {
                    setGame (<div> "Error " + reason </div>)
                });
        }

        loadData();

    }, []);

    return (game)
}

export default App;
