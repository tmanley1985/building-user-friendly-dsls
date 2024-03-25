import React from "react"
import { isAstObject } from "../common/ast"

/**
 * This projection function is essentially a large switch statement that acts like
 * a DFS over the ast. The projection part means that it's mapping the AST to some UI
 * layer, in this case html via react.
 */
export const Projection = ({ astObject }) => {
  if (isAstObject(astObject)) {
    switch (astObject.concept) {
      case "Record Type":
        return (
          <div>
            <div>
              <span className="keyword ws-right">Record Type</span>
              <span className="value">Rental</span>
            </div>
            <div className="section">
              <div>
                <span className="keyword">attributes:</span>
              </div>
              {astObject.settings["attributes"].map((attribute, index) => (
                <Projection astObject={attribute} key={index} />
              ))}
            </div>
          </div>
        )
      case "Data Attribute":
        return (
          <div className="attribute">
            <span className="keyword ws-right">the</span>
            <span className="value">{astObject.settings["name"]}</span>
            <span className="keyword ws-both">is a</span>
            <span className="value enum-like ws-right">
              {astObject.settings["type"]}
            </span>
            {astObject.settings["initialValue"] && (
              <div>
                <span className="keyword ws-right">initially</span>
                <Projection astObject={astObject.settings["initialValue"]} />
              </div>
            )}
          </div>
        )
      default:
        return (
          <div>
            <em>{"No projection defined for concept: " + astObject.concept}</em>
          </div>
        )
    }
  }
}
