import { Skeleton } from "@/components/ui/skeleton";

export default function RecruiterProfileLoadingSkeleton() {
  return (
    <>
      <div className="container mt-5">
        <Skeleton className="mb-5 h-8 w-[350px]"></Skeleton>
        <div className="flex flex-col items-center justify-center gap-x-10 rounded-lg border-4 bg-gray-900 py-5 pl-10 pr-2 text-white md:flex-row md:items-start md:justify-start">
          <div className="flex w-full flex-row items-center justify-center md:w-fit">
            <Skeleton className="mr-6 h-[160px] w-[160px] rounded-full" />
          </div>

          <div className="mr-5 mt-10 flex flex-col gap-5 text-xl md:mt-0">
            <Skeleton className="h-6 w-[300px] md:w-[350px]"> </Skeleton>
            <Skeleton className="h-6 w-[300px] md:w-[350px]"></Skeleton>
            <Skeleton className="h-6 w-[300px] md:w-[350px]"></Skeleton>
            <Skeleton className="h-6 w-[300px] md:w-[350px]"></Skeleton>
          </div>
        </div>

        <Skeleton className="mb-5 mt-10 h-8 w-[350px]"></Skeleton>
        <div className="flex flex-col items-center gap-x-10 rounded-lg border-4 bg-gray-900 py-5 pl-10 pr-2 text-white md:flex-row">
          <div className="flex w-full flex-row items-center justify-center md:w-fit">
            <Skeleton className="mr-6 h-[160px] w-[160px] rounded-full" />
          </div>

          <div className="mr-5 mt-10 flex flex-col gap-5 text-xl md:mt-0">
            <Skeleton className="h-6 w-[300px] md:w-[350px]"> </Skeleton>
            <Skeleton className="h-6 w-[300px] md:w-[350px]"></Skeleton>
            <Skeleton className="h-6 w-[300px] md:w-[350px]"></Skeleton>
            <Skeleton className="h-6 w-[300px] md:w-[350px]"></Skeleton>
          </div>
        </div>
      </div>
    </>
  );
}
