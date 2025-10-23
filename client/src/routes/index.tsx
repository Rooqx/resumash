import { createFileRoute, Link } from '@tanstack/react-router'
import App from '@/components/Layout'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <App>
      <section className="bg-black w-full h-screen text-slate-100 flex justify-center items-center">
        <div className=" flex flex-col gap-5 w-full items-center justify-center">
          <Link
            to="/tailor-resume"
            className={`
            font-bold text-xl w-[30%] text-center border-2 border-zinc-400 py-3 px-6 rounded-full relative
            tailor-resume
            `}
          >
            Ai Tailor Resume
          </Link>
          <Link
            to="/build-resume"
            className={`
            font-bold text-xl w-[30%] text-center border-2 border-zinc-400 py-3 px-6 rounded-full relative
            tailor-resume
            `}
          >
            Build Resume
          </Link>
        </div>
      </section>
    </App>
  )
}
