import express from 'express';
import Collectable from "./Schema/Collectable.js";
import mongoose from 'mongoose';

const router = express.Router();

router.use((req, res, next) => {
    next()
})

router.get('/', async (req, res, next) => {
    try {
        const spots = await Collectable.find();
        res.json(spots);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching collectables', error });
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const spot = await Collectable.findById(req.params.id);
        if (!spot) {
            return res.status(404).json({ message: 'Collectable not found' });
        }
        res.json(spot);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching collectable', error });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newSpot = new Collectable(req.body);
        const savedSpot = await newSpot.save();
        res.status(201).json(savedSpot);
    } catch (error) {
        res.status(400).json({ message: 'Error creating spot', error });
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({ message: 'Collectable not found' });
        } else {
            await Collectable.deleteOne({_id: req.params.id});
            res.status(200).json({ message: 'Deleted collectable', spot: req.params.id });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error collectable', error });
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        if (!req.params.id) {
            res.status(404).json({ message: 'Collectable not found' });
        } else {
            await Collectable.findByIdAndUpdate(req.params.id, req.body,
                {
                    new: true,
                    runValidators: true
                });
            res.status(200).json({ message: 'Updated collectable', spot: req.params.id });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating collectable', error });
    }
});

router.post('/seed', async (req, res, next) => {

});

export default router