const {model,schema, Schema}= require("mongoose")
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Order";

const orderSchema = new Schema ({
    order_userId:{type :Number, required:true},
    order_checkout:{type:Object, default:{}},
    /*
        order_checkout={
            totalprice,
            totalApplyDiscount,
            feeShip,
        }
    */
   order_shiping:{type:Object, default:{}},
   /*
        street,
        city,
        state, 
        country,
   */
    order_payment:{type:Object, default:{}},
    order_product:{type:Array,require:true},//shop_order_id_new
    order_trackingNumber:{type:String, default:"#00000118052024"},
    order_status:{type:String, enum:['pending','confirmed','shipped', 'cancelled', 'delivered'], default:'pending'},

},{
    collection: COLLECTION_NAME,
    timestamps:{
        createdAt:'CreatedOn',
        updatedAt:'UpdatedOn'
    }
})

module.exports = {
    order:model(DOCUMENT_NAME, orderSchema)
}