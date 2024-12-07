const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandle");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await jwt.sign(payload, privateKey, {
            expiresIn: '2 days',
        });
        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: '7 days'
        })
        jwt.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('error verify::', err);
            } else {
                console.log('decode verify::', decode);
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) {
        throw new AuthFailureError('Error: Invalid request!')
    }
    const keyStore = await findByUserId(userId)
    if (!keyStore) {
        throw new NotFoundError('Error:Not found keystore!')
    }
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = jwt.verify(refreshToken, keyStore.publicKey)
            if (userId != decodeUser) throw new AuthFailureError("Invalid request")
                req.keyStore = keyStore,
                req.user = decodeUser,
                req.refreshToken = refreshToken
            return next();
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new AuthFailureError("Error: Invalid request!")
    }
    try {
        const decodeUser = jwt.verify(accessToken, keyStore.publicKey)
        if (userId != decodeUser.userId) {
            throw new AuthFailureError('Error: Invalid user');
        }
        req.keyStore = keyStore
        return next();
    } catch (error) {
        throw error
    }
})
const verifyJWT = async (token, keySecret) => {
    return jwt.verify(token, keySecret)
}
module.exports = { createTokenPair, authentication, verifyJWT }