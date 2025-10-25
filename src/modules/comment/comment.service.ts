import { Request, Response } from "express";
import { PostRepostory } from "../../DB";
import { IAuthUser, IComment, IPost, NotAuthorizedException, NotFoundException, BadRequestException } from "../../utlis";
import { CommentRepository } from "../../DB";
import { CreateCommentDTO } from "./comment.dto";
import { CommentFactoryService } from "./factory";
import { addReactionProvider } from "../../utlis/common/providers/react.provider";

class CommentService{
private readonly commentFactoryService = new CommentFactoryService();
private readonly postRepository = new PostRepostory();
private readonly commentRepository = new CommentRepository();
    create=async(req:Request,res:Response)=>{
        //get data from req
        const{postId,id}=req.params;
        const createCommentDTO:CreateCommentDTO = req.body;
        //checkpost exixt or not
        const postExist = await this.postRepository.exist({_id:postId});
        if(!postExist) throw new NotFoundException("post not found");
       //check comment exist
        let commentExist:IComment|any = undefined;
       if(id){
        commentExist = await this.commentRepository.exist({_id:id});
        if(!commentExist) throw new NotFoundException("comment not found");
        } 
       //prepar data for comment >> factory
        console.log({userId:(req as IAuthUser).user._id,postId:postExist._id,commentId:commentExist?._id})

        const comment = this.commentFactoryService.createComment(
        createCommentDTO,
        (req as IAuthUser).user,
        postExist,
        commentExist);
    //save in DB
    const cretedComment =await this.commentRepository.create(comment);
    //send response
    res.status(201).json({
        message:"comment created successfully",
        success:true,
        data:cretedComment
    });
    };  
    
    getSpecific =async(req:Request,res:Response)=>{
        //get data from req
        const {id} = req.params;
        //check comment exist
        const commentExist = await this.commentRepository.exist({_id:id});
        if(!commentExist) throw new NotFoundException("comment not found");
        //get comment
        if(!commentExist) throw new NotFoundException("comment not found");
        res.status(200).json({
            message:"done",
            success:true,
            data:{commentExist}
        })
    }

    deletcomment=async(req:Request,res:Response)=>{
        //get data from req
        const {id} = req.params;
        //check comment exist
        const commentExist = await this.commentRepository.exist(
            { _id: id },
            {},
            {
                populate: [
                    { path: "postId", select: "userId" },
                ],
            }
        );
        if(!commentExist) throw new NotFoundException("comment not found");
        //check user authorized
        if (
            commentExist.userId.toString() !== (req as IAuthUser).user._id.toString() &&
            (commentExist.postId as unknown  as IPost).userId.toString() !== (req as IAuthUser).user._id.toString()
        )
        throw new NotAuthorizedException("You are not authorized to delete this comment");
        //delete comment
        await this.commentRepository.delete({ _id: id });
        //send response
        res.status(200).json({
            message:"comment deleted successfully",
            success:true,
            data:{commentExist}
        })
    }   

    public addReaction =async(req:Request,res:Response)=>{
        //get data from req
        const {id} = req.params;
        const {reaction} = req.body;

        //add reaction
        if (!id) throw new BadRequestException("comment id is required");

        await addReactionProvider(
            this.commentRepository,
            id,
            req.user._id.toString(),
            (reaction ?? "")
        );
        res.sendStatus(204);
    }

    //freeze comment
    public freezeComment = async (req: Request, res: Response) => {
        // get data from req
        const { id } = req.params;
        // check comment exist
        const commentExist = await this.commentRepository.exist({ _id: id });
        if (!commentExist) throw new NotFoundException("comment not found");
        // check if comment owner is the same as the user
        if (commentExist.userId.toString() !== (req as IAuthUser).user._id.toString())
          throw new NotAuthorizedException("You are not authorized to freeze this comment");
        // freeze comment
        await this.commentRepository.update({ _id: id }, { isFrozen: true });
        // send response
        res.status(200).json({
          message: "comment frozen successfully",
          success: true,
          data: { commentExist },
        });
      };


      //hard delete comment
      public hardDeleteComment = async (req: Request, res: Response) => {
        // get data from req
        const { id } = req.params;
        // check comment exist
        const commentExist = await this.commentRepository.exist({ _id: id });
        if (!commentExist) throw new NotFoundException("comment not found");
        // check if comment owner is the same as the user
        if (commentExist.userId.toString() !== (req as IAuthUser).user._id.toString())
          throw new NotAuthorizedException("You are not authorized to hard delete this comment");
        // hard delete comment
        await this.commentRepository.delete({ _id: id });
        // send response
        res.status(200).json({
          message: "comment hard deleted successfully",
          success: true,
          data: { commentExist },
        });
      };

      //update comment
      public updateComment = async (req: Request, res: Response) => {
        // get data from req
        const { id } = req.params;
        const { content } = req.body;
        // check comment exist
        const commentExist = await this.commentRepository.exist({ _id: id });
        if (!commentExist) throw new NotFoundException("comment not found");
        // check if comment owner is the same as the user
        if (commentExist.userId.toString() !== (req as IAuthUser).user._id.toString())
          throw new NotAuthorizedException("You are not authorized to update this comment");
        
        if(commentExist.isFrozen) throw new NotAuthorizedException("You are not authorized to update this comment");
        // update comment
        const updatedComment = await this.commentRepository.update({ _id: id }, { content: content ?? commentExist.content });
        // send response
        res.status(200).json({
          message: "comment updated successfully",
          success: true,
          data: { updatedComment },
        });
      };

      //get comment by id
      public getCommentById = async (req: Request, res: Response) => {
        // get data from req
        const { id } = req.params;
        // check comment exist
        const commentExist = await this.commentRepository.exist({ _id: id });
        if (!commentExist) throw new NotFoundException("comment not found");
        // get comment
        const comment = await this.commentRepository.getOne({ _id: id });
        // send response
        res.status(200).json({
          message: "done",
          success: true,
          data: { comment },
        });
      };
}
export default new CommentService();
