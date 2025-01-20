import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.use((req, res, next) => {
    next()
})

router.get('/', async (req, res, next) => {
    try {
        const spots = await Spot.find();
        res.json(spots);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching spots', error });
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const spot = await Spot.findById(req.params.id);
        if (!spot) {
            return res.status(404).json({ message: 'Spot not found' });
        }
        res.json(spot);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching spot', error });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newSpot = new Spot(req.body);
        const savedSpot = await newSpot.save();
        res.status(201).json(savedSpot);
    } catch (error) {
        res.status(400).json({ message: 'Error creating spot', error });
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({ message: 'Spot not found' });
        } else {
            await Spot.deleteOne({_id: req.params.id});
            res.status(200).json({ message: 'Deleted spot', spot: req.params.id });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting spot', error });
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        if (!req.params.id) {
            res.status(404).json({ message: 'Spot not found' });
        } else {
            await Spot.findByIdAndUpdate(req.params.id, req.body,
                {
                    new: true,
                    runValidators: true
                });
            res.status(200).json({ message: 'Updated spot', spot: req.params.id });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating spot', error });
    }
});

router.post('/seed', async (req, res, next) => {

});

export default router