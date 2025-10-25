import { Schema, Query } from "mongoose";
import { IPost, IReaction, REACTION } from "../../../utlis";
import { reactionSchema } from "../common";
import { Comment } from "../comment/comment.model";


export const postSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: function () {
        if ((this as any).attachments?.length) return false;
        return true;
      },
      trim: true,
    },
    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Attachment",
      },
    ],
    reactions: [reactionSchema], 
    isFrozen: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    
  },
  { timestamps: true ,toJSON:{virtuals:true},toObject:{virtuals:true}}
);

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
});

postSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (this: Query<any, any>, next) {
    const filter = this.getFilter ? this.getFilter() : {};
    // const fristLayer = await Comment.find({ postId: filter._id, parentId: null });
    // if (fristLayer.length) {
    //   for (const comment of fristLayer) {
    //     await comment.deleteOne({ _id: comment._id });
    //   }
    // }
    await Comment.deleteMany({ postId: (filter as any)._id });
    next();
  }
);
