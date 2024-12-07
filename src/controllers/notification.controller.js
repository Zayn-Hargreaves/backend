const {SuccessResponse} = require("../core/success.response")
const { listNotiByUser } = require("../services/notification.service")
class notificationController{
    listNotiByUser = async(req, res,next)=>{
        new SuccessResponse({
            message:" Get List notification by user",
            metadata: await listNotiByUser(req.body)
        }).send(res)
    }
}

module.exports = new notificationController()