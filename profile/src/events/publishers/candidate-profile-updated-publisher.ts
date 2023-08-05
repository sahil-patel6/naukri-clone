import { Publisher, Subjects,  CandidateProfileUpdatedEvent} from "@naukri-clone/common";

export class CandidateProfileUpdatedPublisher extends Publisher<CandidateProfileUpdatedEvent>{
  readonly subject = Subjects.CandidateProfileUpdated;
}