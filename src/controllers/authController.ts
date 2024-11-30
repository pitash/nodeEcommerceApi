import { Request, Response } from 'express'
import { prismaClient } from '..';
import { hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';

export const signup = async (req:Request, res:Response) => {
    const { name, email, password } = req.body;

    let user = await prismaClient.user.findFirst({where: {email: email} });
    if(user){
        throw Error('User Already Exists!');
    }
    user = await prismaClient.user.create({
        data:{
            name,
            email,
            password: hashSync(password, 10)
        }
    });
    res.json(user);
};

export const login = async (req:Request, res:Response) => {
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({where: {email: email} });
    if(!user){
        throw Error('User Does Not Exists!');
    }
    if(!compareSync(password, user.password)){
        throw Error('Incorrect Password!');
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET);

    res.json({user, token});
};