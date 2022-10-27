class WindFieldModel{

    MAX_WIND_SPEED = 20;
    MAX_CURR_SPEED = 5;
    MIN_WIND_SPEED = 5;

    ncols = 3;
    nrows = 3;

    cells = []
    useCurrent = false

    constructor(height, width, windGridDims) {
        this.nrows = windGridDims.nrows
        this.ncols = windGridDims.ncols
        this.width = width
        this.cellSide = Math.min(height / this.nrows, width / this.ncols)

        for(let row =0; row < this.nrows; row++ ){
            for(let col =0; col < this.ncols; col++ ){
                this.cells.push({
                        twd:30,  // True Wind direction
                        tws:10,  // True Wind speed
                        cd:10,   // Current direction
                        cs:1     // Current speed
                    })
            }
        }
        this.generateField()
    }

    generateField(){
        for( let i=0; i < this.cells.length; i++){
            this.cells[i] = {
                twd: this.randomDirection(0, 30),
                tws: this.randomSpeed(10, 5, 5),
                cd: this.randomDirection(0, 180),
                cs: this.randomSpeed(1, 0, 1),
            }
        }
    }

    setUseCurrent(useCurrent) {
        this.useCurrent = useCurrent
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

