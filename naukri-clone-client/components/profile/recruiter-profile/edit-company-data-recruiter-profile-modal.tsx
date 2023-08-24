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
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  company_name: z.string().min(3, {
    message: "Name should have atleast 3 characters",
  }),
  company_description: z
    .string()
    .min(5, {
      message: "Description should have 5 characters",
    })
    .max(500, {
      message: "Description cannot have more than 500 characters",
    }),
  company_address: z
    .string()
    .min(10, {
      message: "address cannot be empty",
    })
    .max(200, {
      message: "Address cannot be too long",
    }),
});

export default function EditCompanyDataRecruiterProfileModal({
  profile,
  updateProfile,
}: {
  profile: RecruiterProfileProps;
  updateProfile: Function
}) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [pickedCompanyLogo, setPickedCompanyLogo] = useState<File | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      company_name: profile.company_name ?? "",
      company_description: profile.company_description ?? "",
      company_address: profile.company_address ?? "",
    },
  });
  const handleCompanyLogoChange = (e: any) => {
    console.log(e.target.files);
    setPickedCompanyLogo(e.target.files[0]);
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    try {
      if (!profile.company_logo && !pickedCompanyLogo) {
        toast({
          title: "Please pick a company logo",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }
      setIsLoading(true);
      const formData = new FormData();
      if (pickedCompanyLogo) {
        console.log(pickedCompanyLogo);
        formData.append("company_logo", pickedCompanyLogo);
      }
      formData.append("company_name", data.company_name);
      formData.append("company_description", data.company_description);
      formData.append("company_address", data.company_address);
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
      setPickedCompanyLogo(null);
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Your Company Information</DialogTitle>
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
                  pickedCompanyLogo
                    ? URL.createObjectURL(pickedCompanyLogo)
                    : profile.company_logo
                }
              />
              <AvatarFallback className="text-8xl">
                {profile.company_name
                  ? profile.company_name
                      .split(" ")
                      .map((word) => word[0].toUpperCase())
                  : "C"}
              </AvatarFallback>
            </Avatar>
            <Input
              id="picture"
              type="file"
              className="hidden"
              onChange={handleCompanyLogoChange}
            />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-3"
            >
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name: </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Google"
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
                name="company_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description: </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about your company"
                        className="resize-none focus:border-2 focus:border-blue-600"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Address: </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us your company address"
                        className="resize-none focus:border-2 focus:border-blue-600"
                        {...field}
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
