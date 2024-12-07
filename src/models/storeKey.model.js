const {Schema,model,mongoose, Collection} = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = "Keys"
// Declare the Schema of the Mongo model
const keyStoreSchema = new mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Shop'
    },
    privateKey:{
        type:String,
        require:true
    },
    publicKey:{
        type:String,
        require:true
    },
    refreshTokensUsed:{
        type:Array,
        default:[]
    },
    refreshToken:{
        type:String,
        require:true
    }
},{
    timestamp:true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyStoreSchema);