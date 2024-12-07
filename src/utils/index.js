const _ = require("lodash");
const mongoose = require("mongoose")
const {Types} = require("mongoose")
const convertToObjectIdMongoDb = id => Types.ObjectId(id)
const getInfoData = ({fields =[], object = {}})=>{
    return _.pick(object, fields)
}

const getSelectData = (select =[])=>{
    return Object.fromEntries(select.map(item => [item, 1]))
}
const unGetSelectData = (select=[])=>{
    return Object.fromEntries(select.map(item=>[item,0]))
}
const removeUndefinedCheck = obj =>{
    Object.keys(obj).forEach( k =>{
        if(obj[k] == null){
            delete obj[k]
        }
    })
    return obj
}
const updateNestedObjectParser = (obj)=>{
    const final = {}
    Object.keys(obj).forEach(k=>{
        if(typeof(obj[k]) === 'Object' && !Array.isArray(obj[k])){
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(a=>{
                final[`${k}.${a}`] = response[a]
            })
        }else{
           final[k] = obj[k] 
        }
    })   
    return final
}
module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedCheck,
    updateNestedObjectParser,
    convertToObjectIdMongoDb
}