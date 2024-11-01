import {
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from "@chakra-ui/react";
import {
  ColorNeutrality,
  CrossColor,
  CrossStep,
  DualCrossColors,
  LevelMode,
  XCrossSlot,
} from "../types";
import { SelectNumOfMoves } from "../../common/SelectNumOfMoves";
import { NUM_OF_MOVES_CONFIGS } from "../constants";

export interface ScrambleSettingsProps {
  crossStep: CrossStep;
  colorNeutrality: ColorNeutrality;
  fixedCrossColor: CrossColor;
  dualCrossColors: DualCrossColors;
  // TODO: choose xcross slot for fixed
  // fixedXCrossSlot: XCrossSlot;
  levelMode: LevelMode;
  numOfMoves: number;
  // TODO: SHORT SCRAMBLES
  // shortScrambles: boolean;
  setCrossStep: (value: CrossStep) => void;
  setColorNeutrality: (value: ColorNeutrality) => void;
  setFixedCrossColor: (value: CrossColor) => void;
  setDualCrossColors: (value: DualCrossColors) => void;
  // setFixedXCrossSlot: (value: XCrossSlot) => void;
  setLevelMode: (value: LevelMode) => void;
  setNumOfMoves: (value: number) => void;
  // setShortScrambles: (value: boolean) => void;
}

export default function ScrambleSettings({
  crossStep,
  colorNeutrality,
  fixedCrossColor,
  dualCrossColors,
  levelMode,
  numOfMoves,
  setCrossStep,
  setColorNeutrality,
  setFixedCrossColor,
  setDualCrossColors,
  setLevelMode,
  setNumOfMoves,
}: ScrambleSettingsProps) {
  const { min: minNumOfMoves, max: maxNumOfMoves } =
    NUM_OF_MOVES_CONFIGS[crossStep];
  return (
    <Stack gap={4}>
      <Heading size="md">scramble settings</Heading>
      <Checkbox
        isChecked={crossStep === "XCross"}
        onChange={(e) => setCrossStep(e.target.checked ? "XCross" : "Cross")}
      >
        XCross
      </Checkbox>
      <FormControl>
        <FormLabel>color neutrality</FormLabel>
        <RadioGroup value={colorNeutrality} onChange={setColorNeutrality}>
          <Stack direction="row" gap={4}>
            <Radio value="fixed">fixed</Radio>
            <Radio value="dual">dual</Radio>
            {crossStep === "Cross" && <Radio value="full">full</Radio>}
          </Stack>
        </RadioGroup>
      </FormControl>
      {colorNeutrality === "fixed" && (
        <Select
          value={fixedCrossColor}
          onChange={(e) => setFixedCrossColor(e.target.value as CrossColor)}
          variant="filled"
          maxWidth="max-content"
        >
          <option value="white">white cross</option>
          <option value="yellow">yellow cross</option>
          <option value="blue">blue cross</option>
          <option value="green">green cross</option>
          <option value="orange">orange cross</option>
          <option value="red">red cross</option>
        </Select>
      )}
      {colorNeutrality === "dual" && (
        <Select
          value={dualCrossColors}
          onChange={(e) =>
            setDualCrossColors(e.target.value as DualCrossColors)
          }
          variant="filled"
          maxWidth="max-content"
        >
          <option value="white/yellow">white or yellow cross</option>
          <option value="orange/red">orange or red cross</option>
          <option value="blue/green">blue or green cross</option>
        </Select>
      )}
      {colorNeutrality === "fixed" && (
        <FormControl>
          <FormLabel>level</FormLabel>
          <RadioGroup value={levelMode} onChange={setLevelMode}>
            <Stack direction="row" gap={4}>
              <Radio value="random">random</Radio>
              <Radio value="num-of-moves">number of moves</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
      )}
      {colorNeutrality === "fixed" && levelMode === "num-of-moves" && (
        <SelectNumOfMoves
          numOfMoves={numOfMoves}
          setNumOfMoves={setNumOfMoves}
          minNumOfMoves={minNumOfMoves}
          maxNumOfMoves={maxNumOfMoves}
        />
      )}
    </Stack>
  );
}
