const { SuccessResponse } = require("../core/success.response")
const discountService = require("../services/discount.service")

class DiscountController{
    createDiscountCode = async(req, res, next)=>{
        new SuccessResponse({
            message:"success code genertations",
            metadata: await discountService.createDiscountCode({
                ...req.body,
                shopId:req.use.userId
            })
        }).send(res)
    }
    getAllDiscountCodes = async(req, res, next)=>{
        new SuccessResponse({
            message:"success code found",
            metadata: await discountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId:req.user.userId
            })
        }).send(res)
    }
    getDiscountAmount = async(req, res, next)=>{
        new SuccessResponse({
            message:"successfull code found",
            metadata: await discountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }
    getAllDiscountCodesWithProduct = async(req, res, next)=>{
        new SuccessResponse({
            message:"success code found",
            metadata: await discountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res)
    }
}

module.exports = new DiscountController()   