export default function ViewRecruiterProfile({ profile }: { profile: any }) {
  return (
    <>
      <div className="flex">{profile ? profile.name : ""}</div>
    </>
  );
}
