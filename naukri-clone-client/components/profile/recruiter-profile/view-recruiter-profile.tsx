import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signout } from "@/services/profile/signout";
import { LogOut } from "lucide-react";
import EditBasicRecruiterProfileModal from "./edit-basic-recruiter-profile-modal";
import { RecruiterProfileProps } from "./recruiter-profile-props";
import EditCompanyDataRecruiterProfileModal from "./edit-company-data-recruiter-profile-modal";

export default function ViewRecruiterProfile({
  profile,
  updateProfile,
}: {
  profile: RecruiterProfileProps;
  updateProfile: Function;
}) {
  if (profile) {
    return (
      <>
        <div className="container mt-5">
          <p className="text-2xl mb-5 font-semibold">Your Details:</p>
          <div className="flex flex-col items-center justify-center md:flex-row gap-x-10 bg-gray-900 pl-10 pr-2 py-5 rounded-lg text-white border-4">
            {/* <Image
              src={profile.profile_image}
              width={200}
              height={200}
              alt="profile-image"
              loading="lazy"
              className="rounded-full"
              style={{ objectFit: "cover" }}
            /> */}
            <div className="flex flex-row justify-between w-full md:w-fit">
              <div className="flex-1"></div>
              <Avatar className=" flex-2 md:flex-none w-[160px] h-[160px]">
                <AvatarImage src={profile.profile_image} />
                <AvatarFallback className="text-8xl">
                  {profile.name.split(" ").map((word) => word[0])}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-1 md:hidden flex-row justify-end">
                <EditBasicRecruiterProfileModal profile={profile} updateProfile={updateProfile}/>
              </div>
            </div>

            <div className="flex flex-col gap-5 text-xl mt-10 md:mt-0 mr-5">
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
                {profile.phone_number ? profile.phone_number : "NA"}
              </p>
              <p>
                <span className="font-semibold">Current Position: </span>
                {profile.current_position ? profile.current_position : "NA"}
              </p>
            </div>
            <div className="flex-1 hidden md:flex flex-row justify-end items-center cursor-pointer">
              <EditBasicRecruiterProfileModal profile={profile} updateProfile={updateProfile}/>
            </div>
          </div>
          <p className="text-2xl my-5 font-semibold">Your Company Details:</p>
          <div className="flex flex-col items-center justify-center md:flex-row gap-x-10 bg-gray-900 pl-10 pr-2 py-5 rounded-lg text-white border-4">
            {/* <Image
              src={profile.profile_image}
              width={200}
              height={200}
              alt="profile-image"
              loading="lazy"
              className="rounded-full"
              style={{ objectFit: "cover" }}
            /> */}
            <div className="flex flex-row justify-between w-full md:w-fit">
              <div className="flex-1"></div>
              <Avatar className=" flex-2 md:flex-none w-[160px] h-[160px]">
                <AvatarImage src={profile.company_logo} />
                <AvatarFallback className="text-8xl">
                  {profile.company_name
                    ? profile.company_name
                        .split(" ")
                        .map((word) => word[0].toUpperCase())
                    : "C"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-1 md:hidden flex-row justify-end">
                <EditCompanyDataRecruiterProfileModal profile={profile} updateProfile={updateProfile}/>
              </div>
            </div>

            <div className="flex flex-col gap-5 text-xl mt-10 md:mt-0 mr-5 ">
              <p>
                <span className="font-semibold">Name: </span>
                {profile.company_name ? profile.company_name : "NA"}
              </p>
              <p>
                <span className="font-semibold">Description: </span>{" "}
                <span className="break-all">
                  {profile.company_description
                    ? profile.company_description
                    : "NA"}
                </span>
              </p>
              <p>
                <span className="font-semibold">Address: </span>
                <span className="break-all">
                  {profile.company_address ? profile.company_address : "NA"}
                </span>
              </p>
            </div>
            <div className="flex-1 hidden md:flex flex-row justify-end items-center cursor-pointer">
              <EditCompanyDataRecruiterProfileModal profile={profile} updateProfile={updateProfile}/>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center my-10">
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
