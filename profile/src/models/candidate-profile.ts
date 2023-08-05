import { Gender, Language, SocialLinks, WorkExperience, Education, CoursesAndCertification, Project } from "@naukri-clone/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface CandidateProfileAttrs {
  user_id: string;
  name: string;
  email: string;
  phone_number?: string;
  isVerified: boolean;
  profile_image?: string;
  about?: string;
  bio?: string;
  dob?: Date;
  gender?: Gender;
  current_location?: string;
  key_skills?: [string];
  resume?: string;
  language?: [Language];
  social_links?: SocialLinks;
  work_experience?: [WorkExperience];
  education?: [Education];
  courses_and_certifications?: [CoursesAndCertification];
  projects?: [Project],
}


interface CandidateProfileModel extends mongoose.Model<CandidateProfileDoc> {
  build(attrs: CandidateProfileAttrs): CandidateProfileDoc;
}

interface CandidateProfileDoc extends mongoose.Document {
  user_id: string;
  name: string;
  email: string;
  phone_number?: string;
  isVerified: boolean;
  profile_image?: string;
  about?: string;
  bio?: string;
  dob?: Date;
  gender?: Gender;
  current_location?: string;
  key_skills?: [string];
  resume?: string;
  language?: [Language];
  social_links?: SocialLinks;
  work_experience?: [WorkExperience];
  education?: [Education];
  courses_and_certifications?: [CoursesAndCertification];
  projects?: [Project],
  createdAt: string;
  updatedAt: string;
}

const candidateProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
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
  about: {
    type: String
  },
  bio: {
    type: String
  },
  date_of_birth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Others']
  },
  current_location: {
    type: String
  },
  key_skills: {
    type: Array<String>,
    default: []
  },
  resume: {
    type: String
  },
  marital_status: {
    type: String
  },
  language: [{
    language_name: {
      type: String,
      required: true
    },
    proficiency: {
      type: String,
      required: true,
      enum: ['Beginner', 'Proficient', 'Expert'],
    },
    read: {
      type: Boolean,
      required: true
    },
    write: {
      type: Boolean,
      required: true
    },
    speak: {
      type: Boolean,
      required: true
    }
  }],
  social_links: {
    instagram: {
      type: String,
      default: null
    },
    facebook: {
      type: String,
      default: null
    },
    twitter: {
      type: String,
      default: null
    },
    linkedIn: {
      type: String,
      default: null
    },
    gitHub: {
      type: String,
      default: null
    }
  },
  work_experience: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId
    },
    designation: {
      type: String,
      required: true
    },
    company_name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    current_status: {
      type: Boolean,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
    },
    notice_period: {
      type: String,
      enum: ['Serving Notice Period', 'Immediately available', '15 Days', '30 days', 'More than 30 days'],
    },
    job_description: {
      type: String,
      required: true
    }
  }],
  education: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId
    },
    course: {
      type: String,
      required: true
    },
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
    },
    institute: {
      type: String,
      required: true
    }
  }],
  courseAnd_certification: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true,
    },
    issued_by: {
      type: String,
      required: true
    }
  }],
  projects: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId
    },
    title: {
      type: String,
      required: true
    },
    project_status: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }]
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

candidateProfileSchema.set('versionKey', 'version')
candidateProfileSchema.plugin(updateIfCurrentPlugin)

candidateProfileSchema.statics.build = (attrs: CandidateProfileAttrs) => {
  return new CandidateProfile(attrs);
}

const CandidateProfile = mongoose.model<CandidateProfileDoc, CandidateProfileModel>('CandidateProfile', candidateProfileSchema);

export { CandidateProfile };