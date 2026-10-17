import { Router } from 'express';
import { CinemaHandler } from '../../handlers/cinema/cinema';
import { CinemaService } from '../../../services/cinema/cinema.service';

export function createCinemaRouter(): Router {
  const router = Router();

  const cinemaService = new CinemaService();
  const cinemaHandler = new CinemaHandler(cinemaService);

  router.get('/', cinemaHandler.getCinemas);
  router.get('/:id', cinemaHandler.getCinemaById);
  router.post('/', cinemaHandler.createCinema);
  router.delete('/:id', cinemaHandler.deleteCinema);

  return router;
}