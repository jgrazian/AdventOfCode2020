import { getInput, tick, tock } from '../common.ts';

const input = await getInput(10);
let adapters = input.split('\n').map(n => parseInt(n));
adapters.push(0);
adapters = adapters.sort((a, b) => Number(a) - Number(b));
const maxJolts = adapters[adapters.length - 1] + 3;
adapters.push(maxJolts);

const n = adapters.length;

tick();
let pathMap = new Map(adapters.map(v => [v, 0]));
pathMap.set(0, 1);

for (let adapter of adapters) {
    for (let diff = 1; diff < 4; diff++) {
        let next = adapter + diff;
        if (pathMap.has(next)) {
            pathMap.set(next, pathMap.get(next)! + pathMap.get(adapter)!);
        }
    }
}

console.error(tock());
console.log(pathMap.get(maxJolts));