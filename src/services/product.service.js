const { BadRequestError } = require("../core/error.response");
const {product, clothing, electronic, furniture} = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { findAllDraftForShop, publishProductByShop,findAllPublishForShop, searchProductByUser, findAllProduct, findProduct, updateProductbyId } = require("../models/repositories/product.repo");
const { removeUndefinedCheck, updateNestedObjectParser } = require("../utils");
const notificationService = require("./notification.service");
const productSchema = require("./product.config")
class productFactory {
    static productRegistry = {}
    static registerProductType(type, classRef){
        productFactory.productRegistry[type] = classRef
    }
    static async createProduct(type, payload){
        const productClass = productFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Error: Invalid Product Types ${type}`)
        return new productClass(payload).createProduct()
    }
    static async updateProduct(type, productId,payload){
        const productClass = productFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Error: Invalid Product Types ${type}`)
        return new productClass(payload).updateProduct(productId)
    }
    //put
    static async publishProductByShop({product_shop, product_id}){
        return await publishProductByShop({product_shop, product_id})
    }
    static async unPublishProductByShop({product_shop, product_id}){
        return await unPublishProductByShop({product_shop, product_id})
    }
    //query
    static async findAllDraftForShop({product_shop, limit=50, skip= 0}){
        const query = {product_shop, isDraft:true} 
        return await findAllDraftForShop({query, limit, skip})
    }
    static async findAllPublishForShop({product_shop, limit=50, skip= 0}){
        const query = {product_shop, isPublished:true} 
        return await findAllPublishForShop({query, limit, skip})
    }

    static async searchProduct({keySearch}){
        return await searchProductByUser({keySearch})
    }
    static async findAllProduct({limit=50, sort = 'ctime', page = 1, filter={isPublished:true}}){
        return await findAllProduct({limit, sort, page, select:['product_name' ,'product_price','product_thumb',"product_shop"]})
    }
    static async findProduct({product_id}){
        return await findProduct({product_id, unSelect:['__v']})
    }
}

class Product{
    constructor({
        product_name, product_thumb, product_description, product_price, product_type, product_shop, product_attributes, product_quantity
    }){
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description
        this.product_price = product_price
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
        this.product_quantity =product_quantity
    }
    async createProduct (product_id){
        const newProduct =  await product.create({...this, _id:product_id})
        if(newProduct){
            await insertInventory({
                productId:newProduct._id,
                shopId:this.product_shop,
                stock:this.product_quantity
            })
            notificationService.pushNotiToSystem({
                type:"SHOP-001",
                receivedId:1,
                senderId:this.product_shop,
                options:{
                    product_name:this.product_name,
                    shop_name:TouchList.product_shop
                }
            }).then(rs=>console.log(rs))
            .catch(console.error)
        }
        return newProduct
    }
    async updateProduct({productId,payload}){
        return await updateProductbyId({productId,payload,model:product})
    }
}

class Clothing extends Product{
    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop:this.product_shop
        })
        if(!newClothing) throw new BadRequestError('create new Clothing error')
        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError("create new Product error")
        return newProduct
    }
    async updateProduct(productId){
        const objectParams = removeUndefinedCheck(this)

        if(objectParams.product_attributes){
            await updateProductbyId({productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),model:clothing})
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
} 

class Electronics extends Product{
    async createProduct(){
        const newElectronics = await electronic.create({
            ...this.product_attributes,
            product_shop:this.product_shop
        })
        if(!newElectronics) throw new BadRequestError('create new Clothing error')
        const newProduct = await super.createProduct(newElectronics._id)
        if(!newProduct) throw new BadRequestError("create new Product error")
        return newProduct
    }
    async updateProduct(productId){
        const objectParams = removeUndefinedCheck(this)

        if(objectParams.product_attributes){
            await updateProductbyId({productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),model:electronic})
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
    
} 
class Furniture extends Product{
    async createProduct(){
        const newFurnitures = await furniture.create({
            ...this.product_attributes,
            product_shop:this.product_shop
        })
        if(!newFurnitures) throw new BadRequestError('create new Funiture error')
        const newProduct = await super.createProduct(newFurnitures._id)
        if(!newProduct) throw new BadRequestError("create new Product error")
        return newProduct
    }
    async updateProduct(productId){
        const objectParams = removeUndefinedCheck(this)

        if(objectParams.product_attributes){
            await updateProductbyId({productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),model:furniture})
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
} 
Object.entries(productSchema).forEach(([type, schema]) => {
    productFactory.registerProductType(type, schema)    
});

module.exports = productFactory 