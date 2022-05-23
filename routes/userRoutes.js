import express from "express";
const router = express.Router();
import UserController from '../controllers/userContoller.js'

//Puclic roues
router.post('/register', UserController.userRegistration);
router.post('/login', UserController.userLogin);


export default router