class ApiError extends Error {
    statusCode: number;
    data: any;
    success: boolean;
    errors: any[];
    
    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors: any[] = [],
        stack: string = ""
    ) {
        super(message);
        
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            // Ensures the correct stack trace is captured for this error
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
