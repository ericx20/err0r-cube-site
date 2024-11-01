import { Move3x3 } from "src/lib/puzzles/cube3x3";
import { CrossStep } from "./types";

interface NumOfMovesConfig {
  // Minimum choice for number of moves scramble
  min: number;
  // Maximum choice for number of moves scramble
  max: number;
  // The number of iterations allowed when finding an `n`-move scramble before we give up
  iterationLimit: number;
}

export const NUM_OF_MOVES_CONFIGS: { [step in CrossStep]: NumOfMovesConfig } = {
  Cross: { min: 3, max: 7, iterationLimit: 10000 },
  // TODO: test
  XCross: { min: 3, max: 9, iterationLimit: 10000 },
};

/**
 * NOTE: scrambled with white top green front, these are 8-move yellow crosses!
 * Generated with the following code:
 * @example
 * genReversePruningTable(new Cube3x3(MOVESETS.RUFLDB).applyMask(MASKS.Cross), {
     name: "8movers",
     pruningDepth: 8,
   })[8]
 */
export const eightMoveCrosses: Move3x3[][] = [
  ["R", "F", "L", "F2", "U'", "B'", "L2", "F"],
  ["R", "F", "L", "F2", "D", "B'", "L2", "U'"],
  ["R", "F", "L", "F2", "B'", "U", "L2", "U2"],
  ["R", "F", "L", "F2", "B'", "L", "U'", "B'"],
  ["R", "F", "L", "F2", "B'", "L2", "U", "F"],
  ["R", "F", "L", "D", "R2", "F2", "L", "B'"],
  ["R", "F", "L", "D", "L", "U2", "F2", "B'"],
  ["R", "F", "L", "D'", "B2", "U2", "R'", "B"],
  ["R", "F", "L", "D2", "B", "D", "R", "F"],
  ["R", "F", "L", "B", "R'", "U'", "F2", "L2"],
  ["R", "F", "L", "B", "L2", "U'", "R'", "B2"],
  ["R", "F", "L", "B", "L2", "D", "R2", "D2"],
  ["R", "F", "L", "B", "D2", "R", "D", "F"],
  ["R", "F", "L", "B'", "U", "L", "U2", "D'"],
  ["R", "F", "L", "B'", "U'", "F2", "B2", "R'"],
  ["R", "F", "L", "B'", "U'", "L2", "U", "B2"],
  ["R", "F", "L", "B'", "L", "U", "F2", "L"],
  ["R", "F", "L", "B'", "L'", "D", "L2", "B2"],
  ["R", "F", "L", "B'", "L2", "U", "L'", "F2"],
  ["R", "F", "L", "B'", "L2", "F2", "R", "U"],
  ["R", "F", "L", "B'", "L2", "F2", "R", "U'"],
  ["R", "F", "L", "B'", "L2", "D", "F2", "R"],
  ["R", "F", "L", "B'", "D", "R2", "F2", "L"],
  ["R", "F", "L", "B'", "D", "L'", "B2", "D2"],
  ["R", "F", "L", "B'", "D", "L2", "F2", "R"],
  ["R", "F", "L'", "U'", "F", "L2", "B'", "L"],
  ["R", "F", "L'", "U'", "B", "D'", "R", "F2"],
  ["R", "F", "L'", "F", "U'", "L2", "B'", "L"],
  ["R", "F", "L'", "F", "B", "R'", "U'", "L'"],
  ["R", "F", "L'", "F", "B", "U", "R'", "F"],
  ["R", "F", "L'", "F2", "R2", "D'", "R'", "B"],
  ["R", "F", "L'", "F2", "R2", "D'", "B", "R'"],
  ["R", "F", "L'", "F2", "R2", "B", "U'", "B"],
  ["R", "F", "L'", "F2", "U", "D'", "R", "F'"],
  ["R", "F", "L'", "F2", "U", "D2", "F'", "R"],
  ["R", "F", "L'", "F2", "U2", "F'", "D", "L"],
  ["R", "F", "L'", "F2", "B", "R'", "D", "B'"],
  ["R", "F", "L'", "F2", "B2", "U", "F'", "U"],
  ["R", "F", "L'", "D'", "F'", "L2", "D", "L2"],
  ["R", "F", "L'", "D2", "F", "B2", "U", "F"],
  ["R", "F", "L'", "D2", "F'", "R'", "L2", "D"],
  ["R", "F", "L'", "D2", "F'", "R'", "L2", "D'"],
  ["R", "F", "L'", "D2", "F2", "L2", "D'", "F"],
  ["R", "F", "L'", "D2", "L2", "D'", "L'", "F'"],
  ["R", "F", "L'", "D2", "B2", "U", "F", "L'"],
  ["R", "F", "L'", "B", "R'", "U", "F2", "U2"],
  ["R", "F", "L'", "B", "D", "R'", "U2", "F"],
  ["R", "F", "L'", "B2", "U", "R'", "F", "U2"],
  ["R", "F", "L2", "D", "R2", "L", "F", "B'"],
  ["R", "F", "L2", "D", "L'", "F'", "B", "D'"],
  ["R", "F", "L2", "D", "L'", "F'", "B2", "D2"],
  ["R", "F", "L2", "D", "L'", "D2", "F'", "B"],
  ["R", "F", "L2", "B'", "L", "D", "R2", "F"],
  ["R", "F", "L2", "B'", "D", "L'", "B", "D"],
  ["R", "F", "D", "R2", "F", "L", "B'", "L2"],
  ["R", "F", "D", "R2", "F", "L'", "U2", "F"],
  ["R", "F", "D", "R2", "L'", "U2", "F", "U"],
  ["R", "F", "D", "R2", "L'", "F", "U'", "L'"],
  ["R", "F", "D", "F", "U2", "R2", "L'", "F'"],
  ["R", "F", "D", "L'", "U", "F", "U2", "L'"],
  ["R", "F", "D", "L'", "F2", "R2", "B", "U'"],
  ["R", "F", "D'", "R'", "L2", "U2", "B'", "L"],
  ["R", "F", "D2", "F'", "R", "U'", "F'", "R"],
  ["R", "F", "B'", "L", "F2", "U'", "B'", "L2"],
  ["R", "F", "B'", "L", "D", "B2", "R2", "F'"],
  ["R", "F", "B'", "L", "B2", "U", "F2", "D'"],
  ["R", "F", "B'", "L'", "F2", "U", "F'", "U"],
  ["R", "F", "B2", "D", "F", "U2", "R2", "L'"],
  ["R", "F'", "R", "U", "B", "D2", "R'", "B"],
  ["R", "F'", "R", "D", "L", "D2", "B'", "L"],
  ["R", "F'", "R", "B", "D'", "B2", "L", "U"],
  ["R", "F'", "R'", "U'", "L'", "F", "B'", "L"],
  ["R", "F'", "R2", "U'", "B'", "L", "B", "D'"],
  ["R", "F'", "R2", "L", "B", "R'", "D", "L2"],
  ["R", "F'", "R2", "D", "B2", "L", "D2", "B'"],
  ["R", "F'", "R2", "D'", "R'", "B", "U2", "R'"],
  ["R", "F'", "R2", "B'", "D", "L'", "F'", "R'"],
  ["R", "F'", "U", "D2", "R", "F", "U", "L'"],
  ["R", "F'", "U", "B", "D2", "R", "F'", "U2"],
  ["R", "F'", "U'", "L", "B'", "U'", "R", "L"],
  ["R", "F'", "U'", "L", "B'", "L", "U'", "R"],
  ["R", "F'", "U2", "R", "D", "L2", "F", "L'"],
  ["R", "F'", "L", "U", "D'", "R", "F'", "B'"],
  ["R", "F'", "L", "B", "R'", "D", "B'", "L2"],
  ["R", "F'", "L", "B", "R'", "B2", "U'", "D'"],
  ["R", "F'", "L'", "B2", "U", "R", "F", "U2"],
  ["R", "F'", "L'", "B2", "U", "R", "F", "B"],
  ["R", "F'", "D'", "R'", "F2", "B'", "L'", "D2"],
  ["R", "F'", "D2", "R'", "B", "U'", "F2", "D"],
  ["R", "F'", "B", "R'", "L", "D", "B'", "L2"],
  ["R", "F'", "B2", "U'", "L'", "B'", "R", "F"],
  ["R", "F2", "L'", "F", "R2", "D'", "R'", "B"],
  ["R", "F2", "D", "F'", "D2", "R'", "L", "B'"],
  ["R", "L", "F", "B'", "L'", "F2", "U'", "D'"],
  ["R", "L", "D", "R", "L", "U2", "F'", "B'"],
  ["R", "L'", "F", "D", "L", "D", "B'", "D2"],
  ["R", "L'", "F'", "B", "R'", "U'", "D'", "F2"],
  ["R", "D", "R", "U2", "F'", "D2", "R'", "B"],
  ["R", "D", "R", "F", "L", "U2", "F2", "B'"],
  ["R", "D", "R", "F", "L", "F2", "B'", "L2"],
  ["R", "D", "R", "F", "L'", "F2", "U2", "F'"],
  ["R", "D2", "R", "F'", "U2", "D'", "R", "F'"],
];