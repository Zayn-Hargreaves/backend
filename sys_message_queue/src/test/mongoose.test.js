const mongoose = require("mongoose")
const connectString = "mongodb+srv://quanavndwork:12345@cluster0.1x3cx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const testSchema = new mongoose.Schema({name:String})
const Test = mongoose.model("test",testSchema)

describe("Mongoose Connection",()=>{
    let connection;
    beforeAll( async ()=>{
        try {
            console.log(connectString)
            connection = await mongoose.connect(connectString)
        } catch (error) {
            console.log(error)
        }
        
    })
    afterAll(async ()=>{
        await connection.disconnect()
    })

    it(" should connect to mongoose",()=>{
        expect(mongoose.connection.readyState).toBe(1)
    })
    it("should save a document to your database",async()=>{
        const user = new Test({name:"Zayn"})

        await user.save()
        console.log(user.isNew)
        expect(user.isNew).toBe(false)
    })
    it("should find a document from your database",async()=>{
        const user = await Test.findOne({name:"Zayn"})
        console.log(user)
        expect(user).toBeDefined()
    })
})