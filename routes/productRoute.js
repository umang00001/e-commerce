
const express = require("express");
const { isAdmin, requireSign } = require("../middleware/authMiddleware");
const {
    createProductController,
    getAllProductController,
    deleteProductController,
    getSingleProductController,
    updateProductController,
    filterProductController,
    productCountController,
    productListController,
    searchProductController,
    relatedProductConroller,
    braintreeTokenController,
    braintreePaymentController,
    createReviewController,
    getAllReviewController,
    deleteReviewController,
    getImageController } = require("../controller/productController");

const formidble = require("express-formidable")
const multer = require("multer");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./upload")
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + "-" + file.originalname)
//     },

// })
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, "./upload")
//         },
//         filename: function (req, file, cb) {
//             cb(null, file.filename + "-" + Date.now() + ".jpg")
//         }
//     })

// }).single("photo")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/upload")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload = multer({
    storage: storage
}).single("photo")



const router = express.Router()


//create product
router.post("/create-product", requireSign, isAdmin, upload, createProductController);
//get product
router.get("/get-product", getAllProductController);
//get single product
router.get("/single-product/:id/:slug", getSingleProductController)
//get image
router.get("/get-image/:image", getImageController);

//delete product admin
router.delete("/delete-product/:pid", requireSign, isAdmin, deleteProductController)
//update product admin
router.post("/update-product/:pid", requireSign, isAdmin, upload, updateProductController)
//filter product
router.post("/filter-product", filterProductController);
// product count
router.get("/product-count", productCountController)
// product per page 
router.get("/product-list/:page", productListController);
//search product 
router.get("/search-product/:keyword", searchProductController)
//simalar product
router.get("/related-product/:pid/:cid", relatedProductConroller)

// payment route
//token
router.get("/braintree/token", braintreeTokenController);
//payment
router.post("/braintree/payment", requireSign, braintreePaymentController)

// create review 
router.post("/review", requireSign, createReviewController)
// get review
router.get("/all-review/:id", getAllReviewController)
//delete review
router.delete("/delete-review", deleteReviewController)
module.exports = router