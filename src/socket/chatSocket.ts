import { Server, Socket } from "socket.io";
import { MessageModel, IMessage } from "../models/message";

interface SendMessagePayload {
  communityId: string;
  senderId: string;
  text: string;
}

export const handleSocketEvents = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinCommunity", (communityId: string) => {
      socket.join(communityId);
      console.log(`User joined community: ${communityId}`);
    });

    socket.on("sendMessage", async (data: SendMessagePayload) => {
      const { communityId, senderId, text } = data;
      if (!communityId || !senderId || !text) return;

      const message: IMessage = new MessageModel({ community_id: communityId, sender_id: senderId, text });
      await message.save();

      io.to(communityId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
