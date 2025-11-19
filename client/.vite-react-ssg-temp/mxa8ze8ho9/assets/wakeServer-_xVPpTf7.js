import axios from "axios";
import { toast } from "sonner";
const wakeServer = async (isHomePage) => {
  try {
    await axios.get(`${"https://jobbygenie.onrender.com"}`);
  } catch (_err) {
    isHomePage ? "" : toast.error("Resume tailor might fail");
  }
};
export {
  wakeServer as w
};
