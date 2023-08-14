import { toast } from "@/components/ui/use-toast";
import { API } from "@/lib/API";
import https from "https"
import axios from "axios";
import { error_handler } from "@/services/error-handler";

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
    error_handler(err)
  }
}
