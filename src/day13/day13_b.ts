import { getInput, tick, tock } from '../common.ts';

const input = await getInput(13);
const data = input.split('\n');
const buses = data[1].split(',');

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
    
    // let j = 1;
    // while (true) {
    //     if ((np[i] * j) % n[i] == 1) {
    //         break;
    //     } else {
    //         j++;
    //     }
    // }
    // u.push(j);
    u.push(mulInv(N / n[i], n[i]));
}

let ans = 0;
for (let i = 0; i < n.length; i++) {
    ans += a[i]*np[i]*u[i];
}

console.log(n);
console.log(a);
console.log(np);
console.log(u);


console.log(tock());
console.log(ans % N);


function mulInv(a: number, b: number) {
    const b0 = b;
    let [x0, x1] = [0, 1];
   
    if (b === 1) {
      return 1;
    }
    while (a > 1) {
      const q = Math.floor(a / b);
      [a, b] = [b, a % b];
      [x0, x1] = [x1 - q * x0, x0];
    }
    if (x1 < 0) {
      x1 += b0;
    }
    return x1;
}