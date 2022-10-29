class GameStorage {
    boatStats = []

    addScore(boatModel){
        const randomColor = require('randomcolor'); // import the script

        const color = randomColor()

        this.boatStats.push(
            {
                elapsedTime: boatModel.elapsedTimeMs,
                distanceMeters: boatModel.distanceMeters,
                upwindTimeMs: boatModel.upwindTimeMs,
                upwindDistanceMeters: boatModel.upwindDistanceMeters,
                trail: [...boatModel.trail],  // Copy track
                color: color
            }
        )
    }

    getStats(){
        return this.boatStats.map((stat) => {
            return {
                elapsedTime: stat.elapsedTime,
                color: stat.color,
                distanceMeters: stat.distanceMeters,
                upwindTimeMs: stat.upwindTimeMs,
                upwindDistanceMeters: stat.upwindDistanceMeters,
            }
        })
    }

    getTracks(gsInd){
        const tracks = []

        gsInd.forEach((ind) => {
            tracks.push({
                color: this.boatStats[ind].color,
                trail: this.boatStats[ind].trail,
            })
        })

        return tracks
    }

}
export default GameStorage
