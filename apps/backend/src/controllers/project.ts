import asyncHandler from "../../utils/asynchandler";
import ApiResponse from "../../utils/apiresponse";
import ApiError from "../../utils/apierror";
import { PrismaClient } from "@repo/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const prisma = new PrismaClient();


const createproject = asyncHandler(async (req: Request, res: Response) => {

    const { projectname, description, language } = req.body;
    
    if (!projectname || !description || !language) {
        throw new ApiError(400, "All fields are required");
    }
    
    const project = await prisma.project.create({
        data: {
        projectname,
        description,
        language,
        user: {
            connect: {
            id: req.user?.userId,
            },
        },
        },
    });
    
    return res.status(201).json(new ApiResponse(201, project, "Project created successfully"));
})

const allprojects = asyncHandler(async (req: Request, res: Response) => {
    const projects = await prisma.project.findMany({
        where: {
            userId: req.user?.userId,
        },
    });

    return res.status(200).json(new ApiResponse(200, projects, "All projects"));
})

const deleteproject = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid project ID"));
    }

    try {
        // Delete the project
        const project = await prisma.project.delete({
            where: {
                id: parseInt(id),
            },
        });

        return res.status(200).json(new ApiResponse(200, project, "Project deleted successfully"));
    } catch (err) {
        console.error("Error deleting project:", err);
        return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
    }
});
export { createproject,allprojects,deleteproject };