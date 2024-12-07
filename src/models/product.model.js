const { text } = require("express")
const {model, Schema}= require("mongoose")
const slugify = require("slugify")
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema ({
    product_name:{type:String, require:true},
    product_thumb:{type:String, require:true},
    product_description:String,
    product_slug:String,
    product_price:{type:Number, require:true},
    product_quantity:{type:Number, require:true},
    product_type:{type:String, require:true,enum:['Electronics', 'Clothing','Furniture']},
    product_shop:{type:Schema.Types.ObjectId, require:true,ref:'Shop'},
    product_attributes:{type:Schema.Types.Mixed, require:true},
    product_ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1, 'Rating must be above 1.0'],
        max:[5, 'Rating must be above 5.0'],
        set:(val)=>{
            Math.round(val * 10) /10
        }
    },
    product_variation:{type:Array, default:[]},
    isDraft:{type:Boolean, default:true, index:true, select:false},
    isPublished:{type:Boolean, default:false, index:true, select:false}
},{
    collection:COLLECTION_NAME,
    timestamps:true
})
productSchema.index({product_name:'text', product_description : 'text'})
productSchema.pre("save", function(next){
    this.product_slug = slugify(this.product_name,{lower:true})
    next()
})

const clothingSchema = new Schema({
    brand:{type:String, require:true},
    size:String,
    material:String
},{
    collection:'clothes',
    timestamps:true
})
const electronicSchema = new Schema({
    manufacturer:{type:String, require:true},
    model:String,
    color:String,
},{
    collection:'electronics',
    timestamps:true
})
const furnitureSchema = new Schema({
    manufacturer:{type:String, require:true},
    model:String,
    color:String,
},{
    collection:'furnitures',
    timestamps:true
})
module.exports = {
    product:model(DOCUMENT_NAME, productSchema),
    electronic:model("Electronics", electronicSchema),
    clothing:model("Clothing", clothingSchema),
    furniture:model("Furniture", furnitureSchema)
}