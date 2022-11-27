const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.POST || 5000;


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Laptop Resale Market is Running');
});


// ------------ MongoDB Connect start ---------------
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.blopt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// ------------------ end -------------------------



// -------------- MongoDB async function(run) start -------------

async function run() {
    try {
        // -------------- MongoDB collection start ---------------
        const companyCollection = client.db("laptop-resale-market").collection("company");
        const productsCollection = client.db("laptop-resale-market").collection("products");
        const buyersCollection = client.db("laptop-resale-market").collection("buyers");
        const ordersCollection = client.db("laptop-resale-market").collection("orders");
        const advertisesCollection = client.db("laptop-resale-market").collection("advertises");

        // --------------------- end ----------------------------

        // ----------------------- jwt start --------------------
        app.get('/jwt', (req, res) => {

        })
        // ------------------------- end ------------------------
        // ---------------------- isSeller ----------------------
        app.get('/is-seller', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await buyersCollection.findOne(query);
            res.send(user?.isSeller);
        });
        app.get('/seller', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await buyersCollection.findOne(query);
            res.send(user);
        });
        app.get('/is-admin', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await buyersCollection.findOne(query);
            res.send(user?.admin);
        });

        // -------------------- isAdmin ------------------------
        app.put('/mek-admin', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const option = { upSert: true };
            const upDateDoc = {
                $set: { admin: true }
            };
            const result = await buyersCollection.updateOne(query, upDateDoc, option);
            res.send(result);
        })

        // ------------ companyCollection start -----------------
        app.get('/company', async (req, res) => {
            const company = await companyCollection.find({}).toArray();
            res.send(company);
        })
        // ------------------------ end -------------------------

        // ------------ products collection start ---------------
        app.get('/products/:companyName', async (req, res) => {
            const companyName = req.params.companyName;
            const query = { companyName: companyName };
            const products = await productsCollection.find(query).toArray();
            res.send(products);

        });

        app.get('/products-by-email', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });

        app.post('/product', async (req, res) => {
            const productInfo = req.body;
            const result = await productsCollection.insertOne(productInfo);
            console.log(result)
            res.send(result);
        });

        app.post('/advertise', async (req, res) => {
            const advertise = req.body;
            const result = await advertisesCollection.insertOne(advertise);
            res.send(result);

        })

        // ----------------------- end --------------------------

        // ------------------ buyersCollection ------------------
        app.post('/buyer', async (req, res) => {
            const buyer = req.body;
            const result = await buyersCollection.insertOne(buyer);
            console.log(result);
            res.send(result);
        });

        app.get('/buyers', async (req, res) => {
            const query = { isSeller: false }
            const buyers = await buyersCollection.find(query).toArray();
            res.send(buyers);
        })
        app.get('/sellers', async (req, res) => {
            const query = { isSeller: true }
            const buyers = await buyersCollection.find(query).toArray();
            res.send(buyers);
        });

        app.put('/verify', async (req, res) => {
            const email = req.query.email;
            const filter = { email: email };
            const option = { upSert: true };
            const upDateDoc = {
                $set: { verify: true }
            };
            const result = await buyersCollection.updateOne(filter, upDateDoc, option);
            console.log(email);
            res.send(result);
        })

        app.delete('/deleteBuyer/:id', async (req, res) => {
            const email = req.params.id;
            const query = { email: email };
            const result = await buyersCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })

        // -------------------- ordersCollection ----------------
        app.post('/order', async (req, res) => {
            const orderInfo = req.body;
            const result = await ordersCollection.insertOne(orderInfo);
            res.send(result);
        });
        app.get('/ordersByEmail', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const orders = await ordersCollection.find(query).toArray();
            // console.log(orders)
            res.send(orders);
        });
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query)
            const result = await ordersCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })



    }
    catch (err) {
        console.log(err);
    }
    finally {
        console.log('Run function end');
    }
};
run().catch(err => console.log(err));


// --------------------- end -------------------------


app.listen(port, () => {
    console.log('Laptop Resale Market is Running on Port', port);
});
