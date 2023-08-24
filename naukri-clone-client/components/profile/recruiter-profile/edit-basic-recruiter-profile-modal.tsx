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
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { error_handler } from "@/services/error-handler";
import { Loader2, Pencil, Save } from "lucide-react";
import { RecruiterProfileProps } from "./recruiter-profile-props";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const FormSchema = z.object({
  name: z.string().min(3, {
    message: "Name should have atleast 3 characters",
  }),
  phone_number: z.string().length(10, {
    message: "Phone number should have 10 digits",
  }),
  current_position: z.string().min(2, {
    message: "Current Position cannot be empty",
  }),
});

export default function EditBasicRecruiterProfileModal({
  profile,
  updateProfile,
}: {
  profile: RecruiterProfileProps;
  updateProfile: Function
}) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [pickedProfileImage, setPickedProfileImage] = useState<File | null>(
    null
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: profile.name,
      phone_number: profile.phone_number ? profile.phone_number : "",
      current_position: profile.current_position
        ? profile.current_position
        : "",
    },
  });
  const handleProfileImageChange = (e: any) => {
    console.log(e.target.files);
    setPickedProfileImage(e.target.files[0]);
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    try {
      if (!profile.profile_image && !pickedProfileImage) {
        toast({
          title: "Please pick a profile image",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }
      setIsLoading(true);
      const formData = new FormData();
      if (pickedProfileImage) {
        console.log(pickedProfileImage);
        formData.append("profile_image", pickedProfileImage);
      }
      formData.append("name", data.name);
      formData.append("phone_number", data.phone_number);
      formData.append("current_position", data.current_position);
      const response = await axios.post(
        "https://naukri.dev/api/profile/recruiter-profile/",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data, "YE");
      setIsOpen(false);
      updateProfile(response.data)
      toast({
        title: "Profile Updated Successfully",
        className: "bg-green-500",
        duration: 2000,
      });
    } catch (err: any) {
      error_handler(err);
    }
    setIsLoading(false);
  }

  const onModalChange = (status: boolean) => {
    if (!status) {
      setPickedProfileImage(null);
    }
    setIsOpen(status);
  };

  return (
    <ScrollArea>
      <Dialog open={isOpen} onOpenChange={onModalChange}>
        <DialogTrigger className="h-fit">
          <Pencil
            className=" h-10 w-10 text-right hover:bg-gray-800 p-2 rounded-2xl text-white"
            onClick={() => {}}
          />
        </DialogTrigger>
        <DialogContent className="overflow-y-auto max-h-screen">
          <DialogHeader>
            <DialogTitle>Edit Your Basic Information</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center">
            <Avatar
              className=" flex-2 md:flex-none w-[160px] h-[160px] cursor-pointer"
              onClick={() => {
                document.getElementById("picture")?.click();
              }}
            >
              <AvatarImage
                src={
                  pickedProfileImage
                    ? URL.createObjectURL(pickedProfileImage)
                    : profile.profile_image
                }
              />
              <AvatarFallback className="text-8xl">
                {profile.name.split(" ").map((word) => word[0].toUpperCase())}
              </AvatarFallback>
            </Avatar>
            <Input
              id="picture"
              type="file"
              className="hidden"
              onChange={handleProfileImageChange}
            />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-3"
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
                        type="text"
                        className="focus:border-2 focus:border-blue-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number: </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="focus:border-2 focus:border-blue-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="current_position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Position in Company: </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="focus:border-2 focus:border-blue-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  className="text-center  text-white bg-blue-600 hover:bg-blue-500"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
}
