import { getInput, tick, tock } from '../common.ts';

const input = await getInput(15);
const numbers = input.split(',').map(n => parseInt(n));

// number -> # of last turn it was spoken
let lastSeen: Map<number, number> = new Map(numbers.map((n, i) => [n, i + 1]));
lastSeen.delete(numbers[numbers.length - 1]);

const target = 30000000;

tick();
let turn = numbers.length + 1;
let lastSpoken = numbers[numbers.length - 1];
while (true) {
    if (turn > target) break;

    let getLast = lastSeen.get(lastSpoken);
    if (!getLast) {
        lastSeen.set(lastSpoken, turn - 1);
        lastSpoken = 0;
        turn++;
        continue;
    }

    lastSeen.set(lastSpoken, turn - 1);
    lastSpoken = (turn - 1) - getLast;

    turn++;
}

console.error(tock());
console.log(lastSpoken);