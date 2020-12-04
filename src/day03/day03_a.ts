import { getInput, tick, tock, BOX_GRN, BOX_WHT, BOX_BLU, BOX_RED } from '../common.ts';

const input = await getInput(3);
const rows = input.split('\n');

const width = rows[0].trim().length;

tick();

let j = 0; // Col #
let treesHit = 0;
for (let i = 0; i < rows.length; i++) {
    if (rows[i][j] == '#') {
        treesHit += 1;
        //console.log(draw(rows[i], j, BOX_RED));
    } else {
        //console.log(draw(rows[i], j, BOX_BLU));
    }
    j += 3;
    if (j >= width) {
        j = j - width;
    }
}

console.error(tock())
console.log(treesHit);

function draw(orig: string, idx: number, sub: string): string {
    let ret = orig.substring(0, idx) + sub + orig.substring(idx + 1);
    return ret.replaceAll('.', BOX_WHT).replaceAll('#', BOX_GRN);
}