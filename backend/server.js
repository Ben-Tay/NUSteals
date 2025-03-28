import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import couponRoutes from './routes/coupons.js'
import mongoose from 'mongoose';
import cors from 'cors';


// express app + routers
const app = express();

// Middleware
// This must come before other middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow only your frontend origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
    credentials: true, // Allow credentials (cookies, tokens, etc.)
}));

// allow us to access req body for post and edit requests in json format
app.use(express.json());
// 1.Log endpoint requests
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//serve static files 
app.use(express.static("public"));
//use cors

// Load environment variables from the .env file in the backend folder
dotenv.config({ path: path.resolve('backend', '.env') });

// define routes for specific requests to each collection
app.use('/api/users', userRoutes);
app.use('/api/coupons', couponRoutes);

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Listen for requests only when we have connected to the database
        app.listen(process.env.PORT, () => {
            console.log("Connected to db + Listening on port " + process.env.PORT);
        })
    })
    .catch((error) => {
        console.log(error);
    })

