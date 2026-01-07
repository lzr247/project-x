import express from "express";
import indexRoutes from "./routes/index.routes";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import goalRoutes from "./routes/goal.routes";
import "dotenv/config";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

app.use("/api", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", goalRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT http://localhost:${PORT}`);
});
