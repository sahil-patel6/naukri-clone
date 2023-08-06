import { Publisher, Subjects,  UserUpdatedEvent} from "@naukri-clone/common";

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent>{
  readonly subject = Subjects.UserUpdated;
}