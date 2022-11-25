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
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        // -------------------- isAdmin ------------------------
        app.put('/admin', async (req, res) => {
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
        })
        // ----------------------- end --------------------------



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
