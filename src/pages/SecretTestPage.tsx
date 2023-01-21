import { useState } from "react"
import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react"

export default function SecretTestPage() {
  const [difficulty, setDifficulty] = useState(0)
  return (
    <NumberInput value={difficulty} onChange={(_, val) => setDifficulty(val)} min={0} max={10}>
    <NumberInputField />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
    </NumberInput>
  )
}
