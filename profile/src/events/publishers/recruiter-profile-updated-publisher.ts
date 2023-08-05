import { Publisher, Subjects,  RecruiterProfileUpdatedEvent} from "@naukri-clone/common";

export class RecruiterProfileUpdatedPublisher extends Publisher<RecruiterProfileUpdatedEvent>{
  readonly subject = Subjects.RecruiterProfileUpdated;
}