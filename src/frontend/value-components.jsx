import React from "react"
import { action } from "mobx"
import { observer } from "mobx-react"

const isNumber = str => !isNaN(str) && str.trim().length > 0
const isMissing = value => value === null || value === undefined

/**
 * Represents a book.
 * @typedef {Object} EditState
 * @property {string} value - The value of the thing being edited
 * @property {boolean} inEdit - Whether or not the TextValue component should be in edit mode.
 */

/**
 *
 * @param {string} inputType - This is the type for the input element.
 * @returns
 */
export const inputValueComponent = ({ inputType, isValid }) =>
  observer(({ editState, placeholderText }) =>
    console.log({ inputType, placeholderText }) || editState.inEdit ? (
      <input
        type={inputType}
        defaultValue={editState.value}
        autoFocus={true}
        onBlur={action(event => {
          const newValue = event.target.value
          if (!isValid || isValid(newValue)) {
            editState.setValue(newValue)
          }
          editState.inEdit = false
        })}
        onKeyUp={action(event => {
          if (event.key === "Enter") {
            const newValue = event.target.value
            if (!isValid || isValid(newValue)) {
              editState.setValue(newValue)
            }
            editState.inEdit = false
          }
          if (event.key === "Escape") {
            editState.inEdit = false
          }
        })}
      />
    ) : (
      <span
        className={
          "value" + (isMissing(editState.value) ? " value-missing" : "")
        }
        onClick={action(_ => {
          editState.inEdit = true
        })}
      >
        {isMissing(editState.value) ? placeholderText : editState.value}
      </span>
    )
  )

/**
 * Represents an editable value in the ast.
 * @component
 * @param {EditState} editState The editState object representing the string to be edited in the ast.
 * @returns {React.ReactElement}
 */
export const TextValue = inputValueComponent({ inputType: "text" })

/**
 * Represents an editable number value in the ast.
 * @component
 * @param {EditState} editState The editState object representing the string to be edited in the ast.
 * @returns {React.ReactElement}
 */
export const NumberValue = inputValueComponent({
  inputType: "number",
  isValid: isNumber,
})

/**
 * Represents a dropdown for choosing various values.
 *
 * This could be used for choosing attribute types for Record types.
 *
 * @component
 * @param {EditState} editState The editState object representing the string to be edited in the ast.
 * @param {string} className A string for the classes.
 * @param {Array<string>} options A list of strings for the options.
 *
 * @returns {React.ReactElement}
 */
export const DropDownValue = observer(
  ({ editState, className, options, placeholderText }) =>
    editState.inEdit ? (
      <select
        autoFocus={true}
        value={editState.value}
        style={{
          width: Math.max(...options.map(option => option.length)) + "ch",
        }}
        onChange={action(event => {
          editState.setValue(event.target.value)
          editState.inEdit = false
        })}
        onBlur={action(_ => {
          editState.inEdit = false
        })}
        onKeyUp={action(event => {
          if (event.key === "Escape") {
            editState.inEdit = false
          }
        })}
        className={className}
      >
        {options.map((option, index) => (
          <option key={index}>{option}</option>
        ))}
      </select>
    ) : (
      <span
        className={
          className + isMissing(editState.value) ? "value-missing" : ""
        }
        onClick={action(_ => {
          editState.inEdit = true
        })}
      >
        {isMissing(editState.value) ? placeholderText : editState.value}
      </span>
    )
)
