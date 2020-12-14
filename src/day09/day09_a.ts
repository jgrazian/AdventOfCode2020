import { getInput, tick, tock } from '../common.ts';

const input = await getInput(9);
const numbers = new Uint32Array(input.split('\n').map(n => parseInt(n)));
const preambleSize = 25;

tick();
let sums = [];
for (let i=0; i < numbers.length; i++) {
    let row = new Set();
    for (let j=i + 1; j < numbers.length; j++) {
        row.add(numbers[i] + numbers[j]);
    }
    if (row.size > 0) sums.push(row);
}

for (let i=preambleSize; i < numbers.length; i++) {
    let target = numbers[i];

    let isValid = false;
    for (let row=i-preambleSize; row < preambleSize + i; row++) {
        if (sums[row].has(target)) {
            isValid = true;
            break;
        }
    }

    if (!isValid) {
        console.error(tock());
        console.log(target);
        break;
    }
}
