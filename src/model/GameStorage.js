
class GameStorage {
    boatStats = []

    addScore(boatModel){
        const randomColor = require('randomcolor'); // import the script

        const color = randomColor()

        this.boatStats.push(
            {
                elapsedTime: boatModel.elapsedTimeMs,
                trail: [...boatModel.trail],  // Copy track
                color: color
            }
        )
    }

    getStats(){
        return this.boatStats.map((stat) => {
            return {
                elapsedTime: stat.elapsedTime,
                color: stat.color
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
module.exports = GameStorage
