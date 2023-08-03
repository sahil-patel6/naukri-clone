import { Publisher, Subjects, UserCreatedEvent } from "@naukri-clone/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent>{
  readonly subject = Subjects.UserCreated;
}