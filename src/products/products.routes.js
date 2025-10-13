const express = require('express');
const router = express.Router();
const products = require('./products.model')
const Reviews = require('../reviews/reviews.models');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// POST NEW PRODUCTS

router.post('/new-product', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const newProduct = new products({
            ...req.body
        });

        const savedProduct = await newProduct.save();

        // caculate rating 

        const reviews = await Reviews.find({ productId: savedProduct._id });
        if (reviews.length > 0) {
            let rating = reviews.reduce((acc, review) => acc + review.rating, 0);
            let finalRating = rating / reviews.length;
            savedProduct.rating = finalRating;
            await savedProduct.save();
        }

        res.status(200).json({ message: "product created successfully", product: newProduct });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "error while posting new product", error: error.message })
    }
})

// GET ALL PRODUCTS (FILTERS)
router.get('/', async (req, res) => {

    try {
        const { category, color, minprice, maxprice, page = 1, limit = 10 } = req.query;

        const filter = {};

        if (category && category !== "all") {
            filter.category = category;
        }

        if (color && color !== "all") {
            filter.color = color;
        }

        if (minprice && maxprice) {
            const min = parseFloat(minprice);
            const max = parseFloat(maxprice);

            if (!isNaN(min) && !isNaN(max)) {
                filter.price = { $gte: min, $lte: max };
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalProducts = await products.countDocuments(filter);

        const totalPages = Math.ceil(totalProducts / parseInt(limit));

        const filteredProducts = await products.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('author', 'email')
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "all products retrieved successfully", count: totalProducts, products: filteredProducts, totalPages: totalPages })
    } catch (error) {
        console.log(error, error.message)
        res.status(500).json({ message: "error while getting all products", error: error.message });
    }
})

// GET SINGLE PRODUCT

router.get("/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const singleProduct = await products.findById(productId).populate('author', 'email username');
        const reviews = await Reviews.find({ productId }).populate('userId', 'username email')
        await singleProduct.save();
        if (singleProduct) {
            res.status(200).json({ message: "got the product successfully", product: singleProduct, reviews: reviews })
        } else {
            res.status(200).json({ message: "no product found" })
        }

    } catch (error) {
        res.status(500).send({ message: "error while getting single product", error: error.message });
    }
})


// update product

router.patch("/update-product/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = await products.findByIdAndUpdate(productId, { ...req.body }, { new: true });

        if (!updatedProduct) {
            res.status(200).json({ message: "no product found" })
        }
        console.log(updatedProduct);
        res.status(200).json({ message: "product updated successfully", product: updatedProduct })


    } catch (error) {
        res.status(500).json({ message: "error while updating product", error: error.message })
    }
})

// DELETE PRODUCT ROUTE

router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await products.findByIdAndDelete(productId);


        if (!deletedProduct) {
            res.status(200).send({ message: "no product found" });
        } else {
            res.status(200).send({ message: "product deleted successfully" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "error deleting product", error: error.message });

    }
})

// RELATED PRODUCTS

router.get('/related-products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const fetchedProduct = await products.findById(productId);
        if (!fetchedProduct) {
            res.status(404).send({ message: "no product found" });
        }
        else {
            const productCategory = fetchedProduct.category;
            const productColor = fetchedProduct.color;
            const filter = { category: productCategory, color: productColor };
            // get related products

            const relatedProducts = await products.find(filter);
            console.log(relatedProducts);

            if (!relatedProducts) {
                res.status(404).send({ message: "No related products " })
            }
            else {
                res.status(200).json({ message: "get related products successfully", count: relatedProducts.length, relatedProducts: relatedProducts })
            }

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error getting related products", error: error.message });
    }

})

module.exports = router;