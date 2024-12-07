const { SuccessResponse } = require("../core/success.response")
const {createComment, getCommentsByParentId, deleteComments} = require("../services/comment.service")

class CommentController{
    createComment = async(req, res, next)=>{
        new SuccessResponse({
            message:"Create new comment",
            metadata: await createComment(req.body)
        }).send(res)
    }
    getCommentsByParentId = async(req, res, next)=>{
        new SuccessResponse({
            message:"get all comment successfully",
            metadata: await getCommentsByParentId(req.query),
        }).send(res)
    }
    deleteComment = async(req,res,next)=>{
        new SuccessResponse({
            message:"delete Comment successfull",
            metadata: await deleteComments(req.body)
        })
    }
}

module.exports = new CommentController()