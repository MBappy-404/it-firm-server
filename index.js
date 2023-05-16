const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.port || 5000;

app.get('/', (req,res)=>{
     res.send('it server is running')
})

app.use(cors());
app.use(express.json())


const uri = "mongodb+srv://itFirm01:4lBYB26SwXeswNxt@cluster0.wss65wz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){

     try{

          const serviceCollection = client.db('itServices').collection('service');
          const reviewCollection = client.db('itServices').collection('reviews');
          
          // get all service 
          app.get('/service', async(req,res)=>{
               const query = {}
               const service = await serviceCollection.find(query).toArray();
               res.send(service)
          })
          app.get('/serviceDetails/:id', async(req,res)=>{
               const id = req.params.id;
               const query = { _id: new ObjectId(id)};
               const details = await serviceCollection.findOne(query);
               res.send(details)
          })
           
          // add customer review 
          app.post('/reviews', async(req, res)=>{
               const review = req.body;
               const result = await reviewCollection.insertOne(review);
               res.send(result);

          })

          // add customer service 
          app.post('/service', async(req,res)=>{
               const service = req.body
               const result = await serviceCollection.insertOne(service);
               res.send(result)

          })

     //     find review by user email 
          app.get('/review', async(req,res)=>{
               let query = {}
               if(req.query.email){
                    query = {
                         email: req.query.email
                    }
               }
               const review = await reviewCollection.find(query).toArray();
               res.send(review)
          })

          // service reviews 
          app.get('/service/reviews', async (req, res) => {
               let query = {};
               if (req.query.serviceId) {
                    query = {
                         serviceId: req.query.serviceId,
                    };
               }
               const reviews = await reviewCollection.find(query).toArray();
               const result = reviews.sort().reverse();
               res.send(result)
          })
          app.delete('/reviews/:id', async(req, res)=>{
               const id = req.params.id;
               const query = {_id: new ObjectId(id)};
               const result = await reviewCollection.deleteOne(query);
               res.send(result);
          })

          app.put('/reviews/:id', async(req, res)=>{
               const id = req.params.id;
               const filter = {_id: new ObjectId(id)};
               const review = req.body;
               // console.log(updateReview);
               const option = {upsert: true};
               const updateReview = {
                    $set:{
                         serviceRating: review.updateRating,
                         message: review.updateMessage
                    }
               }
               const result = await reviewCollection.updateOne(filter,updateReview, option )

               res.send(result);
          })
          

     }

     finally{

     }

}

run().catch(err => console.log(err))

app.listen(port,()=>{
     console.log(`it server running on port ${port}`);
})