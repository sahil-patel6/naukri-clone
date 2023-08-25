"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SideBarCandidateProfile from "@/components/profile/candidate-profile/sidebar-candidate-profile";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { UserRole } from "@/lib/features/currentUserSlice";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naukri Clone",
  description: "Find jobs here",
};

export default function CandidateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = useSelector((state: RootState) => state.currentUser);

  return (
    <div>
      {currentUser &&
      currentUser.role &&
      currentUser.role === UserRole.CANDIDATE ? (
        <SideBarCandidateProfile>{children}</SideBarCandidateProfile>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
