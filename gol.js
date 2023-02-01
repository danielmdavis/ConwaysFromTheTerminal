import { create, all } from 'mathjs'

const math = create(all,  {})

const scale = 15

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

// EXAMPLE - the other way to do it
const parseSurviveIntoKill = rule => {
    let killRule = [0, 1 , 2, 3, 4, 5, 6, 7, 8]
    for (let i = 0; i < 9; i++) {
        rule.forEach((j) => {
            if (j === rule[i]) { killRule.splice(killRule.indexOf(j), 1) }
        })
    }
    return killRule
}

// == GOALS ==

// prompt for 2 inputs: birth array and survive array
// comma or space seperated, parse into an array for each
// rather than "kill all that don't survive", refactor into the more thematic "opt in to survive"
// refactor fate update for non-continuous rules
// **** if by some miracle we finish, update gridComparer to recognize period-2 oscillators 


// applies birth & survive ruleset based on value and neighborhood value of cell
const stateAndFateUpdate = (y, x, grid, stableGrid) => {

    // get state
    const status = stableGrid.get([y, x])
    const neighborCount = calculateMooreNeighborhood(y, x, stableGrid)

    // update fate
    if (status && neighborCount < 2) { grid.set([y, x], 0) }
    if (status && neighborCount > 3) { grid.set([y, x], 0) }
    if (!status && neighborCount === 3) { grid.set([y, x], 1) }
}

// saves current generation starting state for calculating neighborhood against, applies stateAndFateUpdate for each cell
const updateAll = grid => {
    const stableGrid = grid.clone()
    for (let i = 0; i < scale; i++) {
        for (let j = 0; j < scale; j++) {
            stateAndFateUpdate(j, i, grid, stableGrid)
        }
    }
}

// applies all n times, checking against gridComparer
const generations = async (maxGens, grid) => {
    let stop = false
    let oldGrid
    for (let i = 0; (i < maxGens && stop === false); i++) { 
        updateAll(grid) 
        if (i > 0 && gridComparer(oldGrid, grid)) { break }
        console.log(i)
        gridPrinter(grid) 
        oldGrid = grid.clone()
    }
}

generations(1000, randomGridBuilder())