import { getInput, tick, tock } from '../common.ts';

const input = await getInput(7);
const rules = input.split('\n');

tick()

let ruleMap: Map<string, Map<string, number>> = new Map(rules.map(rule => parseRule(rule)));
let numBags = 0;

let stack: [string, number][] = [...ruleMap.get('shiny gold')!];
while (stack.length > 0) {
    let inner = stack.pop()!;

    numBags += inner[1];

    for (let nested of ruleMap.get(inner[0])!) {
        let key = nested[0];
        let num = nested[1];

        stack.push([key, num * inner[1]]);
    }
}

console.error(tock());
console.log(numBags);

function parseRule(rule: string): [string, Map<string, number>] {
    let container = /(\w* \w*) bags contain/gm.exec(rule)![1];
    let items = [...rule.matchAll(/(\d+) (\w* \w*)/gm)];

    return [container, new Map(items.map(v => [v[2], Number(v[1])]))];
}