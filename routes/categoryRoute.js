const { isAdmin, requireSign } = require("../middleware/authMiddleware")
const {
    createCategoryController,
    updateCategoryController,
    getAllCategoryController,
    deleteCategoryController,
    getSingleCategoryController
} = require("../controller/categotyController")


const express = require("express");

const router = express.Router();

//create categroy routes
router.post("/create-category", requireSign, isAdmin, createCategoryController)
// update category 
router.put("/update-category/:id", requireSign, isAdmin, updateCategoryController)

//delete category
router.delete("/delete-category/:id", requireSign, isAdmin, deleteCategoryController)

// all category 
router.get("/getcategory", getAllCategoryController)

// single category 
router.get("/single-category/:slug", getSingleCategoryController)

module.exports = router