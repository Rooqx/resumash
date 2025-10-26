import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useCurrentPage } from '@/lib/stores/useCurrentPage'

export default function Header() {
  const { page, setPage } = useCurrentPage()

  useEffect(() => {
    setPage('homePage')
  }, [page, setPage])

  return (
    <header className="py-2 flex gap-2 bg-zinc-800 mb-5 w-[98%] md:w-[90%] mx-auto shadow-[0_0_10px_0_rgba(255,255,255,0.5)] border-zinc-400 mt-3 text-white justify-between rounded-full">
      <nav className="flex flex-row justify-between w-full items-center text-xs md:text-sm">
        <div className="px-6 font-bold">
          <Link to="/" className="text-2xl md:text-4xl logo">
            resumeash
          </Link>
        </div>

        <div className="px-2 font-bold flex gap-3">
          {page === 'homePage' ? (
            <Link
              to="/tailor-resume"
              className="flex justify-center items-center gap-3 border-2 border-zinc-300 
               bg-zinc-50 hover:bg-zinc-100 text-zinc-800  text-xs md:text-sm
               font-medium py-2 px-4 rounded-4xl transition relative
               shadow-sm hover:shadow-md cursor-pointer  md:w-[200px] overflow-hidden
               before:content-[''] before:absolute before:left-0 before:top-0 
               before:h-0 before:w-full before:bg-black before:border-zinc-50 before:transition-all before:duration-300
               hover:before:h-full hover:text-white
               "
            >
              <p className="z-2">Tailor Resume</p>
            </Link>
          ) : page === 'tailorPage' ? (
            <Link
              to="/build-resume"
              className="flex justify-center items-center gap-3 border-2 border-zinc-300 
               bg-zinc-50 hover:bg-zinc-100 text-zinc-800  text-xs md:text-sm
               font-medium py-2 px-4 rounded-4xl transition relative
               shadow-sm hover:shadow-md cursor-pointer  md:w-[200px] overflow-hidden
               before:content-[''] before:absolute before:left-0 before:top-0 
               before:h-0 before:w-full before:bg-black before:border-zinc-50 before:transition-all before:duration-300
               hover:before:h-full hover:text-white
               "
            >
              <p className="z-2">Build Resume</p>
            </Link>
          ) : (
            <Link
              to="/build-resume"
              className="flex justify-center items-center gap-3 border-2 border-zinc-300 
               bg-zinc-50 hover:bg-zinc-100 text-zinc-800  text-xs md:text-sm
               font-medium py-2 px-4 rounded-4xl transition relative
               shadow-sm hover:shadow-md cursor-pointer  md:w-[200px] overflow-hidden
               before:content-[''] before:absolute before:left-0 before:top-0 
               before:h-0 before:w-full before:bg-black before:border-zinc-50 before:transition-all before:duration-300
               hover:before:h-full hover:text-white
               "
            >
              <p className="z-2">Tailor Resume</p>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
/**
 * 
 * import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <div className="fixed lg:sticky top-0 z-50 w-full px-2 py-1 backdrop-blur-md bg-black">
      <header className="py-2  md:px-7 w-full flex gap-2 bg-transparent border-2 border-zinc-400 mt-1 text-white justify-between rounded-full ">
        <nav className="flex flex-row justify-between w-full items-center">
          <div className="px-6 font-bold">
            <Link to="/">logo</Link>
          </div>
          <div className="px-2 font-bold flex gap-3">
            <Link
              to="/tailor-resume"
              className="flex justify-center items-center gap-3 border-2 border-zinc-300 
               bg-zinc-50 hover:bg-zinc-100 text-zinc-800  text-sm md:text-base
               font-medium py-2 px-4 rounded-4xl transition relative
               shadow-sm hover:shadow-md cursor-pointer  md:w-[200px] overflow-hidden
               before:content-[''] before:absolute before:left-0 before:top-0 
               before:h-0 before:w-full before:bg-black before:border-zinc-50 before:transition-all before:duration-300
               hover:before:h-full hover:text-white
               "
            >
              <p className="z-2">Tailor Resume</p>
            </Link>
          </div>
        </nav>
      </header>
    </div>
  )
}

 */
