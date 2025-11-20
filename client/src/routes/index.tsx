import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import App from '@/components/Layout'
import SEO from '@/components/SEO'
import wakeServer from '@/lib/serverActions/wakeServer'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    wakeServer(true)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <App>
        <SEO
          title="Home - Resume Builder"
          description="Build your professional resume easily."
        />
        <section className="bg-black w-full h-[calc(100vh-5rem)] text-slate-100 flex items-center justify-center ">
          <div className=" flex flex-col gap-5 w-full items-center justify-center  -mt-40 md:-mt-40 lg:-mt-10">
            <div className="space-y-3 w-full mb-2">
              <p className="text-xs py-2.5 md:py-1 px-4 border border-zinc-800 rounded-full mx-auto font-medium text-center w-fit shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                Tailor Your Resume for Every Job Instantly.
              </p>
              <p className="w-full md:w-[60%] text-4xl px-5 py-2 italic font-bold text-center mx-auto text-zinc-50 leading-[1.3] lg:leading-[1.5]">
                Create and customize resumes that fit every job effortlessly
              </p>
            </div>
            <div className="flex gap-5 flex-col md:flex-row justify-center items-center w-full py-6 px-4">
              <Link
                to="/tailor-resume"
                className={`
            font-semibold text-nowrap text-xl w-full md:w-[40%] text-center border-2 border-zinc-50 py-3 px-6 rounded-full relative
            tailor-resume bg-zinc-50 hover:bg-zinc-900 text-zinc-800 transition-all duration-100 md:duration-300 hover:text-white
            `}
              >
                Tailor My Resume Now
              </Link>
              <Link
                to="/build-resume"
                className={`
            font-semibold text-nowrap text-xl w-full md:w-[40%] text-center border-2 border-zinc-50 py-3 px-6 rounded-full relative
            tailor-resume bg-zinc-50 hover:bg-zinc-900 text-zinc-800 transition-all duration-100 md:duration-300 hover:text-white
            `}
              >
                Build Resume
              </Link>
            </div>
            <p className="font-thin text-zinc-50">Build Tailor Get hired</p>
          </div>
        </section>
      </App>
    </>
  )
}
