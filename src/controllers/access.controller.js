const { CREATED, SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
    handleRefreshToken = async(req, res, next)=>{
        new SuccessResponse({
            message:'Get token success',
            metadata: await AccessService.handleRefreshToken({
                refreshToken: req.refreshToken,
                user:req.user,
                keyStore:req.keyStore
            })
        }).send(res)
    }
    logOut = async(req,res, next)=>{
        new SuccessResponse({
            message:'Logout success',
            metadata:await AccessService.logout(req.keyStore)
        }).send(res)
    }
    logIn = async(req,res, next)=>{
        new SuccessResponse({
            metadata:await AccessService.login(req.body)
        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message:'Registered OK!',
            metadata: await AccessService.signUp(req.body),
            options:{
                limit:10
            } 
        }).send(res)
    }
}

module.exports = new AccessController()