import mongoose from 'mongoose'

const spotSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
})

const Spot = mongoose.model('Spot', spotSchema)

export default Spot