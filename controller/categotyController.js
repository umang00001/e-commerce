const categoryModel = require("../models/category.model")
const slugify = require("slugify")

//create category controller

const createCategoryController = async (req, resp) => {
    try {
        const { name } = req.body
        if (!name) {
            return resp.status(404).send({
                message: "category name is require"
            });
        }
        const categoryExist = await categoryModel.findOne({ name })
        if (categoryExist) {
            return resp.status(200).send({
                success: false,
                message: "category already exist"
            })
        }
        const category = await new categoryModel({ name, slug: slugify(name) }).save()
        resp.status(201).send({
            success: true,
            message: "category created successfully",
            category
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            error,
            message: "error in category"
        })
    }
}

//update category controller
const updateCategoryController = async (req, resp) => {
    try {
        const { name } = req.body
        const { id } = req.params
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
        resp.status(200).send({
            success: true,
            message: "category update successfully",
            category
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: "error in category update",
            error
        })
    }
}
//delete category
const deleteCategoryController = async (req, resp) => {
    try {

        await categoryModel.deleteOne({ _id: req.params.id })
        resp.status(200).send({
            success: true,
            message: "category deleted successfully",
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: "error in delete category",
            error
        })
    }


}
// get all category 
const getAllCategoryController = async (req, resp) => {
    try {
        const category = await categoryModel.find({})
        resp.status(200).send({
            success: true,
            message: "get all category list",
            category
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: "error in get category",
            error
        })
    }
}
//get single category
const getSingleCategoryController = async (req, resp) => {
    try {
        const category = await categoryModel.find({ slug: req.params.slug })
        resp.status(200).send({
            message: "get single category",
            success: true,
            category
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: "error in get single category",
            error
        })
    }
}


module.exports = {
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
    getAllCategoryController,
    getSingleCategoryController
} 