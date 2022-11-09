import {rads} from "../utils/Utils";

class WindFieldModel{

    MAX_WIND_SPEED = 20;
    MAX_CURR_SPEED = 5;
    MIN_WIND_SPEED = 5;

    DEFAULT_WIND_SPEED = 10
    DEFAULT_CURR_DIR = 0

    cells = []
    useCurrent = false
    useSimpleModel = true

    constructor(height, width, windGridDims) {
        this.nrows = windGridDims.nrows
        this.ncols = windGridDims.ncols
        this.width = width
        this.cellSide = Math.min(height / this.nrows, width / this.ncols)
        this.trueWidth = this.ncols * this.cellSide
        this.trueHeight = this.nrows * this.cellSide

        for(let row =0; row < this.nrows; row++ ){
            for(let col =0; col < this.ncols; col++ ){
                this.cells.push({
                        twd:0,  // True Wind direction
                        tws: this.DEFAULT_WIND_SPEED,  // True Wind speed
                        cd: this.DEFAULT_CURR_DIR,     // Current direction
                        cs:0,     // Current speed
                        cache: new Map(),
                    })
            }
        }
        this.generateField()
    }

    generateField(){
        for( let i=0; i < this.cells.length; i++){
            this.cells[i] = {
                twd: this.randomDirection(0, 30),
                tws: this.useSimpleModel ? this.DEFAULT_WIND_SPEED : this.randomSpeed(10, 5, 5),
                cd: this.useSimpleModel ? this.randomUpOrDown(): this.randomDirection(0, 180),
                cs: this.randomSpeed(1, 0, 1),
                cache: new Map(),
            }
        }
    }

    setUseCurrent(useCurrent) {
        this.useCurrent = useCurrent
    }

    setUseSimpleModel(useSimpleModel) {
        this.useSimpleModel = useSimpleModel
        this.generateField()
    }

    randomDirection(mean, range){
        let dir =  (Math.random() - 0.5) * range*2 + mean
        if ( dir < 0 )
            dir += 360
        else if (dir > 360 ){
            dir -= 360
        }
        return dir
    }

    randomUpOrDown(){
        if ( Math.random() > 0.5 )
            return 180
        else
            return 0
    }

    randomSpeed(mean, min, range){
        let speed =  (Math.random() - 0.5) * range*2 + mean
        if ( speed < 0 )
            speed = min
        return speed
    }

    getCellInfo(x, y) {
        const col = Math.trunc(x / this.cellSide )
        const row = Math.trunc(y / this.cellSide )
        const cellIdx = row * this.ncols + col;
        // console.log(`col = ${col} row=${row} cellIdx = ${cellIdx}`)

        return this.cells[cellIdx]
    }

    isOutside(x, y) {
        return x > this.trueWidth || y > this.trueHeight || x < 0 || y < 0;
    }

    getBoatMovement(x, y, isUpWind, isStartBoard, adjustmentAngle) {
        const ci = this.getCellInfo(x, y)
        const cacheKey = `${adjustmentAngle},${isUpWind},${isStartBoard}${this.useCurrent}`

        if (!ci.cache.has(cacheKey)){
            // console.log(`Cache miss ${cacheKey}`)
            const targets = this.polarTable.getTargets(ci.tws, isUpWind)
            const twa = this.getTwa(targets, isStartBoard, adjustmentAngle)
            const hdg = ci.twd + twa

            // For now don't adjust wind angle for current
            const bs = this.polarTable.getTargetSpeed(ci.tws, twa)
            const dxw = bs * Math.sin(rads(hdg))
            const dyw = - bs * Math.cos(rads(hdg))

            let dxc = 0
            let dyc = 0
            if ( this.useCurrent ) {
                dxc =  - ci.cs * Math.sin(rads(ci.cd))
                dyc =  ci.cs * Math.cos(rads(ci.cd))
            }

            const dx = dxw + dxc
            const dy = dyw + dyc

            ci.cache.set(cacheKey, {
                hdg: hdg,
                bs: bs,
                dx: dx,
                dy: dy,
                vmgKts: Math.abs(dyw)
                })
        }

        return ci.cache.get(cacheKey)
    }

    getTwa(targets, isStartBoard, adjustmentAngle) {
        let twa = targets.twa + adjustmentAngle

        if ( adjustmentAngle === 90)  // Special case for reach course
            twa = 90

        if (twa < 0)
            twa = 0
        if (twa > 180)
            twa = 180
        if (isStartBoard)
            twa = -twa
        return twa;
    }


    normalizeAngle(angle){
        if( angle < 0 )
            return angle + 360
        else if ( angle >= 360)
            return angle -360
        else
            return angle
    }

    limitSpeed(minSpeed, speed, maxSpeed){
        if( speed < minSpeed )
            return minSpeed
        else if ( speed > maxSpeed)
            return maxSpeed
        else
            return speed
    }

    setPolarTable(pt) {
        this.polarTable = pt
    }

    onWindDirectionChanged(idx, delta) {
        console.log("Wind direction changed " + idx + ' ' + delta)
        this.cells[idx].twd = this.normalizeAngle(this.cells[idx].twd + delta)
    }

    onWindSpeedChanged(idx, delta) {
        console.log("Wind speed changed " + idx + ' ' + delta)
        this.cells[idx].tws = this.limitSpeed(this.MIN_WIND_SPEED, this.cells[idx].tws + delta, this.MAX_WIND_SPEED)
    }

    onCurrentDirectionChanged(idx, delta) {
        console.log("Current direction changed " + idx + ' ' + delta)
        this.cells[idx].cd = this.normalizeAngle(this.cells[idx].cd + delta)
    }

    onCurrentSpeedChanged(idx, delta) {
        console.log("Current speed changed " + idx + ' ' + delta)
        this.cells[idx].cs = this.limitSpeed(0, this.cells[idx].cs + delta, this.MAX_CURR_SPEED)
    }
}

export default WindFieldModel;

