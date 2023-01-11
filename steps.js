// server site--->
// steps-->
// 1) cd folder location
// 2) mkdir projectName
// 3) cd projectName
// 4) npm init -y
// 5) code .
// 6) index.js
// 7) (global) npm i nodemon
// 7) npm i express cors dotenv mongodb
// 8) in package.json--->"scripts" add two line-->
// "start": "node index.js"
// "start-dev": "nodemon index.js"
// 9) create .env .gitignore
// 10) .gitignore--> node_modules .env
// 11) git init
// 12) index.js---->
// req-- express, cors, port--> process.env.PORT || 5000
// const app = express() require('dotenv').config();

// 13) //middleware
// app.use(cors())
// app.use(express.json());

// 14) copy code from mongodb server connect till v1}})
// async function name(){
// await client.connect();
// const collection = client.db('name').collection('nameC');

// api--->..
// } finally()

// 15) function name().catch(console.dir);
// app.get('/')--running node
// app.listen--port