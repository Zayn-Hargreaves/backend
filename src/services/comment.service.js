const { NotFoundError } = require("../core/error.response")
const Comment = require("../models/comment.model")
const { convertToObjectIdMongoDb } = require("../utils")
const { findProduct } = require("./product.service")

/*
    add comment[user, shop]
    get list of comment [User, Shop]
    delete a comment [Shop, user, admin]
*/

class CommentService{
    static async createComment({
        productId, UserId, content, parentCommentId = null
    }){
        const comment = new Comment({
            comment_productId:productId,
            comment_userId:UserId,
            comment_content:content,
            comment_parentId:parentCommentId
        })
        let rightVal
        if(parentCommentId){
            //reply comment
            const parentComment = await Comment.findById(parentCommentId)
            if(!parentComment) throw new NotFoundError("Parent Comment is not found");
            rightVal = parentComment.comment_right
            //update many comment
            await Comment.updateMany({
                comment_productId: convertToObjectIdMongoDb(productId),
                comment_left: {$gte : rightVal},
            },{
                $inc:{comment_left :2 },
            })

        }else{
            const maxRight = await Comment.findOne({
                comment_productId: convertToObjectIdMongoDb(productId)

            },'comment_right', {sort:{comment_right:-1}})
            if(maxRight){
                rightVal  = maxRight + 1;
            }else{
                rightVal = 1;
            }
        }
        comment.comment_left = rightVal ;
        comment.comment_right = rightVal +1
        await comment.save();
        return comment 
    }
    static async getCommentsByParentId(
        productId, 
        parentCommentId = null,
        limit = 50,
        offset = 0, //skip
    ){
        if(parentCommentId){
            const parent = await Comment.findById(parentCommentId)
            if(parent) throw new NotFoundError("Not found commment for product")
            const comments=  await Comment.find({
                comment_productId:convertToObjectIdMongoDb(productId),
                comment_left:{$gte:comment_left},
                comment_right:{$lte:comment_right}
            }).select({
                comment_left:1,
                comment_right:1,
                comment_content:1,
                comment_parentId:1
            }).sort({
                comment_left:1
            })
            return comments
        }
        const comments = await Comment.find({
            comment_productId:convertToObjectIdMongodb(productId),
            comment_parentId:null,
        }).select({
            comment_left:1,
            comment_right:1,
            comment_content:1,
            comment_parentId:1
        }).sort({
            comment_left:1,
        })
        return comments
    }
    static async deleteComments({
        commentId, productId, 
    }){
        //check product exists in database
        const foundProduct = await findProduct({
            product_id:productId,
        })
        if(!foundProduct) throw new NotFoundError("product not found")
        // 1. xac dinh gia tri left right
        const comment = await Comment.findById(commentId)
        if(!comment) throw new NotFoundError("comment is not found")
        const leftVal = comment.comment_left
        const rightVal = comment.comment_right
        // 2. tinh witch
        const width = rightVal - leftVal + 1;
        // 3 xóa tất cả comment id con
        await Comment.deleteMany({
            comment_productId:convertToObjectIdMongoDb(productId),
            comment_left: {$gte: leftVal, $lte:rightVal}
        })
        //4 cap nhat gia tri left va right con lai
        await Comment.updateMany({
            comment_productId:convertToObjectIdMongoDb(productId),
            comment_right:{$gte: rightVal},
        },{
            $inc:{
                comment_right: -width,
            }
        })
        await Comment.updateMany({
            comment_productId:convertToObjectIdMongoDb(productId),
            comment_left: {$gte:rightVal},
        },{
            $inc:{
                comment_left: -width,
            }
        })
    }
}

module.exports = CommentService