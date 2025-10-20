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
    <div className="bg-zinc-900 text-white">
      <Textarea
        labelFor="tailorJobDesc"
        value={inputValue.tailorJobDesc}
        onChange={(e) => setInputValue(e.target.name, e.target.value)}
        inputTittle="Job Description"
        placeholder="Enter your professional summary or career objective"
      />
      <span className="relative w-fit">
        <input
          type="file"
          id="resumeUpload"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.currentTarget.files?.[0]
            file ? console.log(file) : console.log(null)
          }}
          accept=".pdf,.doc,.docx"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <span
          className="flex items-center gap-2 border border-zinc-300 
               bg-zinc-50 hover:bg-zinc-100 text-zinc-800 
               font-medium px-5 py-3 rounded-xl transition 
               shadow-sm hover:shadow-md cursor-pointer w-[250px]"
        >
          <Upload className="w-5 h-5 text-zinc-700" />
          <span>Upload Resume</span>
        </span>
      </span>
    </div>
  )
}
