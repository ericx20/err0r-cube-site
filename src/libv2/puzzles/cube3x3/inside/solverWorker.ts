import { solve } from "src/libv2/search";
import { Move3x3, CubeRotation } from "..";
import {
  PUZZLE_CONFIGS,
  PuzzleConfigName,
  invertMoves,
  Cube3x3,
  getMaskedFaceletCube,
} from "..";

import * as Comlink from "comlink";

export const Cube3x3Solver = {
  solve(
    scramble: Move3x3[],
    configName: PuzzleConfigName,
    preRotation: CubeRotation[] = [],
    maxSolutionCount?: number
  ): Move3x3[][] {
    const { moveSet, mask, pruningDepth, depthLimit } =
      PUZZLE_CONFIGS[configName].solverConfig;
    const maskedCubeState = getMaskedFaceletCube(mask);
    const translatedScramble = [
      ...invertMoves(preRotation),
      ...scramble,
      ...preRotation,
    ];
    const puzzle = new Cube3x3(moveSet, maskedCubeState);
    puzzle.applyMoves(translatedScramble);

    const solutions = solve(puzzle, {
      name: configName,
      pruningDepth,
      depthLimit,
      maxSolutionCount,
    });
    
    return solutions.map((solution) => [...preRotation, ...solution]);
  }
};

Comlink.expose(Cube3x3Solver);
