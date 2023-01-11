const express = require('express');
const cors = require('cors');
const port  = process.env.Port || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();


//middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://roydb:GuVKwUjhXbVOofJl@cluster0.vy72hno.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('volunteers').collection('works');
        
        app.get('/works', async(req,res)=>{
            const query ={};
            const cursor = serviceCollection.find(query);
            const works = await cursor.toArray();
            res.send(works);
        })

    }
    finally{

    }
}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send("running node volunteer server");
})
app.listen(port, ()=>{
    console.log('working port',port);
})
