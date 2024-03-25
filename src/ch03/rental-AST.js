const prettyPrint = require("../pretty-print")

/*********************************************
 *  VALUES
 *********************************************/

const rentalPriceBeforeDiscountInitialValue = {
  concept: "Number",
  settings: {
    value: "0.0",
  },
}

const discountInitialValue = {
  concept: "Number",
  settings: {
    value: "0",
  },
}

/*********************************************
 *  DATA ATTRIBUTES
 *********************************************/

const rentalPeriodAttribute = {
  concept: "Data Attribute",
  settings: {
    name: "rental period",
    type: "date range",
  },
}

const rentalPriceBeforeDiscountAttribute = {
  concept: "Data Attribute",
  settings: {
    name: "rental price before discount",
    type: "amount",
    initialValue: rentalPriceBeforeDiscountInitialValue,
  },
}

const discountAttribute = {
  concept: "Data Attribute",
  settings: {
    name: "discount",
    type: "percentage",
    initialValue: discountInitialValue,
  },
}

const rentalPriceAfterDiscountInitialValue = {
  concept: "Attribute Reference",
  settings: {
    attribute: {
      // This isn't merely a "contained" object, but a "referred" one.
      // The difference here being that a contained object's lifecycle is
      // entirely controlled by the container.
      // However, a referred object exists of it's own accord and can
      // be referenced, but the container object doesn't control it.

      // An example would be a word document program.
      // You may have a document object that contains paragraph objects.
      // The document can destroy those as it sees fit. They don't "live anywhere else".
      // However, the document may reference a template object, but that shouldn't be controlled
      // by the document, it's merely referenced. The document could die and the template would live on.

      // So the way around this is to wrap this attribute with another object with a ref key.
      // That way, if this attribute needs to go away, we're not destroying the referred object!!
      ref: rentalPriceBeforeDiscountAttribute,
    },
  },
}

const rentalPriceAfterDiscountAttribute = {
  concept: "Data Attribute",
  settings: {
    name: "rental price after discount",
    type: "amount",
    initialValue: rentalPriceAfterDiscountInitialValue,
  },
}

/*********************************************
 *  AST ROOT
 *********************************************/

const rental = {
  concept: "Record Type",
  settings: {
    name: "Rental",
    attributes: [
      rentalPeriodAttribute,
      rentalPriceBeforeDiscountAttribute,
      discountAttribute,
      rentalPriceAfterDiscountAttribute,
    ],
  },
}

module.exports = rental
