import { Listener, Subjects, UserUpdatedEvent } from "@naukri-clone/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class UserUpdatedListener extends Listener<UserUpdatedEvent>{

  readonly subject = Subjects.UserUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    /*
      TODO: implement User Updated Listener functionality
    */
    console.log(data);
  }

}