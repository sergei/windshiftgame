class PolarTable {
    entries = []
    twaTable = []
    boatSpeedTable = []

    constructor(table) {

        const lines = table.split('\n')
        lines.forEach( (line, i) => {
            const t = line.trim().split(/\s+/);
            if ( t.length > 1 ){

                // Targets for this wind speed

                this.entries[i] = {
                    tws: parseFloat(t[0]),
                    upwindTwa: parseFloat( t[3] ),
                    upwindBsp: parseFloat( t[4] ),
                    downWindTwa: parseFloat( t[t.length - 4] ),
                    downWindBsp: parseFloat( t[t.length - 3] ),
                }

                // TWAs for this TWS
                const twaList = []
                for(let i = 1 ; i < t.length; i+= 2){
                    twaList.push(parseFloat(t[i]))
                }
                this.twaTable.push(twaList)


                // Boat speeds for this TWS
                const bs = []
                for(let i = 2 ; i < t.length; i+= 2){
                    bs.push(parseFloat(t[i]))
                }
                this.boatSpeedTable.push(bs)
            }
        })

        // console.log('entries', this.entries)
        // console.log('twaTable', this.twaTable)
        // console.log('boatSpeedTable', this.boatSpeedTable)
    }

	getTwsIndices(tws) {

        let i
		for( i = 0; i < this.entries.length; i++ ){
			const e = this.entries[i];
			if (  e.tws >= tws)
				break;
		}

		let idxTwsLow
		let idxTwsHigh

		if ( i === 0 ){
			idxTwsLow = 0
			idxTwsHigh = 1
		}else if ( i === this.entries.length ){
			idxTwsLow = this.entries.length - 2;
			idxTwsHigh = this.entries.length - 1;
		}else{
			idxTwsLow = i - 1;
			idxTwsHigh = i;
		}

		return [idxTwsLow, idxTwsHigh]
	}

    interpolate(x, x1, x2, y1,  y2) {
        return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
	}

	getTargets(tws, isUpwind){
		const indices = this.getTwsIndices(tws);

		const idxTwsLow = indices[0];
		const idxTwsHigh = indices[1];

		const twsLow = this.entries[idxTwsLow].tws;
		const twsHigh = this.entries[idxTwsHigh].tws;
		let twa0, twa1;
		let bsp0, bsp1;
		if ( isUpwind ){
			twa0 = this.entries[idxTwsLow].upwindTwa;
			twa1 = this.entries[idxTwsHigh].upwindTwa;
			bsp0 = this.entries[idxTwsLow].upwindBsp;
			bsp1 = this.entries[idxTwsHigh].upwindBsp;
		} else {
			twa0 = this.entries[idxTwsLow].downWindTwa;
			twa1 = this.entries[idxTwsHigh].downWindTwa;
			bsp0 = this.entries[idxTwsLow].downWindBsp;
			bsp1 = this.entries[idxTwsHigh].downWindBsp;
		}

		const bsp = this.interpolate(tws, twsLow, twsHigh, bsp0, bsp1);
		const twa = this.interpolate(tws, twsLow, twsHigh, twa0, twa1);

		return {bsp:bsp, twa:twa}
	}

    interpBoatSpeed(inputTwa, idxTws){
        const twaList = this.twaTable[idxTws]
		const twa = Math.min(Math.abs(inputTwa), twaList[twaList.length - 1])
		let i
		for(i = 0; i < twaList.length - 1 ; i++){
			if ( twaList[i] >= twa )
				break;
		}
		if ( i === twaList.length)
			i -- ;
		if( i === 0)
			i = 1;

		const idxTwaLow = i-1;
		const idxTwaHigh = i;
		const twaLow = twaList[idxTwaLow];
		const twaHigh = twaList[idxTwaHigh];

		// Interpolate along TWA axis
		return this.interpolate(twa, twaLow, twaHigh,
				this.boatSpeedTable[idxTws][idxTwaLow],
				this.boatSpeedTable[idxTws][idxTwaHigh]);
	}

	getTargetSpeed(inputTws, inputTwa) {
		let tws = inputTws;

		if ( tws < this.entries[0].tws / 2.){
			return 0;
		}

		tws = Math.min(tws, this.entries[this.entries.length-1].tws);

		const twsIndices = this.getTwsIndices(tws);

		const idxTwsLow = twsIndices[0];
		const idxTwsHigh = twsIndices[1];

		const twsLow = this.entries[idxTwsLow].tws;
		const twsHigh = this.entries[idxTwsHigh].tws;

		// Interpolate along TWA axis
		const bspLowTws = this.interpBoatSpeed(inputTwa, idxTwsLow);
		const bspHighTws = this.interpBoatSpeed(inputTwa, idxTwsHigh);

		// Interpolate along TWS axis
        return this.interpolate(tws, twsLow, twsHigh, bspLowTws, bspHighTws);
	}
}

export default  PolarTable
