import { getInput, tick, tock } from '../common.ts';

const input = await getInput(12);
const actions: [string, number][] = input.split('\n').map(v => [v.substr(0, 1), parseInt(v.substr(1))]);

// [N, E]
const Dir = {
    E: [ 0,  1],
    N: [ 1,  0],
    W: [ 0, -1],
    S: [-1,  0],
};

let shipPos = [0, 0]; 
let wayPos = [1, 10];

const opMap = new Map([
    [ 'F', (arg: number) => shipPos = [shipPos[0] + wayPos[0]*arg, shipPos[1] + wayPos[1]*arg] ], // shipPos + wayPos*dist
    [ 'N', (arg: number) => wayPos = [wayPos[0] + arg, wayPos[1]] ],
    [ 'S', (arg: number) => wayPos = [wayPos[0] - arg, wayPos[1]] ],
    [ 'E', (arg: number) => wayPos = [wayPos[0], wayPos[1] + arg] ],
    [ 'W', (arg: number) => wayPos = [wayPos[0], wayPos[1] - arg] ],
    [ 'R', (arg: number) => wayPos = rotate(wayPos,  arg) ],
    [ 'L', (arg: number) => wayPos = rotate(wayPos, -arg) ],
]);

// Rotate point at vec about [0, 0] by angle
function rotate(vec: number[], angle: number) {
    let s = Math.sin(angle * Math.PI / 180);
    let c = Math.cos(angle * Math.PI / 180);

    return [Math.round(vec[0]*c - vec[1]*s), Math.round(vec[0]*s + vec[1]*c)];
}

tick();
for (let action of actions) {
    opMap.get(action[0])!(action[1]);
}

console.error(tock());
console.log(Math.abs(shipPos[0]) + Math.abs(shipPos[1]));
