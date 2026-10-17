import express from "express";
import { createCinemaRepository } from "./repositories/cinema.js";
import { db } from "./prisma/db.js";
import { createCinemaService } from "./services/cinema/cinema.js";
import { createCinemaRouter } from "./transport/routers/cinema/cinema.js";

const port = 3001;

const cinemaRepository = createCinemaRepository(db);
const cinemaService = createCinemaService(cinemaRepository);

export const app = express();
app.use(express.json());
app.get('/', (_req, res) => {
  res.status(200).send("Cinema Booking API");
});
app.use("/sessions", createCinemaRouter(cinemaService));

const server = app.listen(port, () => {
  console.log(`Cinema Booking API listening on port ${port}`);
});

const shutdown = (): void => {
  server.close((error) => {
    if (error) {
      console.error("Failed to close HTTP server:", error);
      process.exitCode = 1;
    }

    void db.close().catch((dbError: unknown) => {
      console.error("Failed to close database connection:", dbError);
      process.exitCode = 1;
    });
  });
};

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
