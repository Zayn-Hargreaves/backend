const {model, Schema, Types} = require("mongoose");
const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';
const cartSchema = new Schema({
    cart_state:{
        type:String, require:true,
        enum:['active', 'completed', 'failed', "pending"],
        default:'active'
    },
    cart_products:{
        type:Array, require:true, default:[],
    },
    cart_count_product: {type:Number, default:0},
    cart_userId:{type:Number, require:true}
},{
    timestamps:true,
    collection:COLLECTION_NAME,
})

module.exports = model(DOCUMENT_NAME, cartSchema)