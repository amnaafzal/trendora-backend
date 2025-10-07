const express = require('express');
const router = express.Router();
const products = require('./products.model')
const Reviews = require('../reviews/reviews.models')

router.post('/new-product', async (req, res) => {
    try {
        const newProduct = new products({
            ...req.body
        });

        const savedProduct = await newProduct.save();

        // caculate rating 

        const reviews = await Reviews.find({ productId: savedProduct._id });
        let rating = reviews.reduce((acc, review) => acc + review.rating, 0);
        let finalRating = rating / reviews.length;
        savedProduct.rating = finalRating;
        await savedProduct.save();

        res.status(200).json({ message: "product created successfully", product: newProduct });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.get('/', async(req, res) => {

    try {
        const { category, color, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

        const filter = {};

        if (category && category !== "all") {
            filter.category = category;
        }

        if (color && color !== "all") {
            filter.color = color;
        }

        if (minPrice && maxPrice) {
            const min = parseFloat(minPrice);
            const max = parseFloat(maxPrice);

            if (!NaN(min) && !NaN(max)) {
                filter.price = { $gte: max, $lte: min };
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalProducts = await products.countDocuments(filter);

        const totalPages = Math.ceil(totalProducts / parseInt(limit));

        const filteredProducts =await products.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('author', 'email')
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "all products retrieved successfully", products: filteredProducts })
    } catch (error) {
        console.log(error, error.message)
        res.status(500).json({message: error.message});
    }
})



module.exports = router;