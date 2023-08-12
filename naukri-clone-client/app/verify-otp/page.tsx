"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { sendOTP } from "./services/sendOTP";
import { verifyOTP } from "./services/verifyOTP";
import { RootState } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { verifiedUser } from "@/lib/features/currentUserSlice";

const FormSchema = z.object({
  otp: z.string().length(6, {
    message: "OTP should have 6 characters",
  }),
});

export default function Register() {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (currentUser.isVerified) {
      console.log("Already Verified");
      toast({
        title: "Your email is already verified",
        className: "bg-green-500",
        duration: 2000,
      });
    } else {
      sendOTP();
    }
  }, []);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await verifyOTP(data);
    dispatch(verifiedUser());
    router.replace("/");
  }

  return (
    <div className="container flex flex-col justify-center items-center h-full">
      <p>Verify your email:</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/3 space-y-3"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP: </FormLabel>
                <FormControl>
                  <Input
                    placeholder="123456"
                    {...field}
                    className="focus:border-2 focus:border-cyan-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Verify Email
          </Button>
          <p>
            {" "}
            Didn't got the otp yet? Try{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                sendOTP();
              }}
            >
              resend
            </span>{" "}
            here
          </p>
        </form>
      </Form>
    </div>
  );
}
