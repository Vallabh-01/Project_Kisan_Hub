/* eslint-disable no-undef */
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


//  Dashboard – Agriculture News (NewsData API)
app.get("/api/agri-news", async (req, res) => {
  try {
    const response = await axios.get(
      "https://newsdata.io/api/1/news",
      {
        params: {
          apikey: process.env.VITE_NEWS_API_KEY,
          q: "Maharashtra",
          country: "in",
          language: "en",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Agri News Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch agriculture news" });
  }
});

// 2️⃣ GovSchemes Page – Government Scheme News (GNews)

app.get("/api/scheme-news", async (req, res) => {
  try {
    const response = await axios.get(
      "https://gnews.io/api/v4/search",
      {
        params: {
          q: "government scheme",
          lang: "en",
          country: "in",
          max: 10,
          token: process.env.VITE_GNEWS_API_KEY,
        },
      }
    );

    // ✅ GNews returns "articles"
    let results = response.data.articles || [];

    // ✅ Filter for India or Maharashtra
    results = results.filter(article => {
      const content =
        `${article.title || ""} ${article.description || ""}`.toLowerCase();

      return (
        content.includes("india") ||
        content.includes("maharashtra")
      );
    });

    res.json({
      status: "success",
      results
    });

  } catch (error) {
    console.error("Scheme News Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch scheme news" });
  }
});


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});