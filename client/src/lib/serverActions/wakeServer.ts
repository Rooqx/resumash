import axios from 'axios'
import { toast } from 'sonner'

const wakeServer = async (isHomePage: boolean) => {
  try {
    await axios.get(`${import.meta.env.VITE_BACKEND_URL}`)
  } catch (_err) {
    isHomePage ? '' : toast.error('Resume tailor might fail')
  }
}
export default wakeServer
