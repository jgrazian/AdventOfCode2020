import { getInput, tick, tock } from '../common.ts';

const input = await getInput(14);
const instructions = input.split('\n');

tick();
const mem: Map<number, number> = new Map();
let mask = '';
for (let inst of instructions) {
    if (inst.substr(0, 4) == 'mask') {
        mask = inst.substr(7);
    } else {
        let idx = Number(inst.substring(4, inst.indexOf(']')));
        let val = Number(inst.substring(inst.indexOf('=') + 2));

        let masked = applyMask(toU36(val), mask);

        mem.set(idx, parseInt(masked, 2));
    }
}

console.error(tock());
console.log([...mem.values()].reduce((p, c) => p + c));

function applyMask(n: string, mask: string): string {
    for (let i = 0; i < n.length; i++) {
        if (mask.charAt(i) == '1') {
            n = n.substring(0, i) + '1' + n.substring(i + 1);
        } else if (mask.charAt(i) == '0') {
            n = n.substring(0, i) + '0' + n.substring(i + 1);
        }
    }
    return n;
}

function toU36(n: number): string {
    if(n < 0){
        n = 0xFFFFFFFF + n + 1
    }
    return n.toString(2).padStart(36, '0');
}
