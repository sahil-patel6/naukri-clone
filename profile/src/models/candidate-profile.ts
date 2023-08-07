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
  bio?: string;
  dob?: string;
  gender?: Gender;
  current_location?: string;
  preferred_work_location?: string;
  key_skills?: [string];
  resume?: string;
  languages?: [Language];
  social_links?: SocialLinks;
  work_experiences?: [WorkExperience];
  educations?: [Education];
  courses_and_certifications?: [CoursesAndCertification];
  projects?: [Project],
}


interface CandidateProfileModel extends mongoose.Model<CandidateProfileDoc> {
  build(attrs: CandidateProfileAttrs): CandidateProfileDoc;
}

export interface CandidateProfileDoc extends mongoose.Document {
  user_id: string;
  name: string;
  email: string;
  phone_number?: string;
  isVerified: boolean;
  profile_image?: string;
  bio?: string;
  dob?: string;
  gender?: Gender;
  current_location?: string;
  preferred_work_location?: string;
  key_skills?: [string];
  resume?: string;
  languages?: [Language];
  social_links?: SocialLinks;
  work_experiences?: [WorkExperience];
  educations?: [Education];
  courses_and_certifications?: [CoursesAndCertification];
  projects?: [Project],
  version: number;
  createdAt: string;
  updatedAt: string;
}

const candidateProfileSchema = new mongoose.Schema({
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
  bio: {
    type: String
  },
  dob: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Others']
  },
  current_location: {
    type: String
  },
  preferred_work_location: {
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
  languages: {
    type: [{
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
    default: []
  },
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
    linkedin: {
      type: String,
      default: null
    },
    github: {
      type: String,
      default: null
    }
  },
  work_experiences: {
    type: [{
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
      current_working_status: {
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
    default: []
  },
  educations: {
    type: [{
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
    default: []
  },
  courses_and_certifications: {
    type: [{
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
    default: []
  },
  projects: {
    type: [{
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
    }],
    default: []
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.createdAt;
      delete ret.updatedAt;
      ret.languages.forEach((lan: any) => {
        lan.id = lan._id;
        delete lan._id;
      })
      ret.work_experiences.forEach((work_experience: any) => {
        work_experience.id = work_experience._id;
        delete work_experience._id;
      })
      ret.educations.forEach((education: any) => {
        education.id = education._id;
        delete education._id;
      })
      ret.courses_and_certifications.forEach((course: any) => {
        course.id = course._id;
        delete course._id;
      })
      ret.projects.forEach((project: any) => {
        project.id = project._id;
        delete project._id;
      })
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