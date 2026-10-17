import { Router } from 'express';
import { CinemaHandler } from '../../handlers/cinema/cinema';
import type { CinemaService } from '../../../services/cinema/cinema.types.js';

export function createCinemaRouter(cinemaService: CinemaService): Router {
  const router = Router();
  const cinemaHandler = new CinemaHandler(cinemaService);

  router.get('/', cinemaHandler.getSessions);
  router.get('/:id', cinemaHandler.getSessionById);
  router.get('/:id/seats', cinemaHandler.getSessionSeats);
  router.post('/:id/book', cinemaHandler.bookSeat);

  return router;
}