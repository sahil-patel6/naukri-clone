import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signout } from "@/services/profile/signout";
import { Loader, LogOut, Pencil } from "lucide-react";
import Image from "next/image";

interface RecruiterProfileProps {
  id: string;
  name: string;
  email: string;
  profile_image: string;
  phone_number: string;
  current_position: string;
  company_name: string;
  company_description: string;
  company_address: string;
  company_logo: string;
}

export default function ViewRecruiterProfile({
  profile,
}: {
  profile: RecruiterProfileProps;
}) {
  if (profile) {
    return (
      <>
        <div className="container mt-5">
          <p className="text-2xl mb-5 font-semibold">Your Details:</p>
          <div className="flex flex-col md:flex-row gap-x-10 items-cente bg-gray-900 px-10 py-5 rounded-lg text-white">
            {/* <Image
              src={profile.profile_image}
              width={200}
              height={200}
              alt="profile-image"
              loading="lazy"
              className="rounded-full"
              style={{ objectFit: "cover" }}
            /> */}
            <Avatar className="w-[160px] h-[160px] self-center">
              <AvatarImage src={profile.profile_image} />
              <AvatarFallback className="text-8xl">
                {profile.name.split(" ").map((word) => word[0])}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-5 text-xl mt-10 md:mt-0 ">
              <p>
                <span className="font-semibold">Name: </span>
                {profile.name}
              </p>
              <p>
                <span className="font-semibold">Email: </span>
                {profile.email}
              </p>
              <p>
                <span className="font-semibold">Phone number: </span>
                {profile.phone_number}
              </p>
              <p>
                <span className="font-semibold">Role: </span>
                {profile.current_position}
              </p>
            </div>
          </div>
          <p className="text-2xl my-5 font-semibold">Your Company Details:</p>
          <div className="flex flex-col md:flex-row gap-x-10 items-center bg-gray-900 px-10 py-5 rounded-lg text-white">
            {/* <Image
              src={profile.company_logo}
              width={200}
              height={200}
              alt="company-logo"
              loading="lazy"
              className="rounded-full"
              // fill
              // loader={}
              style={{ objectFit: "cover" }}
            /> */}
            <Avatar className="w-[160px] h-[160px] self-center">
              <AvatarImage src={profile.company_logo} />
              <AvatarFallback className="text-8xl">
                {profile.company_name.split(" ").map((word) => word[0].toUpperCase())}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-5 text-xl mt-10 md:mt-0">
              <p>
                <span className="font-semibold">Name: </span>
                {profile.company_name}
              </p>
              <p>
                <span className="font-semibold">Description: </span>{" "}
                {profile.company_description}
              </p>
              <p>
                <span className="font-semibold">Address: </span>
                {profile.company_address}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center my-10">
            <Button className="text-center text-white mb-10 bg-green-600 md:mb-0 md:mr-20 hover:bg-green-500 md:w-1/4">
              <Pencil className="mr-2 h-4 w-4" />
              <span>Update Profile</span>
            </Button>
            <Button
              className="text-center  text-white bg-blue-600 hover:bg-blue-500 md:w-1/4"
              onClick={signout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return <></>;
}
