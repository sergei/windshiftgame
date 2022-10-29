const {intersects, rads, degrees} = require("../utils/Utils");

class BoatModel {

    polarTable = null
    isStartBoard = true
    isUpWind = true
    adjustmentAngle = 0
    isRunning = false
    trail = []
    opponents = []
    hdg = 45
    distanceMeters = 0
    timeMs = 0
    upwindDistanceMeters = 0
    upwindTimeMs = 0
    markRounded = false
    boatSpeedKts = 0
    vmgKts = 0
    layLine = [0, 0, 0, 0]
    layLineCrossed = false

    constructor(windField, raceCourse, x, y) {
        this.windField = windField
        this.raceCourse = raceCourse
        this.x = x
        this.y = y
        this.startX = x
        this.startY = y
    }

    setOpponents(opponents){
        this.opponents = opponents
    }

    setTack(isStarBoard) {
        this.isStartBoard = isStarBoard
    }

    setUpDown(isUpWind) {
        this.isUpWind = isUpWind
    }

    setAdjustmentAngle(adjustmentAngle) {
        this.adjustmentAngle = adjustmentAngle
    }

    startPause(isRunning){
        this.isRunning = isRunning
    }

    onMarkRounded () {
        this.markRounded = true
    }

    stopGame(){
        this.x = this.startX
        this.y = this.startY
        this.trail = []
        this.isRunning = false
        this.distanceMeters = 0
        this.timeMs = 0
        this.upwindDistanceMeters = 0
        this.upwindTimeMs = 0
        this.finished = false
        this.markRounded = false
        const ci = this.windField.getCellInfo(this.x, this.y)
        const targets = this.polarTable.getTargets(ci.tws, this.isUpWind)
        let twa = this.getTwa(targets);
        this.hdg = ci.twd + twa
        this.layLineCrossed = false
    }

    setPolarTable(polarTable){
        this.polarTable = polarTable
        const ci = this.windField.getCellInfo(this.x, this.y)
        // Set boat on starboard tack
        const targets = this.polarTable.getTargets(ci.tws, true)
        this.hdg = ci.twd - targets.twa
    }

    updatePosition(dtMs) {
        if( this.polarTable != null && this.isRunning){
            const move = this.windField.getBoatMovement(this.x, this.y, this.isUpWind, this.isStartBoard, this.adjustmentAngle)
            this.hdg = move.hdg
            this.timeMs += dtMs

            const dtHours = dtMs / 1000. / 3600.
            const x = this.x + move.dx * dtHours
            const y = this.y + move.dy * dtHours

            this.trail.push(x)
            this.trail.push(y)

            if ( this.windField.isOutside(x, y ) ){
                this.boatSpeedKts = 0
                this.vmgKts =0
                return
            }

            this.x = x
            this.y = y

            this.distanceMeters += move.bs * dtHours * 1852
            this.boatSpeedKts = move.bs
            this.vmgKts = move.vmgKts

            if ( !this.markRounded ){
                this.upwindDistanceMeters = this.distanceMeters
                this.upwindTimeMs = this.timeMs
            }

            const finishLine = [this.raceCourse.pin.x, this.raceCourse.pin.y,
                this.raceCourse.rcb.x, this.raceCourse.rcb.y]
            const finished = this.checkLineCrossing(finishLine)
            if( finished ){
                this.elapsedTimeMs = this.timeMs
                this.isRunning = false
                this.finished = true
            }

            const layLineCrossed = this.checkLineCrossing(this.layLine)
            if( layLineCrossed ){
                this.layLineCrossed = true
            }

            // console.log('boat NM xy=', this.x, this.y)
            // console.log(`TWA=${twa.toFixed(0)} BS=${bs.toFixed(2)} HDG=${this.hdg.toFixed(0)} layLineCrossed=${layLineCrossed}`)
        }
    }

    getTwa(targets) {
        let twa = targets.twa + this.adjustmentAngle

        if ( this.adjustmentAngle === 90)  // Special case for reach course
            twa = 90

        if (twa < 0)
            twa = 0
        if (twa > 180)
            twa = 180
        if (this.isStartBoard)
            twa = -twa
        return twa;
    }

    isFinishLineCrossed() {
        return this.finished
    }

    checkLineCrossing(lineToCross) {

        if( this.trail.length > 10 ){
            const prev_x = this.trail[this.trail.length - 4]
            const prev_y = this.trail[this.trail.length - 3]
            const now_x = this.trail[this.trail.length - 2]
            const now_y = this.trail[this.trail.length - 1]
            return  intersects(
                lineToCross[0], lineToCross[1],
                lineToCross[2], lineToCross[3],

                prev_x, prev_y,
                now_x, now_y
                )
        }
    }

    getOpponentsPos(){
        const opponents = []
        const y_idx = this.trail.length - 1
        const x_idx = this.trail.length - 2

        if( y_idx > 2 ){
            this.opponents.forEach( (opponent) => {
                let y,x,yp,xp
                if ( opponent.trail.length >  y_idx ){
                    y = opponent.trail[y_idx]
                    x = opponent.trail[x_idx]
                    yp = opponent.trail[y_idx-2]
                    xp = opponent.trail[x_idx-2]
                }else{
                    y = opponent.trail[opponent.trail.length-1]
                    x = opponent.trail[opponent.trail.length-2]
                    yp = opponent.trail[opponent.trail.length-3]
                    xp = opponent.trail[opponent.trail.length-4]
                }
                const hdg = degrees(Math.atan2(x - xp, yp-y))
                opponents.push({
                    x:x,
                    y:y,
                    hdg:hdg,
                    color: opponent.color
                })
            })
        }

        return opponents
    }

    computeLayLines() {
        // Compute starboard windward mark layline
        const cs = this.windField.getCellInfo(this.raceCourse.wm.x, this.raceCourse.wm.y)
        let twd = cs.twd
        if ( twd > 180 )
            twd = twd - 360
        const twa = this.polarTable.getTargets(cs.tws, true).twa

        let gamma = twa - twd  // Angle to the vertical axis (negative heading)

        if ( this.windField.useCurrent ) {
            // For now don't adjust wind angle for current

            // Boat movement due to current
            const dxc =  - cs.cs * Math.sin(rads(cs.cd))
            const dyc =  cs.cs * Math.cos(rads(cs.cd))
            // console.log(`cd=${cs.cd.toFixed(0)} dxc=${dxc.toFixed(3)} dyc=${dyc.toFixed(3)}`)

            // Boat movement due to the wind
            const bs = this.polarTable.getTargetSpeed(cs.tws, twa)
            const hdg = twd - twa
            const dxw = bs * Math.sin(rads(hdg))
            const dyw = - bs * Math.cos(rads(hdg))

            // console.log(`hdg=${hdg.toFixed(0)} dxw=${dxw.toFixed(3)} dyw=${dyw.toFixed(3)}`)

            // Boat heading adjusted for current
            const dx = dxw + dxc;
            const dy = dyw + dyc;
            const adjHdg = degrees(Math.atan2(dx, -dy ))

            // console.log(`adjHdg=${adjHdg.toFixed(0)} dx=${dx.toFixed(3)} dy=${dy.toFixed(3)}`)
            gamma = - adjHdg
        }

        // console.log(`twd=${twd.toFixed(0)} twa=${twa.toFixed(0)} gamma=${gamma.toFixed(0)}`)

        const isMarkBetweenCols = this.windField.ncols % 2 === 0
        const a = isMarkBetweenCols ? this.windField.cellSide : this.windField.cellSide / 2  // Distance to the right border
        const b = this.windField.cellSide - this.raceCourse.wm.y  // Distance to the bottom of the cell

        // Assume gamma is always in [0; 90)
        const dx = b * Math.tan(rads(gamma))
        const dy = a / Math.tan(rads(gamma))
        // console.log(`dx=${dx.toFixed(3)} dy=${dy.toFixed(3)}`)

        let x = this.raceCourse.wm.x + dx
        let y = this.raceCourse.wm.y + dy

        // Check if it's crossing the side or bottom
        if ( dx > a ){  // Crossing side
            x = this.raceCourse.wm.x + a
        }else {
            y = this.raceCourse.wm.y + b
        }

        this.layLine = [this.raceCourse.wm.x, this.raceCourse.wm.y, x, y]
        // console.log(`Layline = ${JSON.stringify(this.layLine)}`)
    }

}

export default  BoatModel
