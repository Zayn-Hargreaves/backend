const { default: mongoose } = require("mongoose")
const os = require('os')
const process = require("process")
const _SECOND = 5000
const countConnection = ()=>{
    const numOfConnect = mongoose.connections.length
    console.log("number of connection:",numOfConnect)
}
const checkOverload = ()=>{
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUse = process.memoryUsage().rss
        const maxConnections = numCores * 5;
        console.log("Activate Connections: ",numConnection )
        console.log(`Memory Useage:${memoryUse/1024/1024} MB`);
        if(numConnection > maxConnections*0.8 ){
            console.log("Connection Overload detected");
        }
    }, _SECOND);
}
module.exports = {
    countConnection,
    checkOverload
}