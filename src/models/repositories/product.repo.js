const { Types } = require("mongoose")
const {product, electronic, clothing, furniture} = require("../product.model")
const { getSelectData, unGetSelectData, convertToObjectIdMongoDb } = require("../../utils")

const findAllDraftForShop = async({query, limit, skip})=>{
    return await queryProduct({query, limit, skip})
}
const findAllPublishForShop = async({query, limit, skip})=>{
    return await queryProduct({query, limit, skip})
}
const searchProductByUser = async({keySearch})=>{
    const regex = new RegExp(keySearch)
    const result = await product.find({
        isDraft:false,
        $text:{$search:regex},
    },{score:{$meta:'textScore'}})
    .sort({score:{$meta:'textScore'}})
    .lean()
    return result
}
const publishProductByShop = async({product_shop, product_id})=>{
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    })
    if(!foundShop){
        return null
    }
    foundShop.isDraft= false
    foundShop.isPublished = true
    const {modifiedCount} = await foundShop.update(foundShop)
    return modifiedCount
}
const unPublishProductByShop = async({product_shop, product_id})=>{
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    })
    if(!foundShop){
        return null
    }
    foundShop.isDraft= true
    foundShop.isPublished = false
    const {modifiedCount} = await foundShop.update(foundShop)
    return modifiedCount
}
const queryProduct = async ({query, limit, skip})=>{
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({updateAt:-1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const findAllProduct = async({limit, sort, page, filter, select})=>{
    const skip = (page-1) * limit;
    const sortBy = sort === "ctime" ? {_id:-1}:{_id:1}
    const product = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
}

const findProduct = async({product_id, unSelect})=>{
    return await product.findById(product_id).select(unGetSelectData(unSelect))
}
const updateProductbyId = async({
    productId, 
    payload,
    model, 
    isNew=true
})=>{
    return await model.findByIdAndUpdate(productId, payload,{
        new:isNew
    })
}
const getProductById = async(productId)=>{
    return await product.findOne({_id:convertToObjectIdMongoDb(productId)}).lean()
}
const checkProductByServer = async(products)=>{
    return await Promise.all(products.map(async product=>{
        const foundProduct= await getProductById(product.productId)
        if(foundProduct){
            return {
                price: foundProduct.product_price, 
                quantity:product.quantity,
                productId:product.productId
            }
        }
    }))
}
module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProduct, 
    findProduct,
    updateProductbyId,
    getProductById,
    checkProductByServer
}
// query đơn giản nhưng làm nhiều lần cho service class 