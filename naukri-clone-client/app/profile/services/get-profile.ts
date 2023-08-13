import { toast } from "@/components/ui/use-toast";
import { API } from "@/lib/API";
import { UserRole } from "@/lib/features/currentUserSlice";
import axios from "axios";

export async function getProfile(role: UserRole, setProfile: Function) {
  try {
    const response = await axios.get(
      role === UserRole.RECRUITER ?
        API.GET_RECRUITER_PROFILE
        : API.GET_CANDIDATE_PROFILE,
      { withCredentials: true }
    )
    console.log(response.data)
    setProfile(response.data)
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