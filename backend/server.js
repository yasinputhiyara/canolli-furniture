import express from "express"
import dotenv from "dotenv"
import connectDB from "./src/config/db.js";

dotenv.config();

const app = express()
const PORT = process.env.PORT || 4000;

connectDB();

app.get("/", (req, res) => {
  res.send("Api running....")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})