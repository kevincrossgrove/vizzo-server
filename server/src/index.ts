import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AuthRouter from './routers/AuthRouter';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import MongoDBDatabase from './lib/database/MongoDBDatabase';
import TestRouter from './routers/TestRouter';

const env = process.env as any;

if (env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();

app.use(
  cors({
    // Sets Access-Control-Allow-Origin to the UI URI
    origin: env.UI_ROOT_URI,
    // Sets Access-Control-Allow-Credentials to true
    credentials: true,
  })
);

app.use(cookieParser());

// PORT
const PORT = 5000;

// Setup MongoDB connection with Vizzo DB.
const mongoDbClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
const mongoDB = new MongoDBDatabase(mongoDbClient, process.env.MONGODB_DB_NAME);

mongoDB.init();

(global as any).db = mongoDB;

// Use AuthenticationRouter
app.use('/auth', AuthRouter);

app.use('/test', TestRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
