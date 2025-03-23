import express from 'express';
import mongoose from 'mongoose';
import router from './router.js';

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/random-collectables', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

main();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {

    //If the client did not specify it accepts JSON, send an error unless they only ask for options
    if (!req.headers.accept?.includes('application/json') && req.method !== 'OPTIONS') {

        res.status(406);
        return res.json({error: 'This webservice only responds with JSON. Please specify if you will accept this format.'})

    }

    //Otherwise just continue
    next();

});

app.use((req, res, next) => {

    res.setHeader('Accept', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, x-api-key');

    next();

});

function errorHandler (err, req, res, next) {
    console.error(err.stack);
    res.status(500);

    //Save the request to a log file
    log(req, res, err);

    return res.json({error: 'Internal server error'});
}

//Routes
app.use('/items', router)
app.use('/items/reset', router)

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Listening on port ${process.env.EXPRESS_PORT}`);
});