const { SuccessResponse } = require("../core/success.response")
const checkoutService = require("../services/checkout.service")

class checkoutController{
        checkoutReview = async(req,res,next)=>{
        new SuccessResponse({
            message:"Create Cart Success",
            metadata: await checkoutService.checkoutReview(req.body)
        })
    }
}
module.exports = new checkoutController()