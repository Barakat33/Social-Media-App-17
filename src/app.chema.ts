import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { PostQuery } from "./modules/post/graphql/query";

let query = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        ...PostQuery,
            
        }
    }
);

export const appSchema = new GraphQLSchema({
    query,
})