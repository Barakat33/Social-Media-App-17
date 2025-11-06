import { NextFunction, Express, Request, Response } from "express";
import { authRouter, commentRouter, postRouter, userRouter } from "./modules";
import { connectDB } from "./DB/connection";
import { AppError } from "./utlis/error";
import cors from "cors";
import chatRouter from "./modules/chat/chat.controller";
import { appSchema } from "./app.chema";
import { createHandler } from "graphql-http";
import { GraphQLError } from "graphql";

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

  app.all(
  "/graphql",
  createHandler({
    schema: appSchema,
    formatError: (err) => {
      const error = err instanceof GraphQLError ? err : new GraphQLError(err.message);

      return new GraphQLError(
        error.message,
        error.nodes ?? undefined,
        error.source ?? undefined,
        error.positions ?? undefined,
        error.path ?? undefined,
        error.originalError ?? undefined,
        {
          ...error.extensions,
          success: false,
          code: error.extensions?.code || "GRAPHQL_ERROR",
          originalError:
            error.originalError instanceof Error
              ? error.originalError.message
              : null,
        }
      );
    },
    //implement of auth function
    context: (req) => {
      const rawAuth =
        typeof req.headers?.get === "function"
          ? req.headers.get("authorization")
          : (req.headers as any)?.authorization ?? (req as any)?.headers?.authorization;
      const auth = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth;
      const token = auth && typeof auth === "string" && auth.startsWith("Bearer ") ? auth.slice(7) : (typeof auth === "string" ? auth : null);
      return { token };
    },
  })
);

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
