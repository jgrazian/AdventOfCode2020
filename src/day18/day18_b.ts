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
    return -1;
}

function splitGroupLeft(tokens: string[]): number {
    let nOpen = 0;
    let nClose = 0;
    for (let i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i] == '(') nOpen++;
        if (tokens[i] == ')') nClose++;

        if (nOpen == nClose && nOpen > 0) {
            return i;
        }
    }
    return tokens.length - 1;
}

// Pt2 function, wrap addition signs in parentheses, then the above makeNode aglo should just work
function groupAdditions(tokens: string[], addIdx: number): string[] {
    // Make an array of indexes of + signs
    let addLocs = [];
    let addLoc = tokens.findIndex(v => v == '+');
    while (addLoc != -1) {
        addLocs.push(addLoc);
        addLoc = tokens.findIndex((v, i) => (v == '+') && (i > addLoc));
    }
    
    // No more + to wrap == done
    if (addIdx > addLocs.length - 1) return tokens;

    const curAdd = addLocs[addIdx];
    // Check left of +. Can either be ) or number
    let idx1;
    let leftParen = false;
    if (tokens[curAdd - 1] == ')') {
        idx1 = splitGroupLeft(tokens.slice(0, curAdd)); // Location of enclosing (
    } else {
        idx1 = curAdd - 1;
    }
    if (tokens[idx1 - 1] == '(') leftParen = true;

    // Check right of +. Can either be ( or number
    let idx2;
    let rightParen = false;
    if (tokens[curAdd + 1] == '(') {
        idx2 = splitGroup(tokens, curAdd + 1); // Location of enclosing (
    } else {
        idx2 = curAdd + 2;
    }
    if (tokens[idx2] == ')') rightParen = true;

    // If the left and right are already grouped by () just move on
    if (leftParen && rightParen) {
        return groupAdditions(tokens, addIdx + 1);
    } else {
        // NAND to make sure we dont wrap entire expression in () because then we don't have a left and right side
        if (!(idx1 == 0 && idx2 >= tokens.length - 1)) {
            tokens.splice(idx2, 0, ')');
            tokens.splice(idx1, 0, '(');
        }
        return groupAdditions(tokens, addIdx + 1);
    }
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
    tokens = groupAdditions(tokens, 0);

    let n = <Node>makeNode(tokens);
    let v = n.eval();

    ans += v;
}

console.error(tock());
console.log(ans);
