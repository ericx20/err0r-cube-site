import { useEffect, useState } from "react"
import { Box, Badge, Button, Card, Container, Heading, HStack, VStack, useColorModeValue, Text, SimpleGrid, Stack } from "@chakra-ui/react"
import type { MoveSeq, Mask } from "src/lib/types"
import SolutionPlayer from "./SolutionPlayer"
import { moveSeqToString } from "src/lib"
import TrainerCard from "./TrainerCard"

interface SolutionsViewerProps {
  scramble: MoveSeq
  solutions: Array<MoveSeq>
  mask?: Mask
  showEO?: boolean
  hideSolution?: boolean
  onRevealSolution?: () => void
  children?: React.ReactNode
}

export default function SolutionsViewer({ scramble, solutions, mask, showEO, hideSolution = false, onRevealSolution = () => {}, children }: SolutionsViewerProps) {
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(0)
  useEffect(() => {
    setSelectedSolutionIndex(0)
  }, [solutions])
  const selectedSolution = solutions.at(selectedSolutionIndex)
  const badgeText = solutions.length ? `best: ${solutions[0].length} HTM` : ""
  return (
    <TrainerCard>
      <Heading size="md">
        solutions
        <Badge ml={2} colorScheme="blue" variant="solid">
          {badgeText}
        </Badge>
      </Heading>
        <Stack direction={{ base: "column", md: "row" }}>
          <Spoiler hide={solutions.length ? hideSolution : false} onReveal={onRevealSolution}>
            <Box minW="17rem">
              <SelectSolution solutions={solutions} selectedSolutionIndex={selectedSolutionIndex} onSelectSolution={setSelectedSolutionIndex} />
            </Box>
          </Spoiler> 
          {/* set minWidth to 0 to force 3D cube canvas to resize properly */}
          <Box w="100%" minW={0}>
            <SolutionPlayer
              scramble={scramble}
              solution={selectedSolution ?? []}
              mask={mask}
              showEO={showEO}
              hideSolution={hideSolution}
            />
          </Box>
        </Stack>
      {children}
    </TrainerCard>
  )
}

interface SelectSolutionProps {
  solutions: Array<MoveSeq>
  selectedSolutionIndex: number
  onSelectSolution: (index: number) => void
}

function SelectSolution({ solutions, selectedSolutionIndex, onSelectSolution }: SelectSolutionProps) {
  const badgeColorScheme = useColorModeValue(undefined, "gray")
  const badgeSelectedColorScheme = useColorModeValue("blackAlpha", "blue")
  return (
    <SimpleGrid spacing={2} minChildWidth="17rem">
      {solutions.map((solution, index) => {
        const solutionString = moveSeqToString(solution)
        const movecount = solution.length
        const isSelected = selectedSolutionIndex === index
        return (
          <Button
            key={solutionString}
            size={["sm", "md"]}
            onClick={() => onSelectSolution(index)}
            w="100%"
            justifyContent="left"
            colorScheme={isSelected ? "blue" : undefined}
          >
            <HStack>
              <Badge colorScheme={isSelected ? badgeSelectedColorScheme : badgeColorScheme} variant="solid">{movecount} HTM</Badge>
              {/* TODO: REMOVE HARDCODE */}
              <Text fontWeight={500} >x2 {solutionString}</Text>
            </HStack>
          </Button>
        )
      })}
    </SimpleGrid>
  )
}

interface SpoilerProps {
  hide: boolean
  onReveal: () => void
  children: JSX.Element
}

function Spoiler({ hide, onReveal, children }: SpoilerProps) {
  const styles = {
    opacity: hide ? "0" : "1",
    visibility: hide ? "hidden" : "visible",
    transition: "opacity 0.12s linear",
  }
  const coverColor = useColorModeValue("gray.300", "gray.800")
  return (
    <Box
      onClick={onReveal}
      bg={hide ? coverColor : undefined}
      borderRadius="md"
      cursor={hide ? "pointer" : "cursor"}
      position="relative"
    >
      {hide && (
        <Badge
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          fontSize="lg"
        >
          click to reveal
        </Badge>
      )}
      <Box sx={styles}>{children}</Box>
    </Box>
  )
}
