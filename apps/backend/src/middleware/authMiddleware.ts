import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@repo/db";
import ApiError from "../../utils/apierror";

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
      };
    }
  }
}

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.AccessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      select: { id: true, username: true },
    });

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = { userId: user.id, username: user.username };
    next();
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      throw new ApiError(403, "You are not allowed to access this resource");
    }

    next();
  };
};
