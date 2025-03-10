const { BadRequestError } = require("../core/error.response");
const {inventory} = require("../models/inventory.model")

const getProductById = require("../models/repositories/product.repo")

class inventoryService{
    static async addStockToInventory({
        stock,
        productId, 
        shopId, 
        location
    }){
        const product = await getProductById(productId);
        if(!product) throw new BadRequestError("the product is not exists")
        const query = {inven_shopID:shopId, inven_productId:productId},
        updateSet={
            $inc:{
                inven_stock :stock
            },
            $set:{
                inven_location:location
            }
        },options = {upsert:true, new:true}
        return await inventory.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = inventoryService;