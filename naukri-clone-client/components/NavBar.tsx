"use client";
import { useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import axios from "axios";
import { API } from "@/lib/API";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  UserRole,
  addCurrentUser,
  signOutUser,
} from "@/lib/features/currentUserSlice";
import { toast } from "./ui/use-toast";
import { LogOut, User, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { signout } from "@/services/profile/signout";
import { error_handler } from "@/services/error-handler";
import { getProfile } from "@/services/profile/get-profile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function NavBar() {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    async function getCurrentUser() {
      console.log("CALLED", currentUser);
      try {
        if (!currentUser.isFetched && !currentUser.email) {
          const response = await axios.get(API.CURRENT_USER_URL, {
            // httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            withCredentials: true,
          });

          console.log(response.data);
          if (response.data.currentUser) {
            const { data: profile } = await axios.get(
              response.data.currentUser.role === UserRole.RECRUITER
                ? API.GET_RECRUITER_PROFILE
                : API.GET_CANDIDATE_PROFILE,
              {
                // httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                withCredentials: true,
              },
            );
            dispatch(
              addCurrentUser({
                id: response.data.currentUser.id,
                email: response.data.currentUser.email,
                role: response.data.currentUser.role,
                name: profile.name,
                isVerified: response.data.currentUser.isVerified,
                isFetched: true,
                profile_image: profile.profile_image,
              }),
            );
          } else {
            console.log("NOT SIGNED IN");
            dispatch(
              addCurrentUser({
                isFetched: true,
              }),
            );
          }
        }
      } catch (err: any) {
        error_handler(err);
      }
    }
    if (!currentUser.email) {
      getCurrentUser();
    }
  }, [currentUser]);

  return (
    <div className="flex min-h-[60px] items-center justify-between p-3  ">
      <Link className="cursor-pointer text-lg font-semibold" href={"/"}>
        Naukri Clone
      </Link>
      <div className="flex gap-8">
        {currentUser.isFetched && currentUser.email ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                {currentUser.profile_image ? (
                  <Avatar className="h-[35px] w-[35px]">
                    <AvatarImage src={currentUser.profile_image} />
                    <AvatarFallback className="text-8xl">
                      {currentUser.name?.split(" ").map((word) => word[0])}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <UserCircle
                    size={40}
                    className="self-center rounded-full p-[5px] hover:bg-[#1e293b]"
                  />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  My Account ({currentUser.name})
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={"/profile"}>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer" onClick={signout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
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
