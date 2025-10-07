const mongoose =require('mongoose');
const { Schema } = mongoose;
require('../products/products.model');
require('../users/user.model')



const reviewSchema = new Schema({
    comment: {type: String, requied: true},
    rating: {type:Number, requied: true },
    userId : { type: mongoose.Types.ObjectId, ref: "User", required: true},
    productId : { type: mongoose.Types.ObjectId, ref: "product", required: true},
})

const Reviews = mongoose.model("Reviews", reviewSchema);
module.exports = Reviews;