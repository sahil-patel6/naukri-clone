import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface RecruiterProfileAttrs {
  user_id: string;
  name: string;
  email: string;
  phone_number?: string;
  isVerified: boolean;
  profile_image?: string;
  current_position?: string;
  company_name?: string;
  company_logo?: string;
  company_website?: string;
  company_email?: string;
  company_address?: string;
  company_description?: string;
}


interface RecruiterProfileModel extends mongoose.Model<RecruiterProfileDoc> {
  build(attrs: RecruiterProfileAttrs): RecruiterProfileDoc;
}

interface RecruiterProfileDoc extends mongoose.Document {
  user_id:string;
  name: string;
  email: string;
  phone_number?: string;
  isVerified: boolean;
  profile_image?: string;
  current_position?: string;
  company_name?: string;
  company_logo?: string;
  company_website?: string;
  company_email?: string;
  company_address?: string;
  company_description?: string;
  createdAt: string;
  updatedAt: string;
}

const recruiterProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone_number: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profile_image: {
    type: String,
  },
  current_position: {
    type: String,
  },
  company_name: {
    type: String,
  },
  company_logo: {
    type: String,
  },
  company_website: {
    type: String,
  },
  company_email: {
    type: String,
  },
  company_address: {
    type: String,
  },
  company_description: {
    type: String,
  },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
    }
  }
})

recruiterProfileSchema.set('versionKey', 'version')
recruiterProfileSchema.plugin(updateIfCurrentPlugin)

recruiterProfileSchema.statics.build = (attrs: RecruiterProfileAttrs) => {
  return new RecruiterProfile(attrs);
}

const RecruiterProfile = mongoose.model<RecruiterProfileDoc, RecruiterProfileModel>('RecruiterProfile', recruiterProfileSchema);

export { RecruiterProfile };