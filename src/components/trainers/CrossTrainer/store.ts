import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import { mergeDeepLeft } from "ramda";

import type {
  ColorNeutrality,
  CrossColor,
  CrossStep,
  DualCrossColors,
  LevelMode,
  XCrossSlot,
} from "./types";
import { NUM_OF_MOVES_CONFIGS } from "./constants";

type State = {
  crossStep: CrossStep;
  colorNeutrality: ColorNeutrality;
  fixedCrossColor: CrossColor;
  dualCrossColors: DualCrossColors;
  fixedXCrossSlot: XCrossSlot;
  levelMode: LevelMode;
  numOfMoves: number;
  shortScrambles: boolean;
  enableHotkeys: boolean;
  chooseExecAngle: boolean;
};

type Action = {
  setCrossStep: (value: CrossStep) => void;
  setColorNeutrality: (value: ColorNeutrality) => void;
  setFixedCrossColor: (value: CrossColor) => void;
  setDualCrossColors: (value: DualCrossColors) => void;
  setFixedXCrossSlot: (value: XCrossSlot) => void;
  setLevelMode: (value: LevelMode) => void;
  setNumOfMoves: (value: number) => void;
  setShortScrambles: (value: boolean) => void;
  setEnableHotkeys: (value: boolean) => void;
  setChooseExecAngle: (value: boolean) => void;
};

/*
CONSTRAINTS:
- crossStep == Cross:
  - colorNeutrality == fixed:
    - levelMode: random | num-of-moves
    - shortScrambles: true | false
  - colorNeutrality == dual or full:
    - levelMode: random ONLY
    - shortScrambles: false ONLY

- crossStep == XCross:
  - colorNeutrality == fixed:
    - levelMode == random:
      - shortScrambles: false ONLY
    - levelMode == num-of-moves:
      - shortScrambles: true | false
  - colorNeutrality == dual:
    - levelMode: random ONLY
    - shortScrambles: false ONLY

summary:
- if colorNeutrality != fixed || (crossStep == XCross && levelMode == num-of-moves)
  then shortScrambles must be false
- if (colorNeutrality != fixed) then levelMode must be random
*/

/**
 * Manages the settings shown on the UI
 */
export const useStore = create(
  persist<State & Action>(
    (set, get) => ({
      crossStep: "Cross",
      colorNeutrality: "fixed",
      fixedCrossColor: "white",
      dualCrossColors: "white/yellow",
      fixedXCrossSlot: "BL",
      levelMode: "random",
      numOfMoves: 3,
      shortScrambles: true,
      enableHotkeys: true,
      chooseExecAngle: true,
      setCrossStep: (crossStep) =>
        set(() => {
          const { min, max } = NUM_OF_MOVES_CONFIGS[crossStep];
          const state = get();
          const numOfMoves =
            state.numOfMoves < min
              ? min
              : state.numOfMoves > max
              ? max
              : state.numOfMoves;
          const colorNeutrality =
            crossStep === "XCross" && state.colorNeutrality === "full"
              ? "dual"
              : state.colorNeutrality;
          return {
            crossStep,
            numOfMoves,
            colorNeutrality,
          };
        }),
      setColorNeutrality: (colorNeutrality) => set(() => ({ colorNeutrality })),
      setFixedCrossColor: (fixedCrossColor) => set(() => ({ fixedCrossColor })),
      setDualCrossColors: (dualCrossColors) => set(() => ({ dualCrossColors })),
      setFixedXCrossSlot: (fixedXCrossSlot) => set(() => ({ fixedXCrossSlot })),
      setLevelMode: (levelMode) => set(() => ({ levelMode })),
      setNumOfMoves: (numOfMoves) => set(() => ({ numOfMoves })),
      setShortScrambles: (shortScrambles) => set(() => ({ shortScrambles })),
      setEnableHotkeys: (enableHotkeys) => set(() => ({ enableHotkeys })),
      setChooseExecAngle: (chooseExecAngle) => set(() => ({ chooseExecAngle })),
    }),
    {
      name: "cross",
      version: 1,
      merge: (persistedState, currentState) =>
        mergeDeepLeft(persistedState ?? {}, currentState),
    }
  )
);

export type Options = {
  crossStep: CrossStep;
  colorNeutrality: ColorNeutrality;
  fixedCrossColor: CrossColor;
  fixedXCrossSlot: XCrossSlot;
  dualCrossColors: DualCrossColors;
  levelMode: LevelMode;
  numOfMoves: number;
  shortScrambles: boolean;
};

/**
 * Converts the settings chosen in the UI into settings for the scrambler and solver.
 * This is a separate selector to prevent unnecessary re-renders when other unrelated settings change.
 * The settings have some rules, e.g. when color neutrality is not fixed, "num-of-moves" is not allowed.
 * We apply the rules by ignoring the original settings from state, rather than enforcing the rules in the state itself.
 * This is more convenient for users, their preferences will be remembered and ignored only when they don't apply.
 * TODO: is this unnecessary? what if we let the scramblers and solvers decide which options to ignore?
 */
export const useOptions = () =>
  useStore<Options>(
    useShallow((state) => {
      const disableShortScrambles =
        state.colorNeutrality !== "fixed" ||
        (state.crossStep == "XCross" && state.levelMode === "num-of-moves");
      return {
        crossStep: state.crossStep,
        colorNeutrality: state.colorNeutrality,
        fixedCrossColor: state.fixedCrossColor,
        fixedXCrossSlot: state.fixedXCrossSlot,
        dualCrossColors: state.dualCrossColors,
        levelMode:
          state.colorNeutrality === "fixed" ? state.levelMode : "random",
        numOfMoves: state.numOfMoves,
        shortScrambles: disableShortScrambles ? false : state.shortScrambles,
      };
    })
  );
