import express from "express";
import UsersModel from '../models/users';
import bcrypt from 'bcrypt';
import asyncHandler from "../util/asyncHandler";

export default class LoginRouter {
    router: any
    model: UsersModel
    constructor() {
        this.model = new UsersModel()
        this.router = express.Router()
        // login user  
        this.router.post('/', asyncHandler(async (req, res) => {
            const user = await this.model.getPassword(req.body.email);
            if (user.password && await bcrypt.compare(req.body.password, user.password)) {
                req.session.user_id = user.id
               // res.redirect(`/profile/me`) 
               res.send({'user_id':user.id})
            } else
                res.send('wrong email or password');
        }))
        // get login page
        this.router.get('/', (req, res) => {
            if (req.session.user_id)
                res.redirect(`/profile/me`);
            else
                res.render('login.ejs')
        })
    }
}