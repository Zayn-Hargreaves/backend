const express = require("express") 
const { asyncHandler } = require("../../helpers/asyncHandle")
const commentController = require("../../controllers/comment.controller")
const router = express.Router()

router.post("", asyncHandler(commentController.createComment))
router.get("", asyncHandler(commentController.getCommentsByParentId))
router.delete("", asyncHandler(commentController.deleteComment))
module.exports = router
