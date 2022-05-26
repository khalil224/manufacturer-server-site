const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hz9lk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const toolsCollection = client.db('computing_Cafe').collection('tools');
        const ordersCollection = client.db('computing_Cafe').collection('orders');

        app.get('/tool', async (req, res) => {
            const query = {};
            const cursor = toolsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)
        });

        app.get('/order', async (req, res) => {
            const query = {};
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        });

        app.get('/tool/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tool = await toolsCollection.findOne(query);
            res.send(tool)
        })

        //post
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result)
        });

        //update
        // app.put('product/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const quantity = req.body;
        //     console.log(quantity);
        //     const query = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             _id: id,
        //             name: item.name,
        //             price: item.price,
        //             description: item.description,
        //             quantity: quantity.quantity,
        //             suppierName: item.suppierName,
        //             img: item.img
        //         }
        //     }
        //     const result = await itemCollection.updateOne(query, updateDoc, options);
        //     res.send(result)
        // })

        //delete
        // app.delete('/product/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await productCollection.deleteOne(query);
        //     res.send(result);

        // })

    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('The Computing Cafe')
})

app.listen(port, () => {
    console.log('The Computing Cafe is running on port', port)
})