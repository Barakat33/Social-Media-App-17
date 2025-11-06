import { GraphQLID } from "graphql";
import { postListResponse, PostType } from "./post-type.graphql";
import { getSpecificPost } from "./post-service.graphql";
import { getPosts } from "./post-service.graphql";

export const PostQuery = {
    getPost: {
        type:PostType,
        args: {
            id: { type: GraphQLID }
        },
        resolve:getSpecificPost
    },
    getPosts:{
        type:postListResponse,
        args: {
            id: { type: GraphQLID }
        },
        resolve:getPosts
    }
}
