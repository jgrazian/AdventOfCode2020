import { getInput, tick, tock } from '../common.ts';

const input = await getInput(13);
const data = input.split('\n');
const buses = data[1].split(',');

// https://github.com/cojua8/AdventOfCode2020/blob/master/Julia/day13-2.jl
// https://www.dave4math.com/mathematics/chinese-remainder-theorem/
let idOff: {id: number, offset: number}[] = [];
for (let i = 0; i < buses.length; i++) {
    if (buses[i] == 'x') continue;

    idOff.push({id: parseInt(buses[i]), offset: i});
}

const n = idOff.map(v => v.id);
const a = idOff.map(v => v.id - v.offset);
const N = n.reduce((p, c) => p*c);
const np = n.map(ni => N / ni);

const u: number[] = [];
for (let i = 0; i < np.length; i++) {
    let j = 1;
    while (true) {
        if ((np[i] * j) % n[i] == 1) {
            break;
        } else {
            j++;
        }
    }
    u.push(j);
}

let ans = BigInt(0);
for (let i = 0; i < np.length; i++) {
    ans += BigInt(a[i]*np[i]*u[i]);
}

console.log(tock());
console.log(Number(ans % BigInt(N)));
