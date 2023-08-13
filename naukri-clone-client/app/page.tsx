"use client";

import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const router = useRouter();

  useEffect(() => {
    if (currentUser.email && !currentUser.isVerified) {
      router.replace("/verify-otp");
    }
  }, [currentUser]);

  return (
    <main className="container">
      <h1 className="text-4xl text-center">
        {currentUser.email
          ? `You are signed in and here is your email : ${currentUser.email}`
          : "You are not signed in"}
      </h1>
    </main>
  );
}
