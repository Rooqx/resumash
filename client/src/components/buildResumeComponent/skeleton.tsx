import Spinner from '@/components/Spinner'
import { Skeleton } from '@/components/ui/skeleton'

export default function ResumeSkeleton() {
  return (
    <div className="space-y-4 bg-black text-white relative">
      {/* Header (optional) */}
      {/* <h2 className="text-2xl font-semibold mb-2 w-full text-center">My Resume</h2> */}

      <div className="w-full flex items-start gap-0 justify-center h-[800px]">
        {/* Sidebar skeleton */}
        <div className="hidden lg:flex flex-col space-y-4 p-4 w-[250px] border-r border-white/20">
          <Skeleton className="h-8 w-[80%] bg-white/10" />
          <Skeleton className="h-8 w-[70%] bg-white/10" />
          <Skeleton className="h-8 w-[60%] bg-white/10" />
          <Skeleton className="h-8 w-[90%] bg-white/10" />
          <Skeleton className="h-8 w-[50%] bg-white/10" />
        </div>

        {/* Resume Preview skeleton */}
        <div className="lg:py-4 lg:pr-4 w-full  lg:mt-5 flex justify-center">
          <div className="w-full lg:w-[80%] h-[750px] rounded-lg border border-white/10 bg-[#1a1a1a] flex flex-col p-6 space-y-4">
            <Skeleton className="h-10 w-[60%] bg-white/10" />
            <Skeleton className="h-6 w-[40%] bg-white/10" />
            <Skeleton className="h-[500px] w-full bg-white/10 rounded-md" />
            <Skeleton className="h-8 w-[30%] bg-white/10" />
          </div>
        </div>
        <div className=" w-full h-screen flex items-center gap-5 -top-35  justify-center text-white absolute">
          <Spinner /> Tailoring resume
        </div>
        {/* Right panel (desktop PDF actions) */}
        <div className="hidden lg:flex flex-col space-y-5 p-5 w-[300px]">
          <Skeleton className="h-10 w-full bg-white/10" />
          <Skeleton className="h-10 w-full bg-white/10" />
          <div className="bg-[#2c5530] p-4 rounded-md mt-5 space-y-3">
            <Skeleton className="h-6 w-[60%] bg-white/20" />
            <Skeleton className="h-8 w-[80%] bg-white/20" />
            <Skeleton className="h-8 w-[70%] bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  )
}
