import React from "react"
import { observable } from "mobx"
import { createRoot } from "react-dom/client"
import rental from "../ch03/rental-AST"
import { Projection } from "./projection"

require("./styling.css")

createRoot(document.getElementById("root")).render(
  <Projection astObject={observable(rental)} />
)
