import { Request, Response, NextFunction, Router, RequestHandler } from "express";

export class CustomRouter {
    private router: Router;

    constructor() {
        this.router = Router();
    }

    get(path: string, handler: RequestHandler) {
        this.router.get(path, asyncHandler(handler));
    }

    post(path: string, handler: RequestHandler) {
        this.router.post(path, asyncHandler(handler));
    }

    put(path: string, handler: RequestHandler) {
        this.router.put(path, asyncHandler(handler));
    }

    delete(path: string, handler: RequestHandler) {
        this.router.delete(path, asyncHandler(handler));
    }

    use() {
        return this.router;
    }
}


const asyncHandler = (handler: RequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
};
