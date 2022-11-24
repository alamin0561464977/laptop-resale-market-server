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

        // --------------------- end ----------------------------

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



// [
//     {
//         "category_id": "01_hp",
//         "quantity": 22,
//         "name": "HP ENVY x360 2-in-1 Laptop 13-bf0002nx (6W2C7EA)",
//         "image": "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08277657.png",
//         "price": 820,
//         "description": "The HP Envy x360 13.3 2-in-1 allows you to seamlessly write, sketch, stream or transfer images across devices.",
//         "used": "3,m",
//         "date": "2022-11-24T07:55:16.901Z"
//     },
//     {
//         "category_id": "01_hp",
//         "quantity": 22,
//         "name": "HP Laptop 15s-fq5000nx (6W2G9EA)",
//         "image": "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c07951307.png",
//         "price": 500,
//         "description": "Stay productive and entertained from anywhere with long-lasting battery life and micro-edge display.",
//         "used": "6,m",
//         "date": "2022-11-24T07:55:16.901Z"
//     },
//     {
//         "category_id": "01_hp",
//         "quantity": 22,
//         "name": "HP Pavilion Laptop 15-eh2001nx (6W2M4EA)",
//         "image": "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08238440.png",
//         "price": 530,
//         "description": "Incredible performance in a smaller PC, so you can do more and enjoy entertainment wherever you go.",
//         "used": "4,m",
//         "date": "2022-11-24T07:55:16.901Z"
//     },
//     {
//         "category_id": "01_hp",
//         "quantity": 22,
//         "name": "HP Pavilion Laptop 14-dv2023nx (6W2X8EA)",
//         "image": "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08165684.png",
//         "price": 600,
//         "description": "Incredible performance in a smaller PC, so you can do more and enjoy entertainment wherever you go.",
//         "used": "6,m",
//         "date": "2022-11-24T07:55:16.901Z"
//     },
//     {
//         "category_id": "01_hp",
//         "quantity": 22,
//         "name": "HP Spectre x360 2-in-1 Laptop 16-f1002nx (6W2H4EA)",
//         "image": "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08347354.png",
//         "price": 420,
//         "description": "The HP Spectre x360 16 2-in-1 helps you look your best thanks to the 5MP camera that keeps you in-frame and well-lit. It’s packed with clever features that protect your well-being and your privacy.",
//         "used": "9,m",
//         "date": "2022-11-24T07:55:16.901Z"
//     },
//     {
//         "category_id": "02_dell",
//         "quantity": 22,
//         "name": "Dell G15 5520 15.6",
//         "image": "https://m.media-amazon.com/images/I/61Cp5DAzCrL._AC_SL1500_.jpg",
//         "price": 400,
//         "description": "Dell G15 5520 15.6 FHD 165Hz Gaming Laptop, Intel Core i7-12700H, NVIDIA GeForce RTX 3060 6GB, 16GB RAM, 512GB SSD, Backlit Keyboard, Windows 11 Home (Grey)",
//         "used": "1,y",
//         "date": "2022-11-24T07:55:16.901Z"
//     },
//     {
//         "category_id": "02_dell",
//         "quantity": 22,
//         "name": "Dell Business Laptop Latitude 3520,",
//         "image": "https://m.media-amazon.com/images/I/81OoU6IRcDL._AC_SX679_.jpg",
//         "price": 550,
//         "description": "2021 Newest Dell Business Laptop Latitude 3520, 15.6 FHD IPS Backlit Display, i7-1165G7, 16GB RAM, 512GB SSD, Webcam, WiFi 6, USB-C, HDMI, Win 10 Pro",
//         "used": "10,m",
//         "date": "2022-11-24T07:55:16.901Z"
//     },
//     {
//         "category_id": "02_dell",
//         "quantity": 22,
//         "name": "Dell Inspiron 15 3511 2022 Laptop",
//         "image": "https://m.media-amazon.com/images/I/61IoCTLycmL._AC_SX679_.jpg",
//         "price": 630,
//         "description": "Dell Inspiron 15 3511 2022 Laptop, 11th Gen Intel Core i5-1135G7, 15.6 Inch FHD, 1TB HDD + 256GB SSD, 8 GB RAM, Intel® UHD Graphics, Win 11 Home, Eng Ar KB, Silver",
//         "used": "9,m",
//         "date": "2022-11-24T07:55:16.901Z"
//     },
//     {
//         "category_id": "02_dell",
//         "quantity": 22,
//         "name": "Dell G15 5511 Gaming Laptop",
//         "image": "https://m.media-amazon.com/images/I/61O-v9q-VwL._AC_SX679_.jpg",
//         "price": 580,
//         "description": "Dell G15 5511 Gaming Laptop, 11th Gen Intel Core i5-11400H, 15.6 Inch FHD, 512GB SSD, 8 GB RAM, NVIDIA® GeForce RTX™ 3050 4GB Graphics, Win 10 Home, Eng Ar KB, Grey",
//         "used": "7,m",
//         "date": "2022-11-24T07:55:16.901Z"
//     },
//     {
//         "category_id": "03_apple",
//         "quantity": 22,
//         "name": "Apple MacBook Air Laptop: Apple M1 Chip, 13",
//         "image": "https://m.media-amazon.com/images/I/61kdaHROtjL._AC_SY741_.jpg",
//         "price": 920,
//         "description": "2020Apple MacBook Air Laptop: Apple M1 Chip, 13” Retina Display, 8GB RAM, 256GB SSD Storage, Backlit Keyboard, FaceTime HD Camera, Touch ID. Works with iPhone/iPad; Gold; Arabic/English",
//         "used": "4,m",
//         "date": "2022-11-24T07:55:16.901Z"
//     },
//     {
//         "category_id": "03_apple",
//         "quantity": 22,
//         "name": "2021 Apple MacBook Pro (16-inch",
//         "image": "",
//         "price": 1050,
//         "description": "2021 Apple MacBook Pro (16-inch, Apple M1 Pro chip with 10‑core CPU and 16‑core GPU, 16GB RAM, 1TB SSD) - Space Grey; English",
//         "used": "5,m",
//         "date": "2022-11-24T07:55:16.901Z"
//     },
//     {
//         "category_id": "03_apple",
//         "quantity": 22,
//         "name": "Microsoft Surface Pro8 13 Inches",
//         "image": "https://m.media-amazon.com/images/I/71dpVo75lrL._AC_SX679_.jpg",
//         "price": 900,
//         "description": "Microsoft Surface Pro8 13 Inches Intel Core I5-1135G7 Processor Iris Xe Graphics 8Gb 256 SSD Windows 11 Home Platinum, Gray, 8Pq-00007",
//         "used": "4,m",
//         "date": "2022-11-24T07:55:16.901Z"
//     },
// ]