    import { create, all } from 'mathjs'
    import promptSync from 'prompt-sync';

    const math = create(all,  {})
    const prompt = promptSync();

    let scale = 15
    let steps = 200
    let birthRule
    let surviveRule

    const getRules = () => {
        // scale = prompt('grid dimensions: ')
        // steps = prompt('generations: ')
        birthRule = prompt('enter birth rule, comma seperated: ')
        surviveRule = prompt('enter survive rule, comma seperated: ')
        // scale = parseInt(scale)
        birthRule.split(',')
        surviveRule.split(',')
    }

    // returns a matrix at scale size with 50/50 odds of each cell being on or off
    const randomGridBuilder = () => {
        let dummyArr = []
        let builder = []
        for (let i = 0; i < scale; i++) {
            for (let j = 0; j < scale; j++) {
                builder.push(Math.round(Math.random()))
            }
            dummyArr.push(builder)
            builder = []
        }
        return math.matrix(dummyArr)
    }

    // determines whether last two generations have been identical
    const gridComparer = (oldGrid, grid) => {
        let match = true
        for (let i = 0; i < scale; i++) {
            for (let j = 0; j < scale; j++) {
                if (oldGrid !== undefined) {
                    if (oldGrid.get([j, i]) !== grid.get([j, i])) { 
                        match = false 
                    }
                }
            }
        }
        return match
    }

    // simple ascii element used by gridPrinter
    const buildSeperator = scale => {
        let seperator = ''
        for (let i = 0; i < scale; i++) {
            seperator += '__'
        }
        seperator += '|'
        return seperator
    }

    // logs rows of blocks and spaces to the console to represent distribution of on/off cells in matrix
    const gridPrinter = grid => {
        let row
        for (let i = 0; i < scale; i++) {
            row = ''
            for (let j = 0; j < scale; j++) { 
                if (grid.get([j, i])) {
                    row += '██'
                } else {
                    row += '  '
                }
            }
            console.log(row)
        }
        console.log(' ')
        console.log(buildSeperator(scale))
        console.log(' ')
    }

    // checks value of each neighboring cell, returns sum of values which is count of neighbors
    const calculateMooreNeighborhood = (y, x, stableGrid) => {
        let [u, ur, r, dr, d, dl, l, ul] = [0, 0, 0, 0, 0, 0, 0, 0]

        if (y !== 0) { u = stableGrid.get([y - 1, x]) } 
        if (x !== (scale - 1)) { r = stableGrid.get([y, x + 1]) }
        if (y !== (scale - 1)) { d = stableGrid.get([y + 1, x]) }
        if (x !== 0) { l = stableGrid.get([y, x - 1]) }
        if (y !== 0 && x !== (scale - 1)) { ur = stableGrid.get([y - 1, x + 1])}
        if (y !== (scale - 1) && x !== (scale - 1)) { dr = stableGrid.get([y + 1, x + 1])}
        if (y !== (scale - 1) && x !== 0) { dl = stableGrid.get([y + 1, x - 1])}
        if (y !== 0 && x !== 0) { ul = stableGrid.get([y - 1, x - 1])}
        
        return (u + ur + r + dr + d + dl + l + ul)
    }

    // applies birth & survive ruleset based on value and neighborhood value of cell
    const stateAndFateUpdate = (y, x, newGrid, stableGrid) => {

        // get state
        const status = stableGrid.get([y, x])
        const neighborCount = calculateMooreNeighborhood(y, x, stableGrid)

        // update fate
        if (status && surviveRule.includes(neighborCount)) { newGrid.set([y, x], 1) }
        if (!status && birthRule.includes(neighborCount)) { newGrid.set([y, x], 1) }

    }

    // saves current generation starting state for calculating neighborhood against, applies stateAndFateUpdate for each cell
    const updateAll = grid => {
        const stableGrid = grid.clone()
        let newGrid = math.zeros(scale, scale)

        for (let i = 0; i < scale; i++) {
            for (let j = 0; j < scale; j++) {
                stateAndFateUpdate(j, i, newGrid, stableGrid)
            }
        }
        return newGrid
    }

    // applies all n times, checking against gridComparer
    const generations = async (maxGens, grid) => {
        let stop = false
        let oldGrid
        for (let i = 0; (i < maxGens && stop === false); i++) { 
            grid = updateAll(grid) 
            if (i > 0 && gridComparer(oldGrid, grid)) { break }
            console.log(i)
            gridPrinter(grid) 
            oldGrid = grid.clone()
        }
    }

    generations(steps, randomGridBuilder(), getRules())