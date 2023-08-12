import { toast } from "@/components/ui/use-toast";
import { API } from "@/lib/API";
import https from "https"
import axios from "axios";

export async function sendOTP() {
  try {
    const response = await axios.post(
      API.SEND_OTP_URL,
      {},
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
