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

function makeNode(tokens: string[]): Node {
    let idx = 0;
    let l: number | Node;
    let r: number | Node;
    let op: Op;

    if (tokens[0] == '(') {
        idx += splitGroup(tokens);
        l = makeNode(tokens.slice(1, idx));
    } else {
        l = Number(tokens[0]);
    }
    idx++;

    op = opMap[tokens[idx]];
    idx++;

    if (tokens[idx] == '(') {
        let prev = idx;
        idx += splitGroup(tokens, prev + 1)
        r = makeNode(tokens.slice(prev + 1, idx));
    } else {
        r = Number(tokens[idx]);
    }
    idx++;

    let n = new Node(op, l, r);

    if (idx < tokens.length - 1) {
        let next;
        // If the rest of the right side is in () we strip the ()
        if (tokens[idx + 1] == '(' && splitGroup(tokens.slice(idx + 1))) {
            next = tokens.slice(idx + 2, tokens.length - 1);
        } else {
            next = tokens.slice(idx + 1);
        }
        return new Node(opMap[tokens[idx]], n, makeNode(next));
    }

    return n;
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

for (let line of lines) {
    let tokens = line.replaceAll(' ', '').split('');

    let n = makeNode(tokens);
    console.log(n)
    console.log(n.eval());
}