import express from "express";

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is ON." });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT http://localhost:${PORT}`);
});
