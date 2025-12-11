import express from "express";
import cors from "cors";

const app = express();
const port = 5002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/health", (req, res) => {
  res.send("Order service is running!");
});

app.listen(port, () => {
  console.log(`Order service is listening on port ${port}`);
});
