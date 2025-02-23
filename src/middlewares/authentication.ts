import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, UserPayload } from '../types/auth';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies?.token;

    if (!token) {
        res.status(403).json({ message: 'Token not found, access denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as UserPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default verifyToken;
