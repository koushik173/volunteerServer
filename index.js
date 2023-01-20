const express = require('express');
const cors = require('cors');
const port  = process.env.Port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');

//middleware
app.use(cors());
app.use(express.json());

function verifyJWT(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'});
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decoded)=>{
        if(err){
            return res.status(403).send({message: 'Forbidden access' })
        }
        // console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
   
}


const uri = "mongodb+srv://roydb:GuVKwUjhXbVOofJl@cluster0.vy72hno.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('volunteers').collection('works');
        const volunteerCollection = client.db('volunteers').collection('volunteer');
        const adminCollection = client.db('volunteers').collection('admin');
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
        //add newWork event
        app.post('/newEvent', async(req,res)=>{
            const data = req.body;
            const newEvent = await serviceCollection.insertOne(data);
            res.send(newEvent)
        })

        //volunteer collection api
        app.post('/volunteer', async(req,res)=>{
            const data = req.body;
            const volunteer = await  volunteerCollection.insertOne(data);
            const admin = await  adminCollection.insertOne(data);
            res.send(volunteer);
        })

        app.get('/volunteers',verifyJWT, async(req,res)=>{
            const email = req.query.email;
            const query = {email:email};
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

        //admin api
        app.get('/admin', async(req,res)=>{
            const query = {};
            const cursor = adminCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        //delete from admin events tasks
        app.delete('/admin/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await adminCollection.deleteOne(query);
            res.send(result);
        })
        //auth
        app.post('/login', async(req,res)=>{
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h'
            })
            res.send({accessToken});
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
