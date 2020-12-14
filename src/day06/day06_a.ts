import { getInput, tick, tock } from '../common.ts';

const input = await getInput(6);
const forms = input.split('\n');
(forms[forms.length - 1] != '') ? forms.push('') : '';

tick();

const answers = new Uint16Array(26);
let totalQuestions = 0;
for (let form of forms) {

    if (form == '') {
        totalQuestions += answers.map(v =>  Number(v > 0)).reduce((prev, curr) => curr + prev);
        answers.fill(0);
        continue;
    }

    for (let question of form) {
        const idx = question.charCodeAt(0) - 97;
        answers[idx]++;
    }

}

console.error(tock());
console.log(totalQuestions);