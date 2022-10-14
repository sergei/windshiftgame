const fs = require('fs');
const PolarTable = require("../PolarTable")

fs.readFile("../../assets/J105.txt", 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const pt = new PolarTable(data)

    let tws = 10
    let t = pt.getTargets(tws, true)
    console.log('tws ', tws, 'bsp ', t.bsp, 'twa ', t.twa)

    t = pt.getTargets(tws, false)
    console.log('tws ', tws, 'bsp ', t.bsp, 'twa ', t.twa)


    for(let tws = 4; tws < 22.1; tws +=1){
        let csvLine = ''
        csvLine += `${tws}`
        for( let twa =0; twa < 180.1; twa += 1){
            const bs = pt.getTargetSpeed(tws, twa)
            csvLine += `,${bs.toPrecision(2)}`
        }
        console.log(csvLine)
    }

});

