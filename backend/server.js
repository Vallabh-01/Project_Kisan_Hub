import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mandiRoutes from "./routes/mandi.routes.js";
import { loadAllMandiData } from "./services/agmarknet.service.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

await loadAllMandiData();   // 🔥 load once on startup

app.use("/api/mandi", mandiRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});