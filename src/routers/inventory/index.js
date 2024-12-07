const express = require("express")
const { asyncHandler } = require("../../helpers/asyncHandle")
const inventoryController = require("../../controllers/inventory.controller")

const router = express.Router()
router.post("/",asyncHandler(inventoryController.addStockToInventory) )

module.exports = router
