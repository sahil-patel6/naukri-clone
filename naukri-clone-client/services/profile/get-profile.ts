import { API } from "@/lib/API";
import { UserRole } from "@/lib/features/currentUserSlice";
import axios from "axios";
import { error_handler } from "../error-handler";

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
    error_handler(err)
  }
}