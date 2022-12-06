const mongoose = require('mongoose')

const Schema = mongoose.Schema

//we can write resolvers for each field
const ProductSchema = new Schema({
  name: String,
  description: String,
  url: String,
  numberOfVotes: Number,
  publishedAt: Date,
  authorId: Schema.Types.ObjectId,
  categoriesIds: [Schema.Types.ObjectId]
})

//need to export to mongoose model, so that we can implement CRUD on Products.
module.exports = mongoose.model('Product', ProductSchema)