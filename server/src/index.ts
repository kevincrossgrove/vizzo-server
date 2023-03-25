import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AuthRouter from './routers/AuthRouter';

const env = process.env as any;

if (env.NODE_ENV !== 'production') {
  require('dotenv').config();
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

// Use AuthenticationRouter
app.use('/auth', AuthRouter);

// PORT
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
