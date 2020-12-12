import { getInput, tick, tock } from '../common.ts';

const input = await getInput(12);
const actions: [string, number][] = input.split('\n').map(v => [v.substr(0, 1), parseInt(v.substr(1))]);

const Dir = {
    E: [ 0,  1],
    N: [ 1,  0],
    W: [ 0, -1],
    S: [-1,  0],
};
const RL = [Dir.E, Dir.N, Dir.W, Dir.S];

let facing = Dir.E;
let pos = [0, 0];

const opMap = new Map([
    [ 'F', (arg: number) => pos = [pos[0] + facing[0]*arg, pos[1] + facing[1]*arg] ],
    [ 'N', (arg: number) => pos = [pos[0] + arg, pos[1]] ],
    [ 'S', (arg: number) => pos = [pos[0] - arg, pos[1]] ],
    [ 'E', (arg: number) => pos = [pos[0], pos[1] + arg] ],
    [ 'W', (arg: number) => pos = [pos[0], pos[1] - arg] ],
    [ 'R', (arg: number) => facing = turn(-arg) ],
    [ 'L', (arg: number) => facing = turn(arg) ],
]);

function turn(arg: number) {
    let n = arg / 90;
    let curIdx = RL.findIndex(v => v == facing);
    let wrapped = ((curIdx + n) % 4 + 4) % 4;
    return RL[wrapped];
}

tick();
for (let action of actions) {
    opMap.get(action[0])!(action[1]);
}

console.log(tock());
console.log(Math.abs(pos[0]) + Math.abs(pos[1]));
