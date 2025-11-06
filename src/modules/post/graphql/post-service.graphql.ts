import { PostRepostory } from "../../../DB";
import { isAuthenticatedGraghql } from "../../../middleware/auth-graghql.middleware";
import { isvalidGraghql } from "../../../middleware/validation-graghql.middleware";
import { postValidation } from "./post-validtion.graghql";
export const getSpecificPost = async (_parent: unknown, args: { id: string },context: any) => {
    //implement auth function
    await isAuthenticatedGraghql(context);
    //implement validation function
    isvalidGraghql(postValidation,args)
    const PostRepo = new PostRepostory();
    const post = await PostRepo.getOne(
        { _id: args.id },
        {},
        { populate: { path: "userId" } }
    );
    if (!post) {
        throw new Error("Post not found");
    }
    return post;
};

export const getPosts = async () => {
    const PostRepo = new PostRepostory();
    const posts = await PostRepo.getAll(
        {},
        {},
        { populate: { path: "userId" } }
    );
    return {
        message: "Posts fetched successfully",
        success: true,
        data: posts
    };
};