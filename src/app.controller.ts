import { NextFunction, Express, Request, Response } from "express";
import { authRouter, commentRouter, postRouter, userRouter } from "./modules";
import { connectDB } from "./DB/connection";
import { AppError } from "./utlis/error";
import cors from "cors";
import chatRouter from "./modules/chat/chat.controller";

export function bootstrap(app: Express, express: any) {
  connectDB(); // operation buffering

  // parsing for data
  app.use(express.json());
  app.use(cors({origin: "*",}))

  // auth
  app.use("/auth", authRouter);

  // users
  app.use("/users", userRouter);

  // posts
  app.use("/post", postRouter);

  // comments
  app.use("/comment", commentRouter);

  // chat
  app.use("/chat", chatRouter);

  // 404 handler - catch all unhandled routes
  app.all(/.*/, (req: Request, res: Response) => {
    return res.status(404).json({
      message: "invalid url",
      success: false,
    });
  });

  // Error handler middleware
  app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Internal Server Error",
      success: false,
      errorDetails: err.errorDetails || [],
      stack: err.stack,
    });
  });
}
