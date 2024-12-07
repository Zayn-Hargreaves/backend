const { default: mongoose } = require("mongoose");
const { countConnection } = require("../helpers/countConnect");
const {db:{mongoUrl} }= require("../config/config.database");
const connectString = mongoUrl

//  Strategy patern

class Database {
    constructor() {
        this.connect();
    }
    connect(type = "mongodb") {
        if (1 == 1) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }
        mongoose
            .connect(connectString,{maxPoolSize:50})
            .then((_) => {
                console.log("connect database successfully");
                countConnection();
            })
            .catch((err) => console.log("Error Database Connection", err));
    }
    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceDatabase = Database.getInstance();
module.exports = instanceDatabase