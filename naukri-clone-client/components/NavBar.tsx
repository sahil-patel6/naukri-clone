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
import { UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

function NavBar() {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    async function getCurrentUser() {
      try {
        if (!currentUser.email) {
          const response = await axios.get(API.CURRENT_USER_URL, {
            // httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            withCredentials: true,
          });
          console.log(response.data);
          if (response.data.currentUser){
            dispatch(
              addCurrentUser({
                id: response.data.currentUser.id,
                email: response.data.currentUser.email,
                role: response.data.currentUser.role,
                name: response.data.currentUser.name,
                isVerified: response.data.currentUser.isVerified,
                isFetched: true,
              })
            );
          }else{
            console.log("NOT SIGNED IN");
            router.replace("/login")
          }
          
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
    <div className="flex min-h-[50px] p-3 justify-between items-center">
      <Link className="cursor-pointer text-lg font-semibold" href={"/"}>
        Naukri Clone
      </Link>
      <div className="flex gap-8">
        {currentUser.isFetched && currentUser.email ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <UserCircle
                  size={40}
                  className="self-center rounded-full p-[5px] hover:bg-[#1e293b]"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  My Account ({currentUser.name})
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={"/profile"}>
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer" onClick={signout}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : currentUser.isFetched && !currentUser.email ? (
          <>
            <Button asChild variant={"secondary"}>
              <Link href={"/login"}>Login</Link>
            </Button>
            <Button asChild variant={"secondary"}>
              <Link href={"/register"}>Register</Link>
            </Button>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default NavBar;
