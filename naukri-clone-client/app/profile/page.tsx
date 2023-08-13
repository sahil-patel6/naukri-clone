"use client";

import { useEffect } from "react";
import { getProfile } from "./services/get-profile";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function Profile() {
  const currentUser = useSelector((state: RootState) => state.currentUser);

  const router = useRouter();

  useEffect(() => {
    if (!currentUser.email && currentUser.isFetched) {
      router.replace("/login");
    }
    if (currentUser.isFetched){
      getProfile(currentUser.role!);
    }
  });

  return <div className="container">Profile</div>;
}
