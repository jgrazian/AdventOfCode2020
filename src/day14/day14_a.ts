import { getInput, tick, tock } from '../common.ts';

const input = await getInput(14);
const instructions = input.split('\n');

const mem: Map<number, number> = new Map();
let mask = '';
for (let inst of instructions) {
    if (inst.substr(0, 4) == 'mask') {
        mask = inst.substr(7);
    } else {
        let idx = Number(inst.substring(4, inst.indexOf(']')));
        let val = Number(inst.substring(inst.indexOf('=') + 2));
    }
}

function toU36(n: number): string {
    if(n < 0){
        n = 0xFFFFFFFF + n + 1
    }
    return parseInt(n.toString(), 10).toString(2).padStart(36, '0');
}
