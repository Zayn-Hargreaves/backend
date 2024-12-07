const Redis = require("redis")
const {promisify} = require("util")
const { reservationInventory } = require("../models/repositories/inventory.repo")
const redisClient = Redis.createClient()

const pexpire = promisify(redisClient.pExpire).bind(redisClient) // chuyển 1 hàm thành 1 hàm async await promise
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const accquireLock = async(productId, quantity, cartId) =>{
    const key = `lock_2024_${productId}`;
    const reTryTimes = 10;
    const expireTime = 3000
    for(let i = 0;  i < reTryTimes; i++){
        const result = await setnxAsync(key, expireTime);
        console.log('result:::', result)
        if(result){
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })
            if(isReservation.modifiedCount){
                await pexpire(key, expireTime)
                return key
            }
            return null;
        }else{
            await new Promise((resole)=> setTimeout(resole, 50));
        }
    }
}
const releaseLock = async(keyLock)=>{
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock)
}

module.exports = {
    accquireLock,
    releaseLock
}