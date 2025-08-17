import express from "express";
import cors from "cors";
import { CORS_ORIGIN, PORT } from "./config";
import { startBusyCleanup, chargers, sessions } from "./state";
import { reserveRouter } from "./routes/reserve";
import { chargersRouter } from "./routes/chargers";
import { seriesRouter } from "./routes/series";
import { seedData } from "./seed";
import { statsRouter } from "./routes/stats";

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

seedData(chargers, sessions);

startBusyCleanup();

app.get("/", (_request, response) => {
  response.json({ status: "ok", message: "EV backend is running" });
});

app.use("/reserve", reserveRouter);
app.use("/stats", statsRouter);
app.use("/chargers", chargersRouter);
app.use("/series", seriesRouter);

app.use((_req, res) => res.status(404).json({ message: "Not found" }));

app.listen(PORT, () => {
  console.log(`🚀 Local EV backend running on port ${PORT}`);
});
