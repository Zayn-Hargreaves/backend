const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

class cartService {
    static async createUserCart({ userId, product = {} }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addtoset: {
                    cart_products: product
                }
            },
            option = { upsert: true, new: true }
        return await cartModel.findOneAndUpdate(query, updateOrInsert, option)
    }
    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        },
            updateSet = {
                $inc: {
                    'cart_products.$.quantity': quantity
                }
            }, options = { upsert: true, new: true }
        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }
    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }
        const deleteCart = await cartModel.updateOne(query, updateSet)
        return deleteCart   
    }
    static async addToCart({ userId, product = {} }) {
        const userCart = await cartModel.findOne({
            cart_userId: userId
        })
        if (!userCart) {
            return await cartService.createUserCart({ userId, product })
        }
        if (userCart.cart_products.length > 0) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
        if (userCart) {
            return await cartService.updateUserCartQuantity({ userId, product })
        }
    }
        static async addToCartV2({ userId, product = {} }) {
            const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
            const foundProduct = await getProductById(productId)
            if (!foundProduct) {
                throw new NotFoundError("Product is not found")
            }
            if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
                throw new NotFoundError("Product do not belong to the shop")
            }
            if (quantity === 0) {
                return await cartService.deleteUserCart({
                    userId:userId,
                    productId:productId
                })
            }
            return await cartService.updateUserCartQuantity({
                userId: userId,
                prouduct: {
                    productId,
                    quantity: quantity - old_quantity
                }
            })
        }
    static async getListUserCart({userId}){
        return await cartModel.findOne({
            cart_userId:+userId
        }).lean()
    }
}
module.exports = cartService