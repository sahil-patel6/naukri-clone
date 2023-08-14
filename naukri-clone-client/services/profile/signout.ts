import { API } from "@/lib/API";
import { signOutUser } from "@/lib/features/currentUserSlice";
import { store } from "@/lib/store";
import axios from "axios";
import { error_handler } from "../error-handler";

export async function signout(e: any) {
  e.preventDefault();
  try {
    const response = await axios.post(
      API.SIGNOUT_URL,
      {},
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    store.dispatch(signOutUser());
  } catch (err: any){
    error_handler(err)
  }
};