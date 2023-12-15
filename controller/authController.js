const userModel = require("../models/user.model");
const authHelper = require("../helper/auth.Heper");
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const JWT = require("jsonwebtoken")
//register 
const registerController = async (req, resp) => {
    try {
        const { name, phone, address, password, email, answer } = req.body;
        if (!name) {
            resp.send({ message: "name is required" });
        }
        if (!phone) {
            resp.send({ message: "phone is required" });
        }
        if (!address) {
            resp.send({ message: "address is required" });
        }
        if (!password) {
            resp.send({ message: "password is " });
        }
        if (!email) {
            resp.send({ message: "email is required" });
        }

        const existingUser = await userModel.findOne({ email });
        //existing user ?
        if (existingUser) {
            return resp.status(200).send({
                success: false,
                message: "user already exist "
            });
        }

        //register user 

        //hash password
        const hashedPassword = await authHelper.hashPassword(password);
        const user = new userModel({ name, email, phone, address, password: hashedPassword, answer });
        const response = await user.save();

        resp.status(201).send({
            success: true,
            message: "registration success",
            user: response
        })

    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            message: "error in registration",
            error,
        });
    }
};

//login
const loginController = async (req, resp) => {
    try {
        const { email, password } = req.body;
        // validation
        if (!email || !password) {
            return resp.status(404).send({
                success: false,
                message: "password or email required "
            })
        };
        const user = await userModel.findOne({ email })
        if (!user) {
            return resp.status(404).send({
                success: false,
                message: "user not found"
            })
        }
        //matching password
        const match = await authHelper.comparePassword(password, user.password)
        if (!match) {
            return resp.status(200).send({
                success: false,
                message: "password  not match"
            })
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.SECRETE_KEY, { expiresIn: "7d" });

        resp.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: "log in failed",
            error
        })
    }
}
// test controller 
const testController = (req, resp) => {
    resp.send("test protected router")
}
// forgot password
const forgotPasswordController = async (req, resp) => {
    try {
        const { email, answer, newPassword } = req.body

        if (!email) {
            resp.status(400).send({
                message: "email is required"
            })
        }
        if (!answer) {
            resp.status(400).send({
                message: "answer is required"
            })
        }
        if (!newPassword) {
            resp.status(400).send({
                message: "newPassword is required"
            })
        }

        const user = await userModel.findOne({ email, answer });
        if (!user) {
            return resp.status(404).send({ success: false, message: "answer or email is wrong" })
        }
        const hash = await authHelper.hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hash })
        resp.status(200).send({
            success: true,
            message: "password reset successfully"
        })
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            error,
            success: false,
            message: "something went wrong"
        })
    }
}
// update Profile 
const updateProfileController = async (req, resp) => {
    const existData = await userModel.findById(req.user._id)
    try {
        let { email, name, password, address, phone } = req.body
        if (password) {
            password = await authHelper.hashPassword(password)
        }
        const user = await userModel.findByIdAndUpdate(req.user._id,
            {
                email: email,
                name: name,
                password: password ? password : existData.password,
                address: address,
                phone: phone

            })
        resp.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            email, name, password, address, phone


        })
    } catch (error) {
        resp.status(500).send({
            success: false,
            message: "error while updating profile",
            error
        })
        console.log(error)
    }
}

//user orders
const getAllOrderController = async (req, resp) => {
    try {
        const orders = await orderModel.find({ buyers: req.user._id })
            .populate("products", "-photo")
            .populate("buyers", "name")
            .sort({ createdAt: -1 })
        resp.status(200).send({
            message: "get all order successfully",
            orders,
            success: true
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            message: "error while getting orders",
            error,
            success: false
        })
    }
}
// get all order 
const getAllAdminOrdersController = async (req, resp) => {
    try {
        const orders = await orderModel.find().populate("products", "-photo").populate("buyers", "name").sort({ createdAt: -1 })

        resp.status(200).send({
            message: "get all order successfully",
            orders,
            success: true
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            message: "error while getting admin orders",
            error,
            success: false
        })
    }
}
// delete order
const deleteOrderController = async (req, resp) => {
    try {
        const result = await orderModel.deleteOne({ _id: req.params.orderId })
        resp.status(200).send({
            message: "order deleted successfully",
            success: true
        })
    } catch (error) {
        resp.status(500).send({
            success: false,
            message: "error while deleting order",
            error
        })
        console.log(error)
    }
}
// update status
const updateStatusController = async (req, resp) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(orderId, { status })

        const result = await
            resp.status(200).send({
                status: status,
                success: true,
                message: "status and stock updated"
            })
    } catch (error) {
        resp.status(500).send({
            message: "error while updating status",
            error,
            success: false
        })
        console.log(error)
    }
}
// update sotck
const updateStockController = (req, resp) => {
    try {
        const { products } = req.body
        const updateStock = products.filter(async (p) => {
            const databaseProduct = await productModel.findOne({ _id: p._id })
            let update = await productModel.updateOne({ _id: p._id }, { $set: { quantity: databaseProduct.quantity - p.Qty } })
        })
        resp.status(200).send({
            message: "Stock Updated Successfull",
            success: true
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            message: "error while stock update",
            success: false, error
        })
    }
}
// get all users
const getAllUserController = async (req, resp) => {
    try {
        const users = await userModel.find({});
        resp.status(200).send({
            success: true,
            message: "get all users",
            users
        })
    } catch (error) {
        resp.status(500).send({
            success: false,
            message: "error while get all users",
            error
        })
    }
}
// delete user
const deleteUserController = async (req, resp) => {
    try {
        const { userId } = req.body
        const result = await userModel.findByIdAndDelete(userId);
        resp.status(200).send({
            message: "User Deleted Successfully",
            success: true
        })

    } catch (error) {
        resp.status(500).send({
            message: "error while deleting users",
            success: false,
            error
        })
    }
}
module.exports = {
    registerController,
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController,
    getAllOrderController,
    getAllAdminOrdersController,
    updateStatusController,
    getAllUserController,
    deleteUserController,
    deleteOrderController,
    updateStockController
};
