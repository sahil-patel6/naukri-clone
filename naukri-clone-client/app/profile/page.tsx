"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/features/currentUserSlice";
import ViewRecruiterProfile from "@/components/profile/recruiter-profile/view-recruiter-profile";
import { getProfile } from "@/services/profile/get-profile";
import RecruiterProfileLoadingSkeleton from "@/components/profile/recruiter-profile/recruiter-profile-loading-skeleton";
import ViewCandidateProfile from "@/components/profile/candidate-profile/view-candidate-profile";

export default function Profile() {
  const currentUser = useSelector((state: RootState) => state.currentUser);

  const [profile, setProfile] = useState(null);

  const router = useRouter();

  const getP = async () => {
    const profile = await getProfile(currentUser.role!);
    console.log(profile);
    setProfile(profile);
  };

  useEffect(() => {
    if (!currentUser.email && currentUser.isFetched) {
      router.replace("/login");
    }
    if (currentUser.isFetched && !profile) {
      getP();
    }
  }, [currentUser]);

  const updateProfile = (profile: any) => {
    setProfile(profile);
  };

  const getProfileView = () => {
    if (
      currentUser.isFetched &&
      currentUser.role === UserRole.RECRUITER &&
      profile
    ) {
      return (
        <ViewRecruiterProfile profile={profile} updateProfile={updateProfile} />
      );
    } else if (
      currentUser.isFetched &&
      currentUser.role === UserRole.CANDIDATE &&
      profile
    ) {
      return (
        <ViewCandidateProfile profile={profile} updateProfile={updateProfile} />
      );
    } else if (
      currentUser.isFetched &&
      currentUser.role === UserRole.RECRUITER
    ) {
      return <RecruiterProfileLoadingSkeleton />;
    } else if (
      currentUser.isFetched &&
      currentUser.role === UserRole.CANDIDATE
    ) {
      return <p>Candidate Profile Loading</p>;
    } else {
      return <p>Loading</p>;
    }
  };

  return <div>{getProfileView()}</div>;
}
