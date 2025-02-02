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
    const acceptHeader = req.headers['accept'];
    if (acceptHeader && !acceptHeader.includes('application/json')) {
        return res.status(406).json({ error: 'Unsupported Accept header. Only application/json is allowed.' });
    }
    next();
});

//Routes
app.use('/items', router)
app.use('/items/reset', router)

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Listening on port ${process.env.EXPRESS_PORT}`);
});