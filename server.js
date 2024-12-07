const app = require("./src/app");
const PORT = 3000
const server = app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`);
})

process.on("SIGINT", ()=>{
    server.close(()=>console.log("exit server"))
    process.exit(0);
})