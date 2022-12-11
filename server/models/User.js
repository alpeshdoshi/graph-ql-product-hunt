const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    userName: String,
    fullName: String
})

//mongoose.model - > map UserSchema model to User table in DB- and provide CRUD operations on User table.
module.exports=mongoose.model('User', UserSchema)