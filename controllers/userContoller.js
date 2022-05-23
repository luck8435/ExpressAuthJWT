import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class UserController{
    static userRegistration = async (req, res) => {
        const {name, email, password, password_confirmation, tc} = req.body;
        const user = await UserModel.findOne({email: email});
        if(user) {
            res.send({"status":"failed", "message":"email already exists..."});
        } else {
            if(name && email && password && password_confirmation && tc) {
                if(password === password_confirmation){
                    try {
                        const salt = await bcrypt.genSalt(10);
                        const hashPassword = await bcrypt.hash(password, salt);
                        const doc = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword,
                            tc: tc
                        })
                        await doc.save();
                        const saved_user = await UserModel.findOne(
                            {email: email});

                        const token = jwt.sign({userID: saved_user._id},
                        process.env.JWT_SECRET_KEY, {expiresIn: '5d'})
                        
                        res.status(201).send({"status":"success", "message":"Registration Success...",
                    "token": token})
                    } catch (error) {
                        console.log(error);
                        res.send({"status":"failed", "message":"Unable to register..."});                       
                    }
                } else{
                    res.send({"status":"failed", "message":"password doesnot match..."});
                }
            }else{
                res.send({"status":"failed", "message":"All fields are required..."});
            }
        }
    }
    static userLogin = async (req, res) => {
        try {
            const {email, password} = req.body
            if(email&& password){
                const user = await UserModel.findOne({email: email});
                if(user != null){
                    const isMatch = await bcrypt.compare(password, user.password)
                    if((user.email === email) && isMatch){
                        //Generate JWT Token
                        const token = jwt.sign({userID: user._id},
                        process.env.JWT_SECRET_KEY, {expiresIn: '5d'})
                        res.send({"status":"Success", "message":"Logged in Successfully...", "token": token});
                    } else{
                        res.send({"status":"failed", "message":"email or password is not valid..."});
                    }
                }else{
                    res.send({"status":"failed", "message":"You are not a registered user..."});
                }
            } else{
                res.send({"status":"failed", "message":"All fields are required..."});
            }
        } catch (error) {
            console.log(error);
            res.send({"status":"failed", "message":"Unable to login..."});
            
        }
    }

}

export default UserController