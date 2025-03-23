import express from 'express';
import Collectable from "./Schema/Collectable.js";
import mongoose from 'mongoose';

const router = express.Router();

router.use((req, res, next) => {
    next()
})

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.sendStatus(200);
})

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS')
    res.sendStatus(200);
})

router.get('/', async (req, res, next) => {
    try {
        const collectables = await Collectable.find();

        const response = {
            items: collectables,
            _links: {
                self: {href: `${req.protocol}://${req.get('host')}${req.originalUrl}`},
                collection: {href: `${req.protocol}://${req.get('host')}/items/`}
            }
        }

        res.json(response);
    } catch (error) {
        res.status(500).json({message: 'Error fetching collectables', error});
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const collectable = await Collectable.findById(req.params.id);
        if (!collectable) {
            return res.status(404).json({ message: 'Collectable not found' });
        }
        res.json(collectable);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching collectable', error });
    }
});

router.post('/',async (req, res, next) => {
    try {
        const newCollectable = new Collectable(req.body);
        const savedCollectable = await newCollectable.save();
        res.status(201).json(savedCollectable);
    } catch (error) {
        res.status(400).json({ message: 'Error creating collectable', error });
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const collectable = await Collectable.findById(req.params.id);

        if (!collectable) {
            return res.status(404).json({ message: 'Collectable not found' });
        }

        await collectable.deleteOne({_id: req.params.id});

        res.status(204).json({ message: 'Deleted collectable', collectable: req.params.id });

    } catch (error) {

        res.status(500).json({ message: 'Error collectable', error });

    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { name, description, price } = req.body;

        if (!name || !description || !price) {
            return res.status(400).json({ message: 'Name, description, and price are required fields and cannot be empty' });
        }

        const updatedCollectable = await Collectable.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true
            });

        if (!updatedCollectable) {
            return res.status(404).json({ message: 'Collectable not found' });
        }

        res.status(200).json({ message: 'Updated collectable', collectable: updatedCollectable });

    } catch (error) {
        res.status(500).json({ message: 'Error updating collectable', error });
    }
});

router.delete('/reset', async (req, res, next) => {
    try {
        console.log('deleting all collectables and resetting database');

        if(!mongoose.connection.readyState) {
            console.log('Database not ready')
        }
        const result = await Collectable.deleteMany({});

        res.status(200).json({ message: `deleted ${result.deletedCount} collectables` });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting collectables', error });
    }
});


export default router