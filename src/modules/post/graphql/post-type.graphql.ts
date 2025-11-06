import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UserType } from "../../user/graphql/user-type.graphql"

export const PostType = new GraphQLObjectType({
    name:"Post",
    fields:{
        _id:{type:GraphQLID},
        content:{type:GraphQLString},
        userId:{
            type:UserType
        },
        createdAt:{
            type:GraphQLString,
            resolve:(parent)=>{
                if(parent.createdAt)
                    return new Date(parent.createdAt).toISOString();
                
                return parent.createdAt;
     } },
        updatedAt:{type:GraphQLString,
            resolve:(parent)=>{
                if(parent.updatedAt)
                    return new Date(parent.updatedAt).toISOString();
                
     } }
    }
})

export const postResponse = new GraphQLObjectType({
    name:"PostResponse",
    fields:{
        message:{type:GraphQLString},
        success:{type:GraphQLBoolean},
        data:{type:PostType}
    }
});

export const postListResponse = new GraphQLObjectType({
    name:"PostListResponse",
    fields:{
        message:{type:GraphQLString},
        success:{type:GraphQLBoolean},
        data:{type:new GraphQLList(PostType)}
    }
});