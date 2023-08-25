import { RecruiterProfileProps } from "../recruiter-profile/recruiter-profile-props";

export default function ViewCandidateProfile({
  profile,
  updateProfile,
}: {
  profile: RecruiterProfileProps;
  updateProfile: Function;
}) {
  return (
    <div className="mt-5 flex md:ml-5 md:mt-0">
      <p>something</p>
    </div>
  );
}
