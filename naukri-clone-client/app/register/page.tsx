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
import { Toaster } from "@/components/ui/toaster";
import { RootState } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { addCurrentUser } from "@/lib/features/currentUserSlice";

const FormSchema = z
  .object({
    name: z.string().min(3, {
      message: "Name must be at least 3 characters.",
    }),
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
    confirm_password: z
      .string()
      .min(8, {
        message: "password should contain atleast 8 characters",
      })
      .max(20, {
        message: "password can most contain 20 characters",
      }),
    role: z.enum(["CANDIDATE", "RECRUITER"]),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

export default function Register() {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (currentUser.email) {
      console.log("Already signed in my boy...");
      toast({
        title: "Already signed in...",
        className: "bg-green-500",
        duration: 2000,
      });
    }
  }, []);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    try {
      const response = await axios.post(
        "https://naukri.dev/api/users/signup",
        {
          name: data.name,
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
        })
      );
      router.replace("/verify-otp");
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
    <div className="container flex justify-center items-center h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/3 space-y-3"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name: </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className="focus:border-2 focus:border-cyan-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password: </FormLabel>
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
          <Button
            type="submit"
            className="w-full focus:border-2 focus:border-cyan-200"
          >
            Register
          </Button>
          <p>
            {" "}
            Already have an account?{" "}
            <Link href={"/login"} className="text-blue-600">
              Login
            </Link>{" "}
            here
          </p>
        </form>
      </Form>
    </div>
  );
}
