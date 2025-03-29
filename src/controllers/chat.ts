import express from 'express';
import { AuthRequest } from 'types/auth';
import ResponseHelper from "../helpers/responseHelper";
import ChatService from "../services/chatService";

export default class ChatController {
    static async sendMessage(
        req: AuthRequest,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const { message, community_id } = req.body;
            const user_id = req.user.user_id;

            if (!message || !community_id) {
                ResponseHelper.sendErrorResponse(res, "Message and community ID are required", 400);
                return;
            }

            const data = await ChatService.sendMessage(
                user_id,
                community_id,
                message
            );

        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}