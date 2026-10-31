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

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

/* Needed for ES module path */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- HELPERS ---------------- */

const getDistrict = (req, res) => {
  const district = String(req.query.district || "").trim();

  if (!district) {
    res.status(400).json({ error: "District is required" });
    return null;
  }

  if (district.length > 100) {
    res.status(400).json({ error: "District is invalid" });
    return null;
  }

  return district;
};

const requireApiKey = (key, envName, res) => {
  if (!key) {
    console.error(`Missing server environment variable: ${envName}`);
    res.status(500).json({ error: "Service configuration is incomplete" });
    return false;
  }

  return true;
};

/* ---------------- WEATHER API ROUTES ---------------- */

// Current weather
app.get("/api/weather/current", async (req, res) => {
  const district = getDistrict(req, res);

  if (!district || !requireApiKey(WEATHER_API_KEY, "WEATHER_API_KEY", res)) {
    return;
  }

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: district,
          units: "metric",
          appid: WEATHER_API_KEY,
        },
        timeout: 10000,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Current Weather Error:", error.response?.data || error.message);

    const status = error.response?.status === 404 ? 404 : 502;
    res.status(status).json({
      error:
        error.response?.status === 404
          ? "Weather data not found for the selected district"
          : "Failed to fetch current weather",
    });
  }
});

// 5-day / 3-hour forecast
app.get("/api/weather/forecast", async (req, res) => {
  const district = getDistrict(req, res);

  if (!district || !requireApiKey(WEATHER_API_KEY, "WEATHER_API_KEY", res)) {
    return;
  }

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          q: district,
          units: "metric",
          appid: WEATHER_API_KEY,
        },
        timeout: 10000,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Forecast Error:", error.response?.data || error.message);

    const status = error.response?.status === 404 ? 404 : 502;
    res.status(status).json({
      error:
        error.response?.status === 404
          ? "Forecast data not found for the selected district"
          : "Failed to fetch weather forecast",
    });
  }
});

/* ---------------- NEWS API ROUTES ---------------- */

// Agriculture News
app.get("/api/agri-news", async (req, res) => {
  if (!requireApiKey(NEWS_API_KEY, "NEWS_API_KEY", res)) {
    return;
  }

  try {
    const response = await axios.get("https://newsdata.io/api/1/news", {
      params: {
        apikey: NEWS_API_KEY,
        q: "Maharashtra agriculture",
        country: "in",
        language: "en",
      },
      timeout: 10000,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Agri News Error:", error.response?.data || error.message);
    res.status(502).json({ error: "Failed to fetch agriculture news" });
  }
});

// Weather-related news alerts
app.get("/api/weather-alerts", async (req, res) => {
  if (!requireApiKey(NEWS_API_KEY, "NEWS_API_KEY", res)) {
    return;
  }

  try {
    const response = await axios.get("https://newsdata.io/api/1/news", {
      params: {
        apikey: NEWS_API_KEY,
        q: "weather alert OR storm OR cyclone OR rain warning",
        country: "in",
        language: "en",
      },
      timeout: 10000,
    });

    const results = (response.data?.results || []).filter((item) => {
      const content = `${item.title || ""} ${item.description || ""}`.toLowerCase();

      return (
        content.includes("maharashtra") ||
        content.includes("weather") ||
        content.includes("storm") ||
        content.includes("cyclone") ||
        content.includes("rain warning")
      );
    });

    res.json({
      status: "success",
      results: results.slice(0, 3),
    });
  } catch (error) {
    console.error(
      "Weather Alerts Error:",
      error.response?.data || error.message
    );
    res.status(502).json({ error: "Failed to fetch weather alerts" });
  }
});

// Government Scheme News
app.get("/api/scheme-news", async (req, res) => {
  if (!requireApiKey(GNEWS_API_KEY, "GNEWS_API_KEY", res)) {
    return;
  }

  try {
    const response = await axios.get("https://gnews.io/api/v4/search", {
      params: {
        q: "government scheme",
        lang: "en",
        country: "in",
        max: 10,
        token: GNEWS_API_KEY,
      },
      timeout: 10000,
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
    console.error(
      "Scheme News Error:",
      error.response?.data || error.message
    );
    res.status(502).json({ error: "Failed to fetch government scheme news" });
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
