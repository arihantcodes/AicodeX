import asyncHandler from "../../utils/asynchandler";
import ApiResponse from "../../utils/apiresponse";
import ApiError from "../../utils/apierror";
import { PrismaClient } from "@repo/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const prisma = new PrismaClient();


const generateAccessToken = (userId: number, username: string) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  return jwt.sign({ userId, username }, secret, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (userId: number, username: string) => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }
  return jwt.sign({ userId, username }, secret, {
    expiresIn: "7d",
  });
};

// Get all users
const allUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

// Register new user
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username: username.toLowerCase() }],
    },
  });

  if (existingUser) {
    throw new ApiError(400, "User with this email or username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
    },
  });

  const accessToken = generateAccessToken(user.id, user.username);
  const refreshToken = generateRefreshToken(user.id, user.username);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res.cookie("AccessToken", accessToken, { httpOnly: true, secure: true });
  res.cookie("RefreshToken", refreshToken, { httpOnly: true, secure: true });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: { id: user.id, username: user.username, email: user.email },
        accessToken,
        refreshToken,
      },
      "User registered successfully"
    )
  );
});

// Login user
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id, user.username);
  const refreshToken = generateRefreshToken(user.id, user.username);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res.cookie("AccessToken", accessToken, { httpOnly: true, secure: true });
  res.cookie("RefreshToken", refreshToken, { httpOnly: true, secure: true });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: { id: user.id, username: user.username, email: user.email },
        accessToken,
        refreshToken,
      },
      "User logged in successfully"
    )
  );
});

// Logout user
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  res.clearCookie("AccessToken");
  res.clearCookie("RefreshToken");

  return res.status(200).json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const { RefreshToken } = req.cookies;

  if (!RefreshToken) {
    throw new ApiError(401, "No refresh token provided");
  }

  try {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
      throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }

    const { userId, username } = jwt.verify(RefreshToken, secret) as {
      userId: number;
      username: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.refreshToken !== RefreshToken) {
      throw new ApiError(403, "Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(userId, username);
    const newRefreshToken = generateRefreshToken(userId, username);

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: newRefreshToken },
    });

    res.cookie("AccessToken", newAccessToken, { httpOnly: true, secure: true });
    res.cookie("RefreshToken", newRefreshToken, { httpOnly: true, secure: true });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        "Access token refreshed"
      )
    );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
});

// Change Password
const changeCurrentPassword = asyncHandler(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect old password");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

// Get Current User Profile by Username
const getCurrentUserProfileByUsername = asyncHandler(async (req: Request, res: Response) => {
  const username = req.params.username?.toLowerCase();

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});

const me = asyncHandler(async (req: Request, res: Response) => {
  const username = req.params.username?.toLowerCase();

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user, "my profile fetched successfully"));
})

export {
  registerUser,
  allUsers,
  loginUser,
  getCurrentUserProfileByUsername,
  changeCurrentPassword,
  logoutUser,
  me,
  refreshAccessToken,
};