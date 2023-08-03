import mongoose from "mongoose";

interface OTPAttrs {
  otp: string;
  email: string;
}

interface OTPModel extends mongoose.Model<OTPDoc> {
  build(attrs: OTPAttrs): OTPDoc;
}

interface OTPDoc extends mongoose.Document {
  email: string;
  otp: string;
  createdAt: string;
}

const otpSchema = new mongoose.Schema(
  {
      email: {
          type: String,
          required: true,
      },
      otp: {
          type: String,
          required: true,
      },
      createdAt: {
          type: Date,
          default: Date.now,
          expires: 300, // expires after 5 minutes (300 seconds)
      },
  }
);


otpSchema.statics.build = (attrs: OTPAttrs) => {
  return new OTP(attrs);
}

const OTP = mongoose.model<OTPDoc, OTPModel>('OTP', otpSchema);

export { OTP };