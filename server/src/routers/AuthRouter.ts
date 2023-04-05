import express from 'express';
import GetCurrentGoogleUser from '../controllers/AuthController/Google/GetCurrentGoogleUser';
import GetGoogleAuthURL from '../controllers/AuthController/Google/GetGoogleAuthURL';
import { GetYoutubeData } from '../controllers/AuthController/Google/GetYoutubeData';
import HandleGoogleOAuth from '../controllers/AuthController/Google/HandleGoogleOAuth';
import GetTiktokAuthURL from '../controllers/AuthController/Tiktok/GetTiktokAuthURL';
import HandleTiktokOAuth from '../controllers/AuthController/Tiktok/HandleTiktokOAuth';

const AuthRouter = express.Router();

// -------------------------- Google / YouTube related logic -------------------------------
// Getting google login URL
AuthRouter.get('/google/url', GetGoogleAuthURL);

// Getting the user from Google with the code
AuthRouter.get(`/google`, HandleGoogleOAuth);

// Getting the current user
AuthRouter.get('/me', GetCurrentGoogleUser);

AuthRouter.get('/me/videos', GetYoutubeData);

// -------------------------- TikTok related logic ------------------------------------
// Getting the TikTok LoginKit URL
AuthRouter.get('/tiktok/url', GetTiktokAuthURL);

// Getting the user from Tiktok with the code
AuthRouter.get(`/tiktok`, HandleTiktokOAuth);

export default AuthRouter;
