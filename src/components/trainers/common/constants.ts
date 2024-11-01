import { CubeOrientation } from "src/lib/puzzles/cube3x3";
import { CrossColor, DualCrossColors } from "../CrossTrainer/types";

export const crossColorToOrientation = {
  white: "YB",
  yellow: "WG",
  blue: "GY",
  green: "BW",
  orange: "RG",
  red: "OG",
} as const satisfies { [c in CrossColor]: CubeOrientation };

export const dualCrossColorsToOrientations = {
  "white/yellow": [crossColorToOrientation.white, crossColorToOrientation.yellow],
  "orange/red": [crossColorToOrientation.orange, crossColorToOrientation.red],
  "blue/green": [crossColorToOrientation.blue, crossColorToOrientation.green],
} as const satisfies { [c in DualCrossColors]: [CubeOrientation, CubeOrientation]};

export const allCrossColorOrientations = [
  crossColorToOrientation.white,
  crossColorToOrientation.yellow,
  crossColorToOrientation.blue,
  crossColorToOrientation.green,
  crossColorToOrientation.orange,
  crossColorToOrientation.red,
] as const satisfies CubeOrientation[];