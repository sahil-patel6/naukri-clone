"use client";
import { useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import axios from "axios";
import { API } from "@/lib/API";
import https from "https";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { addCurrentUser, signOutUser } from "@/lib/features/currentUserSlice";
import { toast } from "./ui/use-toast";

function NavBar() {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const response = await axios.get(API.CURRENT_USER_URL, {
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
          withCredentials: true,
        });
        console.log(response.data);
        if (response.data.currentUser) {
          dispatch(
            addCurrentUser({
              id: response.data.currentUser.id,
              email: response.data.currentUser.email,
              role: response.data.currentUser.role,
              name: response.data.currentUser.name,
              isVerified: response.data.currentUser.isVerified,
            })
          );
        }
      } catch (err: any) {
        const errors = err?.response?.data?.errors || null;
        if (errors) {
          console.log(errors);
          toast({
            title: errors[0].message,
            variant: "destructive",
            duration: 2000,
          });
        } else {
          toast({
            title: "something went wrong!!",
            variant: "destructive",
            duration: 2000,
          });
        }
        console.log(err);
      }
    }
    if (!currentUser.email) {
      getCurrentUser();
    }
  }, []);

  const signout = async (e: any) => {
    e.preventDefault();
    const response = await axios.post(
      API.SIGNOUT_URL,
      {},
      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        withCredentials: true,
      }
    );
    console.log(response.data);
    dispatch(signOutUser());
  };
  return (
    <div className="flex min-h-[50px] p-5 justify-between items-center">
      <Link className="cursor-pointer text-md" href={"/"}>
        Naukri Clone
      </Link>
      <div className="flex gap-10">
        {currentUser.email ? (
          <Button variant={"secondary"} onClick={signout}>
            Signout
          </Button>
        ) : (
          <>
            <Button asChild variant={"secondary"}>
              <Link href={"/login"}>Login</Link>
            </Button>
            <Button asChild variant={"secondary"}>
              <Link href={"/register"}>Register</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default NavBar;
