import { Listener, Subjects, UserRole, UserVerifiedEvent } from "@naukri-clone/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { CandidateProfile } from "../../models/candidate-profile";
import { RecruiterProfile } from "../../models/recruiter-profile";

export class UserVerifiedListener extends Listener<UserVerifiedEvent>{

  readonly subject = Subjects.UserVerified;
  queueGroupName = queueGroupName;

  async onMessage(data: UserVerifiedEvent['data'], msg: Message) {
    
    console.log(data);

    if (data.role === UserRole.CANDIDATE) {

      const candidateProfile = await CandidateProfile.findOne({
        user_id: data.id,
      })

      if (!candidateProfile) {
        throw new Error('Candidate Profile not found')
      }
      candidateProfile.isVerified = true;
      await candidateProfile.save()
      
      return msg.ack()
    }

    if (data.role === UserRole.RECRUITER) {

      const recruiterProfile = await RecruiterProfile.findOne({
        user_id: data.id,
      })
      
      if (!recruiterProfile) {
        throw new Error('Recruiter Profile not found')
      }
      
      recruiterProfile.isVerified = true;
      await recruiterProfile.save();
      
      return msg.ack()
    
    }

    if (data.role === UserRole.ADMIN) {
      return msg.ack();
    }
    
  }

}