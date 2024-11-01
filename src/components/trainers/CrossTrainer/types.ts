import { Move3x3, RotationMove } from "src/lib/puzzles/cube3x3";

export type LevelMode = "random" | "num-of-moves";
export type CrossStep = "Cross" | "XCross";
export type ColorNeutrality = "fixed" | "dual" | "full";
export type CrossColor =
  | "white"
  | "yellow"
  | "blue"
  | "green"
  | "orange"
  | "red";
export type DualCrossColors = "white/yellow" | "orange/red" | "blue/green";

// This is relative to the preRotation. FL means front-left F2L slot, BR means back-right F2L slot, etc.
export type XCrossSlot = "FL" | "FR" | "BL" | "BR";
// TODO: do this for EOStep as well, where the solver provides the EO annotation through a property

export type CrossSolution = {
  preRotation: RotationMove[];
  solution: Move3x3[];
  xcrossSlot?: XCrossSlot;
};
