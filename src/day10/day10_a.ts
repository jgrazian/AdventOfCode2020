import { getInput, tick, tock } from '../common.ts';

const input = await getInput(10);
const adapters = new Uint16Array(input.split('\n').map(n => parseInt(n))).sort();

tick();
const endJolts = adapters[adapters.length - 1] + 3;

const joltDiff = new Uint16Array(3); // [1, 2, 3] jolts 

let curJolts = 0;
for (let i=0; i < adapters.length; i++) {
    let cur = adapters[i];

    joltDiff[(cur - curJolts) - 1]++;
    
    curJolts = cur;
}
joltDiff[(endJolts - curJolts) - 1]++;

console.error(tock());
console.log(joltDiff[0] * joltDiff[2]);
