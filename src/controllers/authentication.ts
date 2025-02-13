import express, { RequestHandler } from 'express';
import { getUserByEmail, createUser } from '../models/users';
import { random, authentication } from '../helpers';

export const login: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.sendStatus(400);
            return;
        }

        const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");
        if (!user) {
            res.sendStatus(404);
            return;
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            res.sendStatus(401);
            return;
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie("sessionToken", user.authentication.sessionToken, {domain: "localhost", path: "/"});

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

export const register: RequestHandler = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.sendStatus(400);
            return;
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            res.sendStatus(409);
            return;
        }

        const salt = random();
        const user = await createUser({
            username,
            email,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};
