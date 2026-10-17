import type { Request, Response } from 'express';
import type { CinemaService } from '../../../services/cinema/cinema.types.js';
import { validate } from '../../dto/request.js';

export function handleCinemaError(error: unknown, res: Response): void {
  if (error instanceof Error) {
    switch (error.message) {
      case 'SEAT_ALREADY_RESERVED':
        res.status(409).json({ error: 'Seat is already reserved' });
        return;
      case 'SESSION_OR_SEAT_NOT_FOUND':
        res.status(404).json({ error: 'Session or seat not found' });
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

  getSessions = async (_req: Request, res: Response): Promise<void> => {
    try {
      const sessions = await this.cinemaService.getAllSessions();
      res.status(200).json(sessions);
    } catch (error) {
      handleCinemaError(error, res);
    }
  };

  getSessionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const idParam = req.params['id'];
      const id = typeof idParam === 'string' ? Number(idParam) : Number.NaN;
      if (!Number.isSafeInteger(id) || id <= 0) {
        res.status(400).json({ error: 'Invalid session id' });
        return;
      }

      const session = await this.cinemaService.getSessionById(id);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      res.status(200).json(session);
    } catch (error) {
      handleCinemaError(error, res);
    }
  };

  getSessionSeats = async (req: Request, res: Response): Promise<void> => {
    try {
      const idParam = req.params['id'];
      const id = typeof idParam === 'string' ? Number(idParam) : Number.NaN;
      if (!Number.isSafeInteger(id) || id <= 0) {
        res.status(400).json({ error: 'Invalid session id' });
        return;
      }

      const seats = await this.cinemaService.getSessionSeats(id);
      if (!seats) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      res.status(200).json(seats);
    } catch (error) {
      handleCinemaError(error, res);
    }
  };

  bookSeat = async (req: Request, res: Response): Promise<void> => {
    try {
      const booking = validate(req.params['id'], req.body?.seatId);
      if (!booking) {
        res.status(400).json({ error: 'A positive integer seatId is required' });
        return;
      }

      const result = await this.cinemaService.bookSeat(booking.sessionId, booking.seatId);
      if (!result.success) {
        res.status(result.status).json({
          error: result.status === 409 ? 'Seat is already reserved' : 'Session or seat not found',
        });
        return;
      }

      res.status(result.status).json({ success: true });
    } catch (error) {
      handleCinemaError(error, res);
    }
  };
}