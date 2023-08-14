import { toast } from "@/components/ui/use-toast";
import { API } from "@/lib/API";
import axios from "axios";
import https from "https";
import { error_handler } from "../error-handler";

export async function verifyOTP(data: { otp: string }) {
  console.log(data);
  try {
    const response = await axios.post(
      API.VERIFY_OTP_URL,
      {
        otp: data.otp,
      },
      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        withCredentials: true,
      }
    );
    console.log(response.data);
    toast({
      title: response.data.message,
      className: "bg-green-500",
      duration: 2000,
    });
  } catch (err: any) {
    error_handler(err);
  }
}