const RedisPubSubService = require("../services/PubSub.service")
class InventoryServiceTest{
    constructor(){
        RedisPubSubService.subscribe('purchase_events', (channel, message)=>{
            InventoryServiceTest.updateInventory(message)
        })
    }
    static updateInventory({productId, quantity}){
        console.log(`Updated inventory ${productId} with ${quantity}`)
    }
}

module.exports = new InventoryServiceTest();