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
let invalid = 0;
for (let ticket of tickets) {

    for (let value of ticket) {

        let isValid = false;
        for (let rule of rules.values()) {
            if ((value >= rule[0] && value <= rule[1]) || (value >= rule[2] && value <= rule[3])) {
                isValid = true;
                continue;
            }
        }

        if (!isValid) invalid += value;
    }
}

console.error(tock());
console.log(invalid);