import { Listener, Subjects, UserUpdatedEvent } from "@naukri-clone/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { User } from "../../models/user";

export class UserUpdatedListener extends Listener<UserUpdatedEvent>{

  readonly subject = Subjects.UserUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {

    console.log(data);
    
    const user = await User.findById(data.id);
    
    if (!user){
      throw new Error("User not found")
    }

    user.email = data.email;
    user.name = data.name;
    await user.save();
    return msg.ack();
  }

}