import axios from 'axios'
import { toast } from 'sonner'

const wakeServer = async () => {
  try {
    await axios.get(`${import.meta.env.VITE_BACKEND_URL}`)
  } catch (_err) {
    toast.error('Resume tailor might fail')
  }
}
export default wakeServer
