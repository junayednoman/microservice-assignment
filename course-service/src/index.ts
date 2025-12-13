import express from "express";
import cors from "cors";
import { router } from "./routes";
import "./cron";

const app = express();
const port = 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use("/api/courses", router);

app.get("/health", (req, res) => {
  res.send("Course service is running!");
});

app.listen(port, () => {
  console.log(`Course service is listening on port ${port}`);
});
