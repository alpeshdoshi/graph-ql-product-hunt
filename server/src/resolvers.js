
const mongoose = require('mongoose')
const Product = require('../models/Products.js')
const Category = require('../models/Category.js')

const resolvers = {
    Query: {
      appName: () =>
        'ProductHunt clone',

      allProducts: async () => {
        return Product.find({})
     },

      productsByCategory: async (_, {slug}) => {
        const category = await Category.findOne({slug})
        return Product.find({categoriesIds: category._id})

      }
  },

   // Specifies how to get fields for the "Product" type
   Product: {
   /* 
   publishedAt field,  returns a long number, representing the number of milliseconds since 1970. 
   This error happens because Mongoose converts date fields into an instance of the Date type, 
   which is then converted to milliseconds by Apollo. We should be able to fix the problem easily by defining a resolver 
   for publishedAt, which will then convert a Date instance into a human-readable string
   */
        publishedAt: (product) => {
          return product.publishedAt.toISOString()
        },

        categories: async (product) => {
          const allIds = product.categoriesIds
          return Category.find().where('_id').in(allIds)
        }
  },
}
  
  module.exports = {
    resolvers
  }