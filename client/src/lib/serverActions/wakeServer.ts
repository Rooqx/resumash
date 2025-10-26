import axios from 'axios'
import { toast } from 'sonner'

const wakeServer = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}`)
  } catch (error) {
    toast.error('Resume tailor might fail')
  }
}
export default wakeServer
