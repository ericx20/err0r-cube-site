import { useEffect, useState } from "react";

import {
  Box,
  Button,
  ButtonProps,
  Card,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Tooltip,
  useClipboard,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  cubeOrientationToRotations,
  isCubeRotation,
  isFaceMove,
  Layer,
  layerOfLayerMove,
  MASKS,
  Move3x3,
  MOVECOUNT_METRICS,
  RotationMove,
  translateMoves,
} from "src/lib/puzzles/cube3x3";

import useScrambleAndSolutions from "../common/useScrambleAndSolutions";
import ScrambleEditor from "../common/ScrambleEditor";
import { Cube3x3 } from "src/lib/puzzles/cube3x3";

import { Options, useOptions, useStore } from "./store";

import scrambler from "./scrambler";
import solver from "./solver";

import SolutionsViewer, { DisplayedSolution } from "../common/SolutionsViewer";
import { useHotkeys } from "react-hotkeys-hook";
import KeyboardControls from "./settings/KeyboardControls";
import { plausible } from "src/App";
import {
  ColorNeutrality,
  CrossColor,
  CrossSolution,
  CrossStep,
  DualCrossColors,
  LevelMode,
} from "./types";
import { NUM_OF_MOVES_CONFIGS } from "./constants";
import ScrambleSettings from "./settings/ScrambleSettings";
import { SelectNumOfMoves } from "../common/SelectNumOfMoves";

export default function CrossTrainer() {
  const [areSolutionsHidden, setSolutionsHidden] = useState(true);
  const hideSolutions = () => setSolutionsHidden(true);
  const showSolutions = () => setSolutionsHidden(false);

  const state = useStore();
  const options = useOptions();

  const {
    scramble,
    scrambleFailed,
    setScramble,
    solutions,
    isLoading,
    getNext,
  } = useScrambleAndSolutions(scrambler, solver, options, hideSolutions);

  const mainAction = areSolutionsHidden
    ? showSolutions
    : () => {
        plausible.trackEvent("trainer-generate", {
          props: { method: "Cross" },
        });
        getNext();
      };

  const copyText = generateCopyText(scramble, solutions);

  const displayedSolutions: DisplayedSolution<Move3x3, RotationMove>[] =
    solutions.map(({ preRotation, solution, xcrossSlot }) => ({
      preRotation,
      solution: state.chooseExecAngle
        ? optimizeSolutionByYRotation(solution)
        : solution,
      label: xcrossSlot,
    }));

  // hotkeys (note, more hotkeys are implemented in children)
  useHotkeys(" ", mainAction, [areSolutionsHidden], {
    enabled: state.enableHotkeys && !isLoading,
    preventDefault: true,
  });
  useHotkeys("Backspace", hideSolutions, { enabled: state.enableHotkeys });

  const { min: minNumOfMoves, max: maxNumOfMoves } =
    NUM_OF_MOVES_CONFIGS[state.crossStep];
  return (
    <Container maxW="container.lg">
      <VStack spacing={4} my={4}>
        <Heading size="md">cross trainer</Heading> 
        <Card p="1.5rem" w="100%">
          <ScrambleEditor
            scrambleFailed={scrambleFailed}
            isLoading={isLoading}
            scramble={scramble}
            setScramble={setScramble}
            notationParser={scrambleParser}
          />
        </Card>
        <Card p="1.5rem" w="100%">
          <SolutionsViewer
            mask={MASKS[state.crossStep]}
            scramble={scramble}
            solutions={displayedSolutions}
            isLoading={isLoading}
            hideSolutions={areSolutionsHidden || isLoading}
            onRevealSolutions={showSolutions}
            enableHotkeys={!areSolutionsHidden && state.enableHotkeys}
            movecountMetric={MOVECOUNT_METRICS.HTM}
          >
            <HStack>
              <ShareButton text={copyText} isDisabled={areSolutionsHidden || isLoading} />
              <Button onClick={mainAction} isLoading={isLoading} w="100%" colorScheme="purple">
                {areSolutionsHidden ? "reveal" : "next"}
              </Button>
              <Button onClick={hideSolutions} isDisabled={areSolutionsHidden || isLoading}>hide</Button>
            </HStack>
          </SolutionsViewer>
        </Card>
        <Card p="1.5rem" w="100%">
          <ScrambleSettings
              crossStep={state.crossStep}
              colorNeutrality={state.colorNeutrality}
              fixedCrossColor={state.fixedCrossColor}
              dualCrossColors={state.dualCrossColors}
              levelMode={state.levelMode}
              numOfMoves={state.numOfMoves}
              setCrossStep={state.setCrossStep}
              setColorNeutrality={state.setColorNeutrality}
              setFixedCrossColor={state.setFixedCrossColor}
              setDualCrossColors={state.setDualCrossColors}
              setLevelMode={state.setLevelMode}
              setNumOfMoves={state.setNumOfMoves}
          />
        </Card>
        {/* TODO: keyboard shortcut settings */}
        <Flex direction="column" w="100%" gap={4}>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={4}
            w="100%"
            maxW="container.lg"
          >
            <Card p="1.5rem" flex={1} display={{ base: "none", sm: "flex" }}>
              <KeyboardControls
                enableHotkeys={state.enableHotkeys}
                setEnableHotkeys={state.setEnableHotkeys}
              />
            </Card>
          </Stack>
        </Flex>
      </VStack>
    </Container>
  );
}

const scrambleParser = (input: string) => {
  const parsed = Cube3x3.parseNotation(input);
  return parsed?.every(isFaceMove) ? parsed : null;
};

// TODO: make this common
function ShareButton({ text, isDisabled }: { text: string, isDisabled?: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onCopy, hasCopied, setValue } = useClipboard(text);
  useEffect(() => {
    setValue(text);
  }, [text]);
  const boxColor = useColorModeValue("gray.100", "gray.600");
  return (
    <>
      <Button onClick={onOpen} isDisabled={isDisabled}>share</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>share solutions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              bg={boxColor}
              whiteSpace="pre-line"
              borderRadius="lg"
              padding="4"
            >
              {text}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Tooltip label="copied!" isOpen={hasCopied} hasArrow>
              <Button onClick={onCopy} colorScheme="blue" mr={3}>
                copy
              </Button>
            </Tooltip>
            <Button variant="ghost" onClick={onClose}>
              close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

// TODO: generalize this to accept DisplayedSolution<MoveType, RotationType>[] and move to common.
function generateCopyText(
  scramble: Move3x3[],
  solutions: CrossSolution[]
): string {
  const scrambleText = `scramble: ${scramble.join(" ")}`;

  const solutionText = [
    "cross solutions:",
    ...solutions.map(({ preRotation, solution }, index) => {
      const prefixText = `${index + 1}.`;
      const movecountText = `(${solution.length} HTM)`;
      const solutionText = [...preRotation, ...solution].join(" ");
      return [prefixText, movecountText, solutionText].join(" ").trimEnd();
    }),
  ].join("\n");

  const linkText = "generated by https://crystalcuber.com";

  return [scrambleText, solutionText, linkText].join("\n\n");
}

function optimizeSolutionByYRotation(solution: Move3x3[]): Move3x3[] {
  const yRotations: RotationMove[][] = [[], ["y"], ["y'"], ["y2"]];
  const options: Move3x3[][] = yRotations.map((rotation) => [
    ...rotation,
    ...translateMoves(solution, rotation),
  ]);

  // choose y rotations that reduce the number of F or B moves, especially B moves
  // higher score is worse
  let bestOption = options[0];
  let bestScore = Infinity;
  options.forEach((option) => {
    const score = option.reduce((totalScore, currentMove) => {
      if (isCubeRotation(currentMove)) return totalScore;
      const layerScores: { [layer in Layer]?: number } = {
        F: 1,
        B: 2,
      };
      const moveScore = layerScores[layerOfLayerMove(currentMove)] ?? 0;
      return totalScore + moveScore;
    }, 0);
    if (score < bestScore) {
      bestScore = score;
      bestOption = option;
    }
  });
  return bestOption;
}
