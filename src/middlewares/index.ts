import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from 'models/users';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['sessionToken'];
        if (!sessionToken) {
            res.sendStatus(401);
            return;
        }

        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) {
            res.sendStatus(401);
            return;
        }

        merge(req, { user: existingUser });
        next();
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}