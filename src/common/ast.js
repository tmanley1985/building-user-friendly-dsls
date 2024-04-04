const isObject = value =>
  !!value && typeof value === "object" && !Array.isArray(value)

const isAstObject = value =>
  isObject(value) && "concept" in value && "settings" in value

const isAstReferenceObject = value => isObject(value) && "ref" in value
const isAstReference = value =>
  isAstReferenceObject(value) && isAstObject(value.ref)

const placeholderAstObject = "<placeholder for an AST object>"

module.exports = {
  isAstObject,
  isAstReference,
  placeholderAstObject,
}
