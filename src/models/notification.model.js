const {model,Schema} = require("mongoose")
const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';
// khi có notifi thì lưu và điều hướng tới notifi này

const notificationSchema = new Schema({
    noti_type:{type:String, enum:['ORDER-001', 'ORDER-002']},
    noti_sendID:{type:Schema.Types.ObjectId, require:true, ref:'Shop'},
    noti_receivedId:{type:Number, require:true},
    noti_content:{type:String, require:true},
    noti_option:{type:Object, default:{}},

    
},{
    timestamps:true,
    collection:COLLECTION_NAME,
})

module.exports = model(DOCUMENT_NAME, notificationSchema)