const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.t7z1ilf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.get('/',(req,res)=>{
    res.send('task server running')
})
async function run() {
    try {
      const userCollection = client.db("task").collection("user");
      app.get('/user/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const user = await userCollection.findOne(query);
        res.send(user)
    })
      app.put('/user', async(req,res)=>{
        const user = req.body
        const id = user.id
        const filter = { _id: ObjectId(id)};
        delete user.id
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              user
            },
          };
          const result = await userCollection.updateOne(filter, updateDoc, options);
          console.log(result)
          res.send(result)
    })
      
    } finally {
      
    }
  }
  run().catch(console.dir);

app.listen(port, () => {
    console.log(`task server on port ${port}`)
  })