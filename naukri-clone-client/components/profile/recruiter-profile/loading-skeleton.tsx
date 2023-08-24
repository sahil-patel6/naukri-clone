import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <>
      <div className="container mt-5">
        <Skeleton className="h-8 mb-5 w-[350px]"></Skeleton>
        <div className="flex flex-col items-center justify-center md:justify-start md:items-start md:flex-row gap-x-10 bg-gray-900 pl-10 pr-2 py-5 rounded-lg text-white border-4">
          <div className="flex flex-row items-center justify-center w-full md:w-fit">
            <Skeleton className="mr-6 w-[160px] h-[160px] rounded-full" />
          </div>

          <div className="flex flex-col gap-5 text-xl mt-10 md:mt-0 mr-5">
            <Skeleton className="w-[300px] md:w-[350px] h-6"> </Skeleton>
            <Skeleton className="w-[300px] md:w-[350px] h-6"></Skeleton>
            <Skeleton className="w-[300px] md:w-[350px] h-6"></Skeleton>
            <Skeleton className="w-[300px] md:w-[350px] h-6"></Skeleton>
          </div>
        </div>

        <Skeleton className="h-8 mt-10 mb-5 w-[350px]"></Skeleton>
        <div className="flex flex-col items-center md:flex-row gap-x-10 bg-gray-900 pl-10 pr-2 py-5 rounded-lg text-white border-4">
        <div className="flex flex-row items-center justify-center w-full md:w-fit">
            <Skeleton className="mr-6 w-[160px] h-[160px] rounded-full" />
          </div>

          <div className="flex flex-col gap-5 text-xl mt-10 md:mt-0 mr-5">
            <Skeleton className="w-[300px] md:w-[350px] h-6"> </Skeleton>
            <Skeleton className="w-[300px] md:w-[350px] h-6"></Skeleton>
            <Skeleton className="w-[300px] md:w-[350px] h-6"></Skeleton>
            <Skeleton className="w-[300px] md:w-[350px] h-6"></Skeleton>
          </div>
        </div>
      </div>
    </>
  );
}
