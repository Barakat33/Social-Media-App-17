import { Schema } from "mongoose";
import { IComment } from "../../../utlis";
import { reactionSchema } from "../common";

export const commentSchema = new Schema<IComment>(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        postId:{
            type: Schema.Types.ObjectId,
            ref:"Post",
            required:true
        },
        parentId:{
            type:Schema.Types.ObjectId,
            ref:"Comment",
            required:false,
            default: null
            },
        isFrozen: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },

        content :{type:String},
        reactions:[reactionSchema],
    },
    {timestamps:true , toJSON:{virtuals:true},toObject:{virtuals:true}}
);

commentSchema.virtual("replies", {
    ref:"Comment",
    localField:"_id",
    foreignField:"parentId"
    });

    commentSchema.pre("deleteOne", async function (next) {
  const filter = this.getFilter ? this.getFilter() : {};
  const replies = await new this.model("Comment").find({ parentId: filter._id });
  if (replies.length) {
    for (const reply of replies) {
      await reply.deleteOne({ _id: reply._id });
    }
  }
  next(); // base case
});

    