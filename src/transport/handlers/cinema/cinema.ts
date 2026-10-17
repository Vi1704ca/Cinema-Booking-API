import { Request, Response, NextFunction } from 'express';
import { CinemaService } from '../../../services/cinema/cinema.service';

export function handleCinemaError(error: unknown, res: Response): void {
  if (error instanceof Error) {
    switch (error.message) {
      case 'CINEMA_NOT_FOUND':
        res.status(404).json({ error: 'Cinema not found' });
        return;
      case 'INVALID_CINEMA_DATA':
      case 'VALIDATION_ERROR':
        res.status(400).json({ error: error.message });
        return;
      case 'CINEMA_ALREADY_EXISTS':
        res.status(409).json({ error: 'Cinema already exists' });
        return;
      default:
        break;
    }
  }

  console.error('Unexpected cinema error:', error);
  res.status(500).json({ error: 'Internal server error' });
}

export class CinemaHandler {
  constructor(private cinemaService: CinemaService) {}

  getCinemas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cinemas = await this.cinemaService.getAllCinemas();
      res.status(200).json(cinemas);
    } catch (error) {
      handleCinemaError(error, res);
    }
  };

  getCinemaById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const cinema = await this.cinemaService.getCinemaById(id);
      
      if (!cinema) {
        res.status(404).json({ error: 'Cinema not found' });
        return;
      }

      res.status(200).json(cinema);
    } catch (error) {
      handleCinemaError(error, res);
    }
  };

  createCinema = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cinemaData = req.body;
      const newCinema = await this.cinemaService.createCinema(cinemaData);
      
      res.status(201).json(newCinema);
    } catch (error) {
      handleCinemaError(error, res);
    }
  };

  deleteCinema = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.cinemaService.deleteCinema(id);
      
      res.status(204).send();
    } catch (error) {
      handleCinemaError(error, res);
    }
  };
}