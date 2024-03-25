import React from "react"
import { createRoot } from "react-dom/client"
import rental from "../ch03/rental-AST"
import { Projection } from "./projection"

require("./styling.css")

createRoot(document.getElementById("root")).render(
  <Projection astObject={rental} />
)
