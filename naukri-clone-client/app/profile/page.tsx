"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/features/currentUserSlice";
import ViewRecruiterProfile from "@/components/profile/recruiter-profile/view-recruiter-profile";
import { getProfile } from "@/services/profile/get-profile";

export default function Profile() {
  const currentUser = useSelector((state: RootState) => state.currentUser);

  const [profile, setProfile] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!currentUser.email && currentUser.isFetched) {
      router.replace("/login");
    }
    if (currentUser.isFetched && !profile) {
      getProfile(currentUser.role!, setProfile);
    }
  }, [currentUser]);

  const getProfileView = () => {
    if (currentUser.isFetched && currentUser.role === UserRole.RECRUITER && profile) {
      return <ViewRecruiterProfile profile={profile} />;
    } else if (
      currentUser.isFetched &&
      currentUser.role === UserRole.CANDIDATE && profile
    ) {
      return <div>Candidate Profile</div>;
    } else {
      return <div>Loading...</div>;
    }
  };

  return <div className="container flex flex-col">{getProfileView()}</div>;
}
