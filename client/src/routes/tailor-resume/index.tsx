import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Send, Upload } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import ResumeSkeleton from '../../components/buildResumeComponent/skeleton'
import { getTailoredResume } from '@/lib/serverActions/tailorResume'
import Textarea from '@/components/Textarea'
import App from '@/components/Layout'
import Spinner from '@/components/Spinner'
import { useCurrentPage } from '@/lib/stores/useCurrentPage'
import wakeServer from '@/lib/serverActions/wakeServer'
import SEO from '@/components/SEO'

export const Route = createFileRoute('/tailor-resume/')({
  component: RouteComponent,
})
interface DataProps {
  jobDescription: string
  file: any | null
}
function RouteComponent() {
  const [data, setData] = useState<DataProps>({
    jobDescription: '',
    file: null,
  })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { page, setPage } = useCurrentPage()

  // Mutation
  const mutation = useMutation({
    mutationFn: async (resumeData: {
      jobDescription: string
      file: any | null
    }) => {
      const timeout = 1000000 // 100 seconds

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout),
      )

      // Race between your API call and the timeout
      return Promise.race([getTailoredResume(resumeData), timeoutPromise])
    },
    onSuccess: (resumeData) => {
      toast.success('Resume tailor successful')
      //  Store it globally in React Query cache
      queryClient.setQueryData(['tailoredResume'], resumeData.data.data)
      navigate({ to: '/build-resume' })
    },
    onError: (err: any) => {
      console.error('Upload failed:', err)
      toast.error('Tailoring failed')
    },
  })
  useEffect(() => {
    setPage('tailorPage')
    wakeServer()
  }, [page, setPage])

  return (
    <App>
      <SEO
        title="Tailor Resume"
        description="Build your professional resume easily."
      />
      {mutation.isPending ? (
        <ResumeSkeleton />
      ) : (
        <form
          className="bg-black text-white h-screen relative flex items-center flex-col gap-0"
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate(data)
          }}
        >
          <div className="w-full md:w-4/5 overflow-hidden rounded-xl px-6 mt-5">
            <Textarea
              labelFor="tailorJobDesc"
              value={data.jobDescription}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  jobDescription: e.target.value,
                }))
              }}
              inputTittle="Job Description"
              placeholder="Enter Job description"
              inputHeight="40vh"
              inputBG="#27272a"
              noBorder={false}
              rounded={false}
            />
          </div>

          <span className="relative w-fit flex items-center justify-center">
            <input
              type="file"
              id="resumeUpload"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file: any | null = e.currentTarget.files?.[0] || null
                setData((prev) => ({ ...prev, file }))
                file
                  ? toast.success('Resume uploaded successfully')
                  : toast.error('Resume upload failed')
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
                {data.file ? data.file?.name : 'Upload Resume'}
              </span>
            </label>
          </span>
          <button
            type="submit"
            className={`flex justify-center items-center gap-3 border-2 border-zinc-300  font-medium px-5 py-3 rounded-xl transition relative
            shadow-sm hover:shadow-md  w-[200px] overflow-hidden text-zinc-800 
       ${
         mutation.isPending || !data.file || !data.jobDescription
           ? 'bg-zinc-400 cursor-not-allowed'
           : `
            bg-zinc-50 hover:bg-zinc-100 cursor-pointer
            before:content-[''] before:absolute before:left-0 before:top-0 
            before:h-0 before:w-full before:bg-black before:border-zinc-50 before:transition-all before:duration-300
            hover:before:h-full hover:text-white     
            `
       }
          `}
            disabled={mutation.isPending || !data.file || !data.jobDescription}
          >
            <span className="z-2 flex gap-2 items-center justify-center">
              <Send /> {mutation.isPending ? 'Tailoring' : 'Tailor'}{' '}
              {mutation.isPending ? <Spinner /> : ''}
            </span>
          </button>
        </form>
      )}
    </App>
  )
}
