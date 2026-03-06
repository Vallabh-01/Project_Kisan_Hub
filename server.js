/* eslint-disable no-undef */
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

/* Needed for ES module path */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- API ROUTES ---------------- */

// Agriculture News
app.get("/api/agri-news", async (req, res) => {
  try {
    const response = await axios.get("https://newsdata.io/api/1/news", {
      params: {
        apikey: process.env.VITE_NEWS_API_KEY,
        q: "Maharashtra",
        country: "in",
        language: "en",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Agri News Error:", error.message);
    res.status(500).json({ error: "Failed to fetch agriculture news" });
  }
});


// Government Scheme News
app.get("/api/scheme-news", async (req, res) => {
  try {
    const response = await axios.get("https://gnews.io/api/v4/search", {
      params: {
        q: "government scheme",
        lang: "en",
        country: "in",
        max: 10,
        token: process.env.VITE_GNEWS_API_KEY,
      },
    });

    let results = response.data.articles || [];

    results = results.filter((article) => {
      const content =
        `${article.title || ""} ${article.description || ""}`.toLowerCase();

      return content.includes("india") || content.includes("maharashtra");
    });

    res.json({
      status: "success",
      results,
    });
  } catch (error) {
    console.error("Scheme News Error:", error.message);
    res.status(500).json({ error: "Failed to fetch scheme news" });
  }
});

/* ---------------- STATIC FILES ---------------- */

// React build
app.use(express.static(path.join(__dirname, "dist")));

// Serve JSON data files
app.use("/data", express.static(path.join(__dirname, "public/data")));

/* ---------------- SPA FALLBACK ---------------- */

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});