
const mongoose = require('mongoose')
const { UserInputError } = require('apollo-server')
const Product = require('../models/Products.js')
const Category = require('../models/Category.js')
const User = require('../models/User.js')

const resolvers = {
    Query: {
      appName: () =>
        'ProductHunt clone',

      allProducts: async () => {
        return Product.find({})
     },

     productsByAuthor: async(_, {authorName}) => {
      const user = await User.findOne({userName: authorName})
      if (!user) {
        throw new UserInputError('User does not exist')
      }
      return Product.find({authorId: user._id})

     },

      productsByCategory: async (_, {slug}) => {
        const category = await Category.findOne({slug})
        return Product.find({categoriesIds: category._id})

      }
  },

  Mutation: {
    createProduct: async(_, {input}) => {
      const author = await User.findOne({userName: "ellen"})
      return Product.create({
        name: input.name,
        description: input.description, 
        url: input.url,
        numberOfVotes: 0,
        publishedAt: Date.now(),
        authorId: author._id, 
        categoriesIds: input.categoriesIds,
      });

    },
    createCategory: async(_, { input } ) => {
      errors = []
      if (!input.user) {
        errors.push({
          field: 'user',
          error: 'Should not be empty'
        })
      }
      if (!input.slug) {
        errors.push({
          field: 'slug',
          error: 'Should not be empty'
        })
      }
      if (errors) {
        throw new UserInputError('Invalid input', {
          validationErrors: errors
        });
      }
      return Category.create({
        slug: input.slug,
        name: input.name,
       });
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

        author: async (product) => {
          return User.findById(product.authorId)
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