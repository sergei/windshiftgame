class RaceCourseModel{

    constructor(ncols, nrows, cellSide) {
        this.wm = {
            x: ncols * cellSide / 2,
            y: cellSide / 8
        }
        this.pin = {
            x: ncols * cellSide / 2 - cellSide * 0.4,
            y: nrows * cellSide - cellSide / 8
        }
        this.rcb = {
            x: ncols * cellSide / 2 + cellSide * 0.4,
            y: nrows * cellSide - cellSide / 8
        }
    }
}
export default RaceCourseModel;
