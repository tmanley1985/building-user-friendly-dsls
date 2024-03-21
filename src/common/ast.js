const isObject = value =>
  !!value && typeof value === "object" && !Array.isArray(value)

const isAstObject = value =>
  isObject(value) && "concept" in value && "settings" in value

const isAstReferenceObject = value => isObject(value) && "ref" in value
const isAstReference = value =>
  isAstReferenceObject(value) && isAstObject(value.ref)

module.exports = {
  isAstObject,
  isAstReference,
}
