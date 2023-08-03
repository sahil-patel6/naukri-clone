import { Publisher, Subjects, UserVerifiedEvent } from "@naukri-clone/common";

export class UserVerifiedPublisher extends Publisher<UserVerifiedEvent>{
  readonly subject = Subjects.UserVerified;
}