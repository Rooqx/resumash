import { useState } from 'react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Send, Upload } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getTailoredResume } from '@/lib/serverActions/tailorResume'
import Textarea from '@/components/Textarea'
import App from '@/components/Layout'

export const Route = createFileRoute('/tailor-resume/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [data, setData] = useState({
    jobDescription: '',
    file: null,
  })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Mutation
  const mutation = useMutation({
    mutationFn: (resumeData: { jobDescription: string; file: any | null }) =>
      getTailoredResume(resumeData),
    onSuccess: (resumeData) => {
      console.log('Success:', resumeData.data.data.inputValue.fullName)
      //  Store it globally in React Query cache
      queryClient.setQueryData(['tailoredResume'], resumeData.data.data)
      navigate({ to: '/build-resume' })
    },
    onError: (err: any) => {
      console.error('Upload failed:', err)
    },
  })
  return (
    <App>
      <form
        className="bg-black text-white h-screen relative flex items-center justify-center flex-col gap-0"
        onSubmit={(e) => {
          e.preventDefault()
          mutation.mutate(data)
        }}
      >
        <div className="w-[60%]">
          {' '}
          <Textarea
            labelFor="tailorJobDesc"
            value={data.jobDescription}
            onChange={(e) => {
              setData((prev) => ({ ...prev, jobDescription: e.target.value }))
            }}
            inputTittle="Job Description"
            placeholder="Enter your professional summary or career objective"
          />
        </div>

        <span className="relative w-fit flex items-center justify-center">
          <input
            type="file"
            id="resumeUpload"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file: any | null = e.currentTarget.files?.[0] || null
              setData((prev) => ({ ...prev, file }))
            }}
            accept=".pdf,.doc,.docx"
            className="absolute  w-full h-full opacity-0 cursor-pointer "
          />

          <label
            htmlFor="resumeUpload"
            className="flex flex-col justify-center items-center gap-3 border-2 border-zinc-300 w-[300px] p-6 rounded-xl mb-10 cursor-pointer"
          >
            <Upload className="w-5 h-5 z-2" />
            <span className="text-sm text-center flex justify-center z-2">
              Upload Resume
            </span>
          </label>
        </span>
        <button
          type="submit"
          className="flex justify-center items-center gap-3 border-2 border-zinc-300 
               bg-zinc-50 hover:bg-zinc-100 text-zinc-800 
               font-medium px-5 py-3 rounded-xl transition relative
               shadow-sm hover:shadow-md cursor-pointer w-[200px] overflow-hidden
               before:content-[''] before:absolute before:left-0 before:top-0 
               before:h-0 before:w-full before:bg-black before:border-zinc-50 before:transition-all before:duration-300
               hover:before:h-full hover:text-white
               "
        >
          <span className="z-2 flex gap-2 items-center justify-center">
            <Send /> {mutation.isPending ? 'Tailoring' : 'Tailor'}
          </span>
        </button>
      </form>
    </App>
  )
}
