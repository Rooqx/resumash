import express from "express";
import cors from "cors";
//import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
//app.use(cookieParser());
app.use(cors());

const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Hello from Server (Express + TS) 👋");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
