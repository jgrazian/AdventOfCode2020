import { getInput, tick, tock } from '../common.ts';

const input = await getInput(16);
const lines = input.split('\n');

const rules: Map<string, number[]> = new Map();
let myTicket: number[] = [];
const tickets: number[][] = [];

// Parse input
let parseFlag = 0;
for (let line of lines) {
    if (line.trim() == '') {
        parseFlag++;
        continue;
    }
    if (parseFlag == 0) {
        let [name, vals] = line.split(': ');
        rules.set(name, vals.replace(' or ', '-').split('-').map(n => parseInt(n)));
    } else if (parseFlag == 1) {
        if (line.substr(0, 1) == 'y') continue;
        myTicket = line.split(',').map(n => parseInt(n));
    } else {
        if (line.substr(0, 1) == 'n') continue;
        tickets.push(line.split(',').map(n => parseInt(n)));
    }
}

tick();
// remove bad tickets
for (let i = 0; i < tickets.length; i++) {
    let ticket = tickets[i];

    for (let value of ticket) {
        let isValid = false;
        for (let rule of rules.values()) {
            if ((value >= rule[0] && value <= rule[1]) || (value >= rule[2] && value <= rule[3])) {
                isValid = true;
                continue;
            }
        }
        if (!isValid) {
            tickets.splice(i);
            break;
        }
    }
}





const matches = [];
/* -> [
    [0, 1, [value index where matched], .., rules.size], 
        [], 
        []
    ]

*/
for (let i = 0; i < tickets.length; i++) {
    let ticket = tickets[i];
    let match = []; //[0, 1, .., tickets.len]

    for (let value of ticket) {
        let valMatch = [];

        for (let k = 0; k < rules.size; k++) {
            let rule = [...rules.values()][k];

            if (testRule(rule, value)) valMatch.push(k);
        }

        match.push(valMatch);
    }
    matches.push(match);
}

console.log(matches)




function testRule(rule: number[], value: number): boolean {
    return (value >= rule[0] && value <= rule[1]) || (value >= rule[2] && value <= rule[3]);
}

function sortedIndex(array: number[], value: number): number {
    let low = 0;
    let high = array.length;

    while (low < high) {
        let mid = (low + high) >>> 1;
        if (array[mid] < value) low = mid + 1;
        else high = mid;
    }
    return low;
}