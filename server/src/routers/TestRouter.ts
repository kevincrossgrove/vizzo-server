import express from 'express';
import TestMongoDB from '../controllers/TestController/TestMongoDB';

const TestRouter = express.Router();

// -------------------------- Test Related logic -------------------------------
TestRouter.get('/test', TestMongoDB);

export default TestRouter;
