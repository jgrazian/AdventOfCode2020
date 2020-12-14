import { getInput, tick, tock } from '../common.ts';

const input = await getInput(13);
const data = input.split('\n');
const time = parseInt(data[0]);
const buses = data[1].split(',');

tick();
let minMod = Infinity;
let busId = 0;
for (let bus of buses) {
    if (bus == 'x') continue;
    let busTime = parseInt(bus);

    let nTimes = Math.ceil(time / busTime);

    let mod = (nTimes * busTime) % time;
    if (mod < minMod) {
        minMod = mod;
        busId = busTime;
    }
}

console.error(tock());
console.log(minMod * busId);
