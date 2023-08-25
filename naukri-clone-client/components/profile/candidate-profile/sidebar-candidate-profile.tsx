import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
export default function SideBarCandidateProfile({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    {
      label: "Basic Info",
      link: "/profile",
      isActive: pathname === "/profile",
    },
    {
      label: "Courses & Certification",
      link: "/profile/courses-and-certifications",
      isActive: pathname === "/profile/course-and-certifications",
    },
    {
      label: "Education",
      link: "/profile/education",
      isActive: pathname === "/profile/education",
    },
    {
      label: "Languages",
      link: "/profile/languages",
      isActive: pathname === "/profile/languages",
    },
    {
      label: "Projects",
      link: "/profile/projects",
      isActive: pathname === "/profile/projects",
    },
    {
      label: "Social Links",
      link: "/profile/social-links",
      isActive: pathname === "/profile/social-links",
    },
    {
      label: "Work Experience",
      link: "/profile/work-experience",
      isActive: pathname === "/profile/work-experience",
    },
  ];

  return (
    <div className="container">
      <div className="mt-5 flex flex-col items-center md:flex-row md:items-start">
        <div className="flex flex-col gap-1 ">
          {links.map((link) => (
            <Link
              href={link.link}
              className={classNames(
                "w-[300px] cursor-pointer rounded-md py-3 pl-6 text-white hover:bg-slate-600",
                {
                  "bg-slate-600": link.isActive,
                  "bg-slate-800": !link.isActive,
                },
              )}
            >
              <p>{link.label}</p>
            </Link>
          ))}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
