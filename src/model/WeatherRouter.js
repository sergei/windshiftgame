import {findIntersect, intersects} from "../utils/Utils";

const ADJ_ANGLES = [0]

class Node {

    constructor(parent, x, y, dtHours, distToParentSq, weight) {
        this.parent = parent
        this.x = x
        this.y = y
        this.distToParentSq = distToParentSq  // Squared
        this.weight = weight        // Squared
        this.dtHours = dtHours
        this.port = []  // [0] target [1] high [2] low
        this.stbd  = []  // [0] target [1] high [2] low
    }

    nextNode(dtHours, hdg, bs, dxc, dyc ){
        const dx = dxc  * dtHours
        const dy = dyc  * dtHours
        const distToParentSq = dx*dx + dy*dy
        const weight = this.weight + distToParentSq
        return new Node(this, this.x + dx, this.y + dy, dtHours, distToParentSq, weight)
    }

    moveToXY(x, y) {
        const newDistSq = (this.parent.x - x)**2 + (this.parent.y - y)**2
        const distRatio = Math.sqrt( newDistSq / this.distToParentSq)
        this.x = x
        this.y = y
        this.distToParentSq = newDistSq
        this.dtHours = this.dtHours * distRatio
    }

    computeNextPosition(windField, dtHours, isUpwind) {
        for(let i=0; i < ADJ_ANGLES.length; i++){
            // Port
            let move = windField.getBoatMovement(this.x, this.y, isUpwind, false, ADJ_ANGLES[i])
            this.port[i] = this.nextNode(dtHours,move.hdg, move.bs, move.dx, move.dy)

            // Starboard
            move = windField.getBoatMovement(this.x, this.y, isUpwind, true, ADJ_ANGLES[i])
            this.stbd[i] = this.nextNode(dtHours,move.hdg, move.bs, move.dx, move.dy)
        }
    }
}

class WeatherRouter {

    constructor(raceCourse, windField, bm) {
        this.raceCourse = raceCourse
        this.windField = windField
        this.bm = bm
        this.finishLine = [this.raceCourse.rcb.x, this.raceCourse.rcb.y, this.raceCourse.pin.x, this.raceCourse.pin.y,]

        this.resetRouter()
    }

    resetRouter() {
        this.upwindRoute = []
        this.downwindRoute = []

        this.elapsedTimeHr = 0
        this.elapsedUpwindTimeHr = 0
        this.upwindDistMiles  = 0
        this.totalDistMiles  = 0

        this.layline = this.bm.layLine
        this.initRouteCreation(true)
    }

    initRouteCreation(isUpwind) {
        console.log(`Initializing ${isUpwind ? 'UPWIND' : 'DOWNWIND'} routing`)

        const dtSec = 35.

        let boatX
        let boatY

        if ( isUpwind ){  // Start in the middle of the star line
            boatX = (this.raceCourse.rcb.x + this.raceCourse.pin.x) / 2
            boatY = this.raceCourse.rcb.y
        }else{  // Start at windward mark
            boatX = this.raceCourse.wm.x
            boatY = this.raceCourse.wm.y
        }

        const start = []
        start.push( new Node(null, boatX, boatY, 0, 0, 0))
        this.isochrones = []
        this.isochrones.push(start)

        this.rs = {
            dtHours: dtSec / 3600.,
            nSteps: 20,
            step: 0,
            nodeIdx: 0,
            lastIsochrone: start,
            nextIsochrone: [],
            totalNodesCount: 1,
            finishNodeParent: null,
            finished: false,
            failed: false,
            isUpwind: isUpwind,
            routeFinished: false,
        }
    }

    isRoutingComplete(){
        return this.rs.finishNodeParent != null
    }

    routeCreationBatch (maxElapsedMs, nSteps) {
        let start = Date.now();

        for( let i = 0; i < nSteps; i++){
            const done = this.routeCreationStep()
            if ( done )
                return true

            let end = Date.now();
            let elapsedMs = end - start;
            if ( elapsedMs > maxElapsedMs )
                break
        }

        return false
    }

    routeCreationStep() {
        const legComplete = this.legCreationStep()

        if ( this.rs.failed )
            return true

        if ( this.rs.isUpwind ) {
            // Route downwind from WM to the finish line
            if ( legComplete ){
                this.completeUpwindLeg(this.rs.finishNodeParent)
                console.log(`elapsedTimeHr=${this.elapsedTimeHr} totalDist=${this.totalDistMiles}`)
                // console.log(`route ${this.upwindRoute}`)
                this.initRouteCreation(false)
            }
        }else {
            if ( legComplete ) {
                this.completeDownwindLeg(this.rs.finishNodeParent)
                console.log(`elapsedTimeHr=${this.elapsedTimeHr} totalDist=${this.totalDistMiles}`)
                // console.log(`route ${this.upwindRoute}`)
            }
            return legComplete
        }

        return false
    }

    legCreationStep () {

        if (this.rs.finishNodeParent != null ){
            return true
        }

        // console.log(`nodeIdx = ${this.rs.nodeIdx}  finished=${this.rs.finished}` )
        const result = this.growNode(this.rs.dtHours, this.rs.lastIsochrone, this.rs.nodeIdx, this.rs.nextIsochrone)

        // Check if this isochrone is complete
        if ( this.rs.nodeIdx === this.rs.lastIsochrone.length-1 || this.rs.finished ) {
            // Get ready for the next isochrones
            this.isochrones.push(this.rs.nextIsochrone)
            this.rs.lastIsochrone = this.rs.nextIsochrone

            this.rs.nextIsochrone = []
            console.log(`step=${this.rs.step} nodesNum = ${JSON.stringify(this.rs.lastIsochrone.length)}`)
            this.rs.nodeIdx = 0

            // Check if tested all isochrones is done
            if ( this.rs.step === this.rs.nSteps-1 ){
                // Since we reached here and no node achieved the result the routing has failed
                this.rs.failed = true
                console.log(`Failed to route after ${this.rs.step} isochrones ` )
                return true
            }else{
                this.rs.step++
                return false
            }
        }else{
            this.rs.finished = result.finished
            this.rs.finishNodeParent = result.finishNodeParent
            this.rs.totalNodesCount += result.nodesAdded
            this.rs.nodeIdx ++
        }
        return false
    }

    growNode(dtHours, lastIsochrone, nodeIdx, nextIsochrone) {
        const  node = lastIsochrone[nodeIdx]
        let nodesAdded = 0
        if ( ! this.windField.isOutside(node.x, node.y) ) {
            node.computeNextPosition(this.windField, dtHours,  this.rs.isUpwind)
            let legComplete
            if ( this.rs.isUpwind ){
                legComplete = this.isPointReached(node, this.raceCourse.wm)
            } else {
                legComplete = this.isFinishCrossed(node)
            }
            if ( legComplete ) {
                return {finished: true, finishNodeParent: node, nodesAdded: nodesAdded}
            }

            for (let j = 0; j < ADJ_ANGLES.length; j++) {
                nextIsochrone.push(node.port[j])
                nextIsochrone.push(node.stbd[j])
                nodesAdded += 2
            }
        }
        return {finished: false, finishNodeParent: null, nodesAdded: nodesAdded}
    }

    isPointReached(node, point) {
        for(let i=0; i < ADJ_ANGLES.length; i++) {
            let child = node.port[i]
            let distToMarkSq = (child.x - point.x)**2 + (child.y - point.y)**2
            if ( distToMarkSq < child.distToParentSq)
                return true
        }
        return false;
    }

    completeUpwindLeg (finishNodeParent) {
        let node = finishNodeParent

        // Check if the layline was crossed
        let trimmed = this.trimIfCrossing(node);

        if (trimmed) {
            console.log('One more port tack step')
            node.port[0].computeNextPosition(this.windField, this.rs.dtHours,  this.rs.isUpwind)
            node = node.port[0]
            this.trimIfCrossing(node);
        }

        this.upwindRoute = [this.raceCourse.wm.x, this.raceCourse.wm.y]
        let n = node.port[0]
        const distToMark = Math.sqrt( (this.raceCourse.wm.x - n.x)**2 + (this.raceCourse.wm.y - n.y)**2 )
        const bs = Math.sqrt(n.distToParentSq) / n.dtHours
        this.elapsedTimeHr = distToMark / bs
        this.totalDistMiles = distToMark
        while ( n != null) {
            this.elapsedTimeHr += n.dtHours
            this.totalDistMiles += Math.sqrt(n.distToParentSq)
            this.upwindRoute.push(n.x, n.y)
            n = n.parent
        }
        this.upwindDistMiles = this.totalDistMiles
        this.elapsedUpwindTimeHr = this.elapsedTimeHr
    }

    completeDownwindLeg(finishNodeParent) {
        this.downwindRoute = []
        // Find who crossed

        let n
        for(let i=0; i < ADJ_ANGLES.length; i++) {
            if ( finishNodeParent.port[i].finished ){
                n = finishNodeParent.port[i]
                break
            }
            if ( finishNodeParent.stbd[i].finished ){
                n = finishNodeParent.stbd[i]
                break
            }
        }

        while ( n != null) {
            this.elapsedTimeHr += n.dtHours
            this.totalDistMiles += Math.sqrt(n.distToParentSq)
            this.downwindRoute.push(n.x, n.y)
            n = n.parent
        }
    }

    trimIfCrossing(node) {
        let cross = findIntersect(
            this.layline[0], this.layline[1],
            this.layline[2], this.layline[3],
            node.x, node.y, node.port[0].x, node.port[0].y)

        if (cross.length === 2) {  // Intersection found  adjust the crossing point
            console.log('Trim port')
            node.port[0].moveToXY(cross[0], cross[1])
        }
        return cross.length === 0;
    }

    isFinishCrossed(node) {
        let finished = false
        for(let i=0; i < ADJ_ANGLES.length; i++) {
            finished = this.isChildCrossing(node, node.port[i]);
            if ( ! finished ){
                finished = this.isChildCrossing(node, node.stbd[i]);
            }
        }
        return finished
    }

    isChildCrossing(node, child) {
        const finished = intersects(
            this.finishLine[0], this.finishLine[1],
            this.finishLine[2], this.finishLine[3],
            node.x, node.y, child.x, child.y)
        if (finished) {
            // Adjust port x and y so they are exactly on layline
            const cross = findIntersect(
                this.finishLine[0], this.finishLine[1],
                this.finishLine[2], this.finishLine[3],
                node.x, node.y, child.x, child.y)
            if (cross.length === 2) {
                child.moveToXY(cross[0], cross[1])
                child.finished = true
            }
        }
        return finished;
    }

}

export default WeatherRouter;
