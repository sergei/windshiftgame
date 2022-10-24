import * as React from 'react';
import './App.css';
import WindFieldModel from "./model/WindFieldModel";
import polar_text_j105 from './assets/J105.txt'
import PolarTable from "./model/PolarTable";
import BoatModel from "./model/BoatModel";
import Game from "./view/Game";
import RaceCourseModel from "./model/RaceCourseModel";
import GameStorage from "./model/GameStorage";

function App() {
    const maxStageWidth = window.innerWidth
    const maxStageHeight = window.innerHeight* 0.7
    const stageHeightMiles = 1.
    const milesInPixel = stageHeightMiles / maxStageHeight

    const wm = new WindFieldModel(maxStageHeight * milesInPixel, maxStageWidth * milesInPixel);

    const stageWidthPix = wm.ncols * wm.cellSide / milesInPixel
    const stageHeightPix = wm.nrows * wm.cellSide / milesInPixel

    // Set boat initial position in the middle of the bottom row

    const rc = new RaceCourseModel(wm.ncols, wm.nrows, wm.cellSide)
    console.log(`rc = ${JSON.stringify(rc)}`)
    const boatX = (rc.rcb.x + rc.pin.x) / 2
    const boatY = rc.rcb.y
    console.log(`boatx = ${boatX} boaty = ${boatY}`)


    const gs = new GameStorage()

    const bm = new BoatModel(wm, rc, boatX, boatY)

    fetch(polar_text_j105)
        .then(r => r.text())
        .then(data => {
            const pt = new PolarTable(data)
            bm.setPolarTable(pt)
        })
        .catch(reason => {
            console.log("Error " + reason)
        });

    return (
          <div>
              <Game stageWidth={stageWidthPix} stageHeight={stageHeightPix} milesInPixel={milesInPixel} wm={wm} bm={bm} rc={rc} gs={gs}/>
          </div>
      );
}

export default App;
