'use strict'
const mongoose = require("mongoose")
const inventoryModel = require("../inventory.model")
const { convertToObjectIdMongoDb } = require("../../utils")
const insertInventory = async({
    productId, shopId, stock, location = 'unknown'
}) =>{
    return await inventoryModel.create({
        inven_productId:productId,
        inven_shopId:shopId,
        inven_location:location,
        inven_stock:stock  
    })
}
const reservationInventory = async({productId, quantity, cartId})=>{
    const query = {
        inven_productId: convertToObjectIdMongoDb(productId),
        inven_stock: {$gte:quantity}
    },updateSet={
        $inc:{
            inven_stock:-quantity,
        },
        $push:{
            inven_reservation:{
                quantity,
                cartId, 
                createOn:new Date()
            }
        }
    }, option = {upsert :true, new:true}
    return await inventoryModel.updateOne(query, updateSet, option)
}
module.exports ={
    insertInventory,
    reservationInventory
}