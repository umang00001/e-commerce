const productModel = require("../models/product.model");
const fs = require("fs")
const slugify = require("slugify")
const braintree = require("braintree")
const dotEnv = require("dotenv")
const orderModel = require("../models/order.model")
const userModel = require("../models/user.model")
dotEnv.config({ path: "./config/config.env" });

// payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVET_KEY
});

// create product 
const createProductController = async (req, resp) => {
    try {
        const photo = req.file
        const { name, description, price, category, quantity } = req.body;
        switch (true) {
            case !name: return resp.status(500).send({
                error: "name is required"
            })
            case !description: return resp.status(500).send({
                error: "description is required"
            })
            case !price: return resp.status(500).send({
                error: "price is required"
            })
            case !category: return resp.status(500).send({
                error: "category is required"
            })
            case !quantity: return resp.status(500).send({
                error: "quantity is required"
            })
            case photo && photo.size > 1000000: return resp.status(500).send({ error: "photo is required and should be less than 1mb" })
        }
        const product = new productModel({ name, description, price, category, quantity, slug: slugify(name), photo: photo.filename })
        // if (photo) {
        //     product.photo.data = fs.readFileSync(photo.path);
        //     product.photo.contentType = photo.type
        // }
        await product.save()
        resp.status(201).send({
            success: true,
            message: "product created successfully",
            product
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: "error in creating product",
            error
        })
    }
}
//get image 
const getImageController = async (req, resp) => {
    try {
        const image = await productModel.findOne({ photo: req.params.image })
        resp.status(200).send({
            success: true,
            message: "find image successfully",
            image: image.photo
        })
    } catch (error) {
        resp.status(500).send({
            success: false,
            message: "something error while get image",
            error
        })
        console.log(error)
    }
}

//get all product 
const getAllProductController = async (req, resp) => {
    try {
        const products = await productModel
            .find({})
            .populate("category")
            .sort({ createdAt: -1 })

        resp.status(200).send({
            countProduct: products.length,
            success: true,
            message: "got all product",
            products
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            message: "error in get product ",
            success: false,
            error: error.message
        })
    }
}
//get single product
const getSingleProductController = async (req, resp) => {
    try {
        const product = await productModel.findOne({ _id: req.params.id }).populate("category")
        resp.status(200).send({
            success: true,
            message: "got single product",
            product
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            error,
            message: "error in geting single product"
        })
    }
}


//delete product
const deleteProductController = async (req, resp) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid)
        resp.status(200).send({
            success: true,
            message: "product Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            message: "error while deleting product",
            success: false,
            error
        })
    }
}

//update product
const updateProductController = async (req, resp) => {
    try {
        console.log(req.body)
        const { name, description, price, category, quantity } = req.body;
        const photo = req.file
        console.log(photo)
        switch (true) {
            case !name: return resp.status(500).send({
                error: "name is required"
            })
            case !description: return resp.status(500).send({
                error: "description is required"
            })
            case !price: return resp.status(500).send({
                error: "price is required"
            })
            case !category: return resp.status(500).send({
                error: "category is required"
            })
            case !quantity: return resp.status(500).send({
                error: "quantity is required"
            })
            case photo && photo.size > 1000000: return resp.status(500).send({ error: "photo is required and should be less than 1mb" })
        }
        const product = await productModel.findByIdAndUpdate(req.params.pid, { name, description, price, category, quantity, slug: slugify(name), photo: photo.filename }, { new: true })

        await product.save()
        resp.status(200).send({
            success: true,
            message: "product update successfully",
            product
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            message: "error while updating product",
            success: false,
            error
        })
    }
}
//filter product by price and category
const filterProductController = async (req, resp) => {
    try {
        const { radio, checked } = req.body
        let arg = {}
        if (checked.length > 0) arg.category = checked;
        if (radio.length) arg.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(arg)
        resp.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: "error  while filtering product",
            error
        })
    }
}

//product count
const productCountController = async (req, resp) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        resp.status(200).send({
            success: true,
            total

        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: "error while product count"
        })
    }
}
//product list 
const productListController = async (req, resp) => {
    try {
        const perPage = 3
        const page = req.params.page ? req.params.page : 1;
        const product = await productModel
            .find({})
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 })
        resp.status(200).send({
            success: true,
            product
        })
    } catch (error) {
        resp.status(500).send({
            success: false,
            message: "error while per page list",
            error
        })
    }
}
// search product
const searchProductController = async (req, resp) => {
    try {
        const { keyword } = req.params
        const result = await productModel.find({
            $or: [
                { name: { $regex: keyword } },
                { description: { $regex: keyword } }
            ]
        })
        resp.send({
            result
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: "error while searching product",
            error
        })
    }
}
//related product
const relatedProductConroller = async (req, resp) => {
    try {
        const { pid, cid } = req.params
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        })
            .limit(3)
            .populate("category")
        resp.status(200).send({
            success: true,
            message: "found related product successfully",
            products
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            message: "error while getting related product",
            success: false,
            error
        })
    }
}
//payment token 
const braintreeTokenController = async (req, resp) => {
    try {
        gateway.clientToken.generate({}, function (error, response) {
            if (error) {
                resp.status(500).send(error)
            } else {
                resp.send(response)
            }
        })
    } catch (error) {
        console.log(error)
    }
}
//payment
const braintreePaymentController = async (req, resp) => {
    try {
        const { cart, nonce, totalPrice } = req.body

        const newTransaction = gateway.transaction.sale({
            amount: totalPrice,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }

        },
            async function (error, result) {
                if (result) {
                    const order = await new orderModel({
                        products: cart,
                        payments: result,
                        buyers: req.user._id
                    }).save()
                    resp.status(200).send({
                        success: true,
                        order
                    })
                } else {
                    resp.status(500).send({
                        error,
                        success: false
                    })
                }
            }
        )
    } catch (error) {
        console.log(error)
    }
}
// create review
const createReviewController = async (req, resp) => {
    try {
        const { comment, rating, productId } = req.body
        const user = await userModel.findById(req.user._id).select("-password")
        const { name } = user
        const review = {
            name,
            rating,
            comment,
            user: req.user._id
        }
        const product = await productModel.findOne({ _id: productId })

        const isReview = product.reviews.filter((rev) => rev.user == req.user._id)

        if (isReview.length) {
            const index = product.reviews.findIndex((rev) => rev.user == req.user._id)
            product.reviews[index].rating = rating
            product.reviews[index].comment = comment
        } else {
            product.reviews.push(review)
            product.numOfReviews = product.reviews.length
        }
        if (product.reviews.length >= 1) {
            let avg = 0
            product.reviews.forEach((rev) => {
                avg = avg + rev.rating / product.reviews.length
            })
            product.productRating = avg
        }
        await product.save()
        resp.status(200).send({
            message: `Thank you ${name} For Your Review`,
            success: true
        })


    } catch (error) {
        console.log(error)
        resp.status(500).send({
            message: "error while submit review",
            error,
            success: false
        })
    }

}
// get all review
const getAllReviewController = async (req, resp) => {
    try {
        const product = await productModel.findOne({ _id: req.params.id })
        resp.status(200).send({
            success: true,
            message: "got all review",
            reviews: product.reviews
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            message: "error while getting review",
            success: false,
            error
        })
    }

}
//delete review
const deleteReviewController = async (req, resp) => {
    try {
        const { productId, userId } = req.body
        const product = await productModel.findOne({ _id: productId })
        const reviewindex = product.reviews.findIndex((rev) => rev.user == userId)
        product.reviews.splice(reviewindex, 1)
        let avrg = 0
        product.numOfReviews = product.reviews.length
        product.reviews.forEach((rev) => {
            avrg = avrg + rev.rating
        })
        product.productRating = avrg
        await product.save()
        resp.status(200).send({
            message: "review deleted successfully",
            success: true,
        })
    } catch (error) {
        resp.status(500).send({
            success: false,
            message: "error while delting review",
            error
        })
    }
}

module.exports = {
    relatedProductConroller,
    createProductController,
    getAllProductController,
    getSingleProductController,
    deleteProductController,
    updateProductController,
    filterProductController,
    productCountController,
    productListController,
    searchProductController,
    braintreeTokenController,
    braintreePaymentController,
    createReviewController,
    getAllReviewController,
    deleteReviewController,
    getImageController
}