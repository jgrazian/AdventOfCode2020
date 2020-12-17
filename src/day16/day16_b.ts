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
let remCnt = 0;
for (let i = tickets.length - 1; i >= 0; i--) {
    let ticket = tickets[i];

    for (let value of ticket) {
        let isValid = false;
        for (let rule of rules.values()) {
            if ((value >= rule[0] && value <= rule[1]) || (value >= rule[2] && value <= rule[3])) {
                isValid = true;
            }
        }

        if (!isValid) {
            tickets.splice(i, 1);
            remCnt++;
            break;
        }
    }
}

// Builds array of rules that match ticket values
const matches = [];
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

// Flattens matches column wise into array of dict (ruleIdx => # of occourances in column)
let matchMaps: Map<number, number>[] = tickets[0].map(_ => new Map());
for (let match of matches) {
    for (let i = 0; i < match.length; i++) {
        let rules = match[i];

        for (let ruleIdx of rules) {
            let cur = matchMaps[i].get(ruleIdx);
            if (cur != undefined) {
                matchMaps[i].set(ruleIdx, cur + 1);
            } else {
                matchMaps[i].set(ruleIdx, 1);
            }

        }
    }
}

// Matches rules by deduction
let ruleMap: Map<string, number> = new Map([...rules.keys()].map(v => [v, -1]));
while ([...ruleMap.values()].some(v => v == -1)) {
    for (let [i, map] of matchMaps.entries()) {

        let maxCount = 0;
        let ruleIdx = -1;
        map.forEach((v, k) => { if (v == tickets.length) { maxCount++; ruleIdx = k } });

        if (maxCount != 1) continue;

        ruleMap.set([...rules.keys()][ruleIdx], i);
        matchMaps.forEach(map => map.delete(ruleIdx));
    }
}

let ans = 1;
ruleMap.forEach((v, k) => {
    if (k.match('departure')) {
        ans *= myTicket[v];
    }
});

console.error(tock());
console.log(ans);

function testRule(rule: number[], value: number): boolean {
    return (value >= rule[0] && value <= rule[1]) || (value >= rule[2] && value <= rule[3]);
}
