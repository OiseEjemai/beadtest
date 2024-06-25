// server.js
// // // require('dotenk
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
const bodyParser = require('body-parser');
const Transaction = require('./models/Transaction');

const app = express();
dotenv.config()
let balance = 0;

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDb")
  } catch (error) {
    console.log('Connection Failed', error)
  }
}
connectDB()


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const corsOptions = {
  origin: 'https://beadtest-ik5d.vercel.app/',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));



app.post('/api/transactions', async (req, res) => {
  try {

    // Create and save transaction
    const transaction = new Transaction(req.body);

    await transaction.save();
    res.status(201).send(transaction);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.send(transactions);
  } catch (err) {
    res.status(500).send(err);
  }
});


app.get('/api/balance', (req, res) => {
  res.json({ balance });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
