import { create, all } from 'mathjs'

const math = create(all,  {})


const randomGridBuilder = () => {
    let dummyArr = []
    let builder = []
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            builder.push(Math.round(Math.random()))
        }
        dummyArr.push(builder)
        builder = []
    }
    return math.matrix(dummyArr)
}

const gridComparer = (oldGrid, grid) => {
    let match = true
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (oldGrid !== undefined) {

                if (oldGrid.get([j, i]) !== grid.get([j, i])) { 
                    match = false 
                }
            }
        }
    }
    return match
}

const gridPrinter = (grid) => {
    let row
    for (let i = 0; i < 10; i++) {
        row = ''
        for (let j = 0; j < 10; j++) { 
            if (grid.get([j, i])) {
                row += '██'
            } else {
                row += '  '
            }
        }
        console.log(row)
    }
    console.log(' ')
    console.log('____________________|')
    console.log(' ')
}

const stateAndFateCheckAndUpdate = (y, x, grid) => {
    const status = grid.get([y, x])
    let [above, below, left, right] = [0, 0, 0, 0]
    let [ul, ur, bl, br] = [0, 0, 0, 0]

    if (y !== 0) { above = grid.get([y - 1, x]) }     
    if (x !== 0) { left = grid.get([y, x - 1]) }
    if (y !== 9) { below = grid.get([y + 1, x]) }
    if (x !== 9) { right = grid.get([y, x + 1]) }
    if (y !== 0 && x !== 0) { ul = grid.get([y - 1, x - 1])}
    if (y !== 0 && x !== 9) { ur = grid.get([y - 1, x + 1])}
    if (y !== 9 && x !== 0) { bl = grid.get([y + 1, x - 1])}
    if (y !== 9 && x !== 9) { br = grid.get([y + 1, x + 1])}
    
    const neighbors = above + below + left + right + ul + ur + bl + br

    if (status && neighbors < 2) { grid.set([y, x], 0) }
    if (status && neighbors > 3) { grid.set([y, x], 0) }
    if (!status && neighbors === 3) { grid.set([y, x], 1) }
}

const UpdateAll = (grid) => {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            stateAndFateCheckAndUpdate(j, i, grid)
        }
    }
}

const generations = async (maxGens, grid) => {
    let stop = false
    let oldGrid
    for (let i = 0; (i < maxGens && stop === false); i++) { 
        
        
        UpdateAll(grid) 
        if (i > 0 && gridComparer(oldGrid, grid)) { break }
        console.log(i)
        gridPrinter(grid) 
        oldGrid = grid.clone()
    }
}


let grid = randomGridBuilder()
generations(1000, grid)