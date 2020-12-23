import { getInput, tick, tock } from '../common.ts';

const input = await getInput(17);
const lines = input.split('\n');

const nCycle = 6;
const gridScale = 7; // Odd number, if answer doesn't work try bumping this to 9
const n = lines.length * gridScale;
const mid = Math.floor(n / 2);
const grid = new Uint8Array(n * n * n);

enum State {
    dead = 0,
    alive = 1,
    born = 2,
    dies = 3,
}

tick();
let baseOff = -mid + ((gridScale - 1) / 2)*lines.length;
for (let [i, line] of lines.entries()) {
    for (let [j, v] of line.trim().split('').entries()) {
        grid[getIdx(i + baseOff, j + baseOff, 0)] = (v == '.') ? State.dead : State.alive;
    }
}

let nActive = 0;
for (let i = 0; i < nCycle; i++) {
    nActive = cycle();
}
console.error(tock());
console.log(nActive);

function cycle(): number {
    // Check each grid point
    for (let x = -mid + 1; x <= mid - 1; x++) {
        for (let y = -mid + 1; y <= mid - 1; y++) {
            for (let z = -mid + 1; z <= mid -1; z++) {

                let idx = getIdx(x, y, z)
                let count = countNeighbors(x, y, z);
                let state = grid[idx];

                if (state == State.alive) {
                    if ((count != 2 && count != 3)) {
                        // Dies
                        grid[idx] = State.dies;
                    }
                } else {
                    if (count == 3) {
                        // Born
                        grid[idx] = State.born;
                    }
                }
            }
        }
    }

    // Apply state changes
    let nAlive = 0;
    for (let idx = 0; idx < grid.length; idx++) {
        if (grid[idx] == State.dies) {
            grid[idx] = State.dead;
        } else if (grid[idx] == State.born) {
            grid[idx] = State.alive;
            nAlive++;
        } else if (grid[idx] == State.alive) {
            nAlive++;
        }
    }
    return nAlive;
}

function countNeighbors(x: number, y: number, z: number): number {
    let count = 0;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            for (let k = z - 1; k <= z + 1; k++) {

                if (i == x && j == y && k == z) continue;

                let state = grid[getIdx(i, j, k)];
                count += (state == State.alive || state == State.dies) ? 1 : 0;

            }
        }
    }
    return count;
}

function getIdx(x: number, y: number, z: number): number {
    return (y + mid) + (x + mid) * n + (z + mid) * n * n;
}

function getCoord(idx: number): number[] {
    let z = Math.floor(idx / (n * n));
    let x = Math.floor((idx - (z * n * n)) / n);
    let y = idx - (z * n * n + x * n);

    return [x - mid, y - mid, z - mid];
}

function sliceZ(n: number, z: number) {

    for (let x = -n; x <= n; x++) {
        let row = [];
        for (let y = -n; y <= n; y++) {
            row.push(grid[getIdx(x, y, z)]);
        }
        console.log(row.join(''));
    }
    console.log('-------------------');
}
