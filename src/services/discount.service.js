const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const { findAllProduct } = require("../models/repositories/product.repo");
const { convertToObjectIdMongoDb, removeUndefinedCheck } = require("../utils");
const {findAllDiscountCodesUnselect,findAllDiscountCodesSelect, checkDiscountExists} = require("../models/repositories/discount.repo")
class DiscountBuilder {
    constructor(code, shopId) {
        this.discount = {
            discount_code: code,
            discount_shopId: shopId,
        };
    }

    setName(name) {
        this.discount.discount_name = name;
        return this;
    }

    setDescription(description) {
        this.discount.discount_description = description;
        return this;
    }

    setType(type) {
        this.discount.discount_type = type;
        return this;
    }

    setValue(value) {
        this.discount.discount_value = value;
        return this;
    }

    setDateRange(startDate, endDate) {
        this.discount.discount_start_date = new Date(startDate);
        this.discount.discount_end_date = new Date(endDate);
        return this;
    }

    setMinOrderValue(minOrderValue) {
        this.discount.discount_min_order_value = minOrderValue || 0;
        return this;
    }

    setMaxValue(maxValue) {
        this.discount.discount_max_value = maxValue;
        return this;
    }

    setMaxUses(maxUses) {
        this.discount.discount_max_uses = maxUses;
        return this;
    }

    setMaxUsesPerUser(maxUsesPerUser) {
        this.discount.discount_max_uses_per_user = maxUsesPerUser;
        return this;
    }

    setIsActive(isActive) {
        this.discount.discount_is_active = isActive;
        return this;
    }

    setAppliesTo(appliesTo, productIds) {
        this.discount.discount_applies_to = appliesTo;
        this.discount.discount_product_ids = appliesTo === 'all' ? [] : productIds;
        return this;
    }
    setUsesCount(uses_count){
        this.discount.discount_users_count = uses_count
        return this
    }
    setUsersUsed(users_used){
        this.discount.discount_users_used = users_used
    }
    build() {
        return this.discount;
    }
}


class discountService {
    static async createDiscountCode(payload) {
        const { code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, uses_count, max_uses_per_user, max_uses, users_used } = payload;

        // Kiểm tra ngày hợp lệ
        if (!start_date || !end_date) {
            throw new BadRequestError("Start date and end date are required!");
        }

        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError("Discount code has expired!");
        }

        if (new Date(start_date) > new Date(end_date)) {
            throw new BadRequestError("Start date must be before end date");
        }

        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongoDb(shopId)
        }).lean();

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new NotFoundError("Discount exists");
        }


        const newDiscount = new DiscountBuilder(code, shopId)
        .setName(name)
        .setDescription(description)
        .setType(type)
        .setValue(value)
        .setDateRange(start_date, end_date)
        .setMinOrderValue(min_order_value)
        .setMaxValue(max_value)
        .setMaxUses(max_uses)
        .setMaxUsesPerUser(max_uses_per_user)
        .setIsActive(is_active)
        .setAppliesTo(applies_to, product_ids)
        .setUsesCount(uses_count)
        .setUsersUsed(users_used)
        .build();

    return await discountModel.create(newDiscount);
    }

    static async updateDiscountCode(discountId, payload) {
        const { code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, uses_count, max_uses_per_user, max_uses, users_used } = payload;

        if (!start_date || !end_date) {
            throw new BadRequestError("Start date and end date are required!");
        }

        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError("Discount code has expired!");
        }

        if (new Date(start_date) > new Date(end_date)) {
            throw new BadRequestError("Start date must be before end date");
        }

        const updatedDiscount = await discountModel.findByIdAndUpdate(
            discountId,
            {
                discount_code: code,
                discount_start_date: new Date(start_date),
                discount_end_date: new Date(end_date),
                discount_is_active: is_active,
                discount_min_order_value: min_order_value || 0,
                discount_product_ids: applies_to === 'all' ? [] : product_ids,
                discount_name: name,
                discount_description: description,
                discount_type: type,
                discount_value: value,
                discount_max_value: max_value,
                discount_max_uses: max_uses,
            },
            { new: true }
        );

        if (!updatedDiscount) throw new BadRequestError("Discount code not found or update failed");

        return updatedDiscount;
    }
    static async getAllDiscountCodesWithProduct({
        code, shopId, userId, limit, page
    }) {
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongoDb(shopId)
        }).lean();

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new NotFoundError("Discount exists");
        }
        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === "all") {
            products = await findAllProduct({
                filter: {
                    product_shop: convertToObjectIdMongoDb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to === "specific") {
            products = await findAllProduct({
                filter: {
                    _id: {$in:discount_product_ids},
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }
    static async getAllDiscountCodesByShop({
        limit, page, shopId
    }){
        const discount = await findAllDiscountCodesUnselect({
            limit:+limit,
            page:+page,
            filter:{
                discount_shopId:convertToObjectIdMongoDb(shopId),
                discount_is_active:true
            },
            unSelect:['__v', 'discount_shopId'],
            model:discount
        })
        return discount
    }
    static async getDiscountAmount({codeId, userId, shopId, products}){
        const foundDiscount = await checkDiscountExists({
            model:discount,
            filter:{
                discount_code:codeId,
                discount_shopId:convertToObjectIdMongoDb(shopId)
            }
        })
        if(!foundDiscount){
            throw new NotFoundError("discount doesn't exist")
        }
        const{
            discount_is_active,
            discount_max_uses,
            discount_users_used,
            discount_start_date,
            discount_end_date,
            discount_type,
            discount_value,
            discount_max_uses_per_user
        }=foundDiscount
        if(!discount_is_active) throw new NotFoundError('discount expired')
        if(!discount_max_uses) throw new NotFoundError('discount are out')
        if(new Date() < new Date(discount_start_date ) || new Date() > new Date(discount_end_date)){
            throw new NotFoundError("discount code has expired")
        }
        let totalOrder = 0
        if(discount_min_order_value>0){
            totalOrder = products.reduce((acc, product)=>{
                return acc+ (product.quantity* product.price)
            })
            if(totalOrder < discount_min_order_value){
                throw new NotFoundError(`discount requires a minium of ${discount_min_order_value}`)
            }
        }
        if(discount_max_uses_per_user >0){
            const userUseDiscount = discount_users_used.find(user=>userId === userId)
            if(userUseDiscount){
                throw new NotFoundError("User had already used this discount code")
            }
        }
        const amount = discount_type ==="fixed_amount" ? discount_value : totalOrder * (discount_value/100)
        return {
            totalOrder,
            discount:amount,
            totalPrice:totalOrder- amount
        }
    }
    static async deleteDiscountCode ({shopId, codeId}){
        const deleted = await discountModel.findOneAndDelete({
            discount_code:codeId,
            discount_shopId:convertToObjectIdMongoDb(shopId)
        })
        return deleted
    }
    static async cancelDiscountCode({ codeId, shopId, userId }) {
        // Kiểm tra xem mã giảm giá có tồn tại không
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongoDb(shopId)
            }
        });
    
        if (!foundDiscount) {
            throw new NotFoundError("Discount doesn't exist");
        }
    
        const result = await discountModel.findByIdAndUpdate(
            foundDiscount._id,
            {
                $pull: {
                    discount_users_used: userId, 
                },
                $inc: {
                    discount_max_uses: 1,
                    discount_user_userd:-1,
                }
            },
            { new: true } 
        );
    
        if (!result) {
            throw new BadRequestError("Failed to cancel discount code");
        }
    
        return result; 
    }
}

module.exports = discountService;
