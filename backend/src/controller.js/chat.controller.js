// controllers/chat.controller.js
import Chat from "../model/Chat.model.js";
import { User } from "../model/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const pickPublicUserFields = (userDoc) =>
  userDoc
    ? {
      _id: userDoc._id,
      fullName: userDoc.fullName,
      userName: userDoc.userName,
    }
    : null;

// 1. Get Contact List (People I chatted with before)
const getContactList = asyncHandler(async (req, res) => {
  const myId = req.user._id;

  const chats = await Chat.find({ participants: myId })
    .populate({
      path: "participants",
      select: "fullName userName",
      match: { _id: { $ne: myId } }, // exclude myself
    })
    .sort({ updatedAt: -1 });

  // Clean response: only the other person
  const contacts = chats
    .map((chat) => {
      const otherUser = chat.participants.filter(Boolean)[0];
      if (!otherUser) return null;

      // Calculate unread count
      const unreadCount = chat.messages.filter(
        (msg) => msg.senderId.toString() !== myId.toString() && !msg.read
      ).length;

      return {
        _id: otherUser._id,
        fullName: otherUser.fullName,
        userName: otherUser.userName,
        lastMessage: chat.lastMessage || "No messages yet",
        lastMessageTime: chat.updatedAt,
        unreadCount,
      };
    })
    .filter(Boolean);

  return res
    .status(200)
    .json(new ApiResponse(200, contacts, "Contact list fetched"));
});

// 2. Get Full Chat History with a specific person
const getChatHistory = asyncHandler(async (req, res) => {
  const { friendId } = req.params;
  const myId = req.user._id;

  const friend = await User.findById(friendId).select("fullName userName");

  if (!friend) {
    throw new ApiError(404, "User not found");
  }

  const chat = await Chat.findOne({
    participants: { $all: [myId, friendId] },
  })
    .populate("messages.senderId", "fullName userName")
    .populate("participants", "fullName userName");

  if (!chat) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: null,
          participants: [pickPublicUserFields(req.user), pickPublicUserFields(friend)],
          messages: [],
        },
        "No chat yet"
      )
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, chat, "Chat history fetched"));
});

// 3. Mark messages as read
const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { friendId } = req.params;
  const myId = req.user._id;

  const chat = await Chat.findOne({
    participants: { $all: [myId, friendId] },
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  // Update all messages sent by friend to read: true
  let updated = false;
  chat.messages.forEach((msg) => {
    if (msg.senderId.toString() === friendId && !msg.read) {
      msg.read = true;
      updated = true;
    }
  });

  if (updated) {
    await chat.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Messages marked as read"));
});

export { getContactList, getChatHistory, markMessagesAsRead };