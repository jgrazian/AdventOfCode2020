import { getInput, tick, tock } from '../common.ts';

const input = await getInput(5);
const tickets = input.split('\n');

tick();

let ids: number[] = [];
for (let ticket of tickets) {
    let row = parseInt(ticket.substring(0, 7).replaceAll('F', '0').replaceAll('B', '1'), 2);
    let col = parseInt(ticket.substring(7, 10).replaceAll('L', '0').replaceAll('R', '1'), 2);

    let id = row * 8 + col;
    ids.splice(sortedIndex(ids, id), 0, id);
}

let mySeat = ids.findIndex((v, i) => ids[i + 1] - v == 2);

console.log(tock());
console.log(ids[mySeat] + 1);


function sortedIndex(array: number[], value: number) {
    let low = 0;
    let high = array.length;

    while (low < high) {
        var mid = (low + high) >>> 1;
        if (array[mid] < value) low = mid + 1;
        else high = mid;
    }
    return low;
}