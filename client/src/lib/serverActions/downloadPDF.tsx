import axios from 'axios'
import { toast } from 'sonner'
import useInputStore from '../stores/useInputStores'
import useFieldStores from '../stores/useMultipleFieldStore'
import { useTagStore } from '../stores/useInputTags'

export async function downloadResume(fileName: string, setIsDownloading: (value: boolean) => void, template: 'classic'|'modern'|'executive' = 'modern') {
  setIsDownloading(true)
  // used .getState() because it important if u want to use with scrapers
  const { inputValue } = useInputStore.getState()
  const { fields } = useFieldStores.getState()
  const tagFields = useTagStore.getState().fields
  const payload = { inputValue, fields, tagFields, templateId: template }
  const BACKEND_URL =
    import.meta.env.VITE_ENV === 'production'
      ? import.meta.env.VITE_BACKEND_URL
      : import.meta.env.VITE_DEVELOPMENT_BACKEND_URL

  try {
    const res = await axios.post<Blob>(
      `${BACKEND_URL}/api/v1/resumes/download-resume`,
      payload,
      { responseType: 'blob' }, // IMPORTANT
    )
    // console.log('fetch:', res)
    const blob = new Blob([res.data], { type: 'application/pdf' })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = fileName
    a.click()

    URL.revokeObjectURL(url) //  cleanup
    setIsDownloading(false)
    toast.success('Resume Downloaded')
  } catch (error) {
    console.log('error:', error)
    toast.error('Resume download failed')
    setIsDownloading(false)
  }
}

/* export default function DownloadButton() {
  return <button onClick={downloadResume}>Download PDF</button>
}
*/
