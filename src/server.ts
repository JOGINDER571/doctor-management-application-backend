import app from "./app";
// import express from 'express';
import dotenv from "dotenv";
// const app = express()
dotenv.config();

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
