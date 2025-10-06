import mongoose from 'mongoose';
const { Schema } = mongoose;


const reviewSchema = new Schema({
    comment: {type: String, requied: true},
    rating: {type:Number, requied: true },
    userId : { type: mongoose.Types.ObjectId, ref: "User", requied: true},
    productId : { type: mongoose.Types.ObjectId, ref: "Product", requied: true},
})

const reviews = mongoose.model("review", reviewSchema);
module.exports = reviews;