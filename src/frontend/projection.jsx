import React from "react"
import { observable } from "mobx"
import { observer } from "mobx-react"
import { isAstObject } from "../common/ast"
import { TextValue } from "./value-components"

// A or an? This function will return what you need.
const indefiniteArticleFor = nextWord =>
  "a" + (nextWord.toLowerCase().match(/^[aeiou]/) ? "n" : "")

/**
 * This projection function is essentially a large switch statement that acts like
 * a DFS over the ast. The projection part means that it's mapping the AST to some UI
 * layer, in this case html via react.
 *
 * We have a parent object as well, because sometimes you need access to the parent
 * node from the child as in the case of a Number object. You'd need to know if the thing
 * it's referencing is an Amount or a Percentage because in the UI you'd have to know which symbol
 * ($ or %) to show!
 */
export const Projection = observer(({ astObject, parent }) => {
  if (isAstObject(astObject)) {
    const { settings } = astObject
    switch (astObject.concept) {
      case "Record Type":
        return (
          <div>
            <div>
              <span className="keyword ws-right">Record Type</span>
              <TextValue
                editState={observable({
                  value: settings["name"],
                  inEdit: false,
                  setValue: newValue => {
                    settings["name"] = value
                  },
                })}
              />
            </div>
            <div className="section">
              <div>
                <span className="keyword">attributes:</span>
              </div>
              {settings["attributes"].map((attribute, index) => (
                <Projection
                  astObject={attribute}
                  parent={astObject}
                  key={index}
                />
              ))}
            </div>
          </div>
        )
      case "Data Attribute":
        return (
          <div className="attribute">
            <span className="keyword ws-right">the</span>
            <TextValue
              editState={observable({
                value: settings["name"],
                inEdit: false,
                setValue: newValue => {
                  settings["name"] = newValue
                },
              })}
            />
            <span className="keyword ws-both">
              is {indefiniteArticleFor(settings["type"])}
            </span>
            <span className="value enum-like ws-right">{settings["type"]}</span>
            {settings["initialValue"] && (
              <div className="inline">
                <span className="keyword ws-right">initially</span>
                <Projection
                  astObject={settings["initialValue"]}
                  parent={astObject}
                />
              </div>
            )}
          </div>
        )
      case "Attribute Reference":
        return (
          <div className="inline">
            <span className="keyword ws-right">the</span>
            <span className="reference">
              {settings["attribute"].ref.settings["name"]}
            </span>
          </div>
        )
      case "Number": {
        const type =
          parent &&
          parent.concept === "Data Attribute" &&
          parent.settings["type"]
        return (
          <div className="inline">
            {type === "amount" && <span className="keyword">$</span>}
            <span className="value">{settings["value"]}</span>
            {type === "percentage" && <span className="keyword">%</span>}
          </div>
        )
      }
      default:
        return (
          <div className="inline">
            <em>{"No projection defined for concept: " + astObject.concept}</em>
          </div>
        )
    }
  }
})
