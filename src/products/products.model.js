const mongoose = require('mongoose');
const { Schema } = mongoose;

const productsSchema = new Schema({
    name: {type: String, required: true},
    category : {type: String},
    description: String,
    price : {type: Number, required: true},
    oldPrice: Number,
    image:  {type: String, required: true},
    color: String,
    rating: {type: Number, default: 0},
    author: { type: mongoose.Types.ObjectId, ref:"User", required: true }
})


const products = mongoose.model("product", productsSchema);

module.exports = products;