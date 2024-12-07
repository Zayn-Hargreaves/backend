const express = require("express")
const { authentication } = require("../../auth/authUtils")
const { asyncHandler } = require("../../helpers/asyncHandle")
const productContrller = require("../../controllers/product.controller")
const router = express.Router()
router.get("/search/:keySearch", asyncHandler(productContrller.getListSearchProduct))
router.get("/", asyncHandler(productContrller.findAllProduct))
router.get("/:product_id", asyncHandler(productContrller.findProduct))
//authentication
router.use(authentication)
router.post("/", asyncHandler(productContrller.createProduct))
router.patch("/:productId", asyncHandler(productContrller.updateProduct))
router.post("/publish/:id", asyncHandler(productContrller.publishProductByShop))
router.post("/unpublish/:id", asyncHandler(productContrller.unPublishProductByShop ))
// query
router.get("/drafts/all", asyncHandler(productContrller.getAllDraftsForShop))
router.get("/published/all", asyncHandler(productContrller.getAllPublishForShop))
module.exports = router