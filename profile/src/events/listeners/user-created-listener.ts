import { Listener, Subjects, UserCreatedEvent, UserRole } from "@naukri-clone/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { CandidateProfile } from "../../models/candidate-profile";
import { RecruiterProfile } from "../../models/recruiter-profile";

export class UserCreatedListener extends Listener<UserCreatedEvent>{

  readonly subject = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    console.log(data);

    if (data.role === UserRole.CANDIDATE) {
      const candidateProfile = CandidateProfile.build({
        email: data.email,
        user_id: data.id,
        isVerified: data.isVerified,
        name: data.name
      })
      await candidateProfile.save();
      return msg.ack()
    }

    if (data.role === UserRole.RECRUITER) {
      const recruiterProfile = RecruiterProfile.build({
        email: data.email,
        user_id: data.id,
        isVerified: data.isVerified,
        name: data.name
      })
      await recruiterProfile.save();
      return msg.ack()
    }

    if (data.role === UserRole.ADMIN) {
      return msg.ack()
    }
    
  }

}