interface Puzzle<Move = string> {
  isSolved(): boolean;
  get nextMoves(): Readonly<Move[]>;
  encode(): string;
  applyMove(move: Move): this;
  applyMoves(moves: Move[]): this;
  clone: () => Puzzle<Move>;
}

const SUFFIXES = ["", "2", "'"] as const;
type Suffix = (typeof SUFFIXES)[number];
type Move3x3 = `${Layer | Axis}${Suffix}`;

// prettier-ignore
const SOLVED_FACELET_CUBE: Readonly<Facelet3x3> = [
               "U", "U", "U",
               "U", "U", "U",
               "U", "U", "U",
"L", "L", "L", "F", "F", "F", "R", "R", "R", "B", "B", "B",
"L", "L", "L", "F", "F", "F", "R", "R", "R", "B", "B", "B",
"L", "L", "L", "F", "F", "F", "R", "R", "R", "B", "B", "B",
               "D", "D", "D",
               "D", "D", "D",
               "D", "D", "D",
]

const FACES = ["R", "L", "U", "D", "F", "B"] as const;
const LAYERS = ["R", "L", "U", "D", "F", "B", "r", "l", "u", "d", "f", "b", "M", "E", "S"] as const;
const AXES = ["x", "y", "z"] as const;

// const MOVES_3x3 = [...LAYERS, ...AXES].flatMap(letter => SUFFIXES.map(suffix => letter + suffix))
// prettier-ignore


const MOVESET_3x3: Move3x3[] = [
  "R", "R'", "R2",
  "U", "U'", "U2",
  "F", "F'", "F2",
  "L", "L'", "L2",
  "D", "D'", "D2",
  "B", "B'", "B2",
  "r", "r'", "r2",
  "u", "u'", "u2",
  "f", "f'", "f2",
  "l", "l'", "l2",
  "d", "d'", "d2",
  "b", "b'", "b2",
  "x", "x'", "x2",
  "y", "y'", "y2",
  "z", "z'", "z2",
]

type Face = (typeof FACES)[number];
type Layer = (typeof LAYERS)[number];
type Axis = (typeof AXES)[number];
type Facelet = Face | "O" | "X"; // "O" is a facelet that identifies edge orientation, X is a wildcard facelet
type Facelet3x3 = Array<Facelet>;
type FaceletIndex = number; // int from 0 to 53, represents a facelet's location
type Perm<T = number> = [src: T, dst: T][];

// prettier-ignore
const R: Perm<FaceletIndex> = [[ 2, 42], [ 5, 30], [ 8, 18], [14,  2], [15, 17], [16, 29], [17, 41], [18, 53], [26,  5], [27, 16], [29, 40], [30, 50], [38,  8], [39, 15], [40, 27], [41, 39], [42, 47], [47, 14], [50, 26], [53, 38]];
const L: Perm<FaceletIndex> = [[ 0, 12], [ 3, 24], [ 6, 36], [ 9, 11], [10, 23], [11, 35], [12, 45], [20,  6], [21, 10], [23, 34], [24, 48], [32,  3], [33,  9], [34, 21], [35, 33], [36, 51], [44,  0], [45, 44], [48, 32], [51, 20]];
const U: Perm<FaceletIndex> = [[ 0,  2], [ 1,  5], [ 2,  8], [ 3,  1], [ 5,  7], [ 6,  0], [ 7,  3], [ 8,  6], [ 9, 18], [10, 19], [11, 20], [12,  9], [13, 10], [14, 11], [15, 12], [16, 13], [17, 14], [18, 15], [19, 16], [20, 17]];
const D: Perm<FaceletIndex> = [[33, 36], [34, 37], [35, 38], [36, 39], [37, 40], [38, 41], [39, 42], [40, 43], [41, 44], [42, 33], [43, 34], [44, 35], [45, 47], [46, 50], [47, 53], [48, 46], [50, 52], [51, 45], [52, 48], [53, 51]];
const F: Perm<FaceletIndex> = [[ 6, 15], [ 7, 27], [ 8, 39], [11,  8], [12, 14], [13, 26], [14, 38], [15, 47], [23,  7], [24, 13], [26, 37], [27, 46], [35,  6], [36, 12], [37, 24], [38, 36], [39, 45], [45, 11], [46, 23], [47, 35]];
const B: Perm<FaceletIndex> = [[ 0, 33], [ 1, 21], [ 2,  9], [ 9, 51], [17,  0], [18, 20], [19, 32], [20, 44], [21, 52], [29,  1], [30, 19], [32, 43], [33, 53], [41,  2], [42, 18], [43, 30], [44, 42], [51, 41], [52, 29], [53, 17]];
const M: Perm<FaceletIndex> = [[ 1, 13], [ 4, 25], [ 7, 37], [13, 46], [19,  7], [25, 49], [31,  4], [37, 52], [43,  1], [46, 43], [49, 31], [52, 19]];
const E: Perm<FaceletIndex> = [[21, 24], [22, 25], [23, 26], [24, 27], [25, 28], [26, 29], [27, 30], [28, 31], [29, 32], [30, 21], [31, 22], [32, 23]];
const S: Perm<FaceletIndex> = [[ 3, 16], [ 4, 28], [ 5, 40], [10,  5], [16, 50], [22,  4], [28, 49], [34,  3], [40, 48], [48, 10], [49, 22], [50, 34]];

function invert<T>(perm: Perm<T>): Perm<T> {
  return perm.map(([src, dst]) => [dst, src]);
}

function double<T>(perm: Perm<T>): Perm<T> {
  const dstMap = Object.fromEntries(perm);
  return perm.map(([src, dst]) => [src, dstMap[dst]]);
}

const BASIC_MOVE_PERMS = {
  R,
  L,
  U,
  D,
  F,
  B,
  M,
  E,
  S,
  r: [...R, ...invert(M)],
  l: [...L, ...M],
  u: [...U, ...invert(E)],
  d: [...D, ...E],
  f: [...F, ...S],
  b: [...B, ...invert(S)],
  x: [...R, ...invert(M), ...invert(L)],
  y: [...U, ...invert(E), ...invert(D)],
  z: [...F, ...S, ...invert(B)],
}

const MOVE_PERMS = Object.fromEntries(
  Object.entries(BASIC_MOVE_PERMS).flatMap(([name, perm]) => [
    [name, perm],
    [name + "'", invert(perm)],
    [name + "2", double(perm)]
  ])
) as { [move in Move3x3]: Perm<FaceletIndex> };

// TODO: REMOVE
export default {};

// first implement a regular 3x3, ported from crystalcube
class Cube3x3<Move extends Move3x3 = Move3x3> implements Puzzle<Move> {
  private state: Facelet3x3;
  private solvedState: Facelet3x3;
  constructor(
    initialState: Facelet3x3 = [...SOLVED_FACELET_CUBE],
    private moveset: Readonly<Move[]> = MOVESET_3x3 as Move[]
  ) {
    this.state = initialState;
    this.solvedState = initialState;
  }

  isSolved() {
    return this.state.join("") === this.solvedState.join("");
  }

  // TODO: add turning restrictions
  // default turning restriction: after doing a move, you can't do another move of the same family
  get nextMoves() {
    return this.moveset;
  }

  get stateData(): Facelet3x3 {
    return [...this.state];
  }

  encode() {
    return this.state.join("");
  }

  applyMove(move: Move) {
    const nextState = [...this.state];
    const perms = MOVE_PERMS[move];
    perms.forEach(([src, dst]) => {
      nextState[dst] = this.state[src];
    });
    this.state = nextState;
    return this;
  }

  applyMoves(moves: Move[]) {
    moves.forEach((move) => this.applyMove(move));
    return this;
  }

  clone() {
    return new Cube3x3<Move>(this.state, this.moveset);
  }

  print() {
    printFacelet3x3(this.state);
    return this;
  }
}

function printFacelet3x3(cube: Facelet3x3): void {
  const xxx = "➖➖➖";
  const xxxxxx = "➖➖➖➖➖➖";
  const xxxxxxxxxxxx = "➖➖➖➖➖➖➖➖➖➖➖➖";
  const faceletToEmoji: { [f in Facelet]: string } = {
    R: "🟥",
    L: "🟧",
    U: "⬜",
    D: "🟨",
    F: "🟩",
    B: "🟦",
    O: "🟪",
    X: "⬛",
  };
  const emojiCube = cube.map((facelet) => faceletToEmoji[facelet]);
  const slice = (start: number, end: number) =>
    emojiCube.slice(start, end).join("");
  console.log(xxxxxxxxxxxx);
  console.log(xxx + slice(0, 3) + xxxxxx);
  console.log(xxx + slice(3, 6) + xxxxxx);
  console.log(xxx + slice(6, 9) + xxxxxx);
  console.log(slice(9, 21));
  console.log(slice(21, 33));
  console.log(slice(33, 45));
  console.log(xxx + slice(45, 48) + xxxxxx);
  console.log(xxx + slice(48, 51) + xxxxxx);
  console.log(xxx + slice(51, 54) + xxxxxx);
  console.log(xxxxxxxxxxxx);
}

interface Cube3x3Mask {
  solvedFaceletIndices: Readonly<Array<FaceletIndex>>;
  eoFaceletIndices?: Readonly<Array<FaceletIndex>>;
}

const CENTERS: Array<FaceletIndex> = [4, 22, 25, 28, 31, 49];
const EO_FACELETS: Array<FaceletIndex> = [
  1, 3, 5, 7, 24, 26, 30, 32, 46, 48, 50, 52,
];
const CROSS_FACELETS: Array<FaceletIndex> = [
  4, 22, 25, 28, 31, 34, 37, 40, 43, 46, 48, 49, 50, 52,
];
const BACK_ARROW_FACELETS: Array<FaceletIndex> = [
  4, 22, 25, 28, 31, 34, 40, 43, 48, 49, 50, 52,
];
const LEFT_ARROW_FACELETS: Array<FaceletIndex> = [
  4, 22, 25, 28, 31, 34, 37, 43, 46, 48, 49, 52,
];
const LINE_FACELETS: Array<FaceletIndex> = [
  4, 22, 25, 28, 31, 37, 43, 46, 49, 52,
];
const PETRUS_BLOCK_FACELETS: Array<FaceletIndex> = [
  4, 21, 22, 25, 28, 31, 32, 33, 34, 43, 44, 48, 49, 51, 52,
];

const EO_MASK: Cube3x3Mask = {
  solvedFaceletIndices: CENTERS,
  eoFaceletIndices: EO_FACELETS,
};

const EOLINE_MASK: Cube3x3Mask = {
  solvedFaceletIndices: LINE_FACELETS,
  eoFaceletIndices: EO_FACELETS,
};

const EOCROSS_MASK: Cube3x3Mask = {
  solvedFaceletIndices: CROSS_FACELETS,
  eoFaceletIndices: EO_FACELETS,
};

const BACK_EOARROW_MASK: Cube3x3Mask = {
  solvedFaceletIndices: BACK_ARROW_FACELETS,
  eoFaceletIndices: EO_FACELETS,
};

const LEFT_EOARROW_MASK: Cube3x3Mask = {
  solvedFaceletIndices: LEFT_ARROW_FACELETS,
  eoFaceletIndices: EO_FACELETS,
};

const EO222_MASK: Cube3x3Mask = {
  solvedFaceletIndices: PETRUS_BLOCK_FACELETS,
  eoFaceletIndices: EO_FACELETS,
};

const CROSS_MASK: Cube3x3Mask = {
  solvedFaceletIndices: CROSS_FACELETS,
};

// apply a mask to facelet cube
function getMaskedFaceletCube(
  mask: Cube3x3Mask,
  stateData: Readonly<Facelet3x3> = SOLVED_FACELET_CUBE
): Facelet3x3 {
  return [...Array(54).keys()].map((faceletIdx) => {
    if (mask.solvedFaceletIndices.includes(faceletIdx)) {
      return stateData[faceletIdx];
    }
    if (mask.eoFaceletIndices?.includes(faceletIdx)) {
      return "O";
    }
    return "X";
  });
}

// differs from old crystalcube lib, we allow rotations to be considered in the moveset
type MoveSet<Move> = Readonly<Move[]>;

// prettier-ignore
const HTM_MOVESET_BIASED_RUF = [
  "R", "R'", "R2",
  "U", "U'", "U2",
  "F", "F'", "F2",
  "L", "L'", "L2",
  "D", "D'", "D2",
  "B", "B'", "B2",
] as const satisfies MoveSet<Move3x3>

// then we can port the solver
/*
TODO:
- port the solver and pruner
- add turning restriction
- use comlink to make the solver async (web worker)
- add 2x2
- add sq-1
- rewrite the UI to use the new library
*/