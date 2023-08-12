import { toast } from "@/components/ui/use-toast";
import { API } from "@/lib/API";
import axios from "axios";
import https from "https";

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