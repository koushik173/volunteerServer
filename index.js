const express = require('express');
const cors = require('cors');
const port  = process.env.Port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const volunteerCollection = client.db('volunteers').collection('volunteer');
        // const eventsCollection = client.db('userEvents').collection('userEvent');
        //all works api
        app.get('/works', async(req,res)=>{
            const query ={};
            const cursor = serviceCollection.find(query);
            const works = await cursor.toArray();
            res.send(works);
        })
        //single search work api
        app.get('/works/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const work = await serviceCollection.findOne(query);
            res.send(work);
        })

        //volunteer collection api
        app.post('/volunteer', async(req,res)=>{
            const data = req.body;
            const volunteer = await  volunteerCollection.insertOne(data);
            res.send(volunteer);
        })

        app.get('/volunteers', async(req,res)=>{
            const query = {};
            const cursor = volunteerCollection.find(query);
            const volunteers = await cursor.toArray();
            res.send(volunteers);
        })

        //delete from events tasks
        app.delete('/volunteers/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await volunteerCollection.deleteOne(query);
            res.send(result);
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
