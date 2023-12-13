const JWT = require("jsonwebtoken");
const userModel = require("../models/user.model");

// protect route by token 

const requireSign = async (req, resp, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.SECRETE_KEY);
        req.user = decode
        next();

    } catch (error) {
        console.log(error)
    }
};

//admin access
const isAdmin = async (req, resp, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (user.role !== 1) {
            return resp.status(404).send({
                success: false,
                message: "Un Authorized Access"
            });
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
        resp.status(401).send({
            success: false,
            error,
            message: "error in admin middlseware "
        })
    }
}



module.exports = { requireSign, isAdmin }