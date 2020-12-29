import { getInput, tick, tock } from '../common.ts';

const input = await getInput(18);
const lines = input.split('\n');

enum Op {
    add,
    sub,
    mul,
    div
}

const opMap: {[index:string]: Op} = {
    '+': Op.add,
    '-': Op.sub,
    '*': Op.mul,
    '/': Op.div
}

function makeNode(tokens: string[], left?: number | Node): number | Node {

    if (!left) {
        if (tokens[0] == '(') {
            let groupIdx = splitGroup(tokens)
            let left = makeNode(tokens.slice(1, groupIdx));
            return makeNode(tokens.slice(groupIdx + 1), left);
        } else {
            return makeNode(tokens.slice(1), Number(tokens[0]));
        }
    }

    let op: Op = opMap[tokens[0]];
    let n;
    if (tokens[1] == '(') {
        let groupIdx = splitGroup(tokens)
        n = new Node(op, left, makeNode(tokens.slice(2, groupIdx)));
        tokens = tokens.slice(groupIdx + 1);
    } else {
        n = new Node(op, left, Number(tokens[1]));
        tokens = tokens.slice(2);
    }

    if (tokens.length > 0) {
        return makeNode(tokens, n);
    } else {
        return n;
    }
}

function splitGroup(tokens: string[], start?: number): number {
    start = start || 0;
    let nOpen = 0;
    let nClose = 0;
    for (let i = start; i < tokens.length; i++) {
        if (tokens[i] == '(') nOpen++;
        if (tokens[i] == ')') nClose++;

        if (nOpen == nClose && nOpen > 0) {
            return i;
        }
    }
    return tokens.length - 1;
}


class Node {
    op: Op;
    left: number | Node;
    right: number | Node;

    constructor(op: Op, left: number | Node, right: number | Node) {
        this.op = op;
        this.left = left;
        this.right = right;
    }

    eval(): number {
        let l = (typeof this.left == 'number') ? this.left : this.left.eval();
        let r = (typeof this.right == 'number') ? this.right : this.right.eval();

        return Node.doOp(this.op, l, r);
    }

    static doOp(op: Op, v1: number, v2: number): number {
        switch (op) {
            case Op.add:
                return v1 + v2;
            case Op.sub:
                return v1 - v2;
            case Op.mul:
                return v1 * v2;
            case Op.div:
                return v1 / v2;
        }
    }
}

tick();
let ans = 0;
for (let line of lines) {
    let tokens = line.replaceAll(' ', '').trim().split('');

    let n = <Node>makeNode(tokens);
    ans += n.eval();
}

console.error(tock());
console.log(ans);
