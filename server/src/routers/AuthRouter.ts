import express from 'express';
import GetGoogleAuthURL from '../controllers/AuthController/GetGoogleAuthURL';
import { GetYoutubeData } from '../controllers/AuthController/GetYoutubeData';
import HandleGoogleOAuth from '../controllers/AuthController/HandleGoogleOAuth';

const AuthRouter = express.Router();

// Getting google login URL
AuthRouter.get('/google/url', GetGoogleAuthURL);

// Getting the user from Google with the code
AuthRouter.get(`/google`, HandleGoogleOAuth);

// Getting the current user
AuthRouter.get('/me', GetYoutubeData);

export default AuthRouter;
