import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';

const app = express();

express.urlencoded({ extended: false });
express.json();

const start = async () => {
    if(!process.env.MONGO_URI) throw new Error('MONGO_URI UNDEFINED')

    try{
        mongoose.connect(process.env.MONGO_URI);
    } catch(err) {
        throw new Error('databse error')
    }
}

app.listen(8080, () => console.log('up and running on 8080'));