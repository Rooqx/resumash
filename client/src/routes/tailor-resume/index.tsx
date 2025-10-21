import { createFileRoute } from '@tanstack/react-router'
import { Upload } from 'lucide-react'
import Textarea from '@/components/Textarea'
import useInputStore from '@/lib/stores/useInputStores'

export const Route = createFileRoute('/tailor-resume/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { inputValue, setInputValue } = useInputStore()

  return (
    <div className="bg-zinc-900 text-white h-screen relative flex items-center justify-center flex-col gap-0">
      <div className="w-[60%]">
        {' '}
        <Textarea
          labelFor="tailorJobDesc"
          value={inputValue.tailorJobDesc}
          onChange={(e) => setInputValue(e.target.name, e.target.value)}
          inputTittle="Job Description"
          placeholder="Enter your professional summary or career objective"
        />
      </div>

      <span className="relative w-fit flex items-center justify-center">
        <input
          type="file"
          id="resumeUpload"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.currentTarget.files?.[0]
            file ? console.log(file) : console.log(null)
          }}
          accept=".pdf,.doc,.docx"
          className="absolute  w-full h-full opacity-0 cursor-pointer "
        />

        <label
          htmlFor="resumeUpload"
          className="flex justify-center items-center gap-3 border-2 border-zinc-300 
               bg-zinc-50 hover:bg-zinc-100 text-zinc-800 
               font-medium px-5 py-3 rounded-xl transition relative
               shadow-sm hover:shadow-md cursor-pointer w-[200px] overflow-hidden
               before:content-[''] before:absolute before:left-0 before:top-0 
               before:h-0 before:w-full before:bg-zinc-800 before:border-zinc-50 before:transition-all before:duration-300
               hover:before:h-full hover:text-white
               "
        >
          <Upload className="w-5 h-5 z-2" />
          <span className="text-sm text-center flex justify-center z-2">
            Upload Resume
          </span>
        </label>
      </span>
    </div>
  )
}
