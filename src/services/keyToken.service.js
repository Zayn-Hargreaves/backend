const { filter, update } = require('lodash')
const keyTokenModel = require('../models/storeKey.model')
const { Types } = require('mongoose')
class keyTokenService{
    static createToken = async({userId, publicKey, privateKey, refreshToken})=>{
        try {
            // lv0
            // const tokens = await keyTokenModel.create({
            //     user:userId,
            //     publicKey:publicKey,
            //     privateKey:privateKey
            // })
            // return tokens ? tokens.publicKey : null;
            const filter = {user:userId}, update ={
                publicKey,privateKey, refeshTokensUsed:[], refreshToken
            }, options ={
                upsert:true,
                new:true
            }
            const tokens = await keyTokenModel.findOneAndUpdate(filter,update, options)
            return tokens ? tokens.publicKey :null
        } catch (error) {
            console.log(error)
            return error
        }
    }
    static findByUserId = async(userId)=>{
        return await keyTokenModel.findOne({user:Types.ObjectId(userId)}).lean()
    }
    static removeKeyById = async(id)=>{
        return await keyTokenModel.remove(id)
    }
    static findByRefreshTokenUsed = async(refreshToken)=>{
        return await keyTokenModel.findOne({refreshTokensUsed:refreshToken}).lean()
    }
    static findByRefreshToken = async(refreshToken)=>{
        return await keyTokenModel.findOne({refreshToken})
    }
    static deleteKeyById = async(userId)=>{
        return await keyTokenModel.deleteOne({user:userId})
    }
}

module.exports = keyTokenService