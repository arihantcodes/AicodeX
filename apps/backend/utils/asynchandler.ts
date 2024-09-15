import { Request, Response, NextFunction } from 'express';

const asyncHandler = (requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await requestHandler(req, res, next);
    } catch (error: any) {
      res.status(501).json({
        success: false,
        message: error?.message || "An unexpected error occurred",
      });
    }
  };

export default asyncHandler;
