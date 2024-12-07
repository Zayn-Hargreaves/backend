const express = require('express')
const DiscountController = require("../../controllers/discount.controller")
const { asyncHandler } = require('../../helpers/asyncHandle')
const { authentication } = require('../../auth/authUtils')
const router = express.Route()

router.post("/amount", asyncHandler(DiscountController.getAllDiscountCodes))
router.get("/list_product_code", asyncHandler(DiscountController.getAllDiscountCodesWithProduct))
router.use(authentication)
router.post('/', asyncHandler(DiscountController.createDiscountCode))
router.get('/', asyncHandler(DiscountController.getAllDiscountCodesWithProduct))

module.exports = router