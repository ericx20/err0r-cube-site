import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import { BrowserRouter } from "react-router-dom";
import theme from "./theme"
import "@fontsource/roboto/400.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ColorModeScript />
    <BrowserRouter basename="/crystalcube">
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
)
