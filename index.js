const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const cors = require('cors');

require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const BASE_URL = "http://api.weatherbit.io/v2.0/current";

app.use(express.json()); // middleware
app.use(express.urlencoded({ extended: true })); // form data middleware
app.use(express.static("public"));
app.use(morgan("tiny"));
app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}, ${new Date().toISOString()}`);
  next();
});

app.get("/api/weather", async (req, res) => {
  try {
    // req.query
    // req.params
    // req.body
    // req.headers
    const { lat, lon } = req.query;

    if (!lat) {
      return res.status(400).json({ message: "Lat parameter is required" });
    }

    if (!lon) {
      return res.status(400).json({ message: "Lon parameter is required" });
    }

    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        lat,
        lon,
      },
      responseType: "json",
    });

    const [data] = response.data.data;
    const {
      city_name,
      weather: { description },
      temp,
    } = data;

    res.json({ city_name, description, temp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }
  console.log("Server started");
});
