"use client";

import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function Home() {
  const currentUser = useSelector((state: RootState) => state.currentUser);

  return (
    <main className="">
      <Button variant={"destructive"}>
        {currentUser.email
          ? `You are signed in and here is your email : ${currentUser.email}`
          : "You are not signed in"}
      </Button>
    </main>
  );
}
