"use client";

import Link from "next/link";
import https from "https";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { addCurrentUser } from "@/lib/features/currentUserSlice";
import { useEffect } from "react";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z
    .string()
    .min(8, {
      message: "password should contain atleast 8 characters",
    })
    .max(20, {
      message: "password can most contain 20 characters",
    }),
  role: z.enum(["CANDIDATE", "RECRUITER"]),
});

export default function Register() {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    console.log(currentUser);
    if (currentUser.email && currentUser.isFetched) {
      console.log("User already signed in...");
      router.replace("/");
    }
  }, [currentUser]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    try {
      const response = await axios.post(
        "https://naukri.dev/api/users/signin",
        {
          email: data.email,
          role: data.role,
          password: data.password,
        },
        {
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
          withCredentials: true,
        }
      );
      console.log(response.data);
      dispatch(
        addCurrentUser({
          id: response.data.id,
          email: response.data.email,
          role: response.data.role,
          isVerified: response.data.isVerified,
          name: response.data.name,
          isFetched: true,
        })
      );
      if (!response.data.isVerified) {
        console.log("Going to somewhere");
        router.push("/verify-otp");
      } else {
        router.push("/");
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

  return (
    <div className="container flex flex-col justify-center items-center h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/3 space-y-3"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email: </FormLabel>
                <FormControl>
                  <Input
                    placeholder="abc@abc.com"
                    {...field}
                    type="email"
                    className="focus:border-2 focus:border-cyan-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password: </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="focus:border-2 focus:border-cyan-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of User:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="focus:border-2 focus:border-cyan-200">
                      <SelectValue placeholder="Select a type of User" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CANDIDATE">CANDIDATE</SelectItem>
                    <SelectItem value="RECRUITER">RECRUITER</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
          <p>
            {" "}
            Don't have an account yet?{" "}
            <Link href={"/register"} className="text-blue-600">
              Register
            </Link>{" "}
            here
          </p>
        </form>
      </Form>
    </div>
  );
}
