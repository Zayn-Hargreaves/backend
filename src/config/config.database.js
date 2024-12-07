const dev = {
    app:{
        port:3000
    },
    // db:{
    //     host:'localhost',
    //     port:27017,
    //     name:'dbDev'
    // }
    db:{
        mongoUrl:process.env.DATABASEURL
    }
}
const pro = {
    app:{
        port:3000
    },
    // db:{
    //     host:'localhost',
    //     port:27017,
    //     name:'dbProduct'
    // }
    db:{
        mongoUrl:process.env.DATABASEURL
    }
}
const config = {dev, pro};
const env = process.env.NODE_ENV||"dev";
module.exports = config[env]