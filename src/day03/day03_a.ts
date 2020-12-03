import { getInput, tick, tock, BOX_GRN, BOX_WHT } from '../common.ts';

const input = await getInput(3);
const rows = input.split('\n');

const width = rows[0].trim().length;

for (let row of rows) {
    console.log(row.replaceAll('#', BOX_GRN + BOX_GRN).replaceAll('.', BOX_WHT + BOX_WHT));
}
