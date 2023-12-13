const express = require("express");
const {
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
} = require("../controller/authController");
const { requireSign, isAdmin } = require("../middleware/authMiddleware")


//router object
const router = express.Router();

// routing

// Register || method post
router.post("/register", registerController);

//login || method post
router.post("/login", loginController)

// test
router.get("/test", requireSign, isAdmin, testController)

// protected route auth
router.get("/user-auth", requireSign, (req, resp) => {
    resp.status(200).send({ ok: true })
})
// forgot  password
router.post("/forgot-password", forgotPasswordController);
//update profile
router.put("/update-profile", requireSign, updateProfileController)
// get user orders
router.get("/orders", requireSign, getAllOrderController)
// get all orders
router.get("/all-orders", requireSign, isAdmin, getAllAdminOrdersController)
// order status
router.put("/order-status/:orderId", requireSign, isAdmin, updateStatusController);
// delete Order
router.delete("/delete-order/:orderId", requireSign, isAdmin, deleteOrderController)
// get all user 
router.get("/get-all-users", getAllUserController)
// delete user
router.delete("/delete-user", deleteUserController)
//update stock
router.put("/update-stock", updateStockController)
module.exports = router;
