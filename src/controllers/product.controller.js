const { SuccessResponse } = require("../core/success.response")
const ProductService = require("../services/product.service")
class productController{
    createProduct = async(req, res,next)=>{
        new SuccessResponse({
            message:'Create new product success',
            metadata: await ProductService.createProduct(req.body.product_type,{
                ...req.body,
                product_shop:req.user.userId
            })
        }).send(res)
    }

        publishProductByShop = async(req, res, next)=>{
        new SuccessResponse({
            message:'Publish product by shop success',
            metadata: await ProductService.publishProductByShop({
                product_id:req.params.id,
                product_shop:req.user.userId
            })
        }).send(res)
    }
    unPublishProductByShop = async(req, res, next)=>{
        new SuccessResponse({
            message:'Unpublish product by shop success',
            metadata: await ProductService.unPublishProductByShop({
                product_id:req.params.id,
                product_shop:req.user.userId
            })
        }).send(res)
    }
    // query
    /**
     * @desc get all draft for shop
     * @param {number} limit 
     * @param {Number} skip 
     * @return {JSON} next 
     */
    getAllDraftsForShop = async(req, res, next)=>{
        new SuccessResponse({
            message:'Get list product',
            metadata:await ProductService.findAllDraftForShop({
                product_shop:req.user.userId
            }).send(res)
        })
    }
    getAllPublishForShop=async(req, res, next)=>{
        new SuccessResponse({
            message:'Get list product',
            metadata:await ProductService.findAllPublishForShop({
                product_shop:req.user.userId
            }).send(res)
        })
    }
    getListSearchProduct=async(req, res, next)=>{
        new SuccessResponse({
            message:'Get list product',
            metadata:await ProductService.searchProduct(req.params)
            .send(res)
        })
    }
    findAllProduct = async(req,res, next)=>{
        new SuccessResponse({
            message:'Get list product',
            metadata:await ProductService.findAllProduct(req.query)
            .send(res)
        })  
    }
    findProduct = async(req,res, next)=>{
        new SuccessResponse({
            message:'Get product',
            metadata:await ProductService.findProduct({
                product_id:req.params.product_id
            })
            .send(res)
        })
    }
    updateProduct = async(req, res, next)=>{
        new SuccessResponse({
            message:'Update product success',
            metadata:await ProductService.updateProduct(req.body.product_type,req.params.productId,{
                ...req.body,
                product_shop:req.user.userId
            })
            .send(res)
        })
    }
}
module.exports = new productController()