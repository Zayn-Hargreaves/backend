const { SuccessResponse } = require("../core/success.response")
const inventoryService = require("../services/inventory.service")

class inventoryController{
        addStockToInventory = async(req,res,next)=>{
        new SuccessResponse({
            message:"add stock to inventory successfull",
            metadata: await inventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}
module.exports = new inventoryController()