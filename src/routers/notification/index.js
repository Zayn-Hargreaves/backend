const express = require("express") 
const { asyncHandler } = require("../../helpers/asyncHandle")

const notificationController = require("../../controllers/notification.controller")
const router = express.Router()


router.get("", asyncHandler(notificationController.listNotiByUser))

module.exports = router
