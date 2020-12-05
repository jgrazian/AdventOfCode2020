import { getInput, tick, tock } from '../common.ts';

const input = await getInput(5);
const tickets = input.split('\n');

tick();

let maxId = 0;
for (let ticket of tickets) {
    let row = parseInt(ticket.substring(0, 7).replaceAll('F', '0').replaceAll('B', '1'), 2);
    let col = parseInt(ticket.substring(7, 10).replaceAll('L', '0').replaceAll('R', '1'), 2);

    let id = row * 8 + col;
    if (id > maxId) {
        maxId = id;
    }
}

console.log(tock());
console.log(maxId);
