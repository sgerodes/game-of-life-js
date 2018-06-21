class Universe {
    constructor(n, m) {
        this.width = n;
        this.height = m;
        this.state = create2DArray(n, m);
        this.previous_state = create2DArray(n, m);
        this.generation = 0;
        this.initialise_rules();
    }

    initialise_rules() {
        this.overpopulationBorder = 3;
        this.underpopulationBorder = 2;
        this.reproductionNumber = 3;
    }

    ageOneGeneration() {
        this.swap_states();
        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
                this.ageCell(new Point(i, j));
            }
        }
        ++this.generation;
    }

    swap_states() {
        let temp_state = this.state;
        this.state = this.previous_state;
        this.previous_state = temp_state;
    }

    ageCell(cell) {
        let all_neighbors = this.getMooreNeighborhood(this.previous_state, cell);
        let livingNeighborsCount = all_neighbors.filter(neighbour => neighbour).length;
        if (this.wasAlive(cell)) {
            if (livingNeighborsCount > this.overpopulationBorder) {
                this.killCell(cell);
            } else if (livingNeighborsCount < this.underpopulationBorder) {
                this.killCell(cell);
            } else {
                this.vivifyCell(cell);
            }
        } else {
            if (livingNeighborsCount === this.reproductionNumber) {
                this.vivifyCell(cell);
            } else {
                this.killCell(cell);
            }
        }
    }

    isAlive(cell) {
        if (cell.x >= this.width || cell.x < 0 || cell.y >= this.height || cell.y < 0) {
            return undefined;
        }
        return this.state[cell.x][cell.y];
    }

    wasAlive(cell) {
        return this.previous_state[cell.x][cell.y];
    }

    killCell(cell) {
        this.state[cell.x][cell.y] = false;
    }

    vivifyCell(cell) {
        this.state[cell.x][cell.y] = true;
    }

    getMooreNeighborhood(grid, cell) {
        let neighbors = [];
        for (let i = cell.x - 1; i <= cell.x + 1; ++i) {
            for (let j = cell.y - 1; j <= cell.y + 1; ++j) {
                if (i === cell.x && j === cell.y) {
                    continue;
                }
                let floormoddedI = this.floorMod(i, this.width);
                let floormoddedJ = this.floorMod(j, this.height);
                neighbors.push(grid[floormoddedI][floormoddedJ]);
            }
        }
        return neighbors;
    }

    floorMod(number, mod) {
        return (number + mod) % mod;
    }

    randomiseUniverse(){
        this.state = create2DArray(this.width,this.height,true);
    }
}

function create2DArray(n, m, random=false) {
    let outerArr = [];
    for (let i = 0; i < n; ++i) {
        let innerArr = [];
        for (let j = 0; j < m; ++j) {
            if (!random){
                innerArr.push(false);
            } else {
                //creating random values for the universe grid
                innerArr.push(Math.random() >= 0.5);
            }
        }
        outerArr.push(innerArr);
    }
    return outerArr;
}

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}