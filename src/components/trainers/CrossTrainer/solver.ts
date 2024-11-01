import {
  MOVECOUNT_METRICS,
  Move3x3,
  RotationMove,
  cubeOrientationToRotations,
} from "src/lib/puzzles/cube3x3";
import { solveCube3x3 } from "src/lib/puzzles/cube3x3/solvers";
import { Options } from "./store";
import { CrossSolution, XCrossSlot } from "./types";
import {
  allCrossColorOrientations,
  crossColorToOrientation,
  dualCrossColorsToOrientations,
} from "../common/constants";

export default async function solver(
  scramble: Move3x3[],
  options: Options
): Promise<CrossSolution[]> {
  /*
    Cross:
    - fixed: best 5 solutions
    - dual: 6 solutions on both colours combined (generate 3 on white, 3 on yellow, put together)
    - full: 6 solutions, one for each cross colour
  */
  if (options.crossStep === "Cross") {
    const { preRotations, numSolutionsPerOrientation } = {
      fixed: () => ({
        preRotations: [
          cubeOrientationToRotations(
            crossColorToOrientation[options.fixedCrossColor]
          ),
        ],
        numSolutionsPerOrientation: 5,
      }),
      dual: () => ({
        preRotations: dualCrossColorsToOrientations[
          options.dualCrossColors
        ].map(cubeOrientationToRotations),
        numSolutionsPerOrientation: 3,
      }),
      full: () => ({
        preRotations: allCrossColorOrientations.map(cubeOrientationToRotations),
        numSolutionsPerOrientation: 1,
      }),
    }[options.colorNeutrality]();

    const solutionsPerOrientation = await Promise.all(
      preRotations.map(async (preRotation) => {
        const solutions = await solveCube3x3(
          scramble,
          options.crossStep,
          preRotation,
          numSolutionsPerOrientation
        );
        return solutions.map((solution) => ({ preRotation, solution }));
      })
    );
    return solutionsPerOrientation
      .flat()
      .sort(
        (a, b) =>
          MOVECOUNT_METRICS.HTM.metric(a.solution) -
          MOVECOUNT_METRICS.HTM.metric(b.solution)
      );
  }
  /*
    XCross:
    - SPECIAL CASE: if the mode is # of moves, then do fixed orientation for the BL slot only
    - fixed: 4 solutions (4 slots)
    - dual: 8 solutions (4 slots * 2 cross colors)
    - full: not an option, default to dual
  */

  // TODO: worry about dual later, let's just do fixed for now
  // TODO: after we tack on a "y" rotation, we will need to simplify the moves
  // see if our cube library can simplify rotations
  const preRotationFixed = cubeOrientationToRotations(
    crossColorToOrientation[options.fixedCrossColor]
  );

  const slots: { xCrossSlot: XCrossSlot; rotations: RotationMove[] }[] = [
    { xCrossSlot: "BL", rotations: [] },
    { xCrossSlot: "BR", rotations: ["y'"] },
    { xCrossSlot: "FL", rotations: ["y"] },
    { xCrossSlot: "BL", rotations: ["y2"] },
  ];
  const solutions = await Promise.all(slots.map(async ({ xCrossSlot, rotations }) => {
    const preRotation = [...preRotationFixed, ...rotations];
    const solution = (await solveCube3x3(
      scramble,
      options.crossStep,
      preRotation,
      1
    ))[0];
    return {
      preRotation,
      solution,
      xCrossSlot,
    };
  }));
  return solutions
    .flat()
    .sort(
      (a, b) =>
        MOVECOUNT_METRICS.HTM.metric(a.solution) -
        MOVECOUNT_METRICS.HTM.metric(b.solution)
    );
}
