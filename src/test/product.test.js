const RedisPubSubService = require("../services/PubSub.service")
class ProductTestService{
    purchaseProduct(productId, quantity){
        const order={
            productId, 
            quantity
        }
        RedisPubSubService.publish('purchase_events', JSON.stringify(order))
    }
}

module.exports = new ProductTestService()