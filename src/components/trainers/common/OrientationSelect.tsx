import { Select } from "@chakra-ui/react";
import { getAdjacentColors } from "src/lib/puzzles/cube3x3";
import { Color, CubeOrientation } from "src/lib/puzzles/cube3x3";

export interface OrientationSelectProps {
  orientation: CubeOrientation;
  setOrientation: (orientation: CubeOrientation) => void;
}

export default function OrientationSelect({
  orientation,
  setOrientation,
}: OrientationSelectProps) {
  const topColor = orientation[0] as Color;
  const frontColor = orientation[1] as Color;

  const handleTopColor: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const newTopColor = e.target.value as Color;
    const topAdjacentColors = getAdjacentColors(newTopColor);
    const newFrontColor = topAdjacentColors.includes(frontColor)
      ? frontColor
      : topAdjacentColors[0];
    const newOrientation = `${newTopColor}${newFrontColor}` as CubeOrientation;
    setOrientation(newOrientation);
  };

  const handleFrontColor: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const newFrontColor = e.target.value as Color;
    const frontAdjacentColors = getAdjacentColors(newFrontColor);
    const newTopColor = frontAdjacentColors.includes(topColor)
      ? topColor
      : frontAdjacentColors[0];
    const newOrientation = `${newTopColor}${newFrontColor}` as CubeOrientation;
    setOrientation(newOrientation);
  };

  /* prettier-ignore */
  return (
    <>
      <Select
        value={topColor}
        onChange={handleTopColor}
        variant="filled"
        maxWidth="12rem"
      >
        <option value="W" key="W">white top</option>
        <option value="O" key="O">orange top</option>
        <option value="G" key="G">green top</option>
        <option value="R" key="R">red top</option>
        <option value="B" key="B">blue top</option>
        <option value="Y" key="Y">yellow top</option>
      </Select>
      <Select
        value={frontColor}
        onChange={handleFrontColor}
        variant="filled"
        maxWidth="12rem"
      >
        <option value="W" key="W">white front</option>
        <option value="O" key="O">orange front</option>
        <option value="G" key="G">green front</option>
        <option value="R" key="R">red front</option>
        <option value="B" key="B">blue front</option>
        <option value="Y" key="Y">yellow front</option>
      </Select>
    </>
  );
}
