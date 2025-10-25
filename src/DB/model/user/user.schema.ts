import bcrypt from "bcryptjs";
import { Schema } from "mongoose";
import { IUser } from "../../../utlis/common/interface";
import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utlis/common/enum";
import { sendEmail } from "../../../utlis/email";

export const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    tempEmail: { type: String },
    password: {
      type: String,
      required: function () {
        return (this as any).userAgent !== USER_AGENT.google;
      },
    },
    credentialsUpdatedAt: { type: Date },
    phoneNumber: { type: String },
    role: {
  type: Number,
  enum: Object.values(SYS_ROLE),
  default: SYS_ROLE.user, // لازم يكون رقم
},
gender: {
  type: Number,
  enum: Object.values(GENDER),
  default: GENDER.male, // لازم رقم
},
userAgent: {
  type: Number,
  enum: Object.values(USER_AGENT),
  default: USER_AGENT.local, // لازم رقم
},
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blockedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isBlocked: { type: Boolean, default: false },
    friendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ إرسال إيميل التفعيل عند إنشاء حساب جديد
userSchema.pre("save", async function (next) {
  if (this.userAgent !== USER_AGENT.google && this.isNew === true) {
    await sendEmail({
      to: this.email,
      subject: "Confirm your account",
      html: `<h1>Your OTP is ${this.otp}</h1>`,
    });
  }
  next();
});

// ✅ Virtual field (fullName)
userSchema
  .virtual("fullName")
  .get(function (this: any) {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (this: any, value: string) {
    if (typeof value === "string" && value.trim().length > 0) {
      const parts = value.trim().split(" ");
      this.firstName = parts[0];
      this.lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
    }
  });

// ✅ Hash password قبل الحفظ
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ مقارنة الباسورد
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};
