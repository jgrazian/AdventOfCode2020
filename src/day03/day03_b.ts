import { getInput, tick, tock, BOX_GRN, BOX_WHT, BOX_BLU, BOX_RED } from '../common.ts';

const input = await getInput(3);
const rows = input.split('\n');

const width = rows[0].trim().length;

// [[# steps right, # steps down]]
const steps = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2]
];

tick();
let results: number[] = [];
for (let step of steps) {
    let j = 0; // Col #
    let treesHit = 0;
    for (let i = 0; i < rows.length; i += step[1]) {
        if (rows[i][j] == '#') {
            treesHit += 1;
        }
        j += step[0];
        if (j >= width) {
            j = j - width;
        }
    }
    results.push(treesHit);
}

console.error(tock())
console.log(results.reduce((p, c) => p * c));
