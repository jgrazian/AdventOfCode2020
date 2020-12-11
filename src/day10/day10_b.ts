import { getInput, tick, tock } from '../common.ts';

const input = await getInput(10);
let adapters = input.split('\n').map(n => parseInt(n));
adapters.push(0);
adapters = adapters.sort((a, b) => Number(a) - Number(b));
adapters.push(adapters[adapters.length - 1] + 3);

const n = adapters.length;

// _ -> 3 1 3 
// x -> 3 1 1 3
// y -> 3 1 1 1 3
// z -> 3 1 1 1 1 3
// ans = x^2 * 4^y * 7^z

tick();
console.log(adapters);
let deltas = '';
for (let i=0; i < n - 1; i++) {
    deltas += (adapters[i + 1] - adapters[i]).toString();
}

console.log(deltas);
let x = [...deltas.matchAll(/11/gm)].length;
console.log([...deltas.matchAll(/11/gm)]);
let y = [...deltas.matchAll(/111/gm)].length;
console.log([...deltas.matchAll(/111/gm)]);
let z = [...deltas.matchAll(/1111/gm)].length;
console.log([...deltas.matchAll(/1111/gm)]);

console.log(tock());
console.log(Math.pow(x, 2) * Math.pow(4, y) * Math.pow(7, z));
