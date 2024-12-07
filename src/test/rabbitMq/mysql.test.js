const mysql = require('mysql2')
const pool = mysql.createPool({
    host:'localhost',
    port:8811,
    user:'root',
    password:'12345',
    database:'shopDEV'
})

const batchSize = 1000000;
const totalSize = 10000000;
let currentID = 1;
const insertBatch = async()=>{
    const values = [];
    for(let i =0 ; i < batchSize && currentID <totalSize; i++){
        const name = `name-${currentID}`;
        const age = `age-${currentID}`;
        const address = `address-${currentID}`;
        values.push([currentID, name, age, address])
        currentID++;
    }
    if(values.length == 0){
        pool.end(err=>{
            if(err){
                console.log('error occurred while running batch');
            }else{
                console.log('connection pool closed')
            }
        })
        return;

    }
    const sql = 'INSERT INTO User(id, name, age, address) VALUES ?'
    // pool.query('SHOW DATABASES', (err, results) => {
    //     if (err) throw err;
    //     console.log(results);
    //     pool.end();
    // });
    pool.query(sql, [values], async(err, results)=>{
        if(err) throw err;
        console.log(`inserted ${results.affectedRows} records`);
        await insertBatch();
    })
}

insertBatch().catch(err=>console.log(err))