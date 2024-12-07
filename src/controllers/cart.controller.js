const { SuccessResponse } = require("../core/success.response")
const cartService = require("../services/cart.service")

class cartController{
    addToCart = async(req,res,next)=>{
        new SuccessResponse({
            message:"Create new cart successfully",
            metadata:await cartService.addToCart(req.body)
        }).send(res)
    }
    update = async(req,res, next)=>{
        new SuccessResponse({
            message:"Update cart successfully",
            metadata:await cartService.addToCartV2(req.body)
        }).send(res)
    }
    delete= async(req, res, next)=>{
        new SuccessResponse({
            message:"Delete cart successfully",
            metadata:await cartService.deleteUserCart(req.body)
        }).send(res)
    }
    listToCart = async(req, res, next)=>{
        new SuccessResponse({
            message:"List cart successfully",
            metadata:await cartService.getListUserCart(req.body)
        }).send(res)
    }
}

module.exports = new cartController()