import { getInput, tick, tock } from '../common.ts';

const input = await getInput(7);
const rules = input.split('\n');

tick()

let ruleMap: Map<string, Map<string, number>> = new Map(rules.map(rule => parseRule(rule)));
let numBags = 0;

for (let outer of ruleMap.keys()) {
    let stack: string[] = [...ruleMap.get(outer)!.keys()];

    while (stack.length > 0) {
        let inner = stack.pop()!;

        if (inner == 'shiny gold') {
            numBags++;
            break;
        }

        for (let nested of ruleMap.get(inner)!.keys()) {
            stack.push(nested);
        }
    }
}

console.error(tock());
console.log(numBags);

function parseRule(rule: string): [string, Map<string, number>] {
    let container = /(\w* \w*) bags contain/gm.exec(rule)![1];
    let items = [...rule.matchAll(/(\d+) (\w* \w*)/gm)];

    return [container, new Map(items.map(v => [v[2], Number(v[1])]))];
}
