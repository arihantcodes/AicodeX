import asyncHandler from "../../utils/asynchandler";
import ApiResponse from "../../utils/apiresponse";
import ApiError from "../../utils/apierror";
import { PrismaClient } from "@repo/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
    }
  }
}

// Utility function to generate tokens
const generateAccessToken = (userId: number) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  return jwt.sign({ userId }, secret, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (userId: number) => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }
  return jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });
};

// Get all users
const allUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  return res.status(200).json({ data: users });
});

// Register new user
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
    },
  });

  return res.status(201).json(
    new ApiResponse(
      200,
      {
        username: user.username,
        email: user.email,
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

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

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
        user: { id: user.id, email: user.email },
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

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(401, "No refresh token provided");
  }

  try {
    const { userId } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { userId: number };

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(403, "Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: newRefreshToken },
    });

    res.cookie("AccessToken", newAccessToken, { httpOnly: true, secure: true });
    res.cookie("RefreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
    });

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
const changeCurrentPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }

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

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
  }
);

// Ensure this endpoint is protected and requires authentication
const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;  // Assuming req.user is set by authentication middleware

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, username: true },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user, "Current user fetched successfully"));
});

export {
  registerUser,
  allUsers,
  loginUser,
  getCurrentUser,
  changeCurrentPassword,
  logoutUser,
};
