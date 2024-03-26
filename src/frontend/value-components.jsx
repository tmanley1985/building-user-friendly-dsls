import React from "react"
import { action } from "mobx"
import { observer } from "mobx-react"

/**
 * Represents a book.
 * @typedef {Object} EditState
 * @property {string} value - The value of the thing being edited
 * @property {boolean} inEdit - Whether or not the TextValue component should be in edit mode.
 */

/**
 * Represents an editable value in the ast.
 * @component
 * @param {EditState} editState The editState object representing the string to be edited in the ast.
 * @returns {React.ReactElement}
 */
export const TextValue = observer(({ editState }) =>
  editState.inEdit ? (
    <input
      type="text"
      defaultValue={editState.value}
      autoFocus={true}
      onBlur={action(event => {
        const newValue = event.target.value
        editState.setValue(newValue)
        editState.inEdit = false
      })}
      onKeyUp={action(event => {
        if (event.key === "Enter") {
          const newValue = event.target.value
          editState.setValue(newValue)
          editState.inEdit = false
        }
        if (event.key === "Escape") {
          editState.inEdit = false
        }
      })}
    />
  ) : (
    <span
      className="value"
      onClick={action(_ => {
        editState.inEdit = true
      })}
    >
      {editState.value}
    </span>
  )
)
