const { NotFoundError, BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { accquireLock, releaseLock } = require("./redis.service");
const Order = require("../models/order.model")
class checkoutService{

    static async checkoutReview({
        cartId, userId, shop_order_ids
    }){
        const foundCart = await findCartById({cartId})
        if(!foundCart){
            throw new NotFoundError("Cart does not exist")
        }
        const checkout_order = {
            totalPrice:0,
            feeShip:0,
            totalDiscount:0,
            totalCheckout:0
        },shop_order_ids_new = []
        for (let index = 0; index < shop_order_ids.length; index++) {
            const {shopId, shop_discount =[], item_products = [] } = shop_order_ids[i]
            const checkProductServer = await checkProductByServer(item_products)
            console.log("checkProductServer", checkProductServer)
            if(!checkProductServer[0]){
                throw new BadRequestError("order wrong!!")
            }
            const checkoutPrice= checkProductServer.reduce((acc, product)=>{
            return acc + (product.quantity*product.price)
            }, 0)
            checkout_order.totalPrice += checkoutPrice
            const itemCheckout = {
                shopId, 
                shop_discount,
                priceRaw:checkoutPrice,
                priceApplyDiscount:checkoutPrice,
                item_products:checkProductServer
            } 
            if(shop_discount.length>0){
                const {totalPrice = 0, discount = 0} = await getDiscountAmount({
                    codeId:shop_discount[0].codeId,
                    userId,
                    shopId,
                    product:checkProductServer
                })
                checkout_order.totalDiscount += discount
                if(discount >0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
    static async orderByUser({
        shop_order_ids_new, 
        cartId,
        userId,
        user_address={},
        user_payment={}
    }){
        const {shop_order_ids_new, checkout_order} = await checkoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids:shop_order_ids_new,
        })
        const products = shop_order_ids_new.flatMap( order=>order.item_products)
        const accquireProduct = [];
        for (let i = 0; i < products.length; i++) {
            const {productId, quantity} = products[i];
            // khóa bi quan, khóa lạc quan vid 26
            const keyLock = await accquireLock(productId, quantity, cartId)
            accquireProduct.push(keyLock ? true: false);
            if(keyLock){
                await releaseLock(keyLock)
            }
            // tạm gâc lại để học về redis
        }
        if(accquireProduct.includes(false)){
            throw new BadRequestError("Mot so san pham da duoc cap nhat, vui long quay lai gio hang")
        }
        const newOrder = await Order.create({
            order_userId:userId,
            order_checkout:checkout_order,
            order_shipping:user_address,
            order_payment:user_payment,
            order_product:shop_order_ids_new
        })
        if(!(newOrder)){
             //remove product in cart
        }
        return newOrder
    }
    /*
        query order user
    */
    static async getOrdersByUser(){

    }

    /*
        query order using id[user]
    */
   static async getOneOrderByUser(){

   }

   /*
        cancel order
   */
    static async cancelOrderByUser(){

    }
    /*
        update order status 
    */
    static async getOrdersByUser(){

    }
    // update by admin or shop kiểu pending,cancelled ....
    static async updateOrderStatusByShop(){

    }
}
module.exports = checkoutService