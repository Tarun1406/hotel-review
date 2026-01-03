require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const { getReview, postReview, checkLocation, checkHotel, getLocation, getHotel, getHotels, getLocations } = require('./controller/review');

const app = express();

// Prepare mongoose options and URI
// Suppress upcoming Mongoose 7 strictQuery change warning by making intent explicit
mongoose.set('strictQuery', false);

const buildDefaultUri = () => {
    const user = encodeURIComponent(process.env.mongo_user_name || '');
    const pass = encodeURIComponent(process.env.mongo_password || '');
    // NOTE: if you prefer a different DB name, update below (hotelreview used as example)
    return `mongodb+srv://${user}:${pass}@cluster0.bu8j6qg.mongodb.net/hotelreview?retryWrites=true&w=majority`;
};

const MONGO_URI = process.env.MONGO_URI || buildDefaultUri();

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to DB!'))
    .catch((err) => {
        console.error('MongoDB connection error:');
        console.error(err && err.message ? err.message : err);
        // Helpful hint for SRV DNS lookup failures
        if (err && err.code === 'ENOTFOUND') {
            console.error('\nDNS SRV lookup failed for the Atlas host. Possible causes:');
            console.error('- Incorrect cluster host in the URI (did you change the cluster name?)');
            console.error('- Your network/DNS blocks SRV lookups or has no internet access');
            console.error('\nQuick checks:');
            console.error('  - Run: dig +short SRV _mongodb._tcp.cluster0.o14lsej.mongodb.net');
            console.error('  - Or: nslookup -type=SRV _mongodb._tcp.cluster0.o14lsej.mongodb.net');
            console.error('\nIf SRV fails, try using the "Standard" (non-SRV) connection string from Atlas or check your DNS settings (try Google DNS 8.8.8.8).');
        }
    });

const corsOption = {
    origin: '*',
    optionSuccessStatus: 200,
};

app.use(cors(corsOption));

const jsonParser = bodyParser.json();
app.use(jsonParser);

const server = http.createServer(app);

app.get('/', (req, res) => {
    res.status(200).send('Raghav is The King');
});

app.get('/review', getLocation, getHotel, getReview);
app.get('/reviews', getLocation, getReview);
app.post('/review',  checkLocation, checkHotel, postReview);
app.get('/locations', getLocations);
app.get('/hotels', getLocation, getHotels);

const port = process.env.PORT || 8080;

server.listen(port, () => {
    console.log('server running at ' + port);
});
