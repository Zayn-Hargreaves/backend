const { findById } = require("../services/apiKey.service")

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION:'authorization'
}

const apiKey  = async(req, res, next)=>{
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message:"Forbidden Error",
            })
        }
        // check api key
        const objKey = await findById(key)
        if(!objKey){
            return res.status(403).json({
                message:"Forbidden Error",
            })
        }
        req.objKey = objKey;
        return next()
    } catch (error) {
        console.log("ApiKey middleware error:", error)
    }
}

const permission = (permission)=>{
    return(req, res, next)=>{
        if(!req.objKey.permissions){
            return res.status(403).json({
                message:"Permission Denied",
            })
        }
        console.log('permission::', req.objKey.permissions)
        const validPermission = req.objKey.permissions.include(permission)
        if(!validPermission){
            return res.status(403).json({
                message:"Permission Denied",
            })
        }
        return next();
    }
}
// hàm bao đóng trả về hàm mà hàm đó có sử dụng các biến của hàm cha

module.exports = {apiKey, permission}