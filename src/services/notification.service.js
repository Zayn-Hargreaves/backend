const notificationModel = require("../models/notification.model");

class notificationService{
    static pushNotiToSystem = async({
        type="SHOP-001",
        receivedId = 1,
        senderId= 1,
        options = {}
    })=>{
        let noti_content
        if(type="SHOP-001"){
            noti_content = `@@@ vừa mới thêm 1 sản phẩm @@@`;
        }else if(type = "PROMOTION-001"){
            noti_content = `@@@ vừa mới thêm 1 vorcher @@@`;
        }
        const newNoti = await notificationModel.create({noti_type:type,noti_content, noti_senderId:senderId, noti_receivedId:receivedId, noti_option:options})
        return newNoti
    }
    static listNotiByUser = async({
        userID=1,
        type='ALL',
        isRead= 0
    })=>{
        const match = {noti_receivedId:userID}
        if(type !== "ALL"){
            match['noti_type'] = type
        } 
        return await notificationModel.aggregate([
            {
                $match:match
            },{
                $project:{
                    noti_type :1,
                    noti_senderId:1,
                    noti_receivedId:1,
                    noti_content:{
                        $concat:[
                            {
                                $substr:['$noti_options.shop_name',0,1],
                            },
                            'Vừa mới thêm 1 sản phẩm mới:',
                            {
                                $substr:['$noti_option.product_name',0,1],
                            }
                        ]
                    },
                    createAt:1,
                    noti_option:1
                }
            }
        ])
    }
}

module.exports = notificationService