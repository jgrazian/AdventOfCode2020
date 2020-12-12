import { copy } from "https://deno.land/std@0.79.0/fs/copy.ts";
import { getInput, tick, tock } from '../common.ts';

const input = await getInput(11);
const layout = input.split('\n');
const n = layout.length;
const m = layout[0].trim().length;

enum Tile {
    floor = 0,
    empty = 1,
    taken = 2,
}

const tileMap = new Map([
    ['.', Tile.floor],
    ['L', Tile.empty],
    ['#', Tile.taken], // Occupied
]);

// Tile -> fn(number of seats empty): new tile status
const rules = new Map([
    [Tile.floor, (n: number) => Tile.floor],
    [Tile.empty, (n: number) => (n==0) ? Tile.taken : Tile.empty],
    [Tile.taken, (n: number) => (n>=5) ? Tile.empty : Tile.taken],
]);

tick();
let tmp = layout.flat().map(line => line.trim().split('').map(char => tileMap.get(char)!).flat()).flat();
const grid = new Uint8Array(tmp);
const working = new Uint8Array(tmp);

// printMat(grid);
// console.log(countOccupied(3, 3));

let ocPrev = 0;
let ocCurr = 1;
while (ocPrev - ocCurr != 0) {

    ocPrev = ocCurr;
    ocCurr = 0;
    
    for (let i=0; i < n; i++) {
        for (let j=0; j < m; j++) {

            let count = countOccupied(i, j);
            let newTile = rules.get(grid[getIdx(i, j)])!(count);
            working[getIdx(i, j)] = newTile;

            if (newTile == Tile.taken) ocCurr++;
        }
    }
    grid.set(working, 0);
}

console.log(tock());
console.log(ocCurr);

function countOccupied(i: number, j: number): number {
    let matches = [0, 0, 0, 0, 0, 0, 0, 0]; // [tl, tm, tr, ml, mr, bl, bm, br]
    for (let ii = 0; ii <= n; ii++) {
        for (let jj = 0; jj <= m; jj++) {

            if (ii == i && jj == j)
                continue;
            if (ii < 0 || ii >= n || jj < 0 || jj >= m)
                continue;
            if (grid[getIdx(ii, jj)] != Tile.taken)
                continue;

            let slope = (ii - i) / (jj - j);
            let dist = Math.abs(ii - i) + Math.abs(jj - j);
            if (slope == 1 && ii < i)
                matches[0] = 1;
            else if (slope == 1 && ii > i)
                matches[7] = 1;
            else if (slope == -1 && ii < i)
                matches[5] = 1;
            else if (slope == -1 && ii > i)
                matches[2] = 1;
            else if ((slope == Infinity || slope == -Infinity) && ii > i)
                matches[1] = 1;
            else if ((slope == Infinity || slope == -Infinity) && ii < i)
                matches[6] = 1;
            else if (slope == 0 && jj < j)
                matches[3] = 1;
            else if (slope == 0 && jj > j)
                matches[4] = 1;
        }
    }
    return matches.reduce((p, c) => p + c);
}

function getIdx(i: number, j: number): number {
    return i*m + j;
}

function printMat(mat: ArrayLike<number>, n?: number) {
    let sqrt = Math.sqrt(mat.length);
    n = n || sqrt;
    let m = mat.length / n;

    let valStrs: string[] = [];
    let maxChars = 0;
    for (let i = 0; i < mat.length; i++) {
        let valStr = mat[i].toString();
        let valStrLen = mat[i].toString().length;
        if (valStrLen > maxChars) maxChars = valStrLen;
        valStrs.push(valStr);
    }

    let out = '';
    let count = 0;
    for (let i = 0; i < valStrs.length; i++) {
        out += valStrs[i].padStart(maxChars) + ' ';
        count += 1;
        if (count % m == 0) { 
            out += '\n';
            count = 0;
        }
    }
    console.log(out);
}
