const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
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


function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.access_token, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}

// -------------- MongoDB async function(run) start -------------

async function run() {
    try {
        // -------------- MongoDB collection start ---------------
        const companyCollection = client.db("laptop-resale-market").collection("company");
        const productsCollection = client.db("laptop-resale-market").collection("products");
        const buyersCollection = client.db("laptop-resale-market").collection("buyers");
        const ordersCollection = client.db("laptop-resale-market").collection("orders");
        const reportToAdminCollection = client.db("laptop-resale-market").collection("reportToAdmin");

        // --------------------- end ----------------------------
        const verifyAdmin = async (req, res, next) => {
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await buyersCollection.findOne(query);

            if (user?.admin !== true) {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next();
        }
        // ----------------------- jwt start --------------------
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await buyersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.access_token, { expiresIn: '1d' })
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' })


        })
        // ------------------------- end ------------------------
        // ---------------------- isSeller ----------------------
        app.get('/is-seller', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await buyersCollection.findOne(query);
            res.send(user?.isSeller);
        });
        app.get('/seller', verifyJWT, async (req, res) => {
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
        app.put('/mek-admin', verifyJWT, async (req, res) => {
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
            const query = {
                companyName: companyName,
                available: true,
                report: false
            };
            const products = await productsCollection.find(query).toArray();
            res.send(products);

        });

        app.get('/products-by-email', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const query = { email: email, available: true };
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });

        app.get('/advertise', async (req, res) => {
            const query = {
                available: true,
                advertise: true,
                report: !true
            }
            const advertise = await productsCollection.find(query).limit(6).toArray();
            res.send(advertise);
        });

        app.put('/advertise/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const option = { upSert: true };
            const upDateDoc = {
                $set: {
                    advertise: true
                }
            };
            const result = await productsCollection.updateOne(query, upDateDoc, option);
            console.log(result)
            res.send(result);
        })

        app.post('/product', verifyJWT, async (req, res) => {
            const productInfo = req.body;
            const result = await productsCollection.insertOne(productInfo);
            console.log(result)
            res.send(result);
        });

        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const option = { upSert: true };
            const upDateDoc = {
                $set: { available: false }
            };
            const result = await productsCollection.updateOne(query, upDateDoc, option);
            console.log(result);
            res.send(result);
        });

        app.put('/reportProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const upDateDoc = {
                $set: { report: true }
            };
            const option = { upSert: true };
            const result = await productsCollection.updateOne(query, upDateDoc, option);
            res.send(result);
        })

        app.delete('/deleteProduct/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })


        // ------------------ buyersCollection ------------------
        app.post('/buyer', verifyJWT, async (req, res) => {
            const buyer = req.body;
            const result = await buyersCollection.insertOne(buyer);
            console.log(result);
            res.send(result);
        });

        app.get('/buyers', verifyJWT, async (req, res) => {
            const query = { isSeller: false }
            const buyers = await buyersCollection.find(query).toArray();
            res.send(buyers);
        })
        app.get('/sellers', verifyJWT, async (req, res) => {
            const query = { isSeller: true }
            const buyers = await buyersCollection.find(query).toArray();
            res.send(buyers);
        });

        app.put('/verify', verifyJWT, async (req, res) => {
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

        app.put('/order/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
        })


        app.get('/ordersByEmail', verifyJWT, async (req, res) => {
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
        });

        // ----------------------- reportToAdminCollection -----------------------
        app.post('/reportToAdmin', async (req, res) => {
            const product = req.body;
            const result = await reportToAdminCollection.insertOne(product);
            res.send(result);
        });
        app.get('/reportToAdmin', async (req, res) => {
            const product = await reportToAdminCollection.find({}).toArray();
            res.send(product);
        });

        app.delete('/deleteReport/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reportToAdminCollection.deleteOne(query);
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
