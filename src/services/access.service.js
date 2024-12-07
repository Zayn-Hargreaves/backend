const ShopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const keyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};
class AccessService {
    static handleRefreshToken = async ({refreshToken, user, keyStore})=>{
        const {userId, email} = user;
        if(keyStore.refreshToken.includes(refreshToken)){
            await keyStore.deleteKeyById(userId)
            throw new ForbiddenError("Something wrong happend !! pls relogin")
        }
        if(keyStore.refreshToken !== refreshToken){
            throw new AuthFailureError('Error: Shop is not registered')
        }
        const foundShop = await findByEmail({email})
        if(!foundShop){
            throw new AuthFailureError("Error : shop is not registered")
        }
       
        const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)
        await keyStore.update({
            $set:{
                refreshToken:tokens.refreshToken
            },
            $addToSet:{
                refreshTokensUsed:refreshToken // đã dùng để lấy token mới
            }
        })
        return {
            user,
            tokens:tokens
        }
    }
    static logout = async(keyStore)=>{
        const delKey = await keyTokenService.removeKeyById(keyStore._id)
        console.log({delKey})
        return delKey
    }
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError("Shop is not registered");
        }
        const match = bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new AuthFailureError("Authentication error");
        }
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        const {_id:userId} = foundShop
        const tokens = await createTokenPair(
            { userId, email },
            publicKey,
            privateKey
        );
        await keyTokenService.createToken({
            refreshToken:tokens.refreshToken,
            privateKey, publicKey, userId
        })
        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: foundShop,
            }),
            tokens: tokens,
        };
    };

    static signUp = async ({ name, email, password }) => {
        try {
            const hoderShop = await ShopModel.findOne({ email }).lean();
            if (hoderShop) {
                throw new BadRequestError("Error: Shop already registered   ");
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await ShopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP],
            });
            if (newShop) {
                //create privatekey, publickey cho hệ thống lớn
                // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: "pkcs1",
                //         format: "pem",
                //     },
                //     privateKeyEncoding: {
                //         type: "pkcs1",
                //         format: "pem",
                //     },
                // });
                // sau đó lưu public key vào trong model và trả lại publickey, sau đó từ private key tạo ra token , và dùng public key để verify token đó
                const privateKey = crypto.randomBytes(64).toString("hex");
                const publicKey = crypto.randomBytes(64).toString("hex");
                const publicKeyString = await keyTokenService.createToken({
                    userId: newShop._id,
                    publicKey: publicKey,
                    privateKey: privateKey,
                });
                if (!publicKeyString) {
                    throw new BadRequestError("Error: Public Key is not exist  ");
                }
                const tokens = await createTokenPair(
                    { userId: newShop._id, email },
                    publicKey,
                    privateKey
                );
                return {
                    code: "201",
                    metadata: {
                        shop: getInfoData({
                            fields: ["_id", "name", "email"],
                            object: newShop,
                        }),
                        tokens: tokens,
                    },
                };
            }
            return {
                code: 200,
                metadata: "null",
            };
        } catch (error) {
            return;
        }
    };
}
module.exports = AccessService;
