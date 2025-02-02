import mongoose from 'mongoose'
import express from 'express'
import req from "express/lib/request.js";

const collectableSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
},{
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            ret._links = { self: { href: `${process.env.BASE_URL + ':' + process.env.EXPRESS_PORT}/items/${ret._id}` } ,
                            collection: { href: `${process.env.BASE_URL + ':' + process.env.EXPRESS_PORT}/items/`}
            };
            delete ret._id;
        }
    }
})

const Collectable = mongoose.model('Collectable', collectableSchema)

export default Collectable