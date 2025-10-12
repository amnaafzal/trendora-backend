const express = require('express');
const Reviews = require('./reviews.models');
const products = require('../products/products.model');
const router = express.Router();

// post new review
router.post('/new-review', async (req, res) => {
    const { comment, rating, userId, productId } = req.body;
    let postedReview = {};

    try {
        if (comment || rating || userId || productId) {
            // CHECK IF THE REVIEW OF THE SAME USER EXISTS ON SAME POST
            const isExist = await Reviews.findOne({ userId, productId });
            // if exist update old review
            if (isExist) {
                isExist.comment = comment;
                isExist.rating = rating;
                await isExist.save();
                postedReview = isExist;
            }
            // if not exists create a new one
            else {
                const newReview = new Reviews({
                    comment, rating, userId, productId
                });
                await newReview.save();
                postedReview = newReview;
            }
            
            //    calculating the rating
            
            const reviews = await Reviews.find({ productId });
            
            if (reviews.length > 0) {
                const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
                const avgRating = totalRating / reviews.length;
                const product = await products.findById(productId);
                
                if (product) {
                    product.rating = avgRating;
                    await product.save({ validateBeforeSave: false });
                }
                else {
                    res.status(404).send({ message: "product for review not found" });
                }
            }
            
            res.status(200).json({ message: "review posted successfully", Review: postedReview })

        }
        else {
            res.status(501).send({ message: "all the data needed." })
        }

    } catch (error) {

        console.log(error);
        res.status(500).send({ message: "error posting new review", error: error.message });

    }
})

// count total reviews

router.get('/total-reviews', async(req, res) =>{
    try {
        const totalReviews = await Reviews.countDocuments({});
        res.status(200).send({count: totalReviews});
        
    } catch (error) {
        console.log(error);
        res.status(500).send({message : "error fetching total reviews count", error: error.message})
        
    }
} )


// get reviews by user

router.get('/:userId', async(req, res) =>{
    const {userId} = req.params;
    
    try {
        const reviews = await Reviews.find({userId})
        if(reviews.length === 0){
            res.status(200).json({message: "fetched reviews by user successfully", Reviews : reviews});
        }
        else{
            res.status(404).send({message : "n review found"});
        }

        
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "error getting reviews by userId", error: error.message});
    }
})


module.exports = router;