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
        let idx = toU36(Number(inst.substring(4, inst.indexOf(']'))));
        let val = Number(inst.substring(inst.indexOf('=') + 2));

        applyMemMask(idx, mask).forEach(perm => mem.set(parseInt(perm, 2), val));
    }
}

console.error(tock());
console.log([...mem.values()].reduce((p, c) => p + c));

function applyMemMask(n: string, mask: string): string[] {
    for (let i = 0; i < n.length; i++) {
        // 1 overwrites
        if (mask.charAt(i) == '1') {
            n = n.substring(0, i) + '1' + n.substring(i + 1);
        } else if (mask.charAt(i) == 'X') {
            n = n.substring(0, i) + 'X' + n.substring(i + 1);
        }
    }

    let memPerm = [n];
    for (let i = 0; i < n.length; i++) {
        if (n.charAt(i) != 'X') continue;

        let perm = memPerm.pop();
        let tmp = [];
        while (perm) {
            tmp.push(perm.substring(0, i) + '0' + perm.substring(i + 1));
            tmp.push(perm.substring(0, i) + '1' + perm.substring(i + 1));
            perm = memPerm.pop();
        }
        memPerm = tmp;
    }

    return memPerm;
}

function toU36(n: number): string {
    if(n < 0){
        n = 0xFFFFFFFF + n + 1
    }
    return n.toString(2).padStart(36, '0');
}
