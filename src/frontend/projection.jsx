import React from "react"
import { observable } from "mobx"
import { observer } from "mobx-react"
import { isAstObject } from "../common/ast"
import { DropDownValue, NumberValue, TextValue } from "./value-components"

// A or an? This function will return what you need.
const indefiniteArticleFor = nextWord =>
  "a" + (nextWord.toLowerCase().match(/^[aeiou]/) ? "n" : "")

/**
 * This projection function is essentially a large switch statement that acts like
 * a DFS over the ast. The projection part means that it's mapping the AST to some UI
 * layer, in this case html via react.
 *
 * We have a list of ancestor objects as well, because sometimes you need access to the parent
 * node from the child as in the case of a Number object. You'd need to know if the thing
 * it's referencing is an Amount or a Percentage because in the UI you'd have to know which symbol
 * ($ or %) to show!
 */
export const Projection = observer(({ astObject, ancestors }) => {
  if (isAstObject(astObject)) {
    const { settings } = astObject
    const editStateFor = propertyName =>
      observable({
        value: settings[propertyName],
        inEdit: false,
        setValue: newValue => {
          settings[propertyName] = newValue
        },
      })
    switch (astObject.concept) {
      case "Record Type":
        return (
          <div>
            <div>
              <span className="keyword ws-right">Record Type</span>
              <TextValue editState={editStateFor("name")} />
            </div>
            <div className="section">
              <div>
                <span className="keyword">attributes:</span>
              </div>
              {settings["attributes"].map((attribute, index) => (
                <Projection
                  astObject={attribute}
                  ancestors={[astObject, ...ancestors]}
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
            {/* This selects the `is a` or `is an` value for us. */}
            <span className="keyword ws-both">
              is {indefiniteArticleFor(settings["type"])}
            </span>
            <DropDownValue
              className="value enum-like ws-right"
              editState={editStateFor("type")}
              options={["amount", "date range", "percentage"]}
            />
            {settings["initialValue"] && (
              <div className="inline">
                <span className="keyword ws-right">initially</span>
                <Projection
                  astObject={settings["initialValue"]}
                  ancestors={[astObject, ...ancestors]}
                />
              </div>
            )}
          </div>
        )
      case "Attribute Reference": {
        // We have to find the attributes for the CURRENT record type in
        // order to list them out. So for example, maybe for a Rental type
        // the attributes are different from something like a Vehicle type.
        const recordType = ancestors.find(
          ancestor => ancestor.concept === "Record Type"
        )
        // Now we can get all the attributes for the current record type (e.g., Rental)
        // because we'd want to know which attribute this was referencing right?
        // For example, if this value was referencing the rental_price_before_discount
        // then wouldn't it make sense that the initial value should be the referent's initial value?
        // You wouldn't want to mess that up and put a string for an initial value that should be a number right?
        const attributes = recordType.settings["attributes"]
        return (
          <div className="inline">
            <span className="keyword ws-right">the</span>
            <DropDownValue
              editState={observable({
                value: settings["attribute"].ref.settings["name"],
                inEdit: false,
                setValue: newValue => {
                  settings["attribute"].ref = attributes.find(
                    attribute => attribute.settings["name"] === newValue
                  )
                },
              })}
              className="reference"
              options={attributes.map(attribute => attribute.settings["name"])}
            />
          </div>
        )
      }
      case "Number": {
        const type =
          parent &&
          parent.concept === "Data Attribute" &&
          parent.settings["type"]
        return (
          <div className="inline">
            {type === "amount" && <span className="keyword">$</span>}
            <NumberValue editState={editStateFor("value")} />
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
