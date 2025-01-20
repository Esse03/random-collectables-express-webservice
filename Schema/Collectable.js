import mongoose from 'mongoose'
import express from 'express'
import collectable from "./Collectable.js";

const collectableSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
},{
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            ret._links = {
                self: {
                    href: ret._links.self.href,
                },
                collection: {
                   href: ret._links.collection.href,
                }
            }
            delete ret._id
        }
    }
})

const Collectable = mongoose.model('Collectable', collectableSchema)

export default Collectable